import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Bezig met laden…</div>;
  if (!user) return <Navigate to="/login" replace />;

  // Check metadata role
  if (user.user_metadata?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
