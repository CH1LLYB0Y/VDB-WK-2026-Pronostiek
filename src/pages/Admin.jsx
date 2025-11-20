import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Admin() {
  const [settings, setSettings] = useState({ predictions_open: true });
  const [matches, setMatches] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load settings, matches, and predictions
  useEffect(() => {
    async function loadData() {
      setLoading(true);

      const { data: s } = await supabase.from('settings').select('*').limit(1).single().catch(()=>({ data: null }));
      if (s) setSettings(s);

      const { data: ms } = await supabase.from('matches').select('*').order('match_datetime', { ascending: true });
      if (ms) setMatches(ms);

      const { data: preds } = await supabase.from('pronostieken').select('*');
      if (preds) setPredictions(preds);

      setLoading(false);
    }

    loadData();
  }, []);

  // Toggle predictions_open
  async function togglePredictionsOpen() {
    const { error } = await supabase.from('settings').update({ predictions_open: !settings.predictions_open }).eq('id', settings.id);
    if (!error) setSettings({ ...settings, predictions_open: !settings.predictions_open });
  }

  // Update match result and recalc points
  async function updateMatchResult(matchId, team1, team2) {
    // Update match scores
    const { error: matchError } = await supabase.from('matches').update({
      team1_score: team1,
      team2_score: team2
    }).eq('id', matchId);

    if (matchError) {
      alert("Fout bij updaten match: " + matchError.message);
      return;
    }

    // Recalculate points
    const matchPreds = predictions.filter(p => p.match_id === matchId);
    for (const p of matchPreds) {
      let winnerPoints = 0;
      let scorePoints = 0;

      if (p.team1_score != null && p.team2_score != null) {
        const predictedWinner = p.team1_score > p.team2_score ? 'team1' :
                                p.team1_score < p.team2_score ? 'team2' : 'draw';
        const actualWinner = team1 > team2 ? 'team1' :
                             team1 < team2 ? 'team2' : 'draw';
        if (predictedWinner === actualWinner) winnerPoints = 5; // correct_winner = 5
        if (p.team1_score === team1 && p.team2_score === team2) scorePoints = 25; // correct_score = 25
      }

      const totalPoints = winnerPoints + scorePoints;

      await supabase.from('pronostieken').update({
        correct_winner: winnerPoints,
        correct_score: scorePoints,
        total_points: totalPoints
      }).eq('id', p.id);

      // Update local state
      setPredictions(predictions.map(pred =>
        pred.id === p.id
          ? { ...pred, correct_winner: winnerPoints, correct_score: scorePoints, total_points: totalPoints }
          : pred
      ));
    }

    // Update local match scores
    setMatches(matches.map(m =>
      m.id === matchId
        ? { ...m, team1_score: team1, team2_score: team2 }
        : m
    ));

    alert("Scores bijgewerkt!");
  }

  if (loading) return <div className="p-4">Laden…</div>;

  return (
    <div className="container p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Admin Panel — WK 2026 Pronostiek</h1>
        <div className="mt-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={settings.predictions_open} onChange={togglePredictionsOpen} />
            Voorspellingen open
          </label>
        </div>
      </header>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Wedstrijden en Scores</h2>
        {matches.map(m => (
          <div key={m.id} className="mb-3 p-3 border rounded">
            <div className="flex items-center gap-4">
              <div className="font-medium">{m.team1} vs {m.team2}</div>
              <input
                type="number"
                value={m.team1_score ?? ''}
                placeholder="Team1"
                className="w-16 p-1 border"
                onChange={e => setMatches(matches.map(match =>
                  match.id === m.id ? { ...match, team1_score: Number(e.target.value) } : match
                ))}
              />
              <span>-</span>
              <input
                type="number"
                value={m.team2_score ?? ''}
                placeholder="Team2"
                className="w-16 p-1 border"
                onChange={e => setMatches(matches.map(match =>
                  match.id === m.id ? { ...match, team2_score: Number(e.target.value) } : match
                ))}
              />
              <button
                className="ml-2 px-2 py-1 bg-green-600 text-white rounded"
                onClick={() => updateMatchResult(m.id, m.team1_score ?? 0, m.team2_score ?? 0)}
              >
                Update
              </button>
            </div>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Voorspellingen Overzicht</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border p-1">Gebruiker</th>
                <th className="border p-1">Wedstrijd</th>
                <th className="border p-1">Voorspelling</th>
                <th className="border p-1">Correct Winner</th>
                <th className="border p-1">Correct Score</th>
                <th className="border p-1">Totaal punten</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map(p => {
                const match = matches.find(m => m.id === p.match_id);
                const matchLabel = match ? `${match.team1} vs ${match.team2}` : '';
                const predLabel = `${p.team1_score ?? '-'} - ${p.team2_score ?? '-'}`;
                return (
                  <tr key={p.id}>
                    <td className="border p-1">{p.user_name || p.user_id}</td>
                    <td className="border p-1">{matchLabel}</td>
                    <td className="border p-1">{predLabel}</td>
                    <td className="border p-1">{p.correct_winner ?? 0}</td>
                    <td className="border p-1">{p.correct_score ?? 0}</td>
                    <td className="border p-1">{p.total_points ?? 0}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
