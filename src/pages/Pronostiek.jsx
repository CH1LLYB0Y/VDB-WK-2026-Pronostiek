import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Pronostiek() {
  const [groups, setGroups] = useState({});
  const [predictions, setPredictions] = useState({}); // lokale scores
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  async function loadMatches() {
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .order("datum", { ascending: true })
      .order("tijd", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    // Groepeer per poule (teamnr1 begint met A/B/C/…)
    const grouped = {};
    data.forEach((m) => {
      const groupLetter = m.teamnr1?.charAt(0).toUpperCase() ?? "?";

      if (!grouped[groupLetter]) grouped[groupLetter] = [];
      grouped[groupLetter].push(m);
    });

    setGroups(grouped);
    setLoading(false);
  }

  // Score wijziging opslaan in lokale state
  function updateScore(matchId, field, value) {
    setPredictions((prev) => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [field]: value
      }
    }));
  }

  // Opslaan in database (supabase tabel: pronostieken)
  async function savePrediction(matchId) {
    const pred = predictions[matchId];
    if (!pred) return;

    const user = await supabase.auth.getUser();
    const userId = user.data?.user?.id;

    if (!userId) {
      alert("Je moet ingelogd zijn om je pronostiek op te slaan.");
      return;
    }

    const { data, error } = await supabase
      .from("pronostieken")
      .upsert(
        {
          user_id: userId,
          match_id: matchId,
          score_team1: pred.score_team1 || null,
          score_team2: pred.score_team2 || null,
        },
        { onConflict: "user_id,match_id" }
      );

    if (error) {
      console.error(error);
      alert("Er ging iets mis bij het opslaan.");
    } else {
      alert("Pronostiek opgeslagen!");
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
        Mijn Pronostiek
      </h1>

      {loading && <p className="text-center">Laden…</p>}

      {!loading &&
        Object.keys(groups).sort().map((group) => (
          <div key={group} className="mb-10">

            {/* Groepsheader */}
            <h2 className="text-2xl font-bold mb-4 text-wkblue">
              Poule {group}
            </h2>

            <div className="space-y-6">
              {groups[group].map((m) => (
                <div
                  key={m.id}
                  className="bg-white rounded-2xl shadow-md p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-gray-200"
                >
                  {/* Teams */}
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-gray-900">
                      {m.team1} <span className="text-gray-500">vs</span> {m.team2}
                    </p>

                    <p className="text-sm text-gray-600">
                      {m.datum} — {m.tijd.slice(0, 5)}  
                      <span className="ml-2 text-gray-500">({m.locatie})</span>
                    </p>
                  </div>

                  {/* Score invullen */}
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="0"
                      className="w-14 p-2 text-center border rounded-xl"
                      value={predictions[m.id]?.score_team1 || ""}
                      onChange={(e) =>
                        updateScore(m.id, "score_team1", e.target.value)
                      }
                    />

                    <span className="font-bold">-</span>

                    <input
                      type="number"
                      min="0"
                      className="w-14 p-2 text-center border rounded-xl"
                      value={predictions[m.id]?.score_team2 || ""}
                      onChange={(e) =>
                        updateScore(m.id, "score_team2", e.target.value)
                      }
                    />
                  </div>

                  {/* Opslaan */}
                  <button
                    onClick={() => savePrediction(m.id)}
                    className="px-5 py-2 bg-wkgreen text-white font-bold rounded-xl shadow hover:bg-green-700 active:scale-95 transition"
                  >
                    Opslaan
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
