// src/pages/Register.jsx
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function onRegister(e) {
    e.preventDefault();
    setError("");
    if (!email || !pw) return setError("Email en wachtwoord verplicht");

    // signup
    const { error } = await supabase.auth.signUp({
      email,
      password: pw
    });

    if (error) return setError(error.message);

    // Supabase sends confirmation email by default (if enabled)
    // Try sign in automatically (if magic)
    const { error: signinErr } = await supabase.auth.signInWithPassword({
      email,
      password: pw
    });
    if (signinErr) {
      // still OK — redirect to login with message
      navigate("/login");
    } else {
      navigate("/");
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Maak account</h1>
      <form onSubmit={onRegister} className="flex flex-col gap-3">
        <input className="border p-2" placeholder="E-mail" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="border p-2" placeholder="Wachtwoord" value={pw} onChange={e=>setPw(e.target.value)} />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="bg-green-600 text-white p-2 rounded">Registreer</button>
      </form>
    </div>
  );
}
