import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ProtectedRoute({ children }) {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    // check current session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // listen to login/logout events
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return <p style={{ textAlign: "center", marginTop: "60px" }}>Laden…</p>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

