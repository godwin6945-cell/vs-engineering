"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Search, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Layers,
  RefreshCw
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea } from "@/components/ui/Input";
import { formatINR } from "@/lib/utils";

export default function AdminStockPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [form, setForm] = useState({
    sku: "",
    title: "",
    description: "",
    category: "Piping & Flanges",
    quantity: "10",
    unit: "Pieces",
    price: "2500",
    leadTime: "Immediate Dispatch (24h)",
    imageUrl: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80",
  });

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stock");
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setIsAddModalOpen(false);
        setForm({
          sku: "",
          title: "",
          description: "",
          category: "Piping & Flanges",
          quantity: "10",
          unit: "Pieces",
          price: "2500",
          leadTime: "Immediate Dispatch (24h)",
          imageUrl: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80",
        });
        await fetchStock();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this stock item?")) return;
    try {
      const res = await fetch(`/api/stock?id=${id}`, { method: "DELETE" });
      if (res.ok) await fetchStock();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = items.filter((it) => {
    const s = (it.sku || "").toLowerCase();
    const t = (it.title || "").toLowerCase();
    return s.includes(searchTerm.toLowerCase()) || t.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-orange-500 font-bold">
            Catalog & Inventory Desk
          </span>
          <h1 className="text-2xl font-display font-black text-navy-900 dark:text-steel-100 tracking-tight">
            Available Stock & Ready Inventory Management
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              Back to Overview
            </Button>
          </Link>
          <Button variant="orange" size="sm" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Stock Item
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between gap-3 bg-white dark:bg-navy-900 p-4 rounded-xl border border-steel-200 dark:border-steel-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-steel-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search stock by SKU, part title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-steel-50 dark:bg-navy-950 border border-steel-200 dark:border-steel-700 rounded-md text-steel-900 dark:text-white focus:outline-none"
          />
        </div>
        <Link href="/stock" target="_blank" className="text-xs font-mono text-orange-500 hover:underline flex items-center gap-1">
          View Public Catalog <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white dark:bg-navy-900 rounded-xl border border-steel-200 dark:border-steel-800 overflow-hidden shadow-sm flex flex-col justify-between">
            <div>
              <div className="relative aspect-video bg-steel-900">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2">
                  <Badge variant="orange" size="sm">{item.quantity} {item.unit}</Badge>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between text-[11px] font-mono text-steel-500">
                  <span>{item.category}</span>
                  <span className="font-bold text-orange-500">{item.sku}</span>
                </div>
                <h3 className="text-sm font-display font-bold text-navy-900 dark:text-white line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-xs text-steel-500 line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-steel-100 dark:border-steel-800 mt-2 flex items-center justify-between">
              <span className="text-sm font-mono font-bold text-navy-900 dark:text-white">
                {item.price ? formatINR(item.price) : "On Request"}
              </span>
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD MODAL */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Stock / Available Inventory"
          description="Item will appear immediately on the public Available Now page."
          maxWidth="md"
        >
          <form onSubmit={handleCreate} className="space-y-4 text-xs font-mono">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="SKU Code"
                required
                placeholder="e.g. VSE-STK-SS304-BUSH"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
              />
              <Input
                label="Category"
                required
                placeholder="e.g. Piping & Flanges / Spares"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>

            <Input
              label="Item Title"
              required
              placeholder="e.g. Stainless Steel Precision Flanges 4 Inch Class 150"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <Textarea
              label="Technical Description & Specifications"
              rows={3}
              placeholder="Dimensional tolerances, alloy specs, MTC certification availability..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <div className="grid grid-cols-3 gap-3">
              <Input
                label="Quantity Available"
                type="number"
                required
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              />
              <Input
                label="Unit"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
              />
              <Input
                label="Unit Price (₹)"
                placeholder="Leave blank for on request"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>

            <Input
              label="Image URL"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-steel-100 dark:border-steel-800">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="orange" size="sm" type="submit">
                Add to Inventory Catalog
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
