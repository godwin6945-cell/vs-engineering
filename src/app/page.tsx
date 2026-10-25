import React from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  CheckCircle2, 
  Cog, 
  ShieldCheck, 
  Clock, 
  FileCheck2, 
  Layers, 
  Truck, 
  Maximize2,
  Award,
  Cpu,
  ChevronRight,
  TrendingUp,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";

export default function HomePage() {
  const capabilities = [
    {
      title: "CNC Precision Machining",
      subtitle: "3, 4 & 5-Axis Milling & Turning",
      description: "High-accuracy component manufacturing up to ±0.005 mm tolerance. Specialized in titanium, stainless steel (SS304/316), alloy steel (EN8/EN19/EN24), and aviation aluminum.",
      specs: ["Max envelope: 1500 × 800 × 700 mm", "Spindle: Up to 15,000 RPM", "Inspection: CMM & Optical Profile Projector"],
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      link: "/services#cnc",
      tag: "High Precision"
    },
    {
      title: "Heavy Industrial Fabrication",
      subtitle: "Certified Welding & Structure Assemblies",
      description: "ASME & AWS certified fabrication for heavy machine frames, pressure vessel shells, skids, conveyor gantries, and industrial furnaces with load testing.",
      specs: ["Crane capacity: 25 Metric Tonnes", "Processes: MIG, TIG, Submerged Arc (SAW)", "Testing: UT, DPT & Hydrostatic"],
      image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
      link: "/services#fabrication",
      tag: "Structural"
    },
    {
      title: "Fiber Laser Cutting & Bending",
      subtitle: "High-Speed Sheet Metal Processing",
      description: "12 kW CNC Fiber laser cutting with high-precision multi-axis CNC press brakes for clean edges, tight nesting, and minimal material scrap.",
      specs: ["Bed size: 2500 × 6500 mm", "Thickness: MS up to 32mm, SS up to 25mm", "Nitrogen & Oxygen assist cutting"],
      image: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80",
      link: "/services#laser",
      tag: "Sheet Metal"
    },
    {
      title: "Custom Spares & OEM Tooling",
      subtitle: "Reverse Engineering & Rapid Batch Spares",
      description: "Rapid production of obsolete equipment spares, spline shafts, helical gears, hydraulic manifold blocks, and fixture tooling with material test certificates.",
      specs: ["Turnaround: 48-72h for rush breakdown spares", "Hardening: Induction, Case & Vacuum", "Reverse engineering from sample"],
      image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
      link: "/services#spares",
      tag: "Tooling & Spares"
    }
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Upload 2D/3D Drawings",
      desc: "Submit your CAD files (PDF, DWG, DXF, STEP) along with your required material, quantity, and tolerance.",
      time: "Immediate"
    },
    {
      step: "02",
      title: "Receive Detailed Quote & DFM",
      desc: "Our engineering team reviews the drawing, provides Design for Manufacturability (DFM) feedback, and gives transparent INR pricing.",
      time: "Within 4 Hours"
    },
    {
      step: "03",
      title: "Precision Production & QC",
      desc: "Manufactured in our ISO 9001 facility. Track progress photos, CMM inspection reports, and QC milestones in your portal.",
      time: "Live Milestones"
    },
    {
      step: "04",
      title: "Dispatch with E-Way Bill & LR",
      desc: "Packed with protective anti-rust coating, dispatched via trusted Indian transporters with live LR & E-way bill tracking.",
      time: "Pan-India Delivery"
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-navy-950 text-white blueprint-pattern border-b border-navy-800">
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/90 to-navy-900/40 pointer-events-none" />
        
        {/* Subtle technical grid lines */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-900/90 border border-orange-500/30 text-orange-400 text-xs font-mono uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                Defense • Automotive • Power • Heavy Infrastructure
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight text-white leading-[1.1]">
                Precision Engineering <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-steel-200 to-orange-400">
                  Built to Exacting Tolerances.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-steel-300 leading-relaxed max-w-2xl font-sans">
                VS Engineering delivers industrial-grade CNC machining, heavy structural fabrication, and custom spare assemblies across India. Backed by ISO 9001:2015 quality standards and transparent online milestone tracking.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link href="/quote">
                  <Button variant="orange" size="lg" className="w-full sm:w-auto shadow-orange-500/30 shadow-lg text-base">
                    <span>Request a Quote</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <Link href="/services">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-steel-600 text-steel-200 hover:bg-steel-800">
                    Explore Capabilities
                  </Button>
                </Link>
                <Link href="/stock" className="sm:hidden">
                  <Button variant="secondary" size="md" className="w-full justify-center">
                    View Ready-to-Ship Stock
                  </Button>
                </Link>
              </div>

              {/* Trust Badges / Stats */}
              <div className="pt-5 border-t border-navy-800/80 grid grid-cols-2 gap-2 sm:gap-3">
                {[
                  { val: "±0.005mm", label: "Precision Tolerance", color: "text-orange-400" },
                  { val: "4 Hours", label: "Avg. Quote Time", color: "text-white" },
                  { val: "45,000+", label: "Components Delivered", color: "text-white" },
                  { val: "100%", label: "MTC Traceability", color: "text-emerald-400" },
                ].map((stat, i) => (
                  <div key={i} className="bg-navy-900/60 border border-navy-700/50 rounded-xl p-3 sm:p-4">
                    <div className={`text-lg sm:text-2xl font-mono font-bold ${stat.color}`}>{stat.val}</div>
                    <div className="text-[10px] sm:text-xs text-steel-400 mt-0.5 leading-tight">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Card / Machine Blueprint visual */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="relative rounded-2xl bg-gradient-to-b from-navy-900 to-navy-950 p-6 border border-steel-700/60 shadow-2xl overflow-hidden group">
                <div className="flex items-center justify-between pb-4 border-b border-steel-800 text-xs font-mono text-steel-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                    <span className="ml-2 text-steel-300 font-semibold">JOB SPEC #VSE-CNC-8941</span>
                  </div>
                  <span className="text-orange-400 font-semibold">STATUS: QC PASS</span>
                </div>

                <div className="mt-4 relative rounded-lg overflow-hidden border border-navy-800 aspect-[4/3] bg-navy-900">
                  <img
                    src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
                    alt="5-Axis CNC Precision Machining Center at VS Engineering"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono bg-navy-950/80 backdrop-blur-md px-3 py-2 rounded border border-steel-800">
                    <span className="text-steel-300">Material: Aerospace Grade SS316L</span>
                    <span className="text-emerald-400 font-bold">CMM Inspected ✓</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs font-mono text-steel-400">
                  <div className="flex justify-between py-1 border-b border-navy-800">
                    <span>Machining Center</span>
                    <span className="text-white font-semibold">Doosan 5-Axis VMC</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-navy-800">
                    <span>Batch Quantity</span>
                    <span className="text-white font-semibold">250 Units • Finished</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Destination</span>
                    <span className="text-white font-semibold">Pune Automotive Cluster (MH)</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-steel-800 flex items-center justify-between">
                  <Link href="/gallery" className="text-xs font-mono text-orange-400 hover:text-orange-300 flex items-center gap-1">
                    View Gallery & Case Studies <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                  <span className="text-[11px] font-mono text-steel-500">ISO 9001:2015</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities Section */}
      <section className="py-20 bg-steel-50 dark:bg-navy-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-orange-500 font-bold">
                Specialized Operations
              </div>
              <h2 className="text-3xl font-display font-black text-navy-900 dark:text-steel-100 tracking-tight mt-1">
                Engineering Capabilities & Machinery
              </h2>
            </div>
            <p className="text-sm text-steel-600 dark:text-steel-400 max-w-md">
              From one-off prototype development to high-volume manufacturing, our shop floor is equipped to execute complex engineering specifications.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
            {capabilities.map((cap, idx) => (
              <Card key={idx} className="group hover:border-orange-500/50 hover:shadow-xl hover-lift transition-smooth">
                <div className="relative aspect-[16/9] overflow-hidden bg-steel-900">
                  <img
                    src={cap.image}
                    alt={cap.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge variant="orange">{cap.tag}</Badge>
                  </div>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <span className="text-xs font-mono text-orange-500 font-semibold">{cap.subtitle}</span>
                    <h3 className="text-xl font-display font-bold text-navy-900 dark:text-steel-100 mt-0.5">
                      {cap.title}
                    </h3>
                  </div>
                  <p className="text-sm text-steel-600 dark:text-steel-300 leading-relaxed">
                    {cap.description}
                  </p>
                  <ul className="space-y-1.5 pt-2 border-t border-steel-100 dark:border-steel-800 text-xs text-steel-500 dark:text-steel-400 font-mono">
                    {cap.specs.map((s, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2">
                    <Link
                      href={cap.link}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 dark:text-orange-400 hover:text-orange-500 transition-colors"
                    >
                      <span>Technical Specs & Capacities</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Production Lifecycle Workflow */}
      <section className="py-20 bg-white dark:bg-navy-950 blueprint-pattern border-y border-steel-200 dark:border-steel-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <Badge variant="orange">Transparent Execution</Badge>
            <h2 className="text-3xl font-display font-black text-navy-900 dark:text-steel-100 tracking-tight">
              From Drawing to Delivery in 4 Precise Steps
            </h2>
            <p className="text-sm text-steel-600 dark:text-steel-400">
              No ambiguity. Track every production milestone, QC test certificate, and transport status directly from your online dashboard.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {workflowSteps.map((step, idx) => (
              <div
                key={idx}
                className="relative bg-steel-50/70 dark:bg-navy-900/80 border border-steel-200 dark:border-steel-800 rounded-xl p-4 sm:p-6 space-y-2 sm:space-y-3 shadow-sm hover:border-orange-500/40 hover-lift transition-smooth"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl sm:text-3xl font-black text-orange-500/80">
                    {step.step}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-mono font-medium px-1.5 sm:px-2 py-0.5 rounded bg-white dark:bg-navy-950 border border-steel-200 dark:border-steel-700 text-steel-600 dark:text-steel-300 truncate ml-1">
                    {step.time}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-display font-bold text-navy-900 dark:text-steel-100 leading-snug">
                  {step.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-steel-600 dark:text-steel-400 leading-relaxed hidden sm:block">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/quote">
              <Button variant="orange" size="lg">
                Submit Your Drawing for Immediate Quotation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose VS Engineering */}
      <section className="py-20 bg-steel-50 dark:bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <Badge variant="orange">Standard of Excellence</Badge>
                <h2 className="text-3xl font-display font-black text-navy-900 dark:text-steel-100 tracking-tight">
                  Why Leading Indian Enterprises Trust VS Engineering
                </h2>
              </div>
              <p className="text-sm text-steel-600 dark:text-steel-300 leading-relaxed">
                We combine the agility of modern CNC machining with the rigorous process controls of aerospace and automotive tier-1 suppliers.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-navy-900 dark:text-steel-100">
                      100% Raw Material Traceability (MTC)
                    </h4>
                    <p className="text-xs text-steel-500 dark:text-steel-400 mt-0.5">
                      Every bar, plate, and forging is sourced exclusively from reputed mills (SAIL, Tata, Jindal, Mukand) with NABL lab chemical & mechanical test certificates.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-navy-900 dark:text-steel-100">
                      In-House Quality Assurance Lab
                    </h4>
                    <p className="text-xs text-steel-500 dark:text-steel-400 mt-0.5">
                      Equipped with Coordinate Measuring Machines (CMM), surface roughness testers (Ra 0.2µm), ultrasonic flaw detectors, and optical height gauges.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-navy-900 dark:text-steel-100">
                      Safe Packaging & Pan-India Logistics
                    </h4>
                    <p className="text-xs text-steel-500 dark:text-steel-400 mt-0.5">
                      VCI anti-corrosion wrapping, custom wooden crates for heavy components, and tracked transport through V-Trans, TCI Freight, and Safexpress with valid E-way bills.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-4">
                  <div className="rounded-xl overflow-hidden border border-steel-200 dark:border-steel-800 shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80"
                      alt="Welding fabrication workshop"
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 rounded-xl bg-navy-900 text-white space-y-2 border border-navy-800">
                    <span className="text-xs font-mono text-orange-400">Certifications</span>
                    <h4 className="text-base font-display font-bold">ISO 9001:2015</h4>
                    <p className="text-xs text-steel-300">
                      Standardized manufacturing processes audited and certified for precision mechanical assemblies.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 sm:pt-6">
                  <div className="p-5 rounded-xl bg-white dark:bg-navy-950 border border-steel-200 dark:border-steel-800 space-y-2 shadow-sm">
                    <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">On-Time Metric</span>
                    <h4 className="text-2xl font-mono font-bold text-navy-900 dark:text-white">99.4%</h4>
                    <p className="text-xs text-steel-500 dark:text-steel-400">
                      Strict dispatch adherence ensures your assembly lines never face downtime.
                    </p>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-steel-200 dark:border-steel-800 shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80"
                      alt="CMM machine inspection"
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workshop Snapshot Grid */}
      <section className="py-12 bg-navy-950 text-white border-y border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-3">
            <div>
              <span className="text-xs font-mono text-orange-400 uppercase tracking-widest font-bold">Shop Floor Infrastructure</span>
              <h3 className="text-2xl font-display font-black text-white mt-0.5">Inside VS Engineering Works • Coimbatore</h3>
            </div>
            <Link href="/gallery" className="text-xs font-mono text-orange-400 hover:text-orange-300 flex items-center gap-1 font-semibold">
              Browse Full 2026 Portfolio <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
            <div className="group relative rounded-xl overflow-hidden border border-navy-800 aspect-[4/3] bg-navy-900">
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80"
                alt="5-Axis CNC Milling Center"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-2 left-2 right-2 text-[11px] font-mono font-semibold text-white truncate">
                5-Axis Machining Bay
              </div>
            </div>

            <div className="group relative rounded-xl overflow-hidden border border-navy-800 aspect-[4/3] bg-navy-900">
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80"
                alt="Robotic Submerged Arc Welding"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-2 left-2 right-2 text-[11px] font-mono font-semibold text-white truncate">
                Heavy Structural Cell
              </div>
            </div>

            <div className="group relative rounded-xl overflow-hidden border border-navy-800 aspect-[4/3] bg-navy-900">
              <img
                src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=600&q=80"
                alt="Precision Lathe Turning"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-2 left-2 right-2 text-[11px] font-mono font-semibold text-white truncate">
                CNC Turning Line
              </div>
            </div>

            <div className="group relative rounded-xl overflow-hidden border border-navy-800 aspect-[4/3] bg-navy-900">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80"
                alt="Zeiss 3D CMM Metrology Lab"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-2 left-2 right-2 text-[11px] font-mono font-semibold text-white truncate">
                Zeiss CMM QC Lab
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="py-20 bg-white dark:bg-navy-950 border-t border-steel-200 dark:border-steel-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <Badge variant="orange">Customer Voices</Badge>
            <h2 className="text-3xl font-display font-black text-navy-900 dark:text-steel-100 tracking-tight">
              Trusted Across Industrial Corridors
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            <Card className="p-6 space-y-4 hover-lift transition-smooth">
              <div className="text-orange-500 font-mono text-sm">★★★★★</div>
              <p className="text-sm text-steel-700 dark:text-steel-300 leading-relaxed italic">
                &ldquo;VS Engineering fabricated 12 heavy base frames for our automated stamping line. The dimensional accuracy on mounting holes and weld quality exceeded our automotive OEM inspection criteria.&rdquo;
              </p>
              <div className="pt-3 border-t border-steel-100 dark:border-steel-800 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Rajesh Kulkarni"
                  className="w-10 h-10 rounded-full object-cover border-2 border-orange-500/30 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-navy-900 dark:text-white truncate">Rajesh Kulkarni</h4>
                  <p className="text-[11px] text-steel-500 truncate">VP Operations, Precision Auto</p>
                </div>
                <Badge variant="outline" size="sm">Pune, MH</Badge>
              </div>
            </Card>

            <Card className="p-6 space-y-4 hover-lift transition-smooth">
              <div className="text-orange-500 font-mono text-sm">★★★★★</div>
              <p className="text-sm text-steel-700 dark:text-steel-300 leading-relaxed italic">
                &ldquo;Their online quote submission and drawing revision process made procurement seamless. We tracked our CNC milled titanium brackets from raw material testing to final dispatch via their portal.&rdquo;
              </p>
              <div className="pt-3 border-t border-steel-100 dark:border-steel-800 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                  alt="Vikram Menon"
                  className="w-10 h-10 rounded-full object-cover border-2 border-orange-500/30 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-navy-900 dark:text-white truncate">Vikram Menon</h4>
                  <p className="text-[11px] text-steel-500 truncate">Lead Procurement, AeroTech</p>
                </div>
                <Badge variant="outline" size="sm">Bengaluru, KA</Badge>
              </div>
            </Card>

            <Card className="p-6 space-y-4 hover-lift transition-smooth">
              <div className="text-orange-500 font-mono text-sm">★★★★★</div>
              <p className="text-sm text-steel-700 dark:text-steel-300 leading-relaxed italic">
                &ldquo;When our crushing unit experienced a catastrophic spindle failure, VS Engineering manufactured custom EN24 spline shafts within 48 hours, saving our plant lakhs of rupees in idle downtime.&rdquo;
              </p>
              <div className="pt-3 border-t border-steel-100 dark:border-steel-800 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"
                  alt="Ananya Deshmukh"
                  className="w-10 h-10 rounded-full object-cover border-2 border-orange-500/30 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-navy-900 dark:text-white truncate">Ananya Deshmukh</h4>
                  <p className="text-[11px] text-steel-500 truncate">Plant Head, Heavy Infra Minerals</p>
                </div>
                <Badge variant="outline" size="sm">Ahmedabad, GJ</Badge>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
