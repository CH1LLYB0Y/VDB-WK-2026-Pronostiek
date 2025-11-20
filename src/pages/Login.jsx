import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  async function onLogin(e) {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pw
    });

    if (error) {
      setError(error.message);
      return;
    }

    window.location.href = "/";
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Inloggen</h1>

      <form onSubmit={onLogin} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="E-mailadres"
          className="p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Wachtwoord"
          className="p-2 border rounded"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <button className="bg-blue-600 text-white p-2 rounded mt-2">
          Login
        </button>
      </form>
    </div>
  );
}
