import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Admin(){
  const [pw, setPw] = useState('');
  const [ok, setOk] = useState(false);
  const [settings, setSettings] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    async function load(){
      const { data: s } = await supabase.from('settings').select('*').limit(1).single().catch(()=>({data:null}));
      const { data: ms } = await supabase.from('matches').select('*').order('match_datetime', { ascending: true });
      setSettings(s || { predictions_open: true, points_exact:5, points_winner:2 });
      setMatches(ms || []);
      setLoading(false);
    }
    load();
  }, []);

  function login(e) {
    e.preventDefault();
    if (pw === import.meta.env.VITE_ADMIN_PASSWORD) setOk(true);
    else alert('Verkeerd wachtwoord');
  }

  async function saveSettings(){
    await supabase.from('settings').upsert(settings, { onConflict: ['id'] });
    alert('Instellingen opgeslagen');
  }

  async function saveMatchResult(id, a, b) {
    await supabase.from('matches').update({ score_a: a === '' ? null : Number(a), score_b: b === '' ? null : Number(b) }).eq('id', id);
    alert('Resultaat opgeslagen');
  }

  async function recompute() {
    try {
      await supabase.rpc('update_scores');
      alert('Scores geüpdatet');
    } catch (err) {
      alert('Fout: ' + (err.message || err));
    }
  }

  if (!ok) {
    return (
      <div className="p-4 max-w-md">
        <h2 className="text-xl mb-3">Admin login</h2>
        <form onSubmit={login} className="flex gap-2">
          <input type="password" value={pw} onChange={e=>setPw(e.target.value)} className="border p-2 flex-1" placeholder="Admin wachtwoord" />
          <button className="px-3 py-2 bg-blue-600 text-white rounded">Login</button>
        </form>
      </div>
    );
  }

  if (loading) return <div className="p-4">Laden…</div>;

  return (
    <div className="container p-4">
      <h1 className="text-2xl font-bold mb-4">Admin</h1>

      <section className="card p-3 mb-4">
        <h3 className="font-semibold mb-2">Instellingen</h3>
        <div className="flex gap-2 items-center mb-2">
          <label className="w-48">Pronostiek open</label>
          <input type="checkbox" checked={!!settings.predictions_open} onChange={e=> setSettings({...settings, predictions_open: e.target.checked})} />
        </div>
        <div className="flex gap-2 items-center mb-2">
          <label className="w-48">Punten exacte</label>
          <input type="number" value={settings.points_exact ?? 5} onChange={e=> setSettings({...settings, points_exact: Number(e.target.value)})} className="border p-1 w-24" />
        </div>
        <div className="flex gap-2 items-center mb-2">
          <label className="w-48">Punten winnaar</label>
          <input type="number" value={settings.points_winner ?? 2} onChange={e=> setSettings({...settings, points_winner: Number(e.target.value)})} className="border p-1 w-24" />
        </div>
        <button onClick={saveSettings} className="px-3 py-1 bg-green-600 text-white rounded">Opslaan</button>
      </section>

      <section className="card p-3 mb-4">
        <h3 className="font-semibold mb-2">Wedstrijden (resultaten invoeren)</h3>
        {matches.map(m=> (
          <div key={m.id} className="flex gap-2 items-center mb-2">
            <div className="w-64">{m.team1} vs {m.team2} <div className="text-sm text-gray-500">{new Date(m.match_datetime).toLocaleString()}</div></div>
            <input id={`sa-${m.id}`} defaultValue={m.score_a ?? ''} className="w-16 p-1 border" />
            <input id={`sb-${m.id}`} defaultValue={m.score_b ?? ''} className="w-16 p-1 border" />
            <button onClick={()=> saveMatchResult(m.id, document.getElementById(`sa-${m.id}`).value, document.getElementById(`sb-${m.id}`).value)} className="px-2 py-1 bg-blue-600 text-white rounded">Update</button>
          </div>
        ))}
      </section>

      <div className="flex gap-2">
        <button onClick={recompute} className="px-3 py-2 bg-purple-600 text-white rounded">Recompute scores</button>
      </div>
    </div>
  );
}
