import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { BarChart3, Eye, EyeOff, Loader2, Lock, Mail, TrendingUp } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "Impossible de joindre le serveur, réessayez"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Panneau visuel (caché sur mobile) */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 p-12 text-white">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <BarChart3 className="size-7" /> SalesBoard
        </div>
        <div>
          <TrendingUp className="size-12 mb-6 opacity-90" />
          <h2 className="text-4xl font-bold leading-tight">
            Pilotez vos ventes en temps réel.
          </h2>
          <p className="mt-4 text-indigo-100 max-w-md">
            Suivez votre chiffre d'affaires, vos commandes et vos meilleurs produits
            depuis un tableau de bord clair et sécurisé.
          </p>
        </div>
        <p className="text-sm text-indigo-200">© 2026 SalesBoard</p>
      </div>

      {/* Formulaire */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 text-xl font-semibold text-indigo-700 mb-8">
            <BarChart3 className="size-7" /> SalesBoard
          </div>

          <h1 className="text-3xl font-bold">Bienvenue 👋</h1>
          <p className="mt-2 text-slate-500">Connectez-vous pour accéder à votre dashboard.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            {error && (
              <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@demo.com"
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1.5">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                <input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-11 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  aria-label={showPwd ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPwd ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {submitting && <Loader2 className="size-5 animate-spin" />}
              {submitting ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="mt-6 rounded-lg bg-slate-100 px-4 py-3 text-xs text-slate-600">
            Compte de démo : <b>admin@demo.com</b> / <b>Admin123!</b>
          </p>
        </div>
      </div>
    </div>
  );
}