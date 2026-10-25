"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  ExternalLink, 
  AlertCircle,
  Building2,
  RefreshCw
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { formatINR, formatIndianDate, formatIndianDateTime } from "@/lib/utils";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [rejectModalPayment, setRejectModalPayment] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payments");
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/payments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "APPROVE" }),
      });
      if (res.ok) {
        await fetchPayments();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectModalPayment) return;
    setProcessingId(rejectModalPayment.id);
    try {
      const res = await fetch(`/api/payments/${rejectModalPayment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "REJECT",
          rejectionReason,
        }),
      });
      if (res.ok) {
        setRejectModalPayment(null);
        setRejectionReason("");
        await fetchPayments();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  };

  const filtered = payments.filter((p) => {
    const matchesFilter = filter === "ALL" || p.status === filter;
    const utr = (p.utrNumber || "").toLowerCase();
    const orderNo = (p.order?.orderNumber || "").toLowerCase();
    const company = (p.customer?.companyName || "").toLowerCase();
    const matchesSearch = utr.includes(searchTerm.toLowerCase()) || orderNo.includes(searchTerm.toLowerCase()) || company.includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = payments.filter((p) => p.status === "PENDING_VERIFICATION").length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-orange-500 font-bold">
            Accounting & Bank Reconciliation
          </span>
          <h1 className="text-2xl font-display font-black text-navy-900 dark:text-steel-100 tracking-tight">
            Customer Payments Verification Queue
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              Back to Overview
            </Button>
          </Link>
          <Button variant="orange" size="sm" onClick={fetchPayments}>
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh Queue
          </Button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-navy-900 p-4 rounded-xl border border-steel-200 dark:border-steel-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-steel-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by UTR number, Order number, or Customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-steel-50 dark:bg-navy-950 border border-steel-200 dark:border-steel-700 rounded-md text-steel-900 dark:text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          {["ALL", "PENDING_VERIFICATION", "PAID", "REJECTED"].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                filter === st
                  ? "bg-navy-900 text-white dark:bg-orange-500 font-bold"
                  : "bg-steel-100 dark:bg-navy-950 text-steel-600 dark:text-steel-300 hover:bg-steel-200"
              }`}
            >
              {st === "PENDING_VERIFICATION" ? `Pending (${pendingCount})` : st}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-navy-900 rounded-xl border border-steel-200 dark:border-steel-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-steel-100/70 dark:bg-navy-950 text-steel-600 dark:text-steel-400 font-mono uppercase border-b border-steel-200 dark:border-steel-800">
                <th className="py-3 px-4">Payment Ref</th>
                <th className="py-3 px-4">Order Number</th>
                <th className="py-3 px-4">Customer Enterprise</th>
                <th className="py-3 px-4">Amount (INR)</th>
                <th className="py-3 px-4">Type & Method</th>
                <th className="py-3 px-4">UTR / Transaction Ref</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel-100 dark:divide-steel-800 font-sans">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-steel-50/50 dark:hover:bg-navy-800/40">
                  <td className="py-3.5 px-4 font-mono font-bold text-navy-900 dark:text-white">
                    {p.paymentNumber}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-orange-500 font-bold">
                    {p.order?.orderNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-navy-900 dark:text-white">
                      {p.customer?.companyName || p.customer?.user?.name}
                    </div>
                    <div className="text-[10px] text-steel-500 font-mono">
                      {p.customer?.city}, {p.customer?.state}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-navy-900 dark:text-white text-sm">
                    {formatINR(p.amount)}
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <span className="font-semibold text-steel-700 dark:text-steel-200">{p.paymentType}</span>
                    <span className="text-[10px] text-steel-500 block">via {p.paymentMethod}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-navy-900 dark:text-steel-200">
                    {p.utrNumber}
                    {p.screenshotUrl && (
                      <a
                        href={p.screenshotUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-orange-500 hover:underline block"
                      >
                        View Slip / Proof ↗
                      </a>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
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
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                    {p.status === "PENDING_VERIFICATION" ? (
                      <>
                        <Button
                          variant="orange"
                          size="sm"
                          className="py-1 text-xs"
                          isLoading={processingId === p.id}
                          onClick={() => handleApprove(p.id)}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Verify & Credit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          className="py-1 text-xs"
                          onClick={() => setRejectModalPayment(p)}
                        >
                          Reject
                        </Button>
                      </>
                    ) : (
                      <span className="text-steel-400 font-mono text-[11px]">
                        Processed by {p.verifiedBy || "Accounting"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* REJECT MODAL */}
      {rejectModalPayment && (
        <Modal
          isOpen={!!rejectModalPayment}
          onClose={() => setRejectModalPayment(null)}
          title={`Reject Payment Submission: ${rejectModalPayment.paymentNumber}`}
          description={`Amount: ₹${rejectModalPayment.amount} | UTR: ${rejectModalPayment.utrNumber}`}
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-steel-700 dark:text-steel-300 font-bold mb-1">
                Reason for Rejection:
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. UTR not reflected in HDFC Bank current account statement..."
                className="w-full p-2.5 rounded border border-steel-300 dark:border-steel-700 bg-white dark:bg-navy-950 text-steel-900 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setRejectModalPayment(null)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleRejectSubmit}>
                Confirm Rejection
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
