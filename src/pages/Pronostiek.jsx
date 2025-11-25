import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Pronostiek() {
  const [matches, setMatches] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [openGroup, setOpenGroup] = useState(null);

  useEffect(() => {
    loadMatches();
    loadPredictions();
  }, []);

  /* -----------------------------------------------------
     LOAD MATCHES
  ----------------------------------------------------- */
  async function loadMatches() {
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .order("wedstrijdnr", { ascending: true });

    if (!error) setMatches(data || []);
  }

  /* -----------------------------------------------------
     LOAD EXISTING USER PREDICTIONS
  ----------------------------------------------------- */
  async function loadPredictions() {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) return;

    const { data } = await supabase
      .from("pronostieken")
      .select("*")
      .eq("user_id", user.user.id);

    let map = {};
    data?.forEach((p) => {
      map[p.match_id] = {
        team1_score: p.team1_score,
        team2_score: p.team2_score,
      };
    });

    setPredictions(map);
  }

  /* -----------------------------------------------------
     SAVE PREDICTION
  ----------------------------------------------------- */
  async function savePrediction(match_id, team1_score, team2_score) {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) return;

    // bestaat record al?
    const existing = await supabase
      .from("pronostieken")
      .select("*")
      .eq("user_id", user.user.id)
      .eq("match_id", match_id)
      .maybeSingle();

    if (existing.data) {
      // Update
      await supabase
        .from("pronostieken")
        .update({
          team1_score,
          team2_score,
        })
        .eq("id", existing.data.id);
    } else {
      // Insert
      await supabase.from("pronostieken").insert({
        user_id: user.user.id,
        match_id,
        team1_score,
        team2_score,
      });
    }
  }

  /* -----------------------------------------------------
     GROUP MATCHES BY LETTER OF teamnr1 (A, B, C…)
  ----------------------------------------------------- */
  const matchesByGroup = matches.reduce((acc, m) => {
    const group = m.teamnr1?.charAt(0) ?? "?";
    if (!acc[group]) acc[group] = [];
    acc[group].push(m);
    return acc;
  }, {});

  /* -----------------------------------------------------
     RENDER
  ----------------------------------------------------- */
  return (
    <div className="page pronostiek-page">
      <h1 className="page-title">Mijn Pronostiek</h1>

      {/* GROUPS */}
      {Object.keys(matchesByGroup).sort().map((group) => (
        <div key={group} className="group-block">

          {/* HEADER */}
          <div
            className="group-header"
            onClick={() =>
              setOpenGroup(openGroup === group ? null : group)
            }
          >
            <h2>Groep {group}</h2>
            <span className="group-arrow">
              {openGroup === group ? "▲" : "▼"}
            </span>
          </div>

          {/* MATCH LIST */}
          {openGroup === group && (
            <div className="match-list">
              {matchesByGroup[group].map((m) => (
                <div key={m.id} className="match-card">

                  <div className="match-top">
                    <span className="match-location">{m.locatie}</span>
                    <span className="match-date">
                      {new Date(m.datum).toLocaleDateString("nl-BE")}
                      {" • "}
                      {m.tijd?.substring(0, 5)}
                    </span>
                  </div>

                  <div className="match-teams">
                    <div className="team-box">
                      {/* Flag could be added as: <img src={`/flags/${m.team1}.png`} /> */}
                      <span className="team-name">{m.team1}</span>
                    </div>

                    <div className="score-box">
                      <input
                        type="number"
                        min="0"
                        className="score-input"
                        value={predictions[m.id]?.team1_score ?? ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          const newPred = {
                            ...predictions[m.id],
                            team1_score: val,
                          };
                          setPredictions({
                            ...predictions,
                            [m.id]: newPred,
                          });
                          savePrediction(
                            m.id,
                            val,
                            predictions[m.id]?.team2_score ?? ""
                          );
                        }}
                      />

                      <span className="score-separator">–</span>

                      <input
                        type="number"
                        min="0"
                        className="score-input"
                        value={predictions[m.id]?.team2_score ?? ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          const newPred = {
                            ...predictions[m.id],
                            team2_score: val,
                          };
                          setPredictions({
                            ...predictions,
                            [m.id]: newPred,
                          });
                          savePrediction(
                            m.id,
                            predictions[m.id]?.team1_score ?? "",
                            val
                          );
                        }}
                      />
                    </div>

                    <div className="team-box">
                      <span className="team-name">{m.team2}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
