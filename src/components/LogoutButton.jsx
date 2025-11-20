import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  async function logout() {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  }

  return (
    <button
      onClick={logout}
      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Uitloggen
    </button>
  );
}
