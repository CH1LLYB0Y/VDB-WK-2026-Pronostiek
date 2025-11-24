import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const colors = {
    green: "#3CAC3B",
    blue: "#2A398D",
    red: "#E61D25",
    grey: "#D1D4D1",
    dark: "#474A4A",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: colors.grey,
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header blok met logo */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "40px" }}>
        <img
          src="https://upload.wikimedia.org/wikipedia/en/0/02/2026_FIFA_World_Cup_logo.svg"
          alt="WK 2026 Logo"
          style={{ width: "90px", marginRight: "15px" }}
        />

        <div>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "bold", color: colors.dark }}>
            VDB WK 2026 Pronostiek
          </h1>
          <small style={{ color: colors.dark, fontSize: "14px" }}>
            Powered by Supabase • React • Vercel
          </small>
        </div>
      </div>

      {/* Banner container */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        
        {/* Pronostiek invullen */}
        <Link
          to="/pronostiek"
          style={{
            backgroundColor: colors.green,
            padding: "25px",
            borderRadius: "12px",
            textDecoration: "none",
            color: "white",
            fontSize: "22px",
            fontWeight: "bold",
            textAlign: "center",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          }}
        >
          📝 Pronostiek invullen
        </Link>

        {/* Klassement */}
        <Link
          to="/klassement"
          style={{
            backgroundColor: colors.blue,
            padding: "25px",
            borderRadius: "12px",
            textDecoration: "none",
            color: "white",
            fontSize: "22px",
            fontWeight: "bold",
            textAlign: "center",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          }}
        >
          🏆 Klassement bekijken
        </Link>

        {/* Voorspellingen sluiten/open info (optioneel future) */}
        <Link
          to="/mijn-voorspellingen"
          style={{
            backgroundColor: colors.red,
            padding: "25px",
            borderRadius: "12px",
            textDecoration: "none",
            color: "white",
            fontSize: "22px",
            fontWeight: "bold",
            textAlign: "center",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          }}
        >
          🔍 Mijn voorspellingen
        </Link>

      </div>
    </div>
  );
}
