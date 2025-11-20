import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Admin from "./pages/Admin";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check current auth state
  useEffect(() => {
    async function loadUser() {
      const { data: session } = await supabase.auth.getSession();
      setUser(session?.session?.user || null);
      setLoading(false);
    }
    loadUser();

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
  }, []);

  if (loading) return <div className="p-4">Laden…</div>;

  return (
    <BrowserRouter>
      <Navbar user={user} />

      <Routes>
        <Route
          path="/"
          element={
            user ? <Home user={user} /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/admin"
          element={
            user?.app_metadata?.role === "admin"
              ? <Admin />
              : <Navigate to="/" replace />
          }
        />

        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" replace />}
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
