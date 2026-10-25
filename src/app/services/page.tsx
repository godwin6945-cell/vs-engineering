import React from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Cpu, 
  Settings2, 
  FileText, 
  ShieldCheck, 
  Flame, 
  Wrench,
  Download
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function ServicesPage() {
  const services = [
    {
      id: "cnc",
      title: "CNC Precision Milling & Turning",
      lead: "High-complexity 3-axis, 4-axis, and 5-axis simultaneous machining for high-tolerance mechanical parts.",
      specs: [
        { label: "Milling Envelope", val: "Up to 1500 × 800 × 700 mm" },
        { label: "Turning Envelope", val: "Up to Ø 450 mm × 1200 mm Length" },
        { label: "Dimensional Tolerance", val: "± 0.005 mm (5 microns)" },
        { label: "Surface Finish", val: "Ra 0.4 µm to Ra 1.6 µm" },
      ],
      materials: ["Stainless Steel (SS304, SS316L, 17-4 PH)", "Alloy Steels (EN8, EN19, EN24, EN31)", "Aluminum Alloys (6061-T6, 7075-T6)", "Brass, Bronze & Copper", "Engineering Plastics (Delrin, PEEK, Nylon)"],
      applications: ["Aerospace tooling & fixture jigs", "Automotive transmission prototypes", "Hydraulic manifold blocks", "Medical device housing assemblies"],
      image: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "fabrication",
      title: "Heavy Industrial Fabrication",
      lead: "Engineered structural fabrication for high-stress applications, machine beds, pressure vessels, and furnace structures.",
      specs: [
        { label: "Lifting Capacity", val: "Single piece up to 25 Metric Tonnes" },
        { label: "Welding Certifications", val: "ASME Sec IX & AWS D1.1 Certified Welders" },
        { label: "Non-Destructive Testing", val: "Ultrasonic (UT), Dye Penetrant (DPT), Radiography (RT)" },
        { label: "Surface Treatment", val: "Shot blasting SA 2.5 + Epoxy primer & PU topcoat" },
      ],
      materials: ["Structural Carbon Steel (IS 2062 Grade A/B/E250/E350)", "Boiler Quality Steel (SA 516 Gr 70)", "Wear Resistant Steel (Hardox 400/500)", "Austenitic Stainless Steel (SS304/SS316)"],
      applications: ["Heavy equipment base frames & chassis", "Skid mounted process modules", "Material handling conveyor gantries", "Cement & mining plant ducting"],
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "laser",
      title: "Fiber Laser Cutting & Precision Bending",
      lead: "High-speed 12 kW CNC laser cutting combined with 350T synchronized press brake forming.",
      specs: [
        { label: "Cutting Table Size", val: "2500 mm × 6500 mm dual shuttle table" },
        { label: "Cutting Thickness", val: "MS up to 32 mm, SS up to 25 mm, Aluminum up to 20 mm" },
        { label: "Bending Length", val: "Up to 4000 mm with multi-axis CNC crowning" },
        { label: "Edge Quality", val: "Dross-free high-pressure Nitrogen cutting" },
      ],
      materials: ["Mild Steel (CRCA, HR, IS 2062)", "Stainless Steel (2B, No. 4, Mirror)", "Aluminum Sheets (1050, 5052, 6082)", "Copper & Brass Shims"],
      applications: ["Control panel enclosures & cabinets", "Perforated architectural facade panels", "Heavy equipment bracketry & gussets", "Custom sheet metal chassis"],
      image: "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "spares",
      title: "Custom Spares & Industrial Tooling",
      lead: "Reverse engineering, breakdown emergency replacement, and custom OEM precision wear parts.",
      specs: [
        { label: "Emergency Rush Production", val: "48 to 72 hours express dispatch" },
        { label: "Heat Treatment Capabilities", val: "Induction hardening, Case carburizing, Nitriding" },
        { label: "Gear Cutting", val: "Spur, Helical & Bevel gears up to Module 12" },
        { label: "Reverse Engineering", val: "3D Laser scanning & CMM coordinate mapping" },
      ],
      materials: ["Tool Steels (D2, D3, H13, O1)", "High Tensile Alloy Steels", "Phosphor Bronze (PB1, PB2)", "Tungsten Carbide wear inserts"],
      applications: ["Industrial gearboxes & spline shafts", "High pressure pump impellers & sleeves", "Extruder screws & barrel liners", "Stamping dies & punch sets"],
      image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-navy-950 text-white py-16 blueprint-pattern border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Badge variant="orange">Capabilities & Specifications</Badge>
          <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tight text-white">
            Comprehensive Industrial Engineering Services
          </h1>
          <p className="text-steel-300 max-w-3xl text-base sm:text-lg leading-relaxed">
            Delivering end-to-end manufacturing solutions under one roof—from CAD drawing review and raw material sourcing with MTC, to CNC machining, certified welding, and CMM inspection.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 bg-steel-50 dark:bg-navy-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {services.map((svc, idx) => (
            <div
              key={svc.id}
              id={svc.id}
              className="bg-white dark:bg-navy-950 border border-steel-200 dark:border-steel-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 p-5 lg:p-10 items-start lg:items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-orange-500 font-bold">
                      Service Code: #{svc.id.toUpperCase()}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-display font-bold text-navy-900 dark:text-steel-100 mt-1">
                      {svc.title}
                    </h2>
                    <p className="text-sm text-steel-600 dark:text-steel-300 mt-2 leading-relaxed">
                      {svc.lead}
                    </p>
                  </div>

                  {/* Technical Specifications */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2">
                    {svc.specs.map((s, i) => (
                      <div key={i} className="p-3 rounded-lg bg-steel-50 dark:bg-navy-900 border border-steel-100 dark:border-steel-800">
                        <span className="text-[11px] font-mono text-steel-500 uppercase block">{s.label}</span>
                        <span className="text-xs font-mono font-bold text-navy-900 dark:text-steel-100">{s.val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Materials */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-steel-500 font-semibold block">
                      Common Materials Handled:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {svc.materials.map((m, i) => (
                        <span key={i} className="text-xs font-mono px-2.5 py-1 bg-steel-100 dark:bg-navy-800 text-steel-800 dark:text-steel-200 rounded border border-steel-200 dark:border-steel-700">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-steel-100 dark:border-steel-800">
                    <Link href={`/quote?service=${svc.id}`} className="w-full sm:w-auto">
                      <Button variant="orange" size="md" className="w-full justify-center">
                        <FileText className="w-4 h-4 mr-1.5" />
                        Request Quote for this Service
                      </Button>
                    </Link>
                    <Link href="/gallery" className="w-full sm:w-auto">
                      <Button variant="outline" size="md" className="w-full justify-center">
                        View Samples in Gallery
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-5 mt-2 lg:mt-0">
                  <div className="rounded-xl overflow-hidden border border-steel-200 dark:border-steel-800 shadow-md">
                    <img
                      src={svc.image}
                      alt={svc.title}
                      className="w-full h-48 sm:h-64 lg:h-80 object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
