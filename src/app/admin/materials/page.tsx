"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Layers, 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle2, 
  Search, 
  ArrowRight, 
  Save, 
  RefreshCw,
  Sparkles,
  TrendingUp,
  Tag
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea } from "@/components/ui/Input";
import { formatINR } from "@/lib/utils";

export default function AdminMaterialsPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    category: "Stainless Steel",
    pricePerKg: "450",
    machiningRatePerHour: "1400",
    density: "7.93",
    hsnCode: "7218",
    inStock: true,
    stockQuantityKg: "2500",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/materials");
      if (res.ok) {
        const data = await res.json();
        setMaterials(data.materials || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      name: "",
      category: "Stainless Steel",
      pricePerKg: "450",
      machiningRatePerHour: "1400",
      density: "7.93",
      hsnCode: "7218",
      inStock: true,
      stockQuantityKg: "2500",
      notes: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (m: any) => {
    setEditingId(m.id);
    setForm({
      name: m.name,
      category: m.category,
      pricePerKg: m.pricePerKg.toString(),
      machiningRatePerHour: m.machiningRatePerHour.toString(),
      density: m.density.toString(),
      hsnCode: m.hsnCode,
      inStock: m.inStock,
      stockQuantityKg: m.stockQuantityKg.toString(),
      notes: m.notes || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = editingId ? `/api/materials/${editingId}` : "/api/materials";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setIsModalOpen(false);
        await fetchMaterials();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this material from the rate card?")) return;
    try {
      const res = await fetch(`/api/materials/${id}`, { method: "DELETE" });
      if (res.ok) await fetchMaterials();
    } catch (e) {
      console.error(e);
    }
  };

  const categories = ["ALL", "Stainless Steel", "Structural Carbon Steel", "Tool & Alloy Steel", "Non-Ferrous", "Superalloy"];

  const filtered = materials.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.hsnCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "ALL" || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-orange-500 font-bold">
            Raw Material Master & Price Matrix
          </span>
          <h1 className="text-2xl font-display font-black text-navy-900 dark:text-steel-100 tracking-tight">
            Materials Rate Card & Machining Feeds
          </h1>
          <p className="text-xs text-steel-500 font-mono mt-0.5">
            Rates configured here automatically drive the client Quoting Engine and Estimator pricing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              Back to Overview
            </Button>
          </Link>
          <Button variant="orange" size="sm" onClick={openAddModal}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Add New Material
          </Button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-navy-900 p-4 rounded-xl border border-steel-200 dark:border-steel-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-steel-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search material by grade (e.g. SS316, 7075, EN24) or HSN code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-steel-50 dark:bg-navy-950 border border-steel-200 dark:border-steel-700 rounded-md text-steel-900 dark:text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-mono">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                selectedCategory === c
                  ? "bg-navy-900 text-white dark:bg-orange-500 font-bold"
                  : "bg-steel-100 dark:bg-navy-950 text-steel-600 dark:text-steel-300 hover:bg-steel-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-white dark:bg-navy-900 rounded-xl border border-steel-200 dark:border-steel-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-steel-100/70 dark:bg-navy-950 text-steel-600 dark:text-steel-400 font-mono uppercase border-b border-steel-200 dark:border-steel-800">
                <th className="py-3 px-4">Material Grade</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Raw Rate (₹ / Kg)</th>
                <th className="py-3 px-4">Machining Rate (₹ / Hr)</th>
                <th className="py-3 px-4">Density (g/cm³)</th>
                <th className="py-3 px-4">HSN Code</th>
                <th className="py-3 px-4">Stock Level</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel-100 dark:divide-steel-800 font-sans">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-steel-50/50 dark:hover:bg-navy-800/40">
                  <td className="py-3.5 px-4 font-mono font-bold text-navy-900 dark:text-white">
                    {m.name}
                    {m.notes && <p className="text-[10px] text-steel-400 font-sans mt-0.5">{m.notes}</p>}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-steel-600 dark:text-steel-300">
                    {m.category}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-orange-600 dark:text-orange-400 text-sm">
                    {formatINR(m.pricePerKg)} / kg
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-navy-900 dark:text-steel-100">
                    {formatINR(m.machiningRatePerHour)} / hr
                  </td>
                  <td className="py-3.5 px-4 font-mono text-steel-600 dark:text-steel-400">
                    {m.density} g/cm³
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-steel-700 dark:text-steel-300">
                    {m.hsnCode}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-navy-900 dark:text-white">
                    {m.stockQuantityKg.toLocaleString()} kg
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={m.inStock ? "success" : "danger"}>
                      {m.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => openEditModal(m)}
                      className="p-1.5 text-navy-700 dark:text-steel-300 hover:text-orange-500 rounded transition-colors"
                      title="Edit Material Rates"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(m.id)}
                      className="p-1.5 text-red-500 hover:text-red-700 rounded transition-colors"
                      title="Delete Material"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingId ? `Update Material: ${form.name}` : "Add Material Grade to Rate Card"}
          description="Define raw material procurement costs and VMC/lathe machining hourly rates."
          maxWidth="md"
        >
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            <Input
              label="Material Grade & Alloy Designation"
              required
              placeholder="e.g. Stainless Steel SS316L / Titanium Gr 5 / Aluminum 7075"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-steel-700 dark:text-steel-300">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded border border-steel-300 dark:border-steel-700 bg-white dark:bg-navy-950 text-steel-900 dark:text-white"
                >
                  <option value="Stainless Steel">Stainless Steel</option>
                  <option value="Structural Carbon Steel">Structural Carbon Steel</option>
                  <option value="Tool & Alloy Steel">Tool & Alloy Steel</option>
                  <option value="Non-Ferrous">Non-Ferrous (Aluminum / Brass / Bronze)</option>
                  <option value="Superalloy">Superalloy (Titanium / Inconel)</option>
                </select>
              </div>

              <Input
                label="Raw Price (₹ per Kg)"
                type="number"
                required
                value={form.pricePerKg}
                onChange={(e) => setForm({ ...form, pricePerKg: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Machining Feed Rate (₹ per Hour)"
                type="number"
                required
                value={form.machiningRatePerHour}
                onChange={(e) => setForm({ ...form, machiningRatePerHour: e.target.value })}
              />
              <Input
                label="Specific Density (g/cm³)"
                type="number"
                step="0.01"
                required
                value={form.density}
                onChange={(e) => setForm({ ...form, density: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="HSN Code (GST)"
                required
                value={form.hsnCode}
                onChange={(e) => setForm({ ...form, hsnCode: e.target.value })}
              />
              <Input
                label="Current Stock (Kg)"
                type="number"
                value={form.stockQuantityKg}
                onChange={(e) => setForm({ ...form, stockQuantityKg: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="inStockCheck"
                checked={form.inStock}
                onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                className="rounded border-steel-300 text-orange-500 focus:ring-orange-500"
              />
              <label htmlFor="inStockCheck" className="text-xs text-steel-700 dark:text-steel-300 font-semibold cursor-pointer">
                Available in Factory Yard / Immediately Mill-Procured
              </label>
            </div>

            <Textarea
              label="Engineering & Machining Notes"
              rows={2}
              placeholder="e.g. Recommended for marine environment. Requires carbide tooling..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-steel-100 dark:border-steel-800">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="orange" size="sm" type="submit" isLoading={submitting}>
                <Save className="w-3.5 h-3.5 mr-1" />
                {editingId ? "Update Material Rates" : "Add to Rate Card"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
