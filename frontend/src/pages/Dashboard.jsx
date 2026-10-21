import { useEffect, useState } from "react";
import {
  Area, AreaChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  BarChart3, Loader2, LogOut, Receipt, ShoppingCart,
  TrendingDown, TrendingUp, Wallet,
} from "lucide-react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

const COLORS = ["#4f46e5", "#7c3aed", "#0ea5e9", "#f59e0b"];
const fmt = (n) => new Intl.NumberFormat("fr-FR").format(n) + " FCFA";

const STATUS_STYLES = {
  "Payée": "bg-emerald-50 text-emerald-700",
  "En attente": "bg-amber-50 text-amber-700",
  "Annulée": "bg-red-50 text-red-700",
};

function KpiCard({ icon: Icon, label, value, hint, positive }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        <span className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
          <Icon className="size-5" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold">{value}</p>
      {hint && (
        <p className={`mt-1 flex items-center gap-1 text-sm ${positive ? "text-emerald-600" : "text-red-600"}`}>
          {positive ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
          {hint}
        </p>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/sales")
      .then((res) => setData(res.data))
      .catch((err) => {
        if (err.response?.status === 401) logout();
        else setError("Impossible de charger les données de ventes.");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-2 text-lg font-semibold text-indigo-700">
            <BarChart3 className="size-6" /> SalesBoard
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-tight">{user.name}</p>
              <p className="text-xs capitalize text-slate-500">{user.role}</p>
            </div>
            <div className="flex size-9 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">
              {user.name[0]}
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-8">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Tableau de bord des ventes</h1>
          <p className="text-slate-500">Vue d'ensemble de l'activité commerciale.</p>
        </div>

        {error && (
          <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!data && !error && (
          <div className="flex justify-center py-24">
            <Loader2 className="size-8 animate-spin text-indigo-600" />
          </div>
        )}

        {data && (
          <>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <KpiCard icon={Wallet} label="Chiffre d'affaires" value={fmt(data.kpis.totalRevenue)} />
              <KpiCard icon={ShoppingCart} label="Commandes" value={new Intl.NumberFormat("fr-FR").format(data.kpis.totalOrders)} />
              <KpiCard icon={Receipt} label="Panier moyen" value={fmt(data.kpis.averageBasket)} />
              <KpiCard
                icon={data.kpis.growth >= 0 ? TrendingUp : TrendingDown}
                label="Croissance mensuelle"
                value={`${data.kpis.growth > 0 ? "+" : ""}${data.kpis.growth} %`}
                hint="vs mois précédent"
                positive={data.kpis.growth >= 0}
              />
            </section>

            <section className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
                <h2 className="font-semibold">Évolution du chiffre d'affaires</h2>
                <div className="mt-4 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.monthly}>
                      <defs>
                        <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v / 1000000}M`} />
                      <Tooltip formatter={(v) => fmt(v)} />
                      <Area type="monotone" dataKey="revenue" name="CA" stroke="#4f46e5" strokeWidth={2} fill="url(#rev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="font-semibold">Ventes par catégorie</h2>
                <div className="mt-4 h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data.categories} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                        {data.categories.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => `${v} %`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <ul className="mt-2 space-y-1.5 text-sm">
                  {data.categories.map((c, i) => (
                    <li key={c.name} className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="size-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                        {c.name}
                      </span>
                      <span className="font-medium">{c.value} %</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <h2 className="p-5 pb-3 font-semibold">Dernières commandes</h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-5 py-3">N°</th>
                      <th className="px-5 py-3">Client</th>
                      <th className="px-5 py-3">Produit</th>
                      <th className="px-5 py-3">Montant</th>
                      <th className="px-5 py-3">Statut</th>
                      <th className="px-5 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.recentOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3 font-medium">{o.id}</td>
                        <td className="px-5 py-3">{o.customer}</td>
                        <td className="px-5 py-3">{o.product}</td>
                        <td className="px-5 py-3">{fmt(o.amount)}</td>
                        <td className="px-5 py-3">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[o.status]}`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-slate-500">
                          {new Date(o.date).toLocaleDateString("fr-FR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}