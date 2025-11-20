import React, { useEffect, useState } from 'react';
import PronostiekForm from '../components/PronostiekForm';
import Leaderboard from '../components/Leaderboard';

export default function Home() {
  const [matches, setMatches] = useState([]);
  const [settings, setSettings] = useState({ predictions_open: true });
  const [loading, setLoading] = useState(true);

  // Hardcoded user
  const user = { email: 'silvandengroenendal@hotmail.com', name: 'Sil VDG', id: 1 };

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const matchesData = await fetch('/api/matches').then(res => res.json());
        const settingsData = await fetch('/api/settings').then(res => res.json());
        setMatches(matchesData || []);
        setSettings(settingsData || { predictions_open: true });
      } catch (err) {
        console.error("Fout bij laden:", err);
      }
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
          Ingelogd als <strong>{user.name}</strong> ({user.email})
        </p>
      </header>

      <main className="grid md:grid-cols-2 gap-6">
        <section>
          {matches.map(m => (
            <div key={m.id} className="card mb-3 p-3 border rounded">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{m.team1} vs {m.team2}</div>
                  <div className="text-sm text-gray-500">{new Date(m.match_datetime).toLocaleString()}</div>
                </div>
                <PronostiekForm match={m} settings={settings} user={user} />
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
