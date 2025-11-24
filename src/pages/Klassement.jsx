import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Klassement() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    loadScores();
  }, []);

  async function loadScores() {
    const { data } = await supabase
      .rpc("get_leaderboard"); // Zorg dat deze RPC bestaat

    setScores(data || []);
  }

  return (
    <div className="page">
      <h1>Klassement</h1>

      <ul className="ranking-list">
        {scores.map((s, i) => (
          <li key={s.user_id} className="ranking-item">
            <span className="ranking-pos">{i + 1}.</span>
            <span className="ranking-name">{s.email}</span>
            <b className="ranking-points">{s.total_points} pts</b>
          </li>
        ))}
      </ul>
    </div>
  );
}
