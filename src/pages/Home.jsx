import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-container">

      {/* HEADER */}
      <header className="home-header">
        <img 
          src="/logo.png" 
          alt="WK 2026" 
          className="home-logo"
        />
        <h1 className="home-title">VDB WK 2026 Pronostiek</h1>
      </header>

      {/* BANNER GRID */}
      <div className="banner-grid">

        <Link to="/pronostiek" className="banner-tile banner-green">
          <h2>Pronostiek invullen</h2>
        </Link>

        <Link to="/klassement" className="banner-tile banner-blue">
          <h2>Bekijk Klassement</h2>
        </Link>

      </div>

    </div>
  );
}
