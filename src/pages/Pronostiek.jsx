import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

/*
  Plain CSS versie (geen Tailwind).
  - Verwacht dat je CSS-classes in index.css aanwezig zijn (voorbeeld hieronder).
  - Vlaggen: zoekt naar /flags/<team>.png in public map. Als die er niet is, toont hij een default globe emoji.
*/

function Flag({ team }) {
  // probeer een image in public/flags/{team}.png (voeg kleine slugify toe)
  if (!team) return <span className="flag-fallback">🏳️</span>;
  const fileName = team
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const imgUrl = `/flags/${fileName}.png`;
  // We can't check existence synchronously; use <img> and fallback with onError.
  return (
    <img
      src={imgUrl}
      alt={team}
      className="team-flag"
      onError={(e) => {
        // fallback to emoji if image missing
        e.currentTarget.style.display = "none";
      }}
    />
  );
}

export default function Pronostiek() {
  const [groups, setGroups] = useState({});
  const [predictions, setPredictions] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
    // also load existing predictions for current logged-in user
    loadUserPredictions();
    // eslint-disable-next-line
  }, []);

  async function loadMatches() {
    setLoading(true);
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .order("datum", { ascending: true })
      .order("tijd", { ascending: true });

    if (error) {
      console.error("Error loading matches:", error);
      setLoading(false);
      return;
    }

    // group by letter from teamnr1 (first char)
    const grouped = {};
    (data || []).forEach((m) => {
      const teamnr1 = m.teamnr1 ?? m.teamNr1 ?? "";
      const group = (teamnr1 && teamnr1[0]) ? teamnr1[0].toUpperCase() : "?";
      if (!grouped[group]) grouped[group] = [];
      grouped[group].push(m);
    });

    setGroups(grouped);
    setLoading(false);
  }

  async function loadUserPredictions() {
    const sessionRes = await supabase.auth.getSession();
    const userId = sessionRes?.data?.session?.user?.id;
    if (!userId) return;

    const { data, error } = await supabase
      .from("pronostieken")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error loading predictions:", error);
      return;
    }

    const map = {};
    (data || []).forEach((p) => {
      map[p.match_id] = {
        team1_score: p.team1_score,
        team2_score: p.team2_score,
        rowId: p.id,
      };
    });
    setPredictions(map);
  }

  function formatDate(d) {
    if (!d) return "";
    try {
      // if it's a Date-like string, normalize
      const dt = new Date(d);
      return dt.toLocaleDateString("nl-BE");
    } catch {
      return d;
    }
  }

  function formatTime(t) {
    if (!t) return "";
    // if time stored like "18:00:00" show HH:MM
    return typeof t === "string" ? t.substring(0, 5) : t;
  }

  function handleLocalChange(matchKey, field, value) {
    setPredictions((prev) => {
      const prevRow = prev[matchKey] || {};
      return {
        ...prev,
        [matchKey]: { ...prevRow, [field]: value },
      };
    });
  }

  async function handleSave(match) {
    const matchKey = match.id ?? match.ID;
    const pred = predictions[matchKey] || {};
    const sessionRes = await supabase.auth.getSession();
    const userId = sessionRes?.data?.session?.user?.id;
    if (!userId) {
      alert("Je moet ingelogd zijn om je voorspelling op te slaan.");
      return;
    }

    // upsert into pronostieken
    const payload = {
      user_id: userId,
      match_id: matchKey,
      team1_score: pred.team1_score === "" ? null : (pred.team1_score ? Number(pred.team1_score) : null),
      team2_score: pred.team2_score === "" ? null : (pred.team2_score ? Number(pred.team2_score) : null),
    };

    // Use upsert with onConflict on user_id & match_id (Supabase v2 syntax)
    const { error, data } = await supabase
      .from("pronostieken")
      .upsert(payload, { onConflict: ["user_id", "match_id"] })
      .select()
      .single()
      .catch((e) => ({ error: e }));

    if (error) {
      console.error("Save error:", error);
      alert("Opslaan mislukt. Kijk console voor details.");
      return;
    }

    // refresh local predictions map (data may be present)
    if (data) {
      setPredictions((prev) => ({
        ...prev,
        [matchKey]: {
          team1_score: data.team1_score,
          team2_score: data.team2_score,
          rowId: data.id,
        },
      }));
    } else {
      // reload predictions if server didn't return
      loadUserPredictions();
    }

    // brief feedback
    const originalTeam1 = match.team1 ?? "";
    const originalTeam2 = match.team2 ?? "";
    alert(`Voorspelling voor ${originalTeam1} vs ${originalTeam2} opgeslagen.`);
  }

  return (
    <div className="pronostiek-page">
      <div className="pronostiek-container">
        <h1 className="pronostiek-title">Mijn Pronostiek</h1>

        {loading && <div className="pronostiek-loading">Laden…</div>}

        {!loading && Object.keys(groups).length === 0 && (
          <div className="pronostiek-empty">Geen wedstrijden gevonden.</div>
        )}

        {!loading &&
          Object.keys(groups)
            .sort()
            .map((group) => (
              <section key={group} className="group-section">
                <h2 className="group-title">Groep {group}</h2>

                <div className="group-matches">
                  {(groups[group] || []).map((m) => {
                    const matchKey = m.id ?? m.ID;
                    const pred = predictions[matchKey] || {};

                    return (
                      <article key={matchKey} className="match-card">
                        <div className="match-top">
                          <div className="teams-row">
                            <div className="team-left">
                              <Flag team={m.team1} />
                              <div className="team-name">{m.team1}</div>
                            </div>

                            <div className="vs-block">vs</div>

                            <div className="team-right">
                              <Flag team={m.team2} />
                              <div className="team-name">{m.team2}</div>
                            </div>
                          </div>

                          <div className="meta-row">
                            <div className="meta-datetime">
                              {formatDate(m.datum)} — {formatTime(m.tijd)}
                            </div>
                            <div className="meta-location">🏟️ {m.locatie}</div>
                          </div>
                        </div>

                        <div className="match-bottom">
                          <div className="score-inputs">
                            <input
                              className="score-input"
                              type="number"
                              min="0"
                              value={pred.team1_score ?? ""}
                              onChange={(e) =>
                                handleLocalChange(matchKey, "team1_score", e.target.value)
                              }
                              placeholder="-"
                            />
                            <span className="score-sep">—</span>
                            <input
                              className="score-input"
                              type="number"
                              min="0"
                              value={pred.team2_score ?? ""}
                              onChange={(e) =>
                                handleLocalChange(matchKey, "team2_score", e.target.value)
                              }
                              placeholder="-"
                            />
                          </div>

                          <div className="save-area">
                            <button
                              className="btn-save"
                              onClick={() => handleSave(m)}
                            >
                              Opslaan
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
      </div>
    </div>
  );
}
