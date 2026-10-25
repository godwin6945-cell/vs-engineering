"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  Plus, 
  Trash2, 
  Send, 
  CheckCircle2, 
  Clock, 
  X, 
  Download, 
  AlertCircle,
  FileCode,
  DollarSign,
  Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { formatINR, formatIndianDate, calculateGST } from "@/lib/utils";

interface QuoteItemData {
  id: string;
  quoteNumber: string;
  status: string;
  serviceType: string;
  material: string;
  quantity: number;
  subtotal: number;
  totalAmount: number;
  deliveryCity: string;
  deliveryState: string;
  createdAt: string;
  guestName?: string;
  guestEmail?: string;
  guestCompany?: string;
  customer?: {
    companyName: string;
    user?: { name: string; email: string };
  };
  files?: Array<{ fileName: string; fileSize: number; fileUrl: string }>;
  items?: Array<{ description: string; hsnCode: string; quantity: number; unitPrice: number; gstRate: number; total: number }>;
}

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<QuoteItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [activeQuote, setActiveQuote] = useState<QuoteItemData | null>(null);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  // Pricing Form State
  const [lineItems, setLineItems] = useState<Array<{ description: string; hsnCode: string; quantity: number; unitPrice: number; gstRate: number }>>([]);
  const [validityDays, setValidityDays] = useState(15);
  const [adminNotes, setAdminNotes] = useState("");
  const [isSubmittingPricing, setIsSubmittingPricing] = useState(false);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/quotes");
      if (res.ok) {
        const data = await res.json();
        setQuotes(data.quotes || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openPricingModal = (quote: QuoteItemData) => {
    setActiveQuote(quote);
    if (quote.items && quote.items.length > 0) {
      setLineItems(quote.items.map(it => ({
        description: it.description,
        hsnCode: it.hsnCode,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        gstRate: it.gstRate,
      })));
    } else {
      setLineItems([
        {
          description: `${quote.serviceType} Machining & Finishing: ${quote.material}`,
          hsnCode: "8466",
          quantity: quote.quantity,
          unitPrice: 2500,
          gstRate: 18,
        },
      ]);
    }
    setAdminNotes(`Quotation valid for ${validityDays} days from date of issue.`);
    setIsPricingModalOpen(true);
  };

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        description: "Additional Precision Machining / Surface Finishing Scope",
        hsnCode: "8466",
        quantity: 1,
        unitPrice: 1000,
        gstRate: 18,
      },
    ]);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const updateLineItem = (index: number, field: string, value: any) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  };

  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAutofillWithAI = async () => {
    if (!activeQuote) return;
    setIsAiLoading(true);
    try {
      const res = await fetch("/api/ai/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          material: activeQuote.material,
          quantity: activeQuote.quantity,
          dimensions: (activeQuote as any).dimensions,
          tolerance: (activeQuote as any).tolerance,
          serviceType: activeQuote.serviceType,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const est = data.estimate;
        setLineItems([
          {
            description: `${activeQuote.serviceType} Precision Machining (${est.hoursPerUnit} hrs/unit): ${activeQuote.material}`,
            hsnCode: "8466",
            quantity: activeQuote.quantity,
            unitPrice: est.machiningCostPerUnit,
            gstRate: 18,
          },
          {
            description: `Raw Material Billet Cost (${est.estimatedWeightKg} kg/unit): ${activeQuote.material}`,
            hsnCode: "7218",
            quantity: activeQuote.quantity,
            unitPrice: est.materialCostPerUnit,
            gstRate: 18,
          },
        ]);
        setAdminNotes(`Quoted with material master rates. Tooling: ${est.recommendedTooling}. Validity: 15 days.`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Calculations
  const subtotal = lineItems.reduce((acc, it) => acc + (it.quantity * it.unitPrice), 0);
  const customerState = activeQuote?.deliveryState || "Tamil Nadu";
  const gstDetails = calculateGST(subtotal, customerState);

  const handleSendPriceQuote = async () => {
    if (!activeQuote) return;
    setIsSubmittingPricing(true);

    try {
      const res = await fetch(`/api/quotes/${activeQuote.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "PRICE_QUOTE",
          items: lineItems,
          validityDays,
          adminNotes,
        }),
      });

      if (res.ok) {
        setIsPricingModalOpen(false);
        await fetchQuotes();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingPricing(false);
    }
  };

  const filteredQuotes = quotes.filter((q) => {
    const qNum = q.quoteNumber.toLowerCase();
    const client = (q.customer?.companyName || q.guestCompany || q.guestName || "").toLowerCase();
    const matchesSearch = qNum.includes(searchTerm.toLowerCase()) || client.includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "ALL" || q.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return <Badge variant="warning">Submitted</Badge>;
      case "UNDER_REVIEW":
        return <Badge variant="info">Under Review</Badge>;
      case "QUOTED":
        return <Badge variant="orange">Quoted</Badge>;
      case "ACCEPTED":
        return <Badge variant="success">Accepted</Badge>;
      case "REJECTED":
        return <Badge variant="danger">Rejected</Badge>;
      case "EXPIRED":
        return <Badge variant="default">Expired</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-orange-500 font-bold">
            Engineering Estimations Desk
          </span>
          <h1 className="text-2xl font-display font-black text-navy-900 dark:text-steel-100 tracking-tight">
            Quotation Management & Pricing
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              Back to Overview
            </Button>
          </Link>
          <Button variant="orange" size="sm" onClick={fetchQuotes}>
            Refresh Quotes
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-navy-900 p-4 rounded-xl border border-steel-200 dark:border-steel-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-steel-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by quote number (e.g. VSE-Q-2026) or client name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-steel-50 dark:bg-navy-950 border border-steel-200 dark:border-steel-700 rounded-md text-steel-900 dark:text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-mono">
          {["ALL", "SUBMITTED", "UNDER_REVIEW", "QUOTED", "ACCEPTED", "REJECTED"].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                selectedStatus === st
                  ? "bg-navy-900 text-white dark:bg-orange-500 font-bold"
                  : "bg-steel-100 dark:bg-navy-950 text-steel-600 dark:text-steel-300 hover:bg-steel-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Quotes Table */}
      <div className="bg-white dark:bg-navy-900 rounded-xl border border-steel-200 dark:border-steel-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-steel-100/70 dark:bg-navy-950 text-steel-600 dark:text-steel-400 font-mono uppercase border-b border-steel-200 dark:border-steel-800">
                <th className="py-3 px-4">Quote Ref</th>
                <th className="py-3 px-4">Client / Enterprise</th>
                <th className="py-3 px-4">Service & Material</th>
                <th className="py-3 px-4">Batch Qty</th>
                <th className="py-3 px-4">Quoted Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Submitted Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel-100 dark:divide-steel-800 font-sans">
              {filteredQuotes.map((q) => (
                <tr key={q.id} className="hover:bg-steel-50/60 dark:hover:bg-navy-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-navy-900 dark:text-steel-100">
                    {q.quoteNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-navy-900 dark:text-steel-100">
                      {q.customer?.companyName || q.guestCompany || q.guestName || "Guest User"}
                    </div>
                    <div className="text-[10px] text-steel-500 font-mono">
                      {q.deliveryCity}, {q.deliveryState}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <span className="text-orange-500 font-semibold">{q.serviceType}</span> • {q.material}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold">
                    {q.quantity} Nos
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-navy-900 dark:text-white">
                    {q.totalAmount > 0 ? formatINR(q.totalAmount) : <span className="text-steel-400 font-normal">Pending Price</span>}
                  </td>
                  <td className="py-3.5 px-4">
                    {getStatusBadge(q.status)}
                  </td>
                  <td className="py-3.5 px-4 text-steel-500 font-mono">
                    {formatIndianDate(q.createdAt)}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                    <Button
                      variant="orange"
                      size="sm"
                      onClick={() => openPricingModal(q)}
                      className="text-xs py-1"
                    >
                      <DollarSign className="w-3.5 h-3.5 mr-1" />
                      {q.status === "QUOTED" || q.status === "ACCEPTED" ? "Edit Pricing" : "Price Quote"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRICING MODAL */}
      {isPricingModalOpen && activeQuote && (
        <Modal
          isOpen={isPricingModalOpen}
          onClose={() => setIsPricingModalOpen(false)}
          title={`Engineering Pricing: ${activeQuote.quoteNumber}`}
          description={`Customer: ${activeQuote.customer?.companyName || activeQuote.guestCompany || activeQuote.guestName} (${activeQuote.deliveryState})`}
          maxWidth="2xl"
        >
          <div className="space-y-6 text-xs font-mono">
            {/* Drawing preview / download bar */}
            <div className="p-3 rounded-lg bg-steel-100 dark:bg-navy-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-orange-500" />
                <span>Specs: {activeQuote.serviceType} • {activeQuote.material} • Qty: {activeQuote.quantity}</span>
              </div>
              {activeQuote.files && activeQuote.files.length > 0 && (
                <a
                  href={activeQuote.files[0].fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-orange-500 hover:underline flex items-center gap-1 font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  Drawing ({activeQuote.files[0].fileName})
                </a>
              )}
            </div>

            {/* Line items editor */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-steel-700 dark:text-steel-300 uppercase tracking-wider text-xs">
                  Line Item Price Breakdown
                </h4>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    type="button"
                    onClick={handleAutofillWithAI} 
                    isLoading={isAiLoading}
                    className="text-xs py-1 text-orange-600 border-orange-300 dark:border-orange-500/40 hover:bg-orange-50 dark:hover:bg-orange-950/30"
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1" /> Autofill Rates from Master / AI
                  </Button>
                  <Button variant="ghost" size="sm" type="button" onClick={addLineItem} className="text-xs py-1">
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Line Item
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                {lineItems.map((item, idx) => (
                  <div key={idx} className="p-3 bg-steel-50 dark:bg-navy-950 rounded-lg border border-steel-200 dark:border-steel-800 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Description of machining scope"
                        value={item.description}
                        onChange={(e) => updateLineItem(idx, "description", e.target.value)}
                        className="flex-1 px-2.5 py-1.5 text-xs bg-white dark:bg-navy-900 border border-steel-300 dark:border-steel-700 rounded text-steel-900 dark:text-white"
                      />
                      {lineItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLineItem(idx)}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <span className="text-[10px] text-steel-500 block">HSN Code:</span>
                        <input
                          type="text"
                          value={item.hsnCode}
                          onChange={(e) => updateLineItem(idx, "hsnCode", e.target.value)}
                          className="w-full px-2 py-1 text-xs bg-white dark:bg-navy-900 border border-steel-300 dark:border-steel-700 rounded text-steel-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-steel-500 block">Qty (Nos):</span>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(idx, "quantity", parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-xs bg-white dark:bg-navy-900 border border-steel-300 dark:border-steel-700 rounded text-steel-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-steel-500 block">Unit Rate (₹):</span>
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateLineItem(idx, "unitPrice", parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-xs bg-white dark:bg-navy-900 border border-steel-300 dark:border-steel-700 rounded text-steel-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-steel-500 block">Line Total:</span>
                        <div className="py-1 font-bold text-navy-900 dark:text-white">
                          {formatINR(item.quantity * item.unitPrice)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* GST & Totals Summary */}
            <div className="p-4 rounded-xl bg-navy-950 text-white space-y-2">
              <div className="flex justify-between py-1 border-b border-navy-800 text-xs">
                <span className="text-steel-400">Taxable Subtotal:</span>
                <span className="font-bold">{formatINR(subtotal)}</span>
              </div>
              {gstDetails.isIntraState ? (
                <>
                  <div className="flex justify-between py-1 border-b border-navy-800 text-xs">
                    <span className="text-steel-400">CGST (9%):</span>
                    <span>{formatINR(gstDetails.cgstAmount)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-navy-800 text-xs">
                    <span className="text-steel-400">SGST (9%):</span>
                    <span>{formatINR(gstDetails.sgstAmount)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between py-1 border-b border-navy-800 text-xs">
                  <span className="text-steel-400">IGST (18% - Inter-State):</span>
                  <span>{formatINR(gstDetails.igstAmount)}</span>
                </div>
              )}
              <div className="flex justify-between py-1 pt-2 text-sm font-bold text-orange-400">
                <span>Grand Total (INR):</span>
                <span>{formatINR(gstDetails.grandTotal)}</span>
              </div>
            </div>

            {/* Validity & Admin Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-xs text-steel-700 dark:text-steel-300 block mb-1">
                  Validity Period (Days):
                </span>
                <input
                  type="number"
                  value={validityDays}
                  onChange={(e) => setValidityDays(parseInt(e.target.value) || 15)}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-navy-950 border border-steel-300 dark:border-steel-700 rounded text-steel-900 dark:text-white"
                />
              </div>
              <div>
                <span className="text-xs text-steel-700 dark:text-steel-300 block mb-1">
                  Estimator Notes:
                </span>
                <input
                  type="text"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Notes visible to customer..."
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-navy-950 border border-steel-300 dark:border-steel-700 rounded text-steel-900 dark:text-white"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-steel-100 dark:border-steel-800">
              <Button variant="outline" size="sm" onClick={() => setIsPricingModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="orange"
                size="md"
                onClick={handleSendPriceQuote}
                isLoading={isSubmittingPricing}
              >
                <Send className="w-4 h-4 mr-1.5" />
                Issue & Send Quote to Customer
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
