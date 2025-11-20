import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import PronostiekForm from '../components/PronostiekForm';
import Leaderboard from '../components/Leaderboard';

export default function Home() {
  const [matches, setMatches] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const { data: ms, error: matchesErr } = await supabase
        .from('matches')
        .select('*')
        .order('match_datetime', { ascending: true });

      if (matchesErr) console.warn("Fout bij laden wedstrijden:", matchesErr.message);

      const { data: s, error: settingsErr } = await supabase
        .from('settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (settingsErr) console.warn("Fout bij laden settings:", settingsErr.message);

      setMatches(ms || []);
      setSettings(s || { predictions_open: true });
      setLoading(false);
    }

    load();
  }, []);

  if (loading) return <div className="p-4">Laden…</div>;

  return (
    <div className="container p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">WK 2026 — Pronostiek</h1>
        <p className="text-sm text-gray-600">
          Vul je voorspellingen in vóór de aftrap (en zolang admin open laat).
        </p>
      </header>

      <main className="grid md:grid-cols-2 gap-6">
        <section>
          {matches.map(m => (
            <div key={m.id} className="card mb-3 p-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{m.team1} vs {m.team2}</div>
                  <div className="text-sm text-gray-500">{new Date(m.match_datetime).toLocaleString()}</div>
                </div>
                <PronostiekForm match={m} settings={settings} />
              </div>
            </div>
          ))}
        </section>

        <aside>
          <Leaderboard />
        </aside>
      </main>
    </div>
  );
}
