import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Admin() {
  const [adminUser, setAdminUser] = useState(null);
  const [settings, setSettings] = useState({ predictions_open: true });
  const [loading, setLoading] = useState(true);

  // Load current settings
  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .maybeSingle();
      if (error) console.warn("Error loading settings:", error);
      setSettings(data || { predictions_open: true });
      setLoading(false);
    }

    loadSettings();
  }, []);

  // Admin login
  async function login(e) {
    e.preventDefault();
    const name = e.target.elements.name?.value.trim();
    if (!name) return alert("Vul je adminnaam in");

    try {
      // Check if admin exists
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

  // Optional: update scores manually
  async function updateScore(matchId, team1Score, team2Score) {
    if (!adminUser) return;
    try {
      const { data, error } = await supabase
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

  return (
    <div className="p-4">
      <h2 className="text-xl mb-2">Welkom admin {adminUser.name}</h2>

      <div className="mb-4">
        <p>Voorspellingen open: {settings.predictions_open ? "Ja" : "Nee"}</p>
        <button
          onClick={togglePredictions}
          className="px-2 py-1 bg-green-600 text-white rounded"
        >
          Toggle
        </button>
      </div>

      <div>
        <h3 className="text-lg mb-2">Handmatige score update</h3>
        <p>Gebruik dit om scores van een match handmatig aan te passen.</p>
        {/* Hier kun je een UI maken met een lijst van matches + inputs voor scores */}
      </div>
    </div>
  );
}
