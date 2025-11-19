import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function Admin() {
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      setLoggedIn(true);
    } else alert('Verkeerd wachtwoord');
  };

  if (!loggedIn) {
    return (
      <form onSubmit={handleLogin} className="p-4">
        <input
          type="password"
          placeholder="Admin wachtwoord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2"
        />
        <button type="submit" className="bg-blue-600 text-white p-2 mt-2">Login</button>
      </form>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p>Hier kun je pronostiek parameters aanpassen, deadlines instellen of ranglijst resetten.</p>
    </div>
  );
}
