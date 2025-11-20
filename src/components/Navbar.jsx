// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Navbar({ user }) {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <nav className="p-3 bg-white dark:bg-gray-900 border-b dark:border-gray-800 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link to="/" className="font-bold text-lg">WK 2026</Link>
        {user && <div className="text-sm text-gray-600 dark:text-gray-300">{user.email}</div>}
      </div>

      <div className="flex items-center gap-3">
        <button onClick={()=> setTheme(theme === "dark" ? "light" : "dark")} className="px-2 py-1 border rounded">
          {theme === "dark" ? "Light" : "Dark"}
        </button>

        {!user && <Link to="/login" className="px-3 py-1 bg-green-600 text-white rounded">Login</Link>}
        {!user && <Link to="/register" className="px-3 py-1 border rounded">Register</Link>}

        {user && user.app_metadata?.role === "admin" && (
          <Link to="/admin" className="px-3 py-1 bg-blue-600 text-white rounded">Admin</Link>
        )}

        {user && <button onClick={logout} className="px-3 py-1 bg-red-600 text-white rounded">Logout</button>}
      </div>
    </nav>
  );
}
