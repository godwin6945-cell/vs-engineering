"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShoppingBag, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Truck, 
  Layers, 
  PhoneCall,
  Search,
  Tag
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { formatINR } from "@/lib/utils";

interface StockItemData {
  id: string;
  sku: string;
  title: string;
  category: string;
  description: string;
  quantity: number;
  unit: string;
  price: number | null; // null means 'Price on Request'
  leadTime: string;
  image: string;
  specs: string[];
}

export default function StockCatalogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const stockItems: StockItemData[] = [
    {
      id: "stk-01",
      sku: "VSE-STK-SS316-FLANGE",
      title: "Precision Blind Flanges ANSI B16.5 Class 150 (SS316L)",
      category: "Piping & Flanges",
      description: "Forged and CNC finished blind flanges with raised face (RF). Ultrasonic tested with 3.1 MTC inspection certification.",
      quantity: 48,
      unit: "Pieces",
      price: 2450,
      leadTime: "Immediate Dispatch (24h)",
      image: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80",
      specs: ["Size: 4\" (DN100) Class 150", "Material: ASTM A182 F316L", "MTC: Available with Heat No."]
    },
    {
      id: "stk-02",
      sku: "VSE-STK-MS-BASE-1200",
      title: "Vibration Dampening Machine Mounting Sub-Bases",
      category: "Structural Fabrication",
      description: "Pre-fabricated heavy steel mounting bases with machined leveling pad surfaces and M24 anchor hole pattern.",
      quantity: 12,
      unit: "Sets",
      price: 18500,
      leadTime: "Ready in Yard",
      image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
      specs: ["Dimensions: 1200 × 800 × 250 mm", "Material: IS 2062 Grade E250", "Coating: Red Oxide Epoxy Primer"]
    },
    {
      id: "stk-03",
      sku: "VSE-STK-EN24-SHAFT",
      title: "Pre-Turned & Centered EN24T Alloy Steel Shaft Blanks",
      category: "Raw Material & Spares",
      description: "Rough-turned round bar stock with normalized grain structure, ready for finishing splines or gear hobbing.",
      quantity: 35,
      unit: "Bars",
      price: 4800,
      leadTime: "Immediate Dispatch",
      image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
      specs: ["Diameter: Ø 90 mm × 850 mm Length", "Hardness: 28-32 HRC (T Condition)", "Straightness: 0.2 mm/meter"]
    },
    {
      id: "stk-04",
      sku: "VSE-STK-HYD-BLOCK-6P",
      title: "NG6 (D03) Standard 6-Station Hydraulic Subplate",
      category: "Hydraulic Spares",
      description: "Precision CNC milled ductile iron manifold block with standard ISO 4401-03 mounting pattern and cavity testing.",
      quantity: 15,
      unit: "Units",
      price: 12500,
      leadTime: "Ready in Warehouse",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      specs: ["Max Pressure: 315 Bar", "Port Size: G 3/8\" BSPP", "Surface: Black Phosphated"]
    },
    {
      id: "stk-05",
      sku: "VSE-STK-BRONZE-BUSH-80",
      title: "Phosphor Bronze Self-Lubricating Bushings (Ø80mm x 120mm)",
      category: "Raw Material & Spares",
      description: "SAE 660 continuous cast bronze bushings with spiral internal oil grooves for heavy pivot pins.",
      quantity: 40,
      unit: "Pieces",
      price: 1850,
      leadTime: "Immediate Dispatch (24h)",
      image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80",
      specs: ["Bore: Ø 80 mm ±0.015", "Material: CuSn8 Phosphor Bronze", "Grease Groove: Dual Figure-8"]
    },
    {
      id: "stk-06",
      sku: "VSE-STK-LASER-GUSSET-10",
      title: "Pre-Cut Laser Gussets & Mounting Ribs (10mm MS IS2062)",
      category: "Structural Fabrication",
      description: "Fiber laser cut structural gussets with chamfered weld prep edges for automated machine frame stiffening.",
      quantity: 250,
      unit: "Pieces",
      price: 320,
      leadTime: "Immediate Dispatch",
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
      specs: ["Plate: 10 mm IS 2062 Grade B", "Edge: 35° Bevel Prepped", "Surface: Shot blasted SA 2.5"]
    }
  ];

  const categories = ["all", "Piping & Flanges", "Structural Fabrication", "Raw Material & Spares", "Hydraulic Spares"];

  const filtered = stockItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-navy-950 text-white py-16 blueprint-pattern border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Badge variant="orange">Immediate Availability</Badge>
          <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tight text-white">
            Available Stock & Ready Inventory
          </h1>
          <p className="text-steel-300 max-w-2xl text-base sm:text-lg">
            Pre-engineered machinery bases, precision flange sets, turned shaft blanks, and standard hydraulic components ready for rapid 24-hour dispatch across India.
          </p>
        </div>
      </section>

      {/* Catalog */}
      <section className="py-12 bg-steel-50 dark:bg-navy-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white dark:bg-navy-950 p-4 rounded-xl border border-steel-200 dark:border-steel-800 shadow-sm">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-steel-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by part title, SKU, or specification..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-steel-50 dark:bg-navy-900 border border-steel-200 dark:border-steel-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-steel-900 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-3 py-1.5 rounded-md text-xs font-mono whitespace-nowrap transition-all ${
                    selectedCategory === c
                      ? "bg-navy-900 text-white dark:bg-orange-500 font-semibold"
                      : "bg-steel-100 dark:bg-navy-900 text-steel-600 dark:text-steel-300 hover:bg-steel-200"
                  }`}
                >
                  {c === "all" ? "All Categories" : c}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((item) => (
              <Card key={item.id} className="flex flex-col justify-between hover:shadow-xl hover-lift transition-smooth border-steel-200 dark:border-steel-800">
                <div>
                  <div className="relative aspect-video overflow-hidden bg-steel-900">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge variant="orange" size="sm">
                        {item.quantity} {item.unit} In Stock
                      </Badge>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-mono text-steel-500">
                      <span>{item.category}</span>
                      <span className="text-orange-600 dark:text-orange-400 font-bold">{item.sku}</span>
                    </div>

                    <h3 className="text-base font-display font-bold text-navy-900 dark:text-steel-100 line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-xs text-steel-500 dark:text-steel-400 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="pt-2 border-t border-steel-100 dark:border-steel-800 space-y-1 text-[11px] font-mono text-steel-600 dark:text-steel-400">
                      {item.specs.map((s, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-steel-100 dark:border-steel-800 mt-4">
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-xs text-steel-500 font-mono">Unit Price:</span>
                    <span className="text-lg font-mono font-bold text-navy-900 dark:text-white">
                      {item.price ? formatINR(item.price) : "Price on Request"}
                    </span>
                  </div>

                  <Link href={`/quote?stockSku=${item.sku}&stockTitle=${encodeURIComponent(item.title)}`}>
                    <Button variant="orange" size="sm" className="w-full justify-center">
                      <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
                      Reserve / Order Stock
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
