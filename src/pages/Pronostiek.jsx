import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import supabase from "../supabase";

export default function Pronostiek() {
  const [matches, setMatches] = useState([]);
  const [predictions, setPredictions] = useState({});

  useEffect(() => {
    loadMatches();
  }, []);

  async function loadMatches() {
    const { data, error } = await supabase.from("matches").select("*").order("id");
    if (!error) setMatches(data);
  }

  function updatePrediction(matchId, field, value) {
    setPredictions(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [field]: value,
      },
    }));
  }

  async function saveAll() {
    const userEmail = "silvandengroenendal@hotmail.com";

    for (let matchId in predictions) {
      const body = {
        user_email: userEmail,
        match_id: Number(matchId),
        home_score: Number(predictions[matchId].home_score),
        away_score: Number(predictions[matchId].away_score),
      };

      await supabase.from("predictions").upsert(body);
    }

    alert("Voorspellingen opgeslagen!");
  }

  return (
    <div>
      <Header />
      <div style={{ padding: "20px" }}>
        <h2>Pronostiek invullen</h2>

        {matches.map(m => (
          <div
            key={m.id}
            style={{
              marginBottom: "20px",
              padding: "15px",
              background: "#ffffff",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          >
            <h3>
              {m.home_team} vs {m.away_team}
            </h3>

            <input
              type="number"
              placeholder="Thuis"
              style={{ marginRight: "10px", width: "60px" }}
              onChange={e => updatePrediction(m.id, "home_score", e.target.value)}
            />

            <input
              type="number"
              placeholder="Uit"
              style={{ width: "60px" }}
              onChange={e => updatePrediction(m.id, "away_score", e.target.value)}
            />
          </div>
        ))}

        <button
          onClick={saveAll}
          style={{
            padding: "12px 20px",
            background: "#3CAC3B",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          Opslaan
        </button>
      </div>
    </div>
  );
}
