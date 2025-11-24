import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 20px",
        backgroundColor: "#474A4A",
        color: "white",
      }}
    >
      <Link
        to="/"
        style={{ textDecoration: "none", color: "white", fontSize: "22px", fontWeight: "bold" }}
      >
        VDB WK 2026
      </Link>

      <nav style={{ display: "flex", gap: "20px" }}>
        <Link to="/pronostiek" style={{ color: "white", textDecoration: "none", fontSize: "18px" }}>
          Pronostiek
        </Link>

        <Link to="/klassement" style={{ color: "white", textDecoration: "none", fontSize: "18px" }}>
          Klassement
        </Link>
      </nav>
    </header>
  );
}
