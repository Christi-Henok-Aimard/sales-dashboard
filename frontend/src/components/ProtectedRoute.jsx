import { Loader2 } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-indigo-600" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
}