import AlertsPanel from "@/components/admin/dashboard/AlertsPanel";
import NPSSummary from "@/components/admin/dashboard/NPSSummary";
import OrdersTimeline from "@/components/admin/dashboard/OrdersTimeline";
import RecentOrders from "@/components/admin/dashboard/RecentOrders";
import RevenueChart from "@/components/admin/dashboard/RevenueChart";
import StatsGrid from "@/components/admin/dashboard/StatsGrid";
import TopProducts from "@/components/admin/dashboard/TopProducts";
import {
  getDashboardAlerts,
  getDashboardStats,
  getNPSSummary,
  getRecentOrders,
  getRevenueByPeriod,
  getTopProducts,
} from "@/lib/actions/dashboard";
import Link from "next/link";

export default async function AdminDashboard() {
  const [stats, revenue, topProducts, recentOrders, alerts, nps] =
    await Promise.all([
      getDashboardStats(),
      getRevenueByPeriod(30),
      getTopProducts(5),
      getRecentOrders(5),
      getDashboardAlerts(),
      getNPSSummary(),
    ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-dolce-marrom font-bold mb-1">
          Dashboard
        </h1>
        <p className="font-body text-dolce-marrom/60">
          Visão geral do seu negócio — Dolce Neves
        </p>
      </div>

      {/* Alerts */}
      <AlertsPanel alerts={alerts} />

      {/* Stats grid */}
      <StatsGrid stats={stats} />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueChart data={revenue} />
        <OrdersTimeline data={revenue} />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <TopProducts products={topProducts} />
        </div>
        <div className="lg:col-span-1">
          <NPSSummary nps={nps} />
        </div>
        <div className="lg:col-span-1">
          <RecentOrders orders={recentOrders} />
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Encomendas", href: "/admin/encomendas/agenda", icon: "📅" },
          { label: "Ingredientes", href: "/admin/ingredientes", icon: "📋" },
          { label: "Fichas Técnicas", href: "/admin/fichas", icon: "📝" },
          { label: "QR Codes", href: "/admin/qrcodes", icon: "📱" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-white rounded-2xl p-4 border border-dolce-marrom/5 hover:shadow-md transition-shadow text-center group"
          >
            <span className="text-2xl block mb-1">{item.icon}</span>
            <span className="font-body text-sm font-semibold text-dolce-marrom group-hover:text-dolce-rosa transition-colors">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
