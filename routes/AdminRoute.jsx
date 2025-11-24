import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AdminRoute({ children }) {
  const [allowed, setAllowed] = useState(undefined);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const {
      data: { session }
    } = await supabase.auth.getSession();

    if (!session) return setAllowed(false);

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", session.user.id)
      .single();

    setAllowed(profile?.is_admin === true);
  }

  if (allowed === undefined) {
    return <p style={{ textAlign: "center", marginTop: "60px" }}>Laden…</p>;
  }

  if (!allowed) {
    return <Navigate to="/" replace />;
  }

  return children;
}

