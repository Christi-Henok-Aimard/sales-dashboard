const monthly = [
  { month: "Jan", revenue: 4200000, orders: 312 },
  { month: "Fév", revenue: 3800000, orders: 287 },
  { month: "Mar", revenue: 5100000, orders: 365 },
  { month: "Avr", revenue: 4700000, orders: 340 },
  { month: "Mai", revenue: 5900000, orders: 410 },
  { month: "Juin", revenue: 6300000, orders: 452 },
  { month: "Juil", revenue: 5800000, orders: 421 },
  { month: "Août", revenue: 6700000, orders: 489 },
  { month: "Sep", revenue: 7200000, orders: 530 },
  { month: "Oct", revenue: 7900000, orders: 574 },
];

const categories = [
  { name: "Électronique", value: 38 },
  { name: "Mode", value: 24 },
  { name: "Alimentation", value: 20 },
  { name: "Maison", value: 18 },
];

const recentOrders = [
  { id: "CMD-1058", customer: "Koffi Yao", product: "Smartphone X12", amount: 185000, status: "Payée", date: "2026-10-20" },
  { id: "CMD-1057", customer: "Awa Traoré", product: "Robe wax premium", amount: 42000, status: "Payée", date: "2026-10-20" },
  { id: "CMD-1056", customer: "Jean Kouassi", product: "Casque audio", amount: 67500, status: "En attente", date: "2026-10-19" },
  { id: "CMD-1055", customer: "Fatou Diallo", product: "Panier alimentaire", amount: 28000, status: "Payée", date: "2026-10-19" },
  { id: "CMD-1054", customer: "Marc N'Guessan", product: "Mixeur 1200W", amount: 54000, status: "Annulée", date: "2026-10-18" },
  { id: "CMD-1053", customer: "Aïcha Koné", product: "Ordinateur portable", amount: 420000, status: "Payée", date: "2026-10-18" },
];

export function getSalesData() {
  const totalRevenue = monthly.reduce((s, m) => s + m.revenue, 0);
  const totalOrders = monthly.reduce((s, m) => s + m.orders, 0);
  const last = monthly[monthly.length - 1];
  const prev = monthly[monthly.length - 2];

  return {
    kpis: {
      totalRevenue,
      totalOrders,
      averageBasket: Math.round(totalRevenue / totalOrders),
      growth: Number((((last.revenue - prev.revenue) / prev.revenue) * 100).toFixed(1)),
    },
    monthly,
    categories,
    recentOrders,
  };
}