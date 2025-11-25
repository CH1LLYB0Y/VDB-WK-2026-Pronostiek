import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Pronostiek() {
  const [matches, setMatches] = useState([]);
  const [groups, setGroups] = useState({});
  const [openGroups, setOpenGroups] = useState({}); // <-- klapbare secties

  useEffect(() => {
    loadMatches();
  }, []);

  async function loadMatches() {
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .order("wedstrijdnr", { ascending: true });

    if (!data) return;

    // GROEPEN DETECTEREN UIT TEAMNR1 (A1, A2, B1…)
    const grouped = {};

    data.forEach((m) => {
      const groupLetter = m.teamnr1?.charAt(0)?.toUpperCase(); // 'A', 'B', ...

      if (!grouped[groupLetter]) grouped[groupLetter] = [];
      grouped[groupLetter].push(m);
    });

    setMatches(data);
    setGroups(grouped);

    // standaard alles dichtklappen
    const defaults = {};
    Object.keys(grouped).forEach((g) => (defaults[g] = false));
    setOpenGroups(defaults);
  }

  function toggleGroup(g) {
    setOpenGroups((prev) => ({
      ...prev,
      [g]: !prev[g],
    }));
  }

  function flagUrl(teamCode) {
    // teamnr1 = "A1", team1 = "Argentina" -> vlag op basis naam
    return `/flags/${teamCode?.replace(/[0-9]/g, "")}.png`; // A1 → A.png
  }

  return (
    <div className="page">

      <h1 className="page-title">Mijn Pronostiek</h1>

      <div className="pronostiek-wrapper">

        {Object.keys(groups).map((group) => (
          <div className="group-block" key={group}>

            {/* TOGGLE HEADER */}
            <button className="group-header" onClick={() => toggleGroup(group)}>
              <span className="group-title">Poule {group}</span>
              <span className="group-arrow">{openGroups[group] ? "▲" : "▼"}</span>
            </button>

            {/* INKLAPBARE CONTENT */}
            {openGroups[group] && (
              <div className="group-content">

                {groups[group].map((m) => (
                  <div key={m.id} className="match-card">

                    <div className="match-top">

                      <div className="team team-left">
                        <img src={flagUrl(m.teamnr1)} className="flag" alt="" />
                        <span>{m.team1}</span>
                      </div>

                      <div className="vs">vs</div>

                      <div className="team team-right">
                        <img src={flagUrl(m.teamnr2)} className="flag" alt="" />
                        <span>{m.team2}</span>
                      </div>

                    </div>

                    <div className="match-info">
                      <div className="datetime">
                        {new Date(m.datum).toLocaleDateString("nl-NL")} – {m.tijd}
                      </div>
                      <div className="location">🏟️ {m.locatie}</div>
                    </div>

                    <div className="match-bottom">
                      <div className="score-inputs">
                        <input type="number" min="0" className="score-box" placeholder="0" />
                        <span>-</span>
                        <input type="number" min="0" className="score-box" placeholder="0" />
                      </div>

                      <div className="save-area">
                        <button className="save-btn">Opslaan</button>
                      </div>
                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>
        ))}

      </div>
    </div>
  );
}
