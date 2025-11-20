import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  async function handleReset(e) {
    e.preventDefault();
    setStatus("loading");

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setStatus("error");
      return;
    }

    setStatus("success");
    setTimeout(() => navigate("/login"), 1500);
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <form
        onSubmit={handleReset}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4">Nieuw wachtwoord</h1>

        <label className="block text-sm font-medium mb-1">
          Nieuwe wachtwoord
        </label>
        <input
          type="password"
          className="input border p-2 w-full rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded"
        >
          Wachtwoord opslaan
        </button>

        {status === "loading" && (
          <p className="text-gray-600 mt-3 text-sm">Bezig…</p>
        )}
        {status === "error" && (
          <p className="text-red-600 mt-3 text-sm">
            Er ging iets mis. Probeer opnieuw.
          </p>
        )}
        {status === "success" && (
          <p className="text-green-600 mt-3 text-sm">
            Wachtwoord aangepast! Je wordt doorgestuurd…
          </p>
        )}
      </form>
    </div>
  );
}
