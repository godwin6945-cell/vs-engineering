"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Package, 
  Search, 
  Truck, 
  Camera, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Plus, 
  Download,
  AlertCircle,
  ExternalLink,
  RefreshCw
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { formatINR, formatIndianDate, formatIndianDateTime } from "@/lib/utils";

const STAGES = ["CONFIRMED", "IN_PRODUCTION", "QUALITY_CHECK", "PACKED", "DISPATCHED", "DELIVERED", "CANCELLED"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Status Change Modal
  const [activeOrder, setActiveOrder] = useState<any | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("IN_PRODUCTION");
  const [statusNote, setStatusNote] = useState("");

  // Dispatch Logistics Modal
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [dispatchForm, setDispatchForm] = useState({
    transporterName: "V-Trans India Ltd",
    lrNumber: "",
    vehicleNumber: "TN-05-AB-1234",
    eWayBillNumber: "281014",
    trackingUrl: "",
  });

  // Photo Upload Modal
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoForm, setPhotoForm] = useState({
    caption: "",
    stage: "IN_PRODUCTION",
    photoUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!activeOrder) return;
    try {
      const res = await fetch(`/api/orders/${activeOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_STATUS",
          status: newStatus,
          note: statusNote,
        }),
      });
      if (res.ok) {
        setIsStatusModalOpen(false);
        await fetchOrders();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveDispatch = async () => {
    if (!activeOrder) return;
    try {
      const res = await fetch(`/api/orders/${activeOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_DISPATCH",
          dispatchData: dispatchForm,
        }),
      });
      if (res.ok) {
        setIsDispatchModalOpen(false);
        await fetchOrders();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddPhoto = async () => {
    if (!activeOrder) return;
    try {
      const res = await fetch(`/api/orders/${activeOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ADD_PHOTO",
          ...photoForm,
        }),
      });
      if (res.ok) {
        setIsPhotoModalOpen(false);
        await fetchOrders();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = orders.filter((o) => {
    const matchesFilter = statusFilter === "ALL" || o.status === statusFilter;
    const ordNo = (o.orderNumber || "").toLowerCase();
    const cust = (o.customer?.companyName || "").toLowerCase();
    const matchesSearch = ordNo.includes(searchTerm.toLowerCase()) || cust.includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-orange-500 font-bold">
            Shop Floor & Operations
          </span>
          <h1 className="text-2xl font-display font-black text-navy-900 dark:text-steel-100 tracking-tight">
            Order Manufacturing & Dispatch Tracking
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              Back to Overview
            </Button>
          </Link>
          <Button variant="orange" size="sm" onClick={fetchOrders}>
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
          </Button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-navy-900 p-4 rounded-xl border border-steel-200 dark:border-steel-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-steel-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by order number (e.g. VSE-ORD) or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-steel-50 dark:bg-navy-950 border border-steel-200 dark:border-steel-700 rounded-md text-steel-900 dark:text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono overflow-x-auto pb-1 sm:pb-0">
          {["ALL", ...STAGES].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                statusFilter === st
                  ? "bg-navy-900 text-white dark:bg-orange-500 font-bold"
                  : "bg-steel-100 dark:bg-navy-950 text-steel-600 dark:text-steel-300 hover:bg-steel-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-navy-900 rounded-xl border border-steel-200 dark:border-steel-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-steel-100/70 dark:bg-navy-950 text-steel-600 dark:text-steel-400 font-mono uppercase border-b border-steel-200 dark:border-steel-800">
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Customer Enterprise</th>
                <th className="py-3 px-4">Product Description</th>
                <th className="py-3 px-4">Total Value</th>
                <th className="py-3 px-4">Payment State</th>
                <th className="py-3 px-4">Manufacturing Stage</th>
                <th className="py-3 px-4">Dispatch / LR</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel-100 dark:divide-steel-800 font-sans">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-steel-50/50 dark:hover:bg-navy-800/40">
                  <td className="py-3.5 px-4 font-mono font-bold text-navy-900 dark:text-white">
                    {o.orderNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-navy-900 dark:text-white">
                      {o.customer?.companyName || o.customer?.user?.name}
                    </div>
                    <div className="text-[10px] text-steel-500 font-mono">
                      {o.customer?.state}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-steel-700 dark:text-steel-300 max-w-xs truncate">
                    {o.items?.[0]?.description || "Fabrication Scope"}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-navy-900 dark:text-white">
                    {formatINR(o.totalAmount)}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={o.paymentStatus === "FULLY_PAID" ? "success" : o.paymentStatus === "ADVANCE_PAID" ? "orange" : "danger"}>
                      {o.paymentStatus}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant="outline" className="font-bold">
                      {o.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-steel-500">
                    {o.dispatchDetail ? (
                      <span>{o.dispatchDetail.transporterName} (LR: {o.dispatchDetail.lrNumber})</span>
                    ) : (
                      <span className="text-steel-400">Not Dispatched</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                    <Button
                      variant="orange"
                      size="sm"
                      className="text-xs py-1"
                      onClick={() => {
                        setActiveOrder(o);
                        setNewStatus(o.status);
                        setStatusNote("");
                        setIsStatusModalOpen(true);
                      }}
                    >
                      Update Stage
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs py-1"
                      onClick={() => {
                        setActiveOrder(o);
                        setIsDispatchModalOpen(true);
                      }}
                    >
                      <Truck className="w-3 h-3 mr-1" /> LR / E-Way
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs py-1"
                      onClick={() => {
                        setActiveOrder(o);
                        setIsPhotoModalOpen(true);
                      }}
                    >
                      <Camera className="w-3 h-3 mr-1" /> Add Photo
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* UPDATE STATUS MODAL */}
      {isStatusModalOpen && activeOrder && (
        <Modal
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          title={`Update Status: Order #${activeOrder.orderNumber}`}
          description={`Customer: ${activeOrder.customer?.companyName}`}
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-steel-700 dark:text-steel-300 font-bold mb-1">
                Select Lifecycle Stage:
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full p-2.5 rounded border border-steel-300 dark:border-steel-700 bg-white dark:bg-navy-950 text-steel-900 dark:text-white"
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-steel-700 dark:text-steel-300 font-bold mb-1">
                Production Event Log Note:
              </label>
              <textarea
                rows={3}
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="e.g. CMM runout inspection cleared, sent to anodizing..."
                className="w-full p-2.5 rounded border border-steel-300 dark:border-steel-700 bg-white dark:bg-navy-950 text-steel-900 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setIsStatusModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="orange" size="sm" onClick={handleUpdateStatus}>
                Save Stage Update
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* DISPATCH DETAILS MODAL */}
      {isDispatchModalOpen && activeOrder && (
        <Modal
          isOpen={isDispatchModalOpen}
          onClose={() => setIsDispatchModalOpen(false)}
          title={`Dispatch Logistics: ${activeOrder.orderNumber}`}
          description="Enter Indian Transporter consignment details and GST E-way bill number."
          maxWidth="md"
        >
          <div className="space-y-4 text-xs font-mono">
            <Input
              label="Transporter Company Name"
              required
              value={dispatchForm.transporterName}
              onChange={(e) => setDispatchForm({ ...dispatchForm, transporterName: e.target.value })}
              placeholder="e.g. V-Trans / TCI Freight / Safexpress"
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Lorry Receipt (LR) No."
                required
                value={dispatchForm.lrNumber}
                onChange={(e) => setDispatchForm({ ...dispatchForm, lrNumber: e.target.value })}
                placeholder="e.g. VT-CHN-889921"
              />
              <Input
                label="Vehicle Registration No."
                value={dispatchForm.vehicleNumber}
                onChange={(e) => setDispatchForm({ ...dispatchForm, vehicleNumber: e.target.value })}
                placeholder="e.g. TN-05-AB-4455"
              />
            </div>
            <Input
              label="Indian GST E-Way Bill Number (12 Digits)"
              value={dispatchForm.eWayBillNumber}
              onChange={(e) => setDispatchForm({ ...dispatchForm, eWayBillNumber: e.target.value })}
              placeholder="e.g. 281014889921"
            />
            <Input
              label="Consignment Live Tracking URL (Optional)"
              value={dispatchForm.trackingUrl}
              onChange={(e) => setDispatchForm({ ...dispatchForm, trackingUrl: e.target.value })}
              placeholder="https://vtrans.com/track/..."
            />

            <div className="flex items-center justify-end gap-2 pt-3">
              <Button variant="outline" size="sm" onClick={() => setIsDispatchModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="orange" size="sm" onClick={handleSaveDispatch}>
                Confirm Dispatch & Notify Customer
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* SHOP FLOOR PHOTO MODAL */}
      {isPhotoModalOpen && activeOrder && (
        <Modal
          isOpen={isPhotoModalOpen}
          onClose={() => setIsPhotoModalOpen(false)}
          title={`Upload Progress Photo: ${activeOrder.orderNumber}`}
          description="Photos appear in the customer's live tracking gallery."
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs font-mono">
            <Input
              label="Photo Caption"
              required
              value={photoForm.caption}
              onChange={(e) => setPhotoForm({ ...photoForm, caption: e.target.value })}
              placeholder="e.g. 5-Axis finishing pass completed on Doosan VMC"
            />
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-steel-700 dark:text-steel-300">
                Manufacturing Stage
              </label>
              <select
                value={photoForm.stage}
                onChange={(e) => setPhotoForm({ ...photoForm, stage: e.target.value })}
                className="w-full p-2.5 rounded border border-steel-300 dark:border-steel-700 bg-white dark:bg-navy-950 text-steel-900 dark:text-white"
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <Input
              label="Image URL (Shop floor snapshot)"
              value={photoForm.photoUrl}
              onChange={(e) => setPhotoForm({ ...photoForm, photoUrl: e.target.value })}
            />

            <div className="flex items-center justify-end gap-2 pt-3">
              <Button variant="outline" size="sm" onClick={() => setIsPhotoModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="orange" size="sm" onClick={handleAddPhoto}>
                Publish Photo
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
