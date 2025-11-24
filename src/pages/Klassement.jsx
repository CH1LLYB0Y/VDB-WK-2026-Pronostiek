import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Klassement() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    loadScores();
  }, []);

  async function loadScores() {
    const { data } = await supabase
      .rpc("get_leaderboard"); // jouw RPC of table

    setScores(data || []);
  }

  return (
    <div className="page">
      <h1>Klassement</h1>

      <ul className="ranking-list">
        {scores.map((s, i) => (
          <li key={s.user_id}>
            <span>{i+1}. {s.email}</span>
            <b>{s.total_points} pts</b>
          </li>
        ))}
      </ul>
    </div>
  );
}
