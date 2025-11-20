import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Admin() {
  // Hardcoded admin user
  const user = { email: 'silvandengroenendal@hotmail.com', name: 'Sil VDG', id: 1 };

  const [settings, setSettings] = useState({ predictions_open: true });
  const [matches, setMatches] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load all data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Settings
        const { data: s } = await supabase.from('settings').select('*').limit(1).single().catch(() => ({ data: { predictions_open: true } }));
        setSettings(s);

        // Matches
        const { data: ms } = await supabase.from('matches').select('*').order('match_datetime', { ascending: true });
        setMatches(ms || []);

        // Predictions
        const { data: preds } = await supabase.from('pronostieken').select('*');
        setPredictions(preds || []);
      } catch (err) {
        console.error("Fout bij laden:", err);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) return <div className="p-4">Laden…</div>;

  // Toggle predictions open/closed
  const togglePredictions = async () => {
    const newValue = !settings.predictions_open;
    await supabase.from('settings').update({ predictions_open: newValue }).eq('id', settings.id);
    setSettings({ ...settings, predictions_open: newValue });
  };

  // Update points manually
  const updatePoints = async (id, field, value) => {
    await supabase.from('pronostieken').update({ [field]: value }).eq('id', id);
    // Update local state
    setPredictions(predictions.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  return (
    <div className="container p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Admin Dashboard — WK 2026</h1>
        <p className="text-sm text-gray-600">
          Ingelogd als <strong>{user.name}</strong> ({user.email})
        </p>
      </header>

      {/* Instellingen */}
      <section className="mb-6 p-3 border rounded">
        <h2 className="text-lg font-semibold mb-2">Algemene Instellingen</h2>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={settings.predictions_open} onChange={togglePredictions} />
          Voorspellingen open
        </label>
      </section>

      {/* Wedstrijden */}
      <section className="mb-6 p-3 border rounded">
        <h2 className="text-lg font-semibold mb-2">Wedstrijden</h2>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="border-b">
              <th className="p-2">Match</th>
              <th className="p-2">Datum</th>
              <th className="p-2">Team 1 Score</th>
              <th className="p-2">Team 2 Score</th>
              <th className="p-2">Acties</th>
            </tr>
          </thead>
          <tbody>
            {matches.map(match => (
              <tr key={match.id} className="border-b">
                <td className="p-2">{match.team1} vs {match.team2}</td>
                <td className="p-2">{new Date(match.match_datetime).toLocaleString()}</td>
                <td className="p-2">{match.team1_score ?? '-'}</td>
                <td className="p-2">{match.team2_score ?? '-'}</td>
                <td className="p-2">
                  <button
                    className="px-2 py-1 bg-green-600 text-white rounded text-sm"
                    onClick={() => alert(`Hier kun je scores van match ${match.id} handmatig aanpassen`)}
                  >
                    Pas punten aan
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Punten overzicht per gebruiker */}
      <section className="mb-6 p-3 border rounded">
        <h2 className="text-lg font-semibold mb-2">Voorspellingen / Punten</h2>
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-2">Speler</th>
              <th className="p-2">Match ID</th>
              <th className="p-2">Score Team 1</th>
              <th className="p-2">Score Team 2</th>
              <th className="p-2">Juiste winnaar</th>
              <th className="p-2">Juiste score</th>
              <th className="p-2">Acties</th>
            </tr>
          </thead>
          <tbody>
            {predictions.map(p => (
              <tr key={p.id} className="border-b">
                <td className="p-2">{p.user_name ?? p.user_id}</td>
                <td className="p-2">{p.match_id}</td>
                <td className="p-2">{p.team1_score ?? '-'}</td>
                <td className="p-2">{p.team2_score ?? '-'}</td>
                <td className="p-2">
                  <input
                    type="number"
                    value={p.correct_winner ?? 0}
                    onChange={e => updatePoints(p.id, 'correct_winner', Number(e.target.value))}
                    className="w-16 border p-1"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={p.correct_score ?? 0}
                    onChange={e => updatePoints(p.id, 'correct_score', Number(e.target.value))}
                    className="w-16 border p-1"
                  />
                </td>
                <td className="p-2">
                  <button
                    className="px-2 py-1 bg-blue-600 text-white rounded text-sm"
                    onClick={() => alert("Nog extra acties")}
                  >
                    Acties
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
