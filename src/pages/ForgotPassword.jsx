// src/pages/ForgotPassword.jsx
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  async function onSend(e) {
    e.preventDefault();
    setMsg("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password"
    });
    if (error) setMsg(error.message);
    else setMsg("Reset-mail verstuurd. Check je inbox.");
  }
  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Wachtwoord vergeten</h1>
      <form onSubmit={onSend} className="flex flex-col gap-3">
        <input className="border p-2" placeholder="E-mail" value={email} onChange={e=>setEmail(e.target.value)} />
        <button className="bg-blue-600 text-white p-2 rounded">Stuur reset-mail</button>
      </form>
      {msg && <div className="mt-3 text-sm">{msg}</div>}
    </div>
  );
}
