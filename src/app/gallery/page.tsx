"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Maximize2, 
  Layers, 
  Filter, 
  X, 
  CheckCircle2, 
  ArrowRight,
  FileText
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface GalleryItem {
  id: string;
  title: string;
  category: "cnc" | "fabrication" | "laser" | "spares";
  categoryLabel: string;
  image: string;
  material: string;
  tolerance: string;
  industry: string;
  location: string;
  description: string;
}

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const items: GalleryItem[] = [
    {
      id: "gal-1",
      title: "5-Axis Aerospace Fixture Housing",
      category: "cnc",
      categoryLabel: "CNC Machining",
      image: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=1000&q=80",
      material: "Aviation Grade Aluminum 7075-T6",
      tolerance: "± 0.005 mm",
      industry: "Aerospace & Defense",
      location: "Bengaluru, Karnataka",
      description: "Complex monolithic fixture pocketed from solid billet with deep 5-axis undercut pockets and tight bore alignments."
    },
    {
      id: "gal-2",
      title: "20-Tonne Automated Machine Base Frame",
      category: "fabrication",
      categoryLabel: "Heavy Fabrication",
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1000&q=80",
      material: "IS 2062 E350 Structural Steel",
      tolerance: "± 0.5 mm post-stress-relieve",
      industry: "Automotive Press Shop",
      location: "Pune, Maharashtra",
      description: "Heavy structural box girder fabrication, thermal stress-relieved in furnace with 100% UT weld inspection."
    },
    {
      id: "gal-3",
      title: "12 kW Laser Cut High-Pressure Flanges",
      category: "laser",
      categoryLabel: "Sheet Metal & Laser",
      image: "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?auto=format&fit=crop&w=1000&q=80",
      material: "Stainless Steel 316L (20mm Plate)",
      tolerance: "± 0.08 mm",
      industry: "Oil & Gas Pipeline",
      location: "Jamnagar, Gujarat",
      description: "Dross-free high-pressure nitrogen laser cutting with bevel edge preparation for automated orbital welding."
    },
    {
      id: "gal-4",
      title: "Hardened Spline Shaft & Helical Pinion",
      category: "spares",
      categoryLabel: "Tooling & Spares",
      image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1000&q=80",
      material: "EN24 Alloy Steel (Case Hardened 58 HRC)",
      tolerance: "± 0.008 mm (Ground Teeth)",
      industry: "Mining & Heavy Excavation",
      location: "Coimbatore, Tamil Nadu",
      description: "Reverse-engineered replacement drive shaft for 50-tonne crusher gearbox delivered within 72 hours of breakdown."
    },
    {
      id: "gal-5",
      title: "Hydraulic Manifold Distribution Block",
      category: "cnc",
      categoryLabel: "CNC Machining",
      image: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&w=1000&q=80",
      material: "Continuous Cast Ductile Iron 65-45-12",
      tolerance: "± 0.01 mm",
      industry: "Industrial Automation",
      location: "Chennai, Tamil Nadu",
      description: "High-density cross-drilled internal galleries rated for 350 bar continuous operating pressure without internal leakage."
    },
    {
      id: "gal-6",
      title: "Stainless Steel Cyclone Dust Separator Skid",
      category: "fabrication",
      categoryLabel: "Heavy Fabrication",
      image: "https://images.unsplash.com/photo-1581094651181-35942459ef62?auto=format&fit=crop&w=1000&q=80",
      material: "SS304 Food & Pharma Grade",
      tolerance: "± 1.0 mm",
      industry: "Pharmaceutical Processing",
      location: "Hyderabad, Telangana",
      description: "Sanitary TIG welding with internal mirror polish (Ra < 0.8 µm) for clean-in-place (CIP) pharma installations."
    },
    {
      id: "gal-7",
      title: "Robotic Seam-Welded Pressure Vessel Manway",
      category: "fabrication",
      categoryLabel: "Heavy Fabrication",
      image: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&w=1000&q=80",
      material: "SA 516 Grade 70 Boiler Plate",
      tolerance: "ASME Sec VIII Div 1",
      industry: "Chemical & Fertilizer",
      location: "Dahej, Gujarat",
      description: "Multi-pass submerged arc welding with full radiographic testing (RT) and hydrostatic pressure test certificate."
    },
    {
      id: "gal-8",
      title: "Coordinate Metrology & Surface Roughness Verification",
      category: "cnc",
      categoryLabel: "CNC Machining",
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1000&q=80",
      material: "Inconel 718 Turbine Rotor",
      tolerance: "± 0.002 mm (Sub-micron)",
      industry: "Power Generation",
      location: "Trichy, Tamil Nadu",
      description: "Comprehensive Zeiss 3D CMM inspection report with 100% geometric dimensioning and tolerancing (GD&T) validation."
    }
  ];

  const categories = [
    { id: "all", label: "All Engineering Works" },
    { id: "cnc", label: "CNC Machining" },
    { id: "fabrication", label: "Heavy Fabrication" },
    { id: "laser", label: "Sheet Metal & Laser" },
    { id: "spares", label: "Spares & Tooling" },
  ];

  const filteredItems = selectedCategory === "all"
    ? items
    : items.filter((item) => item.category === selectedCategory);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-navy-950 text-white py-16 blueprint-pattern border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Badge variant="orange">Work Showcase</Badge>
          <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tight text-white">
            Manufacturing & Fabrication Gallery
          </h1>
          <p className="text-steel-300 max-w-2xl text-base sm:text-lg">
            Inspect a selection of our delivered components, heavy assemblies, and reverse-engineered precision spares produced for leading Indian enterprises.
          </p>
        </div>
      </section>

      {/* Filter and Grid */}
      <section className="py-12 bg-steel-50 dark:bg-navy-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 sm:flex-wrap">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3.5 py-2 rounded-full text-xs font-mono font-medium whitespace-nowrap transition-all shrink-0 ${
                  selectedCategory === c.id
                    ? "bg-navy-900 text-white dark:bg-orange-500 shadow-md font-bold"
                    : "bg-white dark:bg-navy-950 text-steel-700 dark:text-steel-300 border border-steel-200 dark:border-steel-800 hover:border-steel-400"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className="group cursor-pointer bg-white dark:bg-navy-950 rounded-xl border border-steel-200 dark:border-steel-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-orange-500/50 hover-lift transition-smooth flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-steel-900">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-navy-950/20 group-hover:bg-navy-950/0 transition-colors" />
                  <div className="absolute top-3 left-3">
                    <Badge variant="orange" size="sm">
                      {item.categoryLabel}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="p-2 rounded-full bg-navy-900/90 text-white flex items-center justify-center">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-base font-display font-bold text-navy-900 dark:text-steel-100 group-hover:text-orange-500 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-steel-500 dark:text-steel-400 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-steel-100 dark:border-steel-800 space-y-1 text-[11px] font-mono text-steel-500">
                    <div className="flex justify-between">
                      <span>Material:</span>
                      <span className="text-steel-800 dark:text-steel-200 font-semibold">{item.material}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tolerance:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{item.tolerance}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="w-full max-w-3xl bg-white dark:bg-navy-900 rounded-2xl border border-steel-200 dark:border-steel-800 overflow-hidden shadow-2xl animate-in zoom-in-95 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/9] bg-steel-950">
              <img
                src={activeItem.image}
                alt={activeItem.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-navy-900/80 text-white hover:bg-navy-900 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
                <Badge variant="orange">{activeItem.categoryLabel}</Badge>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-navy-900 dark:text-steel-100">
                    {activeItem.title}
                  </h3>
                  <p className="text-xs font-mono text-steel-500 mt-1">
                    Delivered to: {activeItem.industry} • {activeItem.location}
                  </p>
                </div>
                <Link href={`/quote?ref=${activeItem.id}`} className="w-full sm:w-auto">
                  <Button variant="orange" size="sm" className="w-full justify-center">
                    <FileText className="w-4 h-4 mr-1" />
                    Quote Similar Part
                  </Button>
                </Link>
              </div>

              <p className="text-sm text-steel-600 dark:text-steel-300 leading-relaxed">
                {activeItem.description}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-steel-100 dark:border-steel-800 font-mono text-xs">
                <div className="p-3 rounded bg-steel-50 dark:bg-navy-950 border border-steel-200 dark:border-steel-800">
                  <span className="text-steel-500 block text-[10px] uppercase">Specification Material</span>
                  <span className="font-semibold text-navy-900 dark:text-steel-100">{activeItem.material}</span>
                </div>
                <div className="p-3 rounded bg-steel-50 dark:bg-navy-950 border border-steel-200 dark:border-steel-800">
                  <span className="text-steel-500 block text-[10px] uppercase">Achieved Tolerance</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{activeItem.tolerance}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
