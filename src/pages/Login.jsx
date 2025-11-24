import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState(null);

  const nav = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pw
    });

    if (error) return setError(error.message);

    nav("/");
  }

  return (
    <div className="center-box">
      <h2>Inloggen</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e)=> setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Wachtwoord"
          value={pw}
          onChange={(e)=> setPw(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
}
