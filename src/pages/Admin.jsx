import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Admin() {
  const user = { email: 'silvandengroenendal@hotmail.com', name: 'Sil VDG', id: 1 };

  const [settings, setSettings] = useState({ predictions_open: true });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      try {
        const settingsData = await fetch('/api/settings').then(res => res.json());
        setSettings(settingsData || { predictions_open: true });
      } catch (err) {
        console.error("Fout bij laden:", err);
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  if (loading) return <div className="p-4">Laden…</div>;

  return (
    <div className="container p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Admin — WK 2026</h1>
        <p className="text-sm text-gray-600">
          Ingelogd als <strong>{user.name}</strong> ({user.email})
        </p>
      </header>

      <main>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Voorspellingen open</label>
          <input
            type="checkbox"
            checked={settings.predictions_open}
            onChange={e => setSettings({ ...settings, predictions_open: e.target.checked })}
          />
        </div>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => alert("Instellingen opgeslagen (hardcoded voor nu)")}
        >
          Opslaan
        </button>
      </main>
    </div>
  );
}
