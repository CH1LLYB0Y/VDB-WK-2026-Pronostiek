import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login({ user }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  if (user) return <div className="p-4">Je bent al ingelogd.</div>;

  async function login(e) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pw,
    });

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/");
  }

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-xl mb-4">Inloggen</h1>

      <form onSubmit={login} className="flex flex-col gap-3">
        <input
          className="border p-2"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border p-2"
          placeholder="Wachtwoord"
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />

        <button className="bg-blue-600 text-white p-2 rounded">
          Inloggen
        </button>
      </form>
    </div>
  );
}
