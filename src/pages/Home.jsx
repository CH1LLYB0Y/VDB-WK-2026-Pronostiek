import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import PronostiekForm from "../components/PronostiekForm";
import Leaderboard from "../components/Leaderboard";
import Navbar from "../components/Navbar";

export default function Home() {
  const [matches, setMatches] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const { data: ms } = await supabase
        .from("matches")
        .select("*")
        .order("match_datetime", { ascending: true });

      const { data: s } = await supabase
        .from("settings")
        .select("*")
        .limit(1)
        .maybeSingle(); // veilig!

      setMatches(ms || []);
      setSettings(s || { predictions_open: true });

      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="p-4">Laden…</div>;

  return (
    <div>
      <Navbar />

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Wedstrijden & Voorspellingen</h1>

        <main className="grid md:grid-cols-2 gap-6">
          <section>
            {matches.map((m) => (
              <div key={m.id} className="card mb-3 p-3 border rounded shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">
                      {m.team1} vs {m.team2}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(m.match_datetime).toLocaleString()}
                    </div>
                  </div>

                  <PronostiekForm match={m} settings={settings} />
                </div>
              </div>
            ))}
          </section>

          <aside>
            <Leaderboard />
          </aside>
        </main>
      </div>
    </div>
  );
}
