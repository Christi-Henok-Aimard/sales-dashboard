import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import { useAuth } from "./context/AuthContext";

function Dashboard() {
  const { user, loading, logout } = useAuth();
  if (loading) return <p className="p-8">Chargement...</p>;
  if (!user) return <Navigate to="/login" replace />;
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Bienvenue {user.name}</h1>
      <p className="text-slate-500">Le dashboard arrive à l'étape 4.</p>
      <button onClick={logout} className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-white">
        Se déconnecter
      </button>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}