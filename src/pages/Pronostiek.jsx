import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Pronostiek() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    loadMatches();
  }, []);

  async function loadMatches() {
    const { data } = await supabase
      .from("matches")
      .select("*")
      .order("datum", { ascending: true })
      .order("tijd", { ascending: true });

    setMatches(data || []);
  }

  return (
    <div className="page">
      <h1>Mijn Pronostiek</h1>

      {matches.map((m) => (
        <div key={m.ID} className="match-card">
          <div className="match-teams">{m.team1} vs {m.team2}</div>
          <div className="match-info">
            <span>{new Date(m.datum).toLocaleDateString()}</span> - <span>{m.tijd}</span>
          </div>
          <div className="match-location">{m.locatie}</div>
        </div>
      ))}
    </div>
  );
}
