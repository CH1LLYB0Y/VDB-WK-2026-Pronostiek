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
      .order("match_datetime", { ascending: true });

    setMatches(data || []);
  }

  return (
    <div className="page">
      <h1>Mijn Pronostiek</h1>

      {matches.map((m) => (
        <div key={m.id} className="match-card">
          <div>{m.team1} vs {m.team2}</div>
          <div>{new Date(m.match_datetime).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}
