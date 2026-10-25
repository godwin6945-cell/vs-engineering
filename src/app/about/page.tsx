import React from "react";
import Link from "next/link";
import { 
  Award, 
  ShieldCheck, 
  Users, 
  Building2, 
  Factory, 
  Gauge, 
  FileCheck, 
  MapPin, 
  CheckCircle2, 
  ArrowRight 
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function AboutPage() {
  const machineryList = [
    { name: "Doosan 5-Axis Machining Center (VMC)", size: "1500 x 800 x 700 mm", precision: "±0.005 mm", count: "3 Units" },
    { name: "Mazak CNC Turning Centers", size: "Ø 450 mm x 1200 mm Length", precision: "±0.008 mm", count: "6 Units" },
    { name: "12 kW CNC Fiber Laser Cutting Bed", size: "2500 x 6500 mm", precision: "±0.05 mm", count: "2 Units" },
    { name: "350-Ton CNC Synchronized Press Brake", size: "4000 mm Bending Length", precision: "±0.1 mm", count: "2 Units" },
    { name: "Carl Zeiss Coordinate Measuring Machine (CMM)", size: "1000 x 1200 x 800 mm", precision: "0.9 µm + L/350", count: "1 Unit" },
    { name: "Submerged Arc & Multi-Process Robotic Welding", size: "Up to 25 Tonne Assemblies", precision: "AWS / ASME Sec IX", count: "4 Stations" },
  ];

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-navy-950 text-white py-16 blueprint-pattern border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Badge variant="orange">About VS Engineering</Badge>
          <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tight text-white">
            Engineering Precision. Built for Indian Industry.
          </h1>
          <p className="text-steel-300 max-w-3xl text-base sm:text-lg leading-relaxed">
            Founded with a vision to deliver world-class precision machining and heavy industrial fabrication within India, VS Engineering operates state-of-the-art facilities compliant with ISO 9001:2015 standards.
          </p>
        </div>
      </section>

      {/* Story & Facility Overview */}
      <section className="py-16 bg-white dark:bg-navy-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-orange-500 font-bold">
                  Our Mission & Infrastructure
                </span>
                <h2 className="text-3xl font-display font-black text-navy-900 dark:text-steel-100">
                  Over 40,000 Sq. Ft. of Advanced Manufacturing Floor
                </h2>
              </div>
              <p className="text-sm text-steel-600 dark:text-steel-300 leading-relaxed">
                VS Engineering serves mission-critical sectors including Automotive OEMs, Aerospace fixtures, Power Generation skids, Earthmoving equipment, and Defense subcontracting across India.
              </p>
              <p className="text-sm text-steel-600 dark:text-steel-300 leading-relaxed">
                Our plant houses high-tonnage overhead gantry cranes, climate-controlled inspection rooms, fully equipped welding bays with certified AWS/ASME welders, and in-house shot blasting and epoxy painting booths.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-lg bg-steel-50 dark:bg-navy-950 border border-steel-200 dark:border-steel-800">
                  <div className="text-2xl font-mono font-bold text-navy-900 dark:text-white">40,000+</div>
                  <div className="text-xs text-steel-500 mt-1">Sq. Ft. Shop Floor Area</div>
                </div>
                <div className="p-4 rounded-lg bg-steel-50 dark:bg-navy-950 border border-steel-200 dark:border-steel-800">
                  <div className="text-2xl font-mono font-bold text-orange-500">25 MT</div>
                  <div className="text-xs text-steel-500 mt-1">Overhead Crane Handling</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl overflow-hidden border border-steel-200 dark:border-steel-800 shadow-md aspect-[4/3] group relative hover-lift transition-smooth">
                <img
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80"
                  alt="5-Axis CNC Precision Machining Bay"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded bg-navy-950/80 text-white backdrop-blur-xs">
                  5-Axis CNC Bay
                </span>
              </div>
              <div className="rounded-xl overflow-hidden border border-steel-200 dark:border-steel-800 shadow-md aspect-[4/3] group relative hover-lift transition-smooth">
                <img
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80"
                  alt="Robotic Welding & High-Tonnage Fabrication Cell"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded bg-navy-950/80 text-white backdrop-blur-xs">
                  Welding & Fab Cell
                </span>
              </div>
              <div className="rounded-xl overflow-hidden border border-steel-200 dark:border-steel-800 shadow-md aspect-[4/3] group relative hover-lift transition-smooth">
                <img
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80"
                  alt="Zeiss CMM Inspection & Metrology Room"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded bg-navy-950/80 text-white backdrop-blur-xs">
                  CMM Metrology Room
                </span>
              </div>
              <div className="rounded-xl overflow-hidden border border-steel-200 dark:border-steel-800 shadow-md aspect-[4/3] group relative hover-lift transition-smooth">
                <img
                  src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=600&q=80"
                  alt="Heavy Crane Material Handling & Assembly Yard"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded bg-navy-950/80 text-white backdrop-blur-xs">
                  25 MT Gantry Yard
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Machinery & Equipment Table */}
      <section className="py-16 bg-steel-50 dark:bg-navy-950 border-y border-steel-200 dark:border-steel-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <Badge variant="orange">Shop Floor Assets</Badge>
              <h2 className="text-3xl font-display font-black text-navy-900 dark:text-steel-100 tracking-tight mt-1">
                Machinery & Calibration Standards
              </h2>
            </div>
            <p className="text-xs text-steel-500 font-mono">
              All instruments calibrated annually by NABL-accredited test laboratories.
            </p>
          </div>

          <div className="bg-white dark:bg-navy-900 rounded-xl border border-steel-200 dark:border-steel-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-steel-100/70 dark:bg-navy-950 text-steel-700 dark:text-steel-300 font-mono text-xs uppercase border-b border-steel-200 dark:border-steel-800">
                    <th className="py-3.5 px-6">Equipment / Machine</th>
                    <th className="py-3.5 px-6">Working Envelope / Capacity</th>
                    <th className="py-3.5 px-6">Precision / Tolerance</th>
                    <th className="py-3.5 px-6">Qty Available</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-steel-100 dark:divide-steel-800 font-sans">
                  {machineryList.map((m, idx) => (
                    <tr key={idx} className="hover:bg-steel-50/50 dark:hover:bg-navy-800/50 transition-colors">
                      <td className="py-3.5 px-6 font-semibold text-navy-900 dark:text-steel-100">
                        {m.name}
                      </td>
                      <td className="py-3.5 px-6 text-steel-600 dark:text-steel-300 font-mono text-xs">
                        {m.size}
                      </td>
                      <td className="py-3.5 px-6 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-semibold">
                        {m.precision}
                      </td>
                      <td className="py-3.5 px-6 font-mono text-xs text-steel-500">
                        {m.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications & Quality System */}
      <section className="py-16 bg-white dark:bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-3 border-steel-200 dark:border-steel-800">
              <div className="w-10 h-10 rounded bg-navy-100 dark:bg-navy-950 text-navy-900 dark:text-orange-400 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-display font-bold text-navy-900 dark:text-steel-100">
                ISO 9001:2015 Certified
              </h3>
              <p className="text-xs text-steel-600 dark:text-steel-400 leading-relaxed">
                Certificate No: [ISO-9001-2015-VSE-INDIA]. Audited by TUV Rheinland for Quality Management Systems in Precision CNC & Heavy Structural Fabrication.
              </p>
            </Card>

            <Card className="p-6 space-y-3 border-steel-200 dark:border-steel-800">
              <div className="w-10 h-10 rounded bg-navy-100 dark:bg-navy-950 text-navy-900 dark:text-orange-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-display font-bold text-navy-900 dark:text-steel-100">
                WPS & PQR Qualified Welders
              </h3>
              <p className="text-xs text-steel-600 dark:text-steel-400 leading-relaxed">
                Welding Procedure Specifications (WPS) qualified under ASME Section IX and AWS D1.1 for carbon steels, stainless alloys, and high-tensile structural steel.
              </p>
            </Card>

            <Card className="p-6 space-y-3 border-steel-200 dark:border-steel-800">
              <div className="w-10 h-10 rounded bg-navy-100 dark:bg-navy-950 text-navy-900 dark:text-orange-400 flex items-center justify-center font-bold">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-display font-bold text-navy-900 dark:text-steel-100">
                Full Quality Dossier
              </h3>
              <p className="text-xs text-steel-600 dark:text-steel-400 leading-relaxed">
                Every customer order includes MTRs (Mill Test Reports), Dimensional Inspection Data Sheets, Heat Treatment Graphs, and Surface Treatment Thickness verification.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
