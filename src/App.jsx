import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    // Load user on refresh
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setAuthLoaded(true);
    });

    // Listen for login/logout
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (!authLoaded) return <div className="p-4">Laden…</div>;

  function ProtectedRoute({ children }) {
    return user ? children : <Navigate to="/login" />;
  }

  function AdminRoute({ children }) {
    const role = user?.app_metadata?.role;
    return role === "admin" ? children : <Navigate to="/" />;
  }

  return (
    <BrowserRouter>
      <Navbar user={user} />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home user={user} />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login user={user} />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <Admin />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
