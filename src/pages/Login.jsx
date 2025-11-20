import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });
  }, []);

  async function handleLogin(e) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/");
  }

  return (
    <div className="p-6 max-w-sm mx-auto">
      {user ? (
        <div>
          <p>Je bent al ingelogd als {user.email}</p>
          <button
            className="mt-4 px-3 py-1 bg-red-600 text-white rounded"
            onClick={() => {
              supabase.auth.signOut();
              window.location.reload();
            }}
          >
            Uitloggen
          </button>
        </div>
      ) : (
        <form onSubmit={handleLogin} className="flex flex-col gap-2">
          <h2 className="text-xl font-bold mb-3">Inloggen</h2>
          <input
            className="border p-2"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="border p-2"
            type="password"
            placeholder="Wachtwoord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="bg-blue-600 text-white p-2 rounded">
            Inloggen
          </button>
        </form>
      )}
    </div>
  );
}
