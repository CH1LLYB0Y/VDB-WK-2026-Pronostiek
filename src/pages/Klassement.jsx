import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import supabase from "../supabase";

export default function Klassement() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    loadScores();
  }, []);

  async function loadScores() {
    const { data, error } = await supabase
      .from("user_scores")
      .select("*")
      .order("total_points", { ascending: false });

    if (!error) setScores(data);
  }

  return (
    <div>
      <Header />

      <div style={{ padding: "20px" }}>
        <h2>Klassement</h2>

        {scores.map((s, index) => (
          <div
            key={s.id}
            style={{
              padding: "15px",
              marginBottom: "10px",
              background: "#ffffff",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          >
            <b>{index + 1}. {s.user_name}</b>
            <br />
            {s.total_points} punten
          </div>
        ))}
      </div>
    </div>
  );
}
