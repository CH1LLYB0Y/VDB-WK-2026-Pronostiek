import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

export default function Home() {
  const colors = {
    green: "#3CAC3B",
    blue: "#2A398D",
    red: "#E61D25",
    grey: "#D1D4D1",
    dark: "#474A4A",
  };

  return (
    <div>
      <Header />

      <div style={{ padding: "20px" }}>
        {/* Logo blok */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "35px" }}>
          <img
            src="https://upload.wikimedia.org/wikipedia/en/0/02/2026_FIFA_World_Cup_logo.svg"
            alt="WK 2026 Logo"
            style={{ width: "85px", marginRight: "15px" }}
          />
          <div>
            <h1 style={{ margin: 0, fontSize: "26px", fontWeight: "bold", color: colors.dark }}>
              VDB WK 2026 Pronostiek
            </h1>
            <small style={{ color: colors.dark }}>Powered by React • Supabase • Vercel</small>
          </div>
        </div>

        {/* Responsive grid */}
        <div
          style={{
            display: "grid",
            gap: "20px",
            gridTemplateColumns: "1fr",
          }}
        >
          {/* Desktop > 900px: 2/3 kolommen */}
          <style>
            {`
            @media (min-width: 900px) {
              div[role="grid"] {
                grid-template-columns: repeat(3, 1fr);
              }
            }
          `}
          </style>

          <div role="grid">

            <Link
              to="/pronostiek"
              className="banner"
              style={{
                backgroundColor: colors.green,
                padding: "30px",
                borderRadius: "14px",
                textDecoration: "none",
                color: "white",
                fontSize: "22px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              📝 Pronostiek invullen
            </Link>

            <Link
              to="/klassement"
              className="banner"
              style={{
                backgroundColor: colors.blue,
                padding: "30px",
                borderRadius: "14px",
                textDecoration: "none",
                color: "white",
                fontSize: "22px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              🏆 Klassement bekijken
            </Link>

            <Link
              to="/mijn-voorspellingen"
              className="banner"
              style={{
                backgroundColor: colors.red,
                padding: "30px",
                borderRadius: "14px",
                textDecoration: "none",
                color: "white",
                fontSize: "22px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              🔍 Mijn voorspellingen
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
