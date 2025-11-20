import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Admin() {
  const [settings, setSettings] = useState({ predictions_open: true });
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      // Load settings
      const { data: s, error: settingsErr } = await supabase
        .from('settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (settingsErr) console.warn(settingsErr);
      if (s) setSettings(s);

      // Load predictions with user and match info
      const { data: preds, error: predsErr } = await supabase
        .from('pronostieken')
        .select(`
          *,
          users(name),
          matches(team1, team2, match_datetime)
        `)
        .order('match_id', { ascending: true });

      if (predsErr) console.warn(predsErr);
      setPredictions(preds || []);
      setLoading(false);
    }

    loadData();
  }, []);

  // Toggle predictions_open
  async function togglePredictionsOpen(e) {
    const newVal = e.target.checked;
    setSettings({ ...settings, predictions_open: newVal });

    const { error } = await supabase
      .from('settings')
      .update({ predictions_open: newVal })
      .eq('id', settings.id);

    if (error) alert("Fout bij updaten instellingen: " + error.message);
  }

  // Update punten voor een prediction
  async function updatePoints(predId, correct_winner, correct_score) {
    const { error } = await supabase
      .from('pronostieken')
      .update({ correct_winner, correct_score })
      .eq('id', predId);

    if (error) alert("Fout bij updaten punten: " + error.message);
    else {
      setPredictions(predictions.map(p => 
        p.id === predId ? { ...p, correct_winner, correct_score } : p
      ));
    }
  }

  if (loading) return <div className="p-4">Laden…</div>;

  return (
    <div className="container p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="mb-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.predictions_open}
            onChange={togglePredictionsOpen}
          />
          Voorspellingen open
        </label>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">User</th>
            <th className="p-2 text-left">Match</th>
            <th className="p-2 text-left">Voorspelling</th>
            <th className="p-2 text-left">Correct Winner</th>
            <th className="p-2 text-left">Correct Score</th>
            <th className="p-2 text-left">Acties</th>
          </tr>
        </thead>
        <tbody>
          {predictions.map(pred => (
            <tr key={pred.id} className="border-b">
              <td className="p-2">{pred.users?.name}</td>
              <td className="p-2">{pred.matches?.team1} vs {pred.matches?.team2}</td>
              <td className="p-2">{pred.team1_score ?? '-'} - {pred.team2_score ?? '-'}</td>
              <td className="p-2">
                <input
                  type="number"
                  min="0"
                  value={pred.correct_winner ?? 0}
                  onChange={e => updatePoints(pred.id, Number(e.target.value), pred.correct_score ?? 0)}
                  className="w-16 border p-1"
                />
              </td>
              <td className="p-2">
                <input
                  type="number"
                  min="0"
                  value={pred.correct_score ?? 0}
                  onChange={e => updatePoints(pred.id, pred.correct_winner ?? 0, Number(e.target.value))}
                  className="w-16 border p-1"
                />
              </td>
              <td className="p-2">
                <button
                  className="px-2 py-1 bg-blue-600 text-white rounded"
                  onClick={() => updatePoints(pred.id, 5, 25)}
                >
                  Standaard punten
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
