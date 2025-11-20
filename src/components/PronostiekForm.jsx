import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function PronostiekForm({ match, settings }) {
  const [user, setUser] = useState(null);
  const [s1, setS1] = useState('');
  const [s2, setS2] = useState('');
  const [existing, setExisting] = useState(null);

  // Load local user
  useEffect(() => {
    const stored = localStorage.getItem('wk_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // Load existing prediction
  useEffect(() => {
    if (!user) {
      setExisting(null);
      return;
    }

    async function loadPrediction() {
      const { data, error } = await supabase
        .from('pronostieken')
        .select('*')
        .eq('user_id', user.id)
        .eq('match_id', match.id)
        .maybeSingle(); // optioneel

      if (error) {
        console.warn("Fout bij laden voorspelling:", error.message);
        return;
      }

      if (data) {
        setExisting(data);
        setS1(data.team1_score ?? '');
        setS2(data.team2_score ?? '');
      }
    }

    loadPrediction();
  }, [user, match]);

  // Find or create user
  async function ensureUser(name) {
    const clean = name.trim();
    if (!clean) throw new Error("Vul je naam in.");

    // Probeer te vinden
    const { data: found, error: findErr } = await supabase
      .from('users')
      .select('*')
      .eq('name', clean)
      .maybeSingle();

    if (findErr) throw findErr;
    if (found) return found;

    // Maak nieuwe user
    const { data: created, error: insertErr } = await supabase
      .from('users')
      .insert([{ name: clean }])
      .select()
      .single();

    if (insertErr) throw insertErr;
    return created;
  }

  // Login / create user
  async function onCreate(e) {
    e.preventDefault();
    const name = e.target.elements.name?.value || '';
    try {
      const u = await ensureUser(name);
      localStorage.setItem('wk_user', JSON.stringify(u));
      setUser(u);
      alert("Welkom " + u.name);
    } catch (err) {
      alert("Fout: " + err.message);
    }
  }

  const now = new Date();
  const matchTime = new Date(match.match_datetime);
  const canEdit = (settings?.predictions_open ?? true) && now < matchTime;

  // Save prediction
  async function onSave(e) {
    e.preventDefault();
    if (!user) {
      alert("Vul eerst je naam in.");
      return;
    }

    const { error } = await supabase
      .from('pronostieken')
      .upsert(
        {
          user_id: user.id,
          match_id: match.id,
          team1_score: s1 === '' ? null : Number(s1),
          team2_score: s2 === '' ? null : Number(s2),
        },
        { onConflict: ['user_id', 'match_id'] }
      );

    if (error) {
      alert("Fout bij opslaan: " + error.message);
      return;
    }

    alert("Voorspelling opgeslagen!");
  }

  return (
    <div style={{ minWidth: 300 }}>
      {!user ? (
        <form onSubmit={onCreate} className="flex gap-2 items-center">
          <input name="name" placeholder="Je naam" className="border p-1" />
          <button className="px-2 py-1 bg-blue-600 text-white rounded">Start</button>
        </form>
      ) : (
        <div>
          <div className="text-sm mb-2">Ingelogd als <strong>{user.name}</strong></div>

          {canEdit ? (
            <form onSubmit={onSave} className="flex gap-2 items-center">
              <input type="number" min="0" value={s1} onChange={e => setS1(e.target.value)} className="w-16 p-1 border" />
              <span>-</span>
              <input type="number" min="0" value={s2} onChange={e => setS2(e.target.value)} className="w-16 p-1 border" />
              <button className="ml-2 px-2 py-1 bg-green-600 text-white rounded">Opslaan</button>
            </form>
          ) : (
            <div className="text-sm text-red-600">Voorspellingen gesloten.</div>
          )}
        </div>
      )}

      {existing && !canEdit && (
        <div className="mt-2 text-xs text-gray-600">
          Je voorspelling: {existing.team1_score ?? '-'} - {existing.team2_score ?? '-'}
        </div>
      )}
    </div>
  );
}
