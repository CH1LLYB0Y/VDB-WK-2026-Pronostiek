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
      const { data: ms, error: msErr } = await supabase
        .from('matches')
        .select('*')
        .order('match_datetime', { ascending: true });
      if (msErr) console.warn("Error loading matches:", msErr);

      const { data: s, error: sErr } = await supabase
        .from('settings')
        .select('*')
        .maybeSingle();
      if (sErr) console.warn("Error loading settings:", sErr);

      setMatches(ms || []);
      setSettings(s || { predictions_open: true });
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="p-4">Laden…</div>;

  return (
    <div className="container mx-auto p-4">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-1">WK 2026 — Pronostiek</h1>
        <p className="text-gray-600">Vul je voorspellingen in vóór de aftrap (en zolang admin open laat).</p>
      </header>

      <main className="grid lg:grid-cols-3 gap-6">
        {/* Matches column */}
        <section className="lg:col-span-2 space-y-4">
          {matches.map((m) => (
            <div key={m.id} className="card p-4 border rounded shadow-sm flex flex-col md:flex-row md:justify-between items-center gap-4">
              <div className="flex flex-col md:flex-row items-center gap-3">
                {/* Flags */}
                <img src={`https://flagcdn.com/24x18/${m.team1_code.toLowerCase()}.png`} alt={m.team1} className="h-6 w-auto"/>
                <span className="font-medium">{m.team1}</span>
                <span className="mx-1 font-bold">vs</span>
                <img src={`https://flagcdn.com/24x18/${m.team2_code.toLowerCase()}.png`} alt={m.team2} className="h-6 w-auto"/>
                <span className="font-medium">{m.team2}</span>
              </div>
              <div className="text-sm text-gray-500 text-center md:text-right">
                <div>{new Date(m.match_datetime).toLocaleString()}</div>
                <div>{m.round} @ {m.stadium}</div>
              </div>
              <PronostiekForm match={m} settings={settings} />
            </div>
          ))}
        </section>

        {/* Leaderboard */}
        <aside>
          <Leaderboard />
        </aside>
      </main>
    </div>
  );
}
