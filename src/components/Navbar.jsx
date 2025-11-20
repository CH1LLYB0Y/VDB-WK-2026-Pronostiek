import React from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Navbar({ user }) {
  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <nav className="w-full bg-gray-800 text-white p-3 flex justify-between items-center">
      <Link to="/" className="font-bold text-lg">
        WK 2026
      </Link>

      <div className="flex gap-4 items-center">

        {!user && (
          <Link to="/login" className="hover:underline">
            Login
          </Link>
        )}

        {user && (
          <>
            {user.app_metadata?.role === "admin" && (
              <Link to="/admin" className="hover:underline">
                Admin
              </Link>
            )}

            <button
              onClick={logout}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
