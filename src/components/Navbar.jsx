import { supabase } from "../lib/supabaseClient";
import { Link } from "react-router-dom";

export default function Navbar({ user }) {
  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <nav className="p-4 bg-gray-900 text-white flex justify-between items-center">
      <Link to="/" className="font-bold text-lg">WK 2026 Pronostiek</Link>

      <div className="flex gap-4 items-center">

        {user?.app_metadata?.role === "admin" && (
          <Link to="/admin" className="hover:underline">Admin</Link>
        )}

        {!user && (
          <Link to="/login" className="hover:underline">
            Login
          </Link>
        )}

        {user && (
          <>
            <span className="text-gray-300">{user.email}</span>
            <button
              onClick={logout}
              className="bg-red-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
