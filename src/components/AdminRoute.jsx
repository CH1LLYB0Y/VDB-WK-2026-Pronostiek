import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return <div className="p-4">Laden…</div>;

  if (!user || !isAdmin) return <Navigate to="/" replace />;

  return children;
}
