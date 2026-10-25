"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Trash2, 
  AlertCircle, 
  Building2, 
  ShieldCheck, 
  FileCode, 
  MapPin, 
  Sparkles,
  Layers,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";

interface UploadedFileItem {
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
}

const INDIAN_STATES = [
  "Tamil Nadu",
  "Maharashtra",
  "Karnataka",
  "Gujarat",
  "Telangana",
  "Andhra Pradesh",
  "Kerala",
  "Delhi",
  "Haryana",
  "Uttar Pradesh",
  "Rajasthan",
  "Madhya Pradesh",
  "West Bengal",
  "Punjab",
  "Odisha",
  "Other Indian State"
];

export default function QuoteWizardPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedQuote, setSubmittedQuote] = useState<any | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    gstin: "",
    serviceType: "CNC",
    material: "Stainless Steel SS304",
    quantity: "10",
    dimensions: "",
    tolerance: "± 0.01 mm (Precision)",
    finish: "As Machined / Clean Deburred",
    requiredByDate: "",
    deliveryCity: "Chennai",
    deliveryState: "Tamil Nadu",
    deliveryPincode: "600058",
    notes: "",
  });

  const [availableMaterials, setAvailableMaterials] = useState<any[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // AI DFM Estimator state
  const [aiEstimating, setAiEstimating] = useState(false);
  const [aiEstimate, setAiEstimate] = useState<any | null>(null);

  // Fetch live materials rate card from database
  useEffect(() => {
    fetch("/api/materials")
      .then((r) => r.json())
      .then((d) => {
        if (d.materials && d.materials.length > 0) {
          setAvailableMaterials(d.materials);
        }
      })
      .catch(console.error);
  }, []);

  // Load autosaved draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("vse_quote_draft");
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save draft on change
  useEffect(() => {
    try {
      localStorage.setItem("vse_quote_draft", JSON.stringify(formData));
    } catch {
      // ignore
    }
  }, [formData]);

  const handleRunAiEstimate = async () => {
    setAiEstimating(true);
    try {
      const res = await fetch("/api/ai/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          material: formData.material,
          quantity: formData.quantity,
          dimensions: formData.dimensions,
          tolerance: formData.tolerance,
          serviceType: formData.serviceType,
          notes: formData.notes,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiEstimate(data.estimate);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiEstimating(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setErrorMsg(null);
    setUploadProgress(10);

    const interval = setInterval(() => {
      setUploadProgress((p) => {
        if (!p || p >= 100) {
          clearInterval(interval);
          return null;
        }
        return p + 30;
      });
    }, 150);

    setTimeout(() => {
      const newItems: UploadedFileItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        if (f.size > 25 * 1024 * 1024) {
          setErrorMsg(`File ${f.name} exceeds 25 MB limit.`);
          continue;
        }
        newItems.push({
          fileName: f.name,
          fileSize: f.size,
          fileType: f.type || "application/octet-stream",
          fileUrl: `/uploads/${f.name}`,
        });
      }
      setUploadedFiles((prev) => [...prev, ...newItems]);
      setUploadProgress(null);
    }, 600);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const validateStep = (currentStep: number) => {
    setErrorMsg(null);
    if (currentStep === 1) {
      if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
        setErrorMsg("Please provide your name, valid email, and contact phone number.");
        return false;
      }
    }
    if (currentStep === 2) {
      if (!formData.material.trim() || !formData.quantity || parseInt(formData.quantity) <= 0) {
        setErrorMsg("Please specify material and valid quantity.");
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, 4));
    }
  };

  const prevStep = () => {
    setErrorMsg(null);
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          files: uploadedFiles,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit quote");
      }

      setSubmittedQuote(data.quote);
      localStorage.removeItem("vse_quote_draft");
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION SCREEN
  if (submittedQuote) {
    return (
      <div className="min-h-[80vh] py-16 px-4 sm:px-6 lg:px-8 bg-steel-50 dark:bg-navy-950 blueprint-pattern flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white dark:bg-navy-900 border border-steel-200 dark:border-steel-800 rounded-2xl p-8 shadow-2xl space-y-6 text-center animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <Badge variant="orange" size="md">Quotation Request Received</Badge>
            <h1 className="text-3xl font-display font-black text-navy-900 dark:text-steel-100">
              Reference #{submittedQuote.quoteNumber}
            </h1>
            <p className="text-sm text-steel-600 dark:text-steel-300 max-w-lg mx-auto">
              Your drawings and manufacturing specifications have been registered in our engineering pipeline. Our estimators will review DFM and issue a detailed INR quote within <strong>4 working hours</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-steel-50 dark:bg-navy-950 border border-steel-200 dark:border-steel-800 text-left space-y-2 text-xs font-mono">
            <div className="flex justify-between py-1 border-b border-steel-200 dark:border-steel-800">
              <span className="text-steel-500">Service & Material:</span>
              <span className="font-bold text-navy-900 dark:text-white">{submittedQuote.serviceType} • {submittedQuote.material}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-steel-200 dark:border-steel-800">
              <span className="text-steel-500">Batch Quantity:</span>
              <span className="font-bold text-navy-900 dark:text-white">{submittedQuote.quantity} Units</span>
            </div>
            <div className="flex justify-between py-1 border-b border-steel-200 dark:border-steel-800">
              <span className="text-steel-500">Destination:</span>
              <span className="font-bold text-navy-900 dark:text-white">{submittedQuote.deliveryCity}, {submittedQuote.deliveryState}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-steel-500">Drawings Attached:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{uploadedFiles.length || 1} file(s)</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/dashboard">
              <Button variant="orange" size="md" className="w-full sm:w-auto">
                Track in Customer Dashboard
              </Button>
            </Link>
            <Button
              variant="outline"
              size="md"
              className="w-full sm:w-auto"
              onClick={() => {
                setSubmittedQuote(null);
                setStep(1);
                setUploadedFiles([]);
              }}
            >
              Submit Another Drawing
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-steel-50 dark:bg-navy-950 blueprint-pattern transition-colors">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <Badge variant="orange">DFM & Quick Quotation Engine</Badge>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-navy-900 dark:text-steel-100 tracking-tight">
            Request an Engineering Quotation
          </h1>
          <p className="text-xs sm:text-sm text-steel-600 dark:text-steel-400 max-w-xl mx-auto">
            Upload your 2D/3D engineering drawings (PDF, DWG, DXF, STEP) for rapid pricing in Indian Rupees (₹) with full GST breakdown.
          </p>
        </div>

        {/* Stepper Progress Indicator */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-2xl mx-auto font-mono text-xs">
          {[
            { n: 1, label: "Contact Info" },
            { n: 2, label: "Specifications" },
            { n: 3, label: "Drawings" },
            { n: 4, label: "Review & State" },
          ].map((s) => (
            <div key={s.n} className="flex flex-col items-center text-center space-y-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  step === s.n
                    ? "bg-orange-500 text-white ring-4 ring-orange-500/20"
                    : step > s.n
                    ? "bg-emerald-600 text-white"
                    : "bg-steel-200 dark:bg-navy-800 text-steel-500"
                }`}
              >
                {step > s.n ? "✓" : s.n}
              </div>
              <span className={`hidden sm:inline ${step === s.n ? "text-orange-500 font-bold" : "text-steel-500"}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="max-w-2xl mx-auto p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Multi-step Form Body */}
        <Card className="max-w-3xl mx-auto border-steel-200 dark:border-steel-800 shadow-xl">
          <CardContent className="p-6 sm:p-8">
            {/* STEP 1: CONTACT DETAILS */}
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-steel-100 dark:border-steel-800 pb-3">
                  <h3 className="text-base font-display font-bold text-navy-900 dark:text-steel-100">
                    Step 1: Contact & Enterprise Identity
                  </h3>
                  <p className="text-xs text-steel-500 dark:text-steel-400">
                    Guests can submit without prior login; an account will be automatically prepared for order tracking.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Representative Full Name"
                    required
                    placeholder="e.g. Ramesh Chandra"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <Input
                    label="Work Email Address"
                    type="email"
                    required
                    placeholder="ramesh@autotech.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Phone / Mobile (WhatsApp Enabled)"
                    required
                    placeholder="+91 93458 04547"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <Input
                    label="Company / Enterprise Name"
                    placeholder="e.g. AutoTech Industries Ltd"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>

                <Input
                  label="GSTIN (Optional - for Input Tax Credit)"
                  placeholder="e.g. 33AAAAA0000A1Z5"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                  helperText="15-digit Indian Goods & Services Tax Number"
                />
              </div>
            )}

            {/* STEP 2: TECHNICAL SPECIFICATIONS */}
            {step === 2 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-steel-100 dark:border-steel-800 pb-3">
                  <h3 className="text-base font-display font-bold text-navy-900 dark:text-steel-100">
                    Step 2: Manufacturing Specifications
                  </h3>
                  <p className="text-xs text-steel-500 dark:text-steel-400">
                    Define the mechanical scope, alloy grade, volume, and tolerance criteria.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-steel-700 dark:text-steel-300">
                      Primary Process / Service <span className="text-orange-500">*</span>
                    </label>
                    <select
                      value={formData.serviceType}
                      onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm rounded-md border border-steel-300 dark:border-steel-700 bg-white dark:bg-navy-900 text-steel-900 dark:text-steel-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    >
                      <option value="CNC">CNC Precision Machining (3/4/5-Axis)</option>
                      <option value="FABRICATION">Heavy Structural Fabrication</option>
                      <option value="LASER">12 kW Sheet Metal Laser Cutting & Bending</option>
                      <option value="SPARES">Custom Tooling & Industrial Spares</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-steel-700 dark:text-steel-300">
                      Material Specification / Grade <span className="text-orange-500">*</span>
                    </label>
                    {availableMaterials.length > 0 ? (
                      <select
                        value={formData.material}
                        onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm rounded-md border border-steel-300 dark:border-steel-700 bg-white dark:bg-navy-900 text-steel-900 dark:text-steel-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      >
                        {availableMaterials.map((m) => (
                          <option key={m.id} value={m.name}>
                            {m.name} — {formatINR(m.pricePerKg)}/kg {m.inStock ? "(In Stock)" : "(Mill Lead Time)"}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        required
                        placeholder="e.g. Stainless Steel SS304 / EN24 / Aluminum 6061-T6"
                        value={formData.material}
                        onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                      />
                    )}
                  </div>
                </div>

                {/* AI DFM & Instant Estimation Bar */}
                <div className="p-3.5 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-navy-950 dark:to-orange-950/30 rounded-xl border border-orange-200 dark:border-orange-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-xs font-mono font-bold text-navy-900 dark:text-white">
                        AI Manufacturing & DFM Assistant
                      </h4>
                      <p className="text-[11px] text-steel-500 font-mono">
                        Instant DFM tooling feedback, material density weight & cost estimation.
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="orange"
                    size="sm"
                    className="text-xs shrink-0"
                    isLoading={aiEstimating}
                    onClick={handleRunAiEstimate}
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1" /> Run AI Estimation
                  </Button>
                </div>

                {/* AI Estimate Display Card */}
                {aiEstimate && (
                  <div className="p-4 bg-white dark:bg-navy-900 rounded-xl border-2 border-orange-500/40 shadow-lg space-y-3 font-mono text-xs animate-in zoom-in-95">
                    <div className="flex items-center justify-between border-b border-steel-100 dark:border-steel-800 pb-2">
                      <span className="font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1.5 uppercase">
                        <Sparkles className="w-3.5 h-3.5" /> AI Engineering Feasibility Report
                      </span>
                      <span className="text-[11px] text-steel-500">
                        Lead Time: ~{aiEstimate.leadTimeDays} working days
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                      <div className="p-2 rounded bg-steel-50 dark:bg-navy-950 border border-steel-100 dark:border-steel-800">
                        <span className="text-[10px] text-steel-400 uppercase block">Part Unit Weight</span>
                        <span className="font-bold text-navy-900 dark:text-white">{aiEstimate.estimatedWeightKg} kg</span>
                      </div>
                      <div className="p-2 rounded bg-steel-50 dark:bg-navy-950 border border-steel-100 dark:border-steel-800">
                        <span className="text-[10px] text-steel-400 uppercase block">Est. Machining Time</span>
                        <span className="font-bold text-navy-900 dark:text-white">{aiEstimate.hoursPerUnit} hrs/unit</span>
                      </div>
                      <div className="p-2 rounded bg-steel-50 dark:bg-navy-950 border border-steel-100 dark:border-steel-800">
                        <span className="text-[10px] text-steel-400 uppercase block">Est. Unit Price</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatINR(aiEstimate.estimatedUnitCost)}</span>
                      </div>
                      <div className="p-2 rounded bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800">
                        <span className="text-[10px] text-orange-600 dark:text-orange-300 uppercase block font-bold">Est. Total (incl. GST)</span>
                        <span className="font-bold text-orange-600 dark:text-orange-400">{formatINR(aiEstimate.estimatedTotal)}</span>
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      <span className="text-[11px] text-steel-500 font-bold block">DFM Engineering Insights:</span>
                      <ul className="space-y-1 text-[11px] text-steel-700 dark:text-steel-300">
                        {aiEstimate.dfmInsights.map((tip: string, i: number) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-orange-500 font-bold">›</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Quantity (Units / Batch)"
                    type="number"
                    required
                    min={1}
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  />
                  <Input
                    label="Overall Dimensions"
                    placeholder="e.g. 250 x 180 x 45 mm"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  />
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-steel-700 dark:text-steel-300">
                      Tolerance Required
                    </label>
                    <select
                      value={formData.tolerance}
                      onChange={(e) => setFormData({ ...formData, tolerance: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-md border border-steel-300 dark:border-steel-700 bg-white dark:bg-navy-900 text-steel-900 dark:text-steel-100 focus:outline-none"
                    >
                      <option value="± 0.005 mm (High Precision CMM)">± 0.005 mm (Micro / CMM)</option>
                      <option value="± 0.01 mm (Precision)">± 0.01 mm (Precision)</option>
                      <option value="± 0.05 mm (Standard Machining)">± 0.05 mm (Standard)</option>
                      <option value="± 0.5 mm (Fabrication / Welded)">± 0.5 mm (Fabrication)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Surface Finishing / Coating"
                    placeholder="e.g. Hard Anodize / Red Oxide / Mirror Polish / Induction Hardened"
                    value={formData.finish}
                    onChange={(e) => setFormData({ ...formData, finish: e.target.value })}
                  />
                  <Input
                    label="Target Required-by Date"
                    type="date"
                    value={formData.requiredByDate}
                    onChange={(e) => setFormData({ ...formData, requiredByDate: e.target.value })}
                  />
                </div>

                <Textarea
                  label="Special Technical Notes / Inspection Requirements"
                  rows={3}
                  placeholder="e.g. Require ultrasonic test reports, CMM inspection sheets, or specific thread pitch..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            )}

            {/* STEP 3: DRAWING & CAD UPLOADS */}
            {step === 3 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-steel-100 dark:border-steel-800 pb-3">
                  <h3 className="text-base font-display font-bold text-navy-900 dark:text-steel-100">
                    Step 3: Engineering Drawings & CAD Files
                  </h3>
                  <p className="text-xs text-steel-500 dark:text-steel-400">
                    Attach 2D PDF blueprints or 3D CAD models (STEP, IGES, DWG, DXF, PNG up to 25 MB).
                  </p>
                </div>

                {/* Drag-and-drop Zone */}
                <label className="border-2 border-dashed border-steel-300 dark:border-steel-700 hover:border-orange-500 dark:hover:border-orange-500 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer bg-steel-50/50 dark:bg-navy-900/50 transition-colors group">
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    accept=".pdf,.dwg,.dxf,.step,.stp,.iges,.igs,.png,.jpg,.jpeg,.zip"
                    onChange={handleFileUpload}
                  />
                  <Upload className="w-10 h-10 text-steel-400 group-hover:text-orange-500 transition-colors mb-3" />
                  <p className="text-sm font-semibold text-navy-900 dark:text-white">
                    Click to browse or drag and drop drawing files
                  </p>
                  <p className="text-xs text-steel-500 font-mono mt-1">
                    PDF, DWG, DXF, STEP, STP (Max 25 MB per file)
                  </p>
                </label>

                {uploadProgress !== null && (
                  <div className="w-full bg-steel-200 dark:bg-steel-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-orange-500 h-2 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 ? (
                  <div className="space-y-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-steel-500 font-bold block">
                      Attached Files ({uploadedFiles.length}):
                    </span>
                    <div className="divide-y divide-steel-100 dark:divide-steel-800 border border-steel-200 dark:border-steel-800 rounded-lg overflow-hidden bg-white dark:bg-navy-900">
                      {uploadedFiles.map((f, i) => (
                        <div key={i} className="flex items-center justify-between p-3 text-xs font-mono">
                          <div className="flex items-center gap-2.5 truncate">
                            <FileCode className="w-4 h-4 text-orange-500 shrink-0" />
                            <span className="truncate font-semibold text-navy-900 dark:text-steel-100">{f.fileName}</span>
                            <span className="text-steel-400">({(f.fileSize / (1024 * 1024)).toFixed(2)} MB)</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(i)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-steel-400 italic text-center">
                    Note: If you don&apos;t have CAD files right now, you can proceed and email them later.
                  </p>
                )}
              </div>
            )}

            {/* STEP 4: DELIVERY LOCATION & REVIEW */}
            {step === 4 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-steel-100 dark:border-steel-800 pb-3">
                  <h3 className="text-base font-display font-bold text-navy-900 dark:text-steel-100">
                    Step 4: Delivery Location & GST State Verification
                  </h3>
                  <p className="text-xs text-steel-500 dark:text-steel-400">
                    Your state determines GST tax calculation (Intra-state CGST+SGST vs Inter-state IGST).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Destination City"
                    required
                    placeholder="e.g. Pune / Bengaluru / Chennai"
                    value={formData.deliveryCity}
                    onChange={(e) => setFormData({ ...formData, deliveryCity: e.target.value })}
                  />

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-steel-700 dark:text-steel-300">
                      Destination State <span className="text-orange-500">*</span>
                    </label>
                    <select
                      value={formData.deliveryState}
                      onChange={(e) => setFormData({ ...formData, deliveryState: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-md border border-steel-300 dark:border-steel-700 bg-white dark:bg-navy-900 text-steel-900 dark:text-steel-100 focus:outline-none"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st} {st === "Tamil Nadu" ? "(Home State: CGST+SGST)" : "(Inter-State: IGST)"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input
                    label="Pincode"
                    required
                    placeholder="e.g. 600058"
                    value={formData.deliveryPincode}
                    onChange={(e) => setFormData({ ...formData, deliveryPincode: e.target.value })}
                  />
                </div>

                {/* Review Specifications Summary Box */}
                <div className="p-4 rounded-xl bg-steel-50 dark:bg-navy-950 border border-steel-200 dark:border-steel-800 space-y-2 text-xs font-mono">
                  <div className="font-bold uppercase tracking-wider text-orange-500 pb-1 border-b border-steel-200 dark:border-steel-800">
                    Order Scope Summary
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-steel-600 dark:text-steel-300">
                    <div>Client: <strong className="text-navy-900 dark:text-white">{formData.name} ({formData.company || "Individual"})</strong></div>
                    <div>Email: <strong className="text-navy-900 dark:text-white">{formData.email}</strong></div>
                    <div>Service: <strong className="text-navy-900 dark:text-white">{formData.serviceType}</strong></div>
                    <div>Material: <strong className="text-navy-900 dark:text-white">{formData.material}</strong></div>
                    <div>Batch Qty: <strong className="text-navy-900 dark:text-white">{formData.quantity} Units</strong></div>
                    <div>Tolerance: <strong className="text-navy-900 dark:text-white">{formData.tolerance}</strong></div>
                    <div>Files: <strong className="text-navy-900 dark:text-white">{uploadedFiles.length} attached</strong></div>
                    <div>Tax Regime: <strong className="text-orange-500">{formData.deliveryState === "Tamil Nadu" ? "CGST (9%) + SGST (9%)" : "IGST (18%)"}</strong></div>
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-steel-100 dark:border-steel-800 mt-6">
              {step > 1 ? (
                <Button variant="outline" size="md" onClick={prevStep}>
                  <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
                </Button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <Button variant="orange" size="md" onClick={nextStep}>
                  Continue <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              ) : (
                <Button
                  variant="orange"
                  size="lg"
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                  className="shadow-lg shadow-orange-500/20"
                >
                  <FileText className="w-4 h-4 mr-1.5" />
                  Submit Drawing for Rapid Quotation
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
