import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Admin() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const { data } = await supabase
      .from("settings")
      .select("*")
      .limit(1)
      .single();

    setSettings(data);
  }

  async function toggleOpen() {
    const updated = await supabase
      .from("settings")
      .update({ predictions_open: !settings.predictions_open })
      .eq("id", settings.id)
      .select()
      .single();

    setSettings(updated.data);
  }

  return (
    <div className="page">
      <h1>Admin Dashboard</h1>

      {!settings && <p>Laden…</p>}

      {settings && (
        <div className="admin-box">

          <h3>Voorspellingen</h3>
          <label className="switch-row">
            <span>Open voor spelers</span>
            <input
              type="checkbox"
              checked={settings.predictions_open}
              onChange={toggleOpen}
            />
          </label>

        </div>
      )}
    </div>
  );
}
