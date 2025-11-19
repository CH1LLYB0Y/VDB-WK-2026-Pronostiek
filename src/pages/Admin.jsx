import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Admin() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: ms, error } = await supabase
        .from('matches')
        .select('*')
        .order('match_datetime', { ascending: true });
      if (error) console.warn("Error loading matches:", error);
      setMatches(ms || []);
      setLoading(false);
    }
    load();
  }, []);

  async function updateMatch(match) {
    const { error } = await supabase
      .from('matches')
      .update({
        team1_score: match.team1_score,
        team2_score: match.team2_score,
        round: match.round,
        stadium: match.stadium,
      })
      .eq('id', match.id);

    if (error) alert("Fout bij updaten: " + error.message);
    else alert("Match geüpdatet!");
  }

  if (loading) return <div className="p-4">Laden…</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin — Matches beheren</h1>
      <div className="space-y-4">
        {matches.map((m) => (
          <div key={m.id} className="p-4 border rounded flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-2">
              <img
                src={`https://flagcdn.com/24x18/${(m.team1_code || 'xx').toLowerCase()}.png`}
                alt={m.team1}
                className="h-6 w-auto"
              />
              <span>{m.team1}</span>
              <span className="mx-1 font-bold">vs</span>
              <img
                src={`https://flagcdn.com/24x18/${(m.team2_code || 'xx').toLowerCase()}.png`}
                alt={m.team2}
                className="h-6 w-auto"
              />
              <span>{m.team2}</span>
            </div>

            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="T1 score"
                value={m.team1_score ?? ''}
                onChange={(e) => (m.team1_score = Number(e.target.value))}
                className="w-16 p-1 border rounded"
              />
              <input
                type="number"
                placeholder="T2 score"
                value={m.team2_score ?? ''}
                onChange={(e) => (m.team2_score = Number(e.target.value))}
                className="w-16 p-1 border rounded"
              />
              <input
                type="text"
                placeholder="Ronde"
                value={m.round || ''}
                onChange={(e) => (m.round = e.target.value)}
                className="w-24 p-1 border rounded"
              />
              <input
                type="text"
                placeholder="Stadion"
                value={m.stadium || ''}
                onChange={(e) => (m.stadium = e.target.value)}
                className="w-32 p-1 border rounded"
              />
              <button
                onClick={() => updateMatch(m)}
                className="px-2 py-1 bg-green-600 text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
