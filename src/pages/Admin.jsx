import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Navbar from "../components/Navbar";

export default function Admin() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);

    const { data: s } = await supabase
      .from("settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    setSettings(s);
    setLoading(false);
  }

  async function togglePredictions() {
    const newState = !settings.predictions_open;

    await supabase.from("settings").update({
      predictions_open: newState,
    }).eq("id", settings.id);

    setSettings({ ...settings, predictions_open: newState });
  }

  if (loading) return <div>Laden…</div>;

  return (
    <div>
      <Navbar />

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        <div className="p-4 border rounded shadow">
          <h2 className="text-xl font-semibold mb-3">Voorspellingen-instellingen</h2>

          <p className="mb-4">
            Momenteel:{" "}
            <span className="font-bold">
              {settings.predictions_open ? "OPEN" : "GESLOTEN"}
            </span>
          </p>

          <button
            onClick={togglePredictions}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Zet voorspellingen {settings.predictions_open ? "DICHT" : "OPEN"}
          </button>
        </div>
      </div>
    </div>
  );
}
