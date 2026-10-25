"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  FileText, 
  Package, 
  CreditCard, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  MapPin, 
  Layers, 
  LogOut,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { formatINR, formatIndianDate, formatIndianDateTime } from "@/lib/utils";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [stats, setStats] = useState({
    newQuotesCount: 0,
    ordersInProductionCount: 0,
    pendingPaymentsCount: 0,
    totalRevenueMonth: 0,
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [needsAuth, setNeedsAuth] = useState(false);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const meRes = await fetch("/api/auth/me");
      if (!meRes.ok) {
        setNeedsAuth(true);
        setLoading(false);
        return;
      }
      const meData = await meRes.json();
      if (!meData.user || meData.user.role !== "ADMIN") {
        setNeedsAuth(true);
        setLoading(false);
        return;
      }
      setCurrentUser(meData.user);
      setNeedsAuth(false);

      const [ordRes, quoRes, payRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/quotes"),
        fetch("/api/payments"),
      ]);

      let ordData: any[] = [];
      let quoData: any[] = [];
      let payData: any[] = [];

      if (ordRes.ok) ordData = (await ordRes.json()).orders || [];
      if (quoRes.ok) quoData = (await quoRes.json()).quotes || [];
      if (payRes.ok) payData = (await payRes.json()).payments || [];

      setOrders(ordData);
      setQuotes(quoData);
      setPayments(payData);

      // Calculate KPIs
      const newQuotes = quoData.filter((q) => q.status === "SUBMITTED" || q.status === "UNDER_REVIEW").length;
      const inProd = ordData.filter((o) => o.status === "IN_PRODUCTION" || o.status === "CONFIRMED" || o.status === "QUALITY_CHECK").length;
      const pendingPay = payData.filter((p) => p.status === "PENDING_VERIFICATION").length;
      const revenue = ordData.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      setStats({
        newQuotesCount: newQuotes,
        ordersInProductionCount: inProd,
        pendingPaymentsCount: pendingPay,
        totalRevenueMonth: revenue,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setNeedsAuth(true);
    setCurrentUser(null);
    router.refresh();
  };

  const handleDirectAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Authentication failed");
      if (data.user.role !== "ADMIN") throw new Error("Account does not have ADMIN privileges.");
      await loadAdminData();
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  // State distribution across India
  const stateCounts: Record<string, number> = {};
  orders.forEach((o) => {
    const st = o.customer?.state || "Tamil Nadu";
    stateCounts[st] = (stateCounts[st] || 0) + 1;
  });

  // Status breakdown
  const statusCounts: Record<string, number> = {};
  orders.forEach((o) => {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  });

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center font-mono text-sm text-steel-500">
        <RefreshCw className="w-5 h-5 animate-spin mr-2 text-orange-500" />
        Authenticating Admin Operations Desk...
      </div>
    );
  }

  if (needsAuth) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-navy-900 border border-steel-200 dark:border-steel-800 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-display font-black text-2xl mx-auto shadow-md">
              VS
            </div>
            <h2 className="text-xl font-display font-black text-navy-900 dark:text-white">
              Admin Operations Gate
            </h2>
            <p className="text-xs text-steel-500 font-mono">
              Authentication required to access production control, quotes & payments.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 font-mono">
              {authError}
            </div>
          )}

          <form onSubmit={handleDirectAdminLogin} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-steel-700 dark:text-steel-300 font-bold mb-1">
                Admin Email:
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@company.com"
                className="w-full px-3 py-2 rounded-lg bg-steel-50 dark:bg-navy-950 border border-steel-300 dark:border-steel-700 text-steel-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-steel-700 dark:text-steel-300 font-bold mb-1">
                Password:
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3 py-2 rounded-lg bg-steel-50 dark:bg-navy-950 border border-steel-300 dark:border-steel-700 text-steel-900 dark:text-white"
              />
            </div>

            <Button
              variant="orange"
              size="md"
              type="submit"
              isLoading={isAuthenticating}
              className="w-full justify-center text-sm py-2.5 font-bold"
            >
              Unlock Admin Desk
            </Button>
          </form>

          <div className="pt-2 border-t border-steel-100 dark:border-steel-800 text-center">
            <Link href="/" className="text-xs font-mono text-steel-400 hover:text-orange-500">
              ← Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-steel-50 dark:bg-navy-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="bg-white dark:bg-navy-900 rounded-xl border border-steel-200 dark:border-steel-800 p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500 text-white flex items-center justify-center font-display font-black text-2xl shadow-md">
              VS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-display font-black text-navy-900 dark:text-steel-100">
                  Engineering Operations & Admin Control
                </h1>
                <Badge variant="orange" size="sm">ADMIN ACCESS</Badge>
              </div>
              <p className="text-xs text-steel-500 font-mono mt-0.5">
                Logged in as: {currentUser?.name} ({currentUser?.email}) • Chennai / Coimbatore Works
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/" target="_blank">
              <Button variant="outline" size="sm" className="text-xs">
                Public Website <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-steel-500 hover:text-red-500">
              <LogOut className="w-4 h-4 mr-1" /> Sign Out
            </Button>
          </div>
        </div>

        {/* 4 Primary KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Link href="/admin/quotes">
            <Card className="p-5 hover:border-orange-500/60 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-steel-500">
                  New Quote Requests
                </span>
                <FileText className="w-4 h-4 text-orange-500" />
              </div>
              <div className="text-3xl font-display font-black text-navy-900 dark:text-white mt-2">
                {stats.newQuotesCount}
              </div>
              <p className="text-[11px] text-orange-500 font-mono mt-1 flex items-center gap-1 font-semibold">
                Review & Price Quotes →
              </p>
            </Card>
          </Link>

          <Link href="/admin/orders">
            <Card className="p-5 hover:border-orange-500/60 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-steel-500">
                  Orders in Production
                </span>
                <Package className="w-4 h-4 text-sky-500" />
              </div>
              <div className="text-3xl font-display font-black text-navy-900 dark:text-white mt-2">
                {stats.ordersInProductionCount}
              </div>
              <p className="text-[11px] text-sky-500 font-mono mt-1 flex items-center gap-1 font-semibold">
                Shop Floor & Tracking →
              </p>
            </Card>
          </Link>

          <Link href="/admin/payments">
            <Card className="p-5 hover:border-orange-500/60 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-steel-500">
                  Payments Awaiting UTR
                </span>
                <CreditCard className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl font-display font-black text-navy-900 dark:text-white mt-2">
                {stats.pendingPaymentsCount}
              </div>
              <p className="text-[11px] text-amber-500 font-mono mt-1 flex items-center gap-1 font-semibold">
                Verify UTRs & Credit →
              </p>
            </Card>
          </Link>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-steel-500">
                Order Value Pipeline
              </span>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-3xl font-display font-black text-navy-900 dark:text-white mt-2">
              {formatINR(stats.totalRevenueMonth)}
            </div>
            <p className="text-[11px] text-emerald-500 font-mono mt-1">Across all active contracts</p>
          </Card>
        </div>

        {/* Quick Navigation Panels */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
          <Link
            href="/admin/quotes"
            className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-steel-200 dark:border-steel-800 shadow-sm hover:border-orange-500/60 transition-all flex items-center justify-between group"
          >
            <div>
              <span className="text-sm font-display font-bold text-navy-900 dark:text-white block">
                Quote Management
              </span>
              <span className="text-xs text-steel-400 font-mono">Costing, line items & GST</span>
            </div>
            <ArrowRight className="w-4 h-4 text-orange-500 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/admin/orders"
            className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-steel-200 dark:border-steel-800 shadow-sm hover:border-orange-500/60 transition-all flex items-center justify-between group"
          >
            <div>
              <span className="text-sm font-display font-bold text-navy-900 dark:text-white block">
                Order Tracking
              </span>
              <span className="text-xs text-steel-400 font-mono">Stages, photos & LR/E-way</span>
            </div>
            <ArrowRight className="w-4 h-4 text-orange-500 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/admin/payments"
            className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-steel-200 dark:border-steel-800 shadow-sm hover:border-orange-500/60 transition-all flex items-center justify-between group"
          >
            <div>
              <span className="text-sm font-display font-bold text-navy-900 dark:text-white block">
                Payment Verification
              </span>
              <span className="text-xs text-steel-400 font-mono">Bank NEFT/UPI queue</span>
            </div>
            <ArrowRight className="w-4 h-4 text-orange-500 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/admin/materials"
            className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-orange-500/40 shadow-sm hover:border-orange-500 transition-all flex items-center justify-between group bg-gradient-to-br from-white to-orange-50/20 dark:from-navy-900 dark:to-orange-950/20"
          >
            <div>
              <span className="text-sm font-display font-bold text-orange-600 dark:text-orange-400 block flex items-center gap-1">
                Materials & Price Master
              </span>
              <span className="text-xs text-steel-400 font-mono">Raw rates & feed costs</span>
            </div>
            <ArrowRight className="w-4 h-4 text-orange-500 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/admin/stock"
            className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-steel-200 dark:border-steel-800 shadow-sm hover:border-orange-500/60 transition-all flex items-center justify-between group"
          >
            <div>
              <span className="text-sm font-display font-bold text-navy-900 dark:text-white block">
                Stock Catalog
              </span>
              <span className="text-xs text-steel-400 font-mono">Manage ready inventory</span>
            </div>
            <ArrowRight className="w-4 h-4 text-orange-500 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Charts & Analytical Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Order Lifecycle Breakdown Bar */}
          <div className="lg:col-span-7 bg-white dark:bg-navy-900 rounded-xl border border-steel-200 dark:border-steel-800 p-6 space-y-4 shadow-sm">
            <h3 className="text-base font-display font-bold text-navy-900 dark:text-white">
              Orders by Production Stage
            </h3>

            <div className="space-y-3 font-mono text-xs">
              {[
                { key: "CONFIRMED", label: "Confirmed / Scheduled" },
                { key: "IN_PRODUCTION", label: "In Active Production" },
                { key: "QUALITY_CHECK", label: "Quality Inspection (CMM/UT)" },
                { key: "PACKED", label: "Packed in Wooden Crates" },
                { key: "DISPATCHED", label: "Dispatched (In Transit)" },
                { key: "DELIVERED", label: "Delivered & Reconciled" },
              ].map((st) => {
                const count = statusCounts[st.key] || 0;
                const percentage = orders.length > 0 ? (count / orders.length) * 100 : 0;
                return (
                  <div key={st.key} className="space-y-1">
                    <div className="flex justify-between text-steel-600 dark:text-steel-300">
                      <span>{st.label}</span>
                      <span className="font-bold">{count} order(s)</span>
                    </div>
                    <div className="w-full bg-steel-100 dark:bg-navy-950 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(percentage, 5)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Geographical Orders Distribution (India) */}
          <div className="lg:col-span-5 bg-white dark:bg-navy-900 rounded-xl border border-steel-200 dark:border-steel-800 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-display font-bold text-navy-900 dark:text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-orange-500" /> Orders by Indian State
              </h3>
              <Badge variant="outline" size="sm">PAN-INDIA</Badge>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {Object.entries(stateCounts).map(([st, cnt]) => (
                <div key={st} className="flex items-center justify-between p-2.5 bg-steel-50 dark:bg-navy-950 rounded border border-steel-100 dark:border-steel-800">
                  <span className="font-semibold text-navy-900 dark:text-white">{st}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-steel-400 text-[11px]">
                      {st === "Tamil Nadu" ? "Intra (CGST+SGST)" : "Inter (IGST)"}
                    </span>
                    <Badge variant="orange" size="sm">{cnt} Orders</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Quotes & Order Activity Table */}
        <div className="bg-white dark:bg-navy-900 rounded-xl border border-steel-200 dark:border-steel-800 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-display font-bold text-navy-900 dark:text-white">
              Recent Engineering Quotes
            </h3>
            <Link href="/admin/quotes" className="text-xs font-mono text-orange-500 hover:underline">
              View All Quotes →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-steel-50 dark:bg-navy-950 text-steel-500 uppercase border-b border-steel-200 dark:border-steel-800">
                  <th className="py-2.5 px-3">Quote Number</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Service</th>
                  <th className="py-2.5 px-3">Material</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-steel-100 dark:divide-steel-800">
                {quotes.slice(0, 5).map((q) => (
                  <tr key={q.id}>
                    <td className="py-2.5 px-3 font-bold text-navy-900 dark:text-white">{q.quoteNumber}</td>
                    <td className="py-2.5 px-3">{q.customer?.companyName || q.guestCompany || q.guestName}</td>
                    <td className="py-2.5 px-3 text-orange-500">{q.serviceType}</td>
                    <td className="py-2.5 px-3">{q.material}</td>
                    <td className="py-2.5 px-3">
                      <Badge variant={q.status === "QUOTED" ? "orange" : q.status === "ACCEPTED" ? "success" : "default"}>
                        {q.status}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3 font-bold">{q.totalAmount > 0 ? formatINR(q.totalAmount) : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
