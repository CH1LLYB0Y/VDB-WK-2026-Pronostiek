import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    // load users
    const { data: u } = await supabase.from("users").select("*").order("id", { ascending: true });
    setUsers(u || []);

    // load predictions
    const { data: p } = await supabase
      .from("pronostieken")
      .select("*, users(name), matches(team1, team2)")
      .order("match_id", { ascending: true });
    setPredictions(p || []);

    // load settings
    const { data: s } = await supabase.from("settings").select("*").limit(1).maybeSingle();
    setSettings(s || { predictions_open: true });
  }

  async function togglePredictions() {
    const newVal = !settings.predictions_open;

    await supabase
      .from("settings")
      .update({ predictions_open: newVal })
      .eq("id", settings.id);

    setSettings({ ...settings, predictions_open: newVal });
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Paneel</h1>

      {/* SETTINGS */}
      <section className="mb-8 p-4 border rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-3">Instellingen</h2>

        {settings && (
          <div className="flex items-center gap-4">
            <div>
              Voorspellingen staan:{" "}
              <strong className={settings.predictions_open ? "text-green-600" : "text-red-600"}>
                {settings.predictions_open ? "Open" : "Gesloten"}
              </strong>
            </div>

            <button
              onClick={togglePredictions}
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Toggle
            </button>
          </div>
        )}
      </section>

      {/* USERS */}
      <section className="mb-8 p-4 border rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-3">Gebruikers</h2>

        <ul className="list-disc pl-5">
          {users.map((u) => (
            <li key={u.id}>
              {u.name} (ID: {u.id})
            </li>
          ))}
        </ul>
      </section>

      {/* PRONOSTIEKEN */}
      <section className="p-4 border rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-3">Alle Pronostieken</h2>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Gebruiker</th>
              <th className="border p-2">Wedstrijd</th>
              <th className="border p-2">Score</th>
            </tr>
          </thead>
          <tbody>
            {predictions.map((p) => (
              <tr key={`${p.user_id}-${p.match_id}`}>
                <td className="border p-2">{p.users?.name}</td>
                <td className="border p-2">
                  {p.matches?.team1} vs {p.matches?.team2}
                </td>
                <td className="border p-2">
                  {p.team1_score ?? "-"} - {p.team2_score ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
