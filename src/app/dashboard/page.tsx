"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Package, 
  FileText, 
  CreditCard, 
  User as UserIcon, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Download, 
  RefreshCw, 
  ArrowRight, 
  ExternalLink, 
  Camera, 
  AlertCircle,
  Building2,
  QrCode,
  Send,
  LogOut,
  ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { formatINR, formatIndianDate, formatIndianDateTime } from "@/lib/utils";

const STAGES = [
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "IN_PRODUCTION", label: "In Production" },
  { key: "QUALITY_CHECK", label: "QC Passed" },
  { key: "PACKED", label: "Packed" },
  { key: "DISPATCHED", label: "Dispatched" },
  { key: "DELIVERED", label: "Delivered" },
];

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"orders" | "quotes" | "payments" | "profile">("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Selected Order for Detail View
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Payment Submission Modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentTargetOrder, setPaymentTargetOrder] = useState<any | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    paymentType: "ADVANCE",
    paymentMethod: "BANK_TRANSFER",
    utrNumber: "",
    screenshotUrl: "",
  });
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const meRes = await fetch("/api/auth/me");
      if (!meRes.ok) {
        router.push("/login?redirect=/dashboard");
        return;
      }
      const meData = await meRes.json();
      if (!meData.user) {
        router.push("/login?redirect=/dashboard");
        return;
      }
      setCurrentUser(meData.user);

      // Load orders and quotes
      const [ordRes, quoRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/quotes"),
      ]);

      if (ordRes.ok) {
        const ordData = await ordRes.json();
        setOrders(ordData.orders || []);
        if (ordData.orders?.length > 0) {
          setSelectedOrder(ordData.orders[0]);
        }
      }

      if (quoRes.ok) {
        const quoData = await quoRes.json();
        setQuotes(quoData.quotes || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const handleAcceptQuote = async (quoteId: string) => {
    try {
      const res = await fetch(`/api/quotes/${quoteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ACCEPT" }),
      });
      if (res.ok) {
        await loadDashboardData();
        setActiveTab("orders");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openPaymentModal = (order: any, type: "ADVANCE" | "BALANCE" = "ADVANCE") => {
    setPaymentTargetOrder(order);
    const amt = type === "ADVANCE" ? (order.advanceRequired || order.totalAmount * 0.5) : (order.balanceDue || order.totalAmount);
    setPaymentForm({
      amount: amt.toString(),
      paymentType: type,
      paymentMethod: "BANK_TRANSFER",
      utrNumber: "",
      screenshotUrl: "",
    });
    setPaymentSuccessMsg(null);
    setIsPaymentModalOpen(true);
  };

  const submitPaymentDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentTargetOrder) return;
    setPaymentSubmitting(true);

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: paymentTargetOrder.id,
          amount: parseFloat(paymentForm.amount),
          paymentType: paymentForm.paymentType,
          paymentMethod: paymentForm.paymentMethod,
          utrNumber: paymentForm.utrNumber,
          screenshotUrl: paymentForm.screenshotUrl || "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80",
        }),
      });

      if (res.ok) {
        setPaymentSuccessMsg(`🎉 Payment Submitted & Product Ordered! Your order #${paymentTargetOrder.orderNumber} is officially confirmed and queued for manufacturing.`);
        await loadDashboardData();
        setTimeout(() => {
          setIsPaymentModalOpen(false);
          setActiveTab("orders");
        }, 2000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPaymentSubmitting(false);
    }
  };

  const getStageIndex = (status: string) => {
    const idx = STAGES.findIndex((s) => s.key === status);
    return idx === -1 ? 0 : idx;
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center font-mono text-sm text-steel-500">
        <RefreshCw className="w-5 h-5 animate-spin mr-2 text-orange-500" />
        Loading your engineering dashboard...
      </div>
    );
  }

  // Active orders count & payments due
  const activeOrdersCount = orders.filter((o) => o.status !== "DELIVERED" && o.status !== "CANCELLED").length;
  const pendingQuotesCount = quotes.filter((q) => q.status === "SUBMITTED" || q.status === "UNDER_REVIEW" || q.status === "QUOTED").length;
  const totalBalanceDue = orders.reduce((sum, o) => sum + (o.balanceDue || 0), 0);

  return (
    <div className="min-h-screen bg-steel-50 dark:bg-navy-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Bar with Enterprise info & Quick Logouts */}
        <div className="bg-white dark:bg-navy-900 rounded-xl border border-steel-200 dark:border-steel-800 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-navy-900 dark:bg-orange-500 text-white flex items-center justify-center font-display font-black text-2xl shadow-md">
              VS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-display font-black text-navy-900 dark:text-steel-100">
                  {currentUser?.customer?.companyName || currentUser?.name || "Customer Portal"}
                </h1>
                <Badge variant="outline" size="sm" className="font-mono text-[10px]">
                  ID: {currentUser?.customer?.id?.slice(0, 8)}
                </Badge>
              </div>
              <p className="text-xs text-steel-500 font-mono mt-0.5">
                GSTIN: {currentUser?.customer?.gstin || "Unregistered"} • State: {currentUser?.customer?.state || "Tamil Nadu"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/quote">
              <Button variant="orange" size="sm">
                <FileText className="w-4 h-4 mr-1.5" /> Request New Quote
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-steel-500 hover:text-red-500">
              <LogOut className="w-4 h-4 mr-1" /> Sign Out
            </Button>
          </div>
        </div>

        {/* 3 Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5 border-steel-200 dark:border-steel-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-steel-500">
                Active Production Orders
              </span>
              <Package className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-3xl font-display font-black text-navy-900 dark:text-white mt-2">
              {activeOrdersCount}
            </div>
            <p className="text-[11px] text-steel-400 font-mono mt-1">In fabrication / machining / QC</p>
          </Card>

          <Card className="p-5 border-steel-200 dark:border-steel-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-steel-500">
                Active Quotations
              </span>
              <FileText className="w-4 h-4 text-sky-500" />
            </div>
            <div className="text-3xl font-display font-black text-navy-900 dark:text-white mt-2">
              {pendingQuotesCount}
            </div>
            <p className="text-[11px] text-steel-400 font-mono mt-1">Awaiting price review / acceptance</p>
          </Card>

          <Card className="p-5 border-steel-200 dark:border-steel-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-steel-500">
                Balance Due (INR)
              </span>
              <CreditCard className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-3xl font-display font-black text-navy-900 dark:text-white mt-2">
              {formatINR(totalBalanceDue)}
            </div>
            <p className="text-[11px] text-steel-400 font-mono mt-1">Payable via NEFT / RTGS / UPI</p>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 sm:gap-2 border-b border-steel-200 dark:border-steel-800 text-xs sm:text-sm font-mono font-medium overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 px-3 transition-colors relative whitespace-nowrap shrink-0 ${
              activeTab === "orders"
                ? "text-orange-500 border-b-2 border-orange-500 font-bold"
                : "text-steel-600 dark:text-steel-400 hover:text-navy-900 dark:hover:text-white"
            }`}
          >
            My Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("quotes")}
            className={`pb-3 px-3 transition-colors relative whitespace-nowrap shrink-0 ${
              activeTab === "quotes"
                ? "text-orange-500 border-b-2 border-orange-500 font-bold"
                : "text-steel-600 dark:text-steel-400 hover:text-navy-900 dark:hover:text-white"
            }`}
          >
            My Quotes ({quotes.length})
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`pb-3 px-3 transition-colors relative whitespace-nowrap shrink-0 ${
              activeTab === "payments"
                ? "text-orange-500 border-b-2 border-orange-500 font-bold"
                : "text-steel-600 dark:text-steel-400 hover:text-navy-900 dark:hover:text-white"
            }`}
          >
            Payments & Bank Details
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 px-3 transition-colors relative whitespace-nowrap shrink-0 ${
              activeTab === "profile"
                ? "text-orange-500 border-b-2 border-orange-500 font-bold"
                : "text-steel-600 dark:text-steel-400 hover:text-navy-900 dark:hover:text-white"
            }`}
          >
            Company Profile & GST
          </button>
        </div>

        {/* TAB 1: ORDERS & TRACKING */}
        {activeTab === "orders" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Orders List */}
            <div className="lg:col-span-5 space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-steel-500 font-bold block">
                Select Order to Track:
              </span>
              {orders.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-navy-900 rounded-xl border border-steel-200 dark:border-steel-800 text-xs text-steel-400">
                  No active orders yet. Accept a quotation to begin manufacturing.
                </div>
              ) : (
                orders.map((o) => (
                  <div
                    key={o.id}
                    onClick={() => setSelectedOrder(o)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedOrder?.id === o.id
                        ? "bg-white dark:bg-navy-900 border-orange-500 shadow-md ring-1 ring-orange-500"
                        : "bg-white/60 dark:bg-navy-900/60 border-steel-200 dark:border-steel-800 hover:border-steel-300"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-navy-900 dark:text-white">{o.orderNumber}</span>
                      <Badge variant="orange" size="sm">{o.status}</Badge>
                    </div>
                    <div className="text-xs text-steel-600 dark:text-steel-300 mt-2 font-medium line-clamp-1">
                      {o.items?.[0]?.description || "Precision Fabrication Job"}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-steel-500 pt-2 border-t border-steel-100 dark:border-steel-800">
                      <span>Total: <strong>{formatINR(o.totalAmount)}</strong></span>
                      <span>Delivery: {formatIndianDate(o.estimatedDelivery)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Right Detailed Order Status View */}
            <div className="lg:col-span-7">
              {selectedOrder ? (
                <div className="bg-white dark:bg-navy-900 rounded-xl border border-steel-200 dark:border-steel-800 p-6 space-y-6 shadow-sm">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-steel-100 dark:border-steel-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-display font-black text-navy-900 dark:text-white">
                          Order #{selectedOrder.orderNumber}
                        </h2>
                        <Badge variant="orange">{selectedOrder.status}</Badge>
                      </div>
                      <p className="text-xs text-steel-500 font-mono mt-0.5">
                        Created on {formatIndianDate(selectedOrder.createdAt)} • Ref Quote: {selectedOrder.quote?.quoteNumber || "Direct"}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <Link href={`/quote?reorder=${selectedOrder.id}`}>
                        <Button variant="outline" size="sm" className="text-xs">
                          <RefreshCw className="w-3.5 h-3.5 mr-1" /> Reorder Specs
                        </Button>
                      </Link>

                      {selectedOrder.balanceDue > 0 && (
                        <Button
                          variant="orange"
                          size="sm"
                          onClick={() => openPaymentModal(selectedOrder, selectedOrder.paymentStatus === "UNPAID" ? "ADVANCE" : "BALANCE")}
                          className="text-xs"
                        >
                          <CreditCard className="w-3.5 h-3.5 mr-1" /> Pay Due ({formatINR(selectedOrder.balanceDue)})
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* 6-Stage Timeline Stepper */}
                  <div className="space-y-3">
                    <span className="text-xs font-mono uppercase tracking-wider text-steel-500 font-bold block">
                      Live Manufacturing Lifecycle:
                    </span>

                    <div className="relative pt-2">
                      <div className="grid grid-cols-6 gap-1 text-center font-mono text-[10px]">
                        {STAGES.map((st, idx) => {
                          const currentIdx = getStageIndex(selectedOrder.status);
                          const isPassed = idx <= currentIdx;
                          const isCurrent = idx === currentIdx;

                          return (
                            <div key={st.key} className="flex flex-col items-center space-y-1">
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                                  isCurrent
                                    ? "bg-orange-500 text-white ring-4 ring-orange-500/20 animate-pulse"
                                    : isPassed
                                    ? "bg-emerald-600 text-white"
                                    : "bg-steel-200 dark:bg-navy-800 text-steel-400"
                                }`}
                              >
                                {isPassed ? "✓" : idx + 1}
                              </div>
                              <span
                                className={`hidden sm:inline ${
                                  isCurrent
                                    ? "text-orange-500 font-bold"
                                    : isPassed
                                    ? "text-steel-700 dark:text-steel-200"
                                    : "text-steel-400"
                                }`}
                              >
                                {st.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Dispatch Logistics Detail Box */}
                  {selectedOrder.dispatchDetail && (
                    <div className="p-4 rounded-xl bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono font-bold text-orange-700 dark:text-orange-400">
                        <span className="flex items-center gap-1.5">
                          <Truck className="w-4 h-4" /> Transport & Consignment Logistics
                        </span>
                        <span>Dispatched: {formatIndianDate(selectedOrder.dispatchDetail.dispatchDate)}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono text-steel-700 dark:text-steel-300 pt-1">
                        <div>Transporter: <strong>{selectedOrder.dispatchDetail.transporterName}</strong></div>
                        <div>LR Number: <strong>{selectedOrder.dispatchDetail.lrNumber}</strong></div>
                        <div>Vehicle: <strong>{selectedOrder.dispatchDetail.vehicleNumber || "-"}</strong></div>
                        <div>E-Way Bill: <strong>{selectedOrder.dispatchDetail.eWayBillNumber || "-"}</strong></div>
                      </div>
                    </div>
                  )}

                  {/* Shop Floor Progress Photos Gallery */}
                  {selectedOrder.photos && selectedOrder.photos.length > 0 && (
                    <div className="space-y-3">
                      <span className="text-xs font-mono uppercase tracking-wider text-steel-500 font-bold flex items-center gap-1.5">
                        <Camera className="w-4 h-4 text-orange-500" /> Shop Floor Inspection Photos:
                      </span>
                      <div className="grid grid-cols-3 gap-3">
                        {selectedOrder.photos.map((p: any) => (
                          <div key={p.id} className="group rounded-lg overflow-hidden border border-steel-200 dark:border-steel-800 bg-steel-900 aspect-video relative">
                            <img src={p.photoUrl} alt={p.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent opacity-80" />
                            <span className="absolute bottom-1.5 left-1.5 right-1.5 text-[10px] text-white font-mono truncate">
                              {p.caption}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Order Status History Log */}
                  <div className="space-y-2 pt-2 border-t border-steel-100 dark:border-steel-800">
                    <span className="text-xs font-mono uppercase tracking-wider text-steel-500 font-bold block">
                      Production Event History:
                    </span>
                    <div className="space-y-2">
                      {selectedOrder.statusHistory?.map((h: any) => (
                        <div key={h.id} className="flex items-start gap-2.5 text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                          <div className="font-mono text-steel-600 dark:text-steel-300">
                            <strong>[{formatIndianDateTime(h.createdAt)}]</strong> {h.status}: {h.note}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Download Invoices & Documents */}
                  {selectedOrder.invoices && selectedOrder.invoices.length > 0 && (
                    <div className="pt-3 border-t border-steel-100 dark:border-steel-800 flex items-center justify-between">
                      <span className="text-xs font-mono text-steel-500">Official Tax Invoice:</span>
                      <Link
                        href={`/api/invoices/${selectedOrder.invoices[0].id}/pdf`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-orange-500 hover:underline"
                      >
                        <Download className="w-4 h-4" />
                        Download Tax Invoice ({selectedOrder.invoices[0].invoiceNumber})
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-12 text-center bg-white dark:bg-navy-900 rounded-xl border border-steel-200 dark:border-steel-800 text-steel-400 text-sm">
                  Select an order on the left to view the live timeline and dispatch details.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MY QUOTES */}
        {activeTab === "quotes" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-navy-900 rounded-xl border border-steel-200 dark:border-steel-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-steel-100/70 dark:bg-navy-950 text-steel-600 dark:text-steel-400 font-mono uppercase border-b border-steel-200 dark:border-steel-800">
                      <th className="py-3 px-4">Quote Number</th>
                      <th className="py-3 px-4">Service & Material</th>
                      <th className="py-3 px-4">Batch Qty</th>
                      <th className="py-3 px-4">Quoted Price (INR)</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-steel-100 dark:divide-steel-800 font-sans">
                    {quotes.map((q) => (
                      <tr key={q.id} className="hover:bg-steel-50/50 dark:hover:bg-navy-800/40">
                        <td className="py-3.5 px-4 font-mono font-bold text-navy-900 dark:text-white">
                          {q.quoteNumber}
                        </td>
                        <td className="py-3.5 px-4 font-mono">
                          <span className="text-orange-500 font-semibold">{q.serviceType}</span> • {q.material}
                        </td>
                        <td className="py-3.5 px-4 font-mono">{q.quantity} Nos</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-navy-900 dark:text-white">
                          {q.totalAmount > 0 ? formatINR(q.totalAmount) : <span className="text-steel-400">Under Review</span>}
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge variant={q.status === "QUOTED" ? "orange" : q.status === "ACCEPTED" ? "success" : "default"}>
                            {q.status}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-steel-500 font-mono">
                          {formatIndianDate(q.createdAt)}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {q.status === "QUOTED" && (
                            <Button
                              variant="orange"
                              size="sm"
                              onClick={() => handleAcceptQuote(q.id)}
                              className="text-xs py-1"
                            >
                              Accept & Order
                            </Button>
                          )}
                          {q.status === "ACCEPTED" && (
                            <span className="text-emerald-500 font-mono font-bold text-xs">
                              Order Active ✓
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PAYMENTS & BANK DETAILS */}
        {activeTab === "payments" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Bank Details & UPI Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-navy-950 text-white p-6 rounded-xl border border-navy-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-mono uppercase tracking-wider text-orange-400 font-bold flex items-center gap-2">
                    <QrCode className="w-4 h-4" /> Official UPI & Bank Remittance
                  </h3>
                  <Badge variant="outline" size="sm" className="text-emerald-400 border-emerald-500">
                    Live Verified QR
                  </Badge>
                </div>

                <div className="space-y-2 text-xs font-mono text-steel-300">
                  <div className="flex justify-between py-1 border-b border-navy-900">
                    <span className="text-steel-400">Account Holder:</span>
                    <span className="text-white font-bold text-sm">Godwin S</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-navy-900">
                    <span className="text-steel-400">Bank & Branch:</span>
                    <span className="text-white font-semibold">Indian Bank (0930)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-navy-900">
                    <span className="text-steel-400">UPI ID:</span>
                    <span className="text-orange-400 font-bold text-sm">godwin6945@okicici</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-navy-900">
                    <span className="text-steel-400">Accepted Apps:</span>
                    <span className="text-white">Google Pay, PhonePe, Paytm, BHIM</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-steel-400">GSTIN:</span>
                    <span className="text-emerald-400 font-bold">33AAAAA0000A1Z5</span>
                  </div>
                </div>

                {/* Real User-Provided UPI QR Code */}
                <div className="pt-2 text-center bg-navy-900/60 p-4 rounded-xl border border-navy-800">
                  <div className="relative w-48 h-auto mx-auto rounded-xl overflow-hidden shadow-2xl border-2 border-orange-500 bg-white p-2">
                    <img
                      src="/images/upi_qr.jpg"
                      alt="Google Pay UPI QR Code - Godwin S - godwin6945@okicici"
                      className="w-full h-auto object-contain rounded-lg"
                    />
                  </div>
                  <div className="mt-3 space-y-1">
                    <p className="text-xs font-mono font-bold text-white">
                      Scan with Google Pay, PhonePe, or Paytm
                    </p>
                    <p className="text-[11px] font-mono text-steel-400">
                      UPI ID: <span className="text-orange-400 font-bold">godwin6945@okicici</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Payment History & Pending Queue */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white dark:bg-navy-900 rounded-xl border border-steel-200 dark:border-steel-800 p-6 space-y-4 shadow-sm">
                <h3 className="text-base font-display font-bold text-navy-900 dark:text-white">
                  Payment Verification Records
                </h3>

                <div className="divide-y divide-steel-100 dark:divide-steel-800">
                  {orders.flatMap((o) => o.payments || []).length === 0 ? (
                    <p className="text-xs text-steel-400 py-4">No payment submissions recorded yet.</p>
                  ) : (
                    orders.flatMap((o) => o.payments || []).map((p: any) => (
                      <div key={p.id} className="py-3.5 flex items-center justify-between text-xs font-mono">
                        <div>
                          <div className="font-bold text-navy-900 dark:text-white">
                            {p.paymentNumber} • {formatINR(p.amount)} ({p.paymentType})
                          </div>
                          <div className="text-steel-500 text-[11px] mt-0.5">
                            UTR: {p.utrNumber} • {p.paymentMethod} • {formatIndianDate(p.paymentDate)}
                          </div>
                        </div>
                        <Badge
                          variant={
                            p.status === "PAID"
                              ? "success"
                              : p.status === "PENDING_VERIFICATION"
                              ? "warning"
                              : "danger"
                          }
                        >
                          {p.status}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PROFILE */}
        {activeTab === "profile" && (
          <div className="max-w-2xl bg-white dark:bg-navy-900 rounded-xl border border-steel-200 dark:border-steel-800 p-6 space-y-4 shadow-sm">
            <h3 className="text-base font-display font-bold text-navy-900 dark:text-white">
              Enterprise Billing & Shipping Address
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 bg-steel-50 dark:bg-navy-950 rounded border border-steel-200 dark:border-steel-800">
                <span className="text-steel-400 block text-[10px] uppercase">Company Name:</span>
                <span className="font-bold text-navy-900 dark:text-white">{currentUser?.customer?.companyName || "-"}</span>
              </div>
              <div className="p-3 bg-steel-50 dark:bg-navy-950 rounded border border-steel-200 dark:border-steel-800">
                <span className="text-steel-400 block text-[10px] uppercase">GSTIN:</span>
                <span className="font-bold text-navy-900 dark:text-white">{currentUser?.customer?.gstin || "Unregistered"}</span>
              </div>
              <div className="p-3 bg-steel-50 dark:bg-navy-950 rounded border border-steel-200 dark:border-steel-800">
                <span className="text-steel-400 block text-[10px] uppercase">Billing State:</span>
                <span className="font-bold text-navy-900 dark:text-white">{currentUser?.customer?.state || "Tamil Nadu"}</span>
              </div>
              <div className="p-3 bg-steel-50 dark:bg-navy-950 rounded border border-steel-200 dark:border-steel-800">
                <span className="text-steel-400 block text-[10px] uppercase">City & Pincode:</span>
                <span className="font-bold text-navy-900 dark:text-white">{currentUser?.customer?.city || "-"}, {currentUser?.customer?.pincode || "-"}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SUBMIT PAYMENT MODAL */}
      {isPaymentModalOpen && paymentTargetOrder && (
        <Modal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          title={`Submit Payment for Order #${paymentTargetOrder.orderNumber}`}
          description="Enter your NEFT / RTGS / IMPS / UPI transaction reference (UTR) for account verification."
          maxWidth="md"
        >
          {paymentSuccessMsg ? (
            <div className="p-6 text-center space-y-4 font-mono">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2">
                  PRODUCT ORDER CONFIRMED
                </span>
                <p className="text-sm text-steel-900 dark:text-steel-100 font-bold leading-relaxed">{paymentSuccessMsg}</p>
                <p className="text-xs text-steel-500 mt-2">
                  Order status updated to <strong>CONFIRMED</strong>. Shop floor technicians are scheduling material cut & setup.
                </p>
              </div>
              <Button
                variant="orange"
                size="sm"
                onClick={() => {
                  setIsPaymentModalOpen(false);
                  setActiveTab("orders");
                }}
                className="mt-2 text-xs"
              >
                Go to Order Lifecycle Tracker →
              </Button>
            </div>
          ) : (
            <form onSubmit={submitPaymentDetails} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Amount (INR ₹)"
                  required
                  type="number"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                />
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-steel-700 dark:text-steel-300">
                    Payment Type
                  </label>
                  <select
                    value={paymentForm.paymentType}
                    onChange={(e) => setPaymentForm({ ...paymentForm, paymentType: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded border border-steel-300 dark:border-steel-700 bg-white dark:bg-navy-950 text-steel-900 dark:text-white"
                  >
                    <option value="ADVANCE">Advance (50%)</option>
                    <option value="BALANCE">Balance Payment</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-steel-700 dark:text-steel-300">
                    Payment Method
                  </label>
                  <select
                    value={paymentForm.paymentMethod}
                    onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded border border-steel-300 dark:border-steel-700 bg-white dark:bg-navy-950 text-steel-900 dark:text-white"
                  >
                    <option value="BANK_TRANSFER">NEFT / RTGS / IMPS</option>
                    <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                    <option value="CHEQUE">Cheque / Demand Draft</option>
                  </select>
                </div>

                <Input
                  label="Bank UTR / Transaction No."
                  required
                  placeholder="e.g. HDFCR520261024..."
                  value={paymentForm.utrNumber}
                  onChange={(e) => setPaymentForm({ ...paymentForm, utrNumber: e.target.value })}
                />
              </div>

              <div className="p-4 bg-gradient-to-r from-orange-50/50 to-steel-50 dark:from-navy-900 dark:to-navy-950 rounded-xl border-2 border-dashed border-orange-400 dark:border-orange-500/50 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-28 h-28 shrink-0 bg-white p-1.5 rounded-xl border-2 border-orange-500 overflow-hidden shadow-md flex items-center justify-center">
                  <img src="/images/upi_qr.jpg" alt="UPI QR Code - Godwin S" className="w-full h-full object-contain hover:scale-105 transition-transform" />
                </div>
                <div className="text-xs font-mono text-steel-700 dark:text-steel-300 space-y-1 text-center sm:text-left flex-1">
                  <div className="inline-block px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                    OFFICIAL COMPANY UPI QR
                  </div>
                  <div>Account: <strong className="text-navy-900 dark:text-white font-bold">Godwin S</strong></div>
                  <div>Bank: <strong className="text-navy-900 dark:text-white">Indian Bank 0930</strong></div>
                  <div>UPI ID: <strong className="text-orange-500 font-mono font-bold select-all">godwin6945@okicici</strong></div>
                  <p className="text-[10px] text-steel-500 pt-0.5">
                    Scan using Google Pay, PhonePe, Paytm, or BHIM. Enter the generated 12-digit UTR below for immediate accounts credit.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-steel-100 dark:border-steel-800">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsPaymentModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="orange" size="sm" type="submit" isLoading={paymentSubmitting}>
                  Submit for Verification
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}
