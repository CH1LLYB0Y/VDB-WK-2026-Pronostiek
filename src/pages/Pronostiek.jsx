import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

// Helper om emoji-vlaggen te genereren op basis van landcode
// (Werkt alleen als team1/team2 een 2-letter code zijn, bv. "FR", "BE")
function flagFromCountryCode(code) {
  if (!code || code.length !== 2) return "🏳️";
  const base = 127397;
  return String.fromCodePoint(...[...code.toUpperCase()].map(c => base + c.charCodeAt(0)));
}

export default function Pronostiek() {
  const [groups, setGroups] = useState({});
  const [predictions, setPredictions] = useState({});
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

    const grouped = {};
    data.forEach((m) => {
      const groupLetter = m.teamnr1?.charAt(0).toUpperCase() ?? "?";
      if (!grouped[groupLetter]) grouped[groupLetter] = [];
      grouped[groupLetter].push(m);
    });

    setGroups(grouped);
    setLoading(false);
  }

  function updateScore(matchId, field, value) {
    setPredictions((prev) => ({
      ...prev,
      [matchId]: { ...prev[matchId], [field]: value }
    }));
  }

  async function savePrediction(matchId) {
    const pred = predictions[matchId];
    if (!pred) return;

    const user = await supabase.auth.getUser();
    const userId = user.data?.user?.id;

    const { error } = await supabase
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
    <div className="flex justify-center px-4">
      <div className="w-full max-w-3xl py-8">

        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
          Mijn Pronostiek
        </h1>

        {loading && <p className="text-center">Laden…</p>}

        {!loading &&
          Object.keys(groups)
            .sort()
            .map((group) => (
              <div key={group} className="mb-10">

                {/* Groepsnaam */}
                <h2 className="text-2xl font-bold mb-4 text-blue-700 text-center">
                  Poule {group}
                </h2>

                <div className="space-y-6">
                  {groups[group].map((m) => {
                    const flag1 = flagFromCountryCode(m.team1_code);
                    const flag2 = flagFromCountryCode(m.team2_code);

                    return (
                      <div
                        key={m.id}
                        className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 text-center"
                      >
                        {/* Teams + vlaggen */}
                        <div className="flex justify-center items-center gap-4 mb-3">
                          <div className="text-3xl">{flag1}</div>
                          <div className="text-lg font-semibold text-gray-900">
                            {m.team1}
                          </div>

                          <span className="text-gray-600 font-bold">vs</span>

                          <div className="text-lg font-semibold text-gray-900">
                            {m.team2}
                          </div>
                          <div className="text-3xl">{flag2}</div>
                        </div>

                        {/* Datum & tijd */}
                        <p className="text-sm text-gray-700 font-medium">
                          {m.datum} — {m.tijd.slice(0, 5)}
                        </p>

                        {/* Locatie */}
                        <p className="text-sm text-gray-500 mt-1">
                          🏟️ {m.locatie}
                        </p>

                        {/* Score inputs */}
                        <div className="flex justify-center items-center gap-3 mt-4">
                          <input
                            type="number"
                            min="0"
                            className="w-12 p-1 text-center border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            value={predictions[m.id]?.score_team1 || ""}
                            onChange={(e) =>
                              updateScore(m.id, "score_team1", e.target.value)
                            }
                          />

                          <span className="font-bold text-gray-700">-</span>

                          <input
                            type="number"
                            min="0"
                            className="w-12 p-1 text-center border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            value={predictions[m.id]?.score_team2 || ""}
                            onChange={(e) =>
                              updateScore(m.id, "score_team2", e.target.value)
                            }
                          />
                        </div>

                        {/* Opslaan button */}
                        <button
                          onClick={() => savePrediction(m.id)}
                          className="mt-4 px-5 py-2 bg-blue-600 text-white font-bold rounded-xl shadow hover:bg-blue-700 active:scale-95 transition"
                        >
                          Opslaan
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
