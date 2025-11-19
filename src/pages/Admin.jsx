import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Admin() {
  const [adminUser, setAdminUser] = useState(null);
  const [settings, setSettings] = useState({ predictions_open: true });
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load settings and matches
  useEffect(() => {
    async function loadData() {
      setLoading(true);

      // Load settings
      const { data: s, error: sErr } = await supabase
        .from('settings')
        .select('*')
        .maybeSingle();
      if (sErr) console.warn("Settings load error:", sErr);
      setSettings(s || { predictions_open: true });

      // Load matches
      const { data: ms, error: msErr } = await supabase
        .from('matches')
        .select('*')
        .order('match_datetime', { ascending: true });
      if (msErr) console.warn("Matches load error:", msErr);
      setMatches(ms || []);

      setLoading(false);
    }

    loadData();
  }, []);

  // Admin login
  async function login(e) {
    e.preventDefault();
    const name = e.target.elements.name?.value.trim();
    if (!name) return alert("Vul je adminnaam in");

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('name', name)
        .maybeSingle();

      if (error) throw error;
      if (!data) return alert("Admin niet gevonden");
      if (!data.is_admin) return alert("Geen adminrechten");

      setAdminUser(data);
      alert("Welkom admin " + data.name);
    } catch (err) {
      console.error(err);
      alert("Fout bij login: " + err.message);
    }
  }

  // Toggle predictions open/closed
  async function togglePredictions() {
    if (!adminUser) return;
    try {
      const updated = { predictions_open: !settings.predictions_open };
      const { data, error } = await supabase
        .from('settings')
        .upsert(updated, { onConflict: ['id'] })
        .maybeSingle();
      if (error) throw error;
      setSettings(data);
    } catch (err) {
      console.error(err);
      alert("Fout bij opslaan instellingen: " + err.message);
    }
  }

  // Update match scores
  async function updateScore(matchId, team1Score, team2Score) {
    if (!adminUser) return;
    try {
      const { error } = await supabase
        .from('pronostieken')
        .update({ team1_score: team1Score, team2_score: team2Score })
        .eq('match_id', matchId);
      if (error) throw error;
      alert("Score geüpdatet!");
    } catch (err) {
      console.error(err);
      alert("Fout bij updaten score: " + err.message);
    }
  }

  if (!adminUser) {
    return (
      <div className="p-4">
        <h2 className="text-xl mb-2">Admin login</h2>
        <form onSubmit={login} className="flex gap-2 items-center">
          <input name="name" placeholder="Admin naam" className="border p-1" />
          <button className="px-2 py-1 bg-blue-600 text-white rounded">Login</button>
        </form>
      </div>
    );
  }

  if (loading) return <div className="p-4">Laden…</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl mb-2">Welkom admin {adminUser.name}</h2>

      {/* Toggle predictions */}
      <div className="mb-4">
        <p>Voorspellingen open: {settings.predictions_open ? "Ja" : "Nee"}</p>
        <button
          onClick={togglePredictions}
          className="px-2 py-1 bg-green-600 text-white rounded"
        >
          Toggle
        </button>
      </div>

      {/* Matches list with score editing */}
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">Datum/Tijd</th>
              <th className="border px-2 py-1">Ronde</th>
              <th className="border px-2 py-1">Stadion</th>
              <th className="border px-2 py-1">Teams</th>
              <th className="border px-2 py-1">Team1</th>
              <th className="border px-2 py-1">Team2</th>
              <th className="border px-2 py-1">Actie</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((m) => (
              <tr key={m.id} className="text-center">
                <td className="border px-2 py-1">{new Date(m.match_datetime).toLocaleString()}</td>
                <td className="border px-2 py-1">{m.round || "-"}</td>
                <td className="border px-2 py-1">{m.stadium || "-"}</td>
                <td className="border px-2 py-1">{m.team1} - {m.team2}</td>
                <td className="border px-2 py-1">
                  <input
                    type="number"
                    min="0"
                    defaultValue={m.team1_score || ""}
                    onChange={(e) => m.team1_score = e.target.value}
                    className="w-16 p-1 border"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="number"
                    min="0"
                    defaultValue={m.team2_score || ""}
                    onChange={(e) => m.team2_score = e.target.value}
                    className="w-16 p-1 border"
                  />
                </td>
                <td className="border px-2 py-1">
                  <button
                    onClick={() => updateScore(m.id, Number(m.team1_score), Number(m.team2_score))}
                    className="px-2 py-1 bg-blue-600 text-white rounded"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
