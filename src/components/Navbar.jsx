import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        const role = data.user.app_metadata?.role;
        setIsAdmin(role === "admin");
      }
    }
    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <nav className="w-full bg-gray-900 text-white px-4 py-3 flex justify-between items-center">
      <Link to="/" className="text-lg font-bold">
        WK 2026 Pronostiek
      </Link>

      <div className="flex items-center gap-4">
        {isAdmin && (
          <Link
            to="/admin"
            className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
          >
            Admin
          </Link>
        )}

        {!user && (
          <Link
            to="/login"
            className="px-3 py-1 bg-green-600 rounded hover:bg-green-700"
          >
            Login
          </Link>
        )}

        {user && (
          <button
            onClick={logout}
            className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
          >
            Uitloggen
          </button>
        )}
      </div>
    </nav>
  );
}
