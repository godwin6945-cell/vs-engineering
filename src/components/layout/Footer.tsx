import React from "react";
import Link from "next/link";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Award, 
  ArrowRight,
  Compass,
  FileText,
  CreditCard
} from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-950 text-steel-300 border-t border-navy-800">
      {/* Pre-footer Call to Action */}
      <div className="border-b border-navy-800/80 bg-navy-900/50 blueprint-pattern py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-2xl font-display font-bold text-white tracking-tight">
              Ready to manufacture your precision components?
            </h3>
            <p className="text-steel-400 text-sm max-w-xl">
              Upload your 2D/3D engineering drawings (PDF, DWG, STEP) for rapid quoting within 4 working hours.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-6 py-3 rounded-md shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5"
            >
              <FileText className="w-4 h-4" />
              Get Instant Quote
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-steel-800/80 hover:bg-steel-700 text-steel-200 font-medium text-sm px-5 py-3 rounded-md border border-steel-700 transition-all"
            >
              Consult Our Engineers
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Company Identity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-orange-500 text-white flex items-center justify-center font-display font-black text-lg">
              VS
            </div>
            <div>
              <span className="font-display font-black text-xl text-white tracking-tight">
                VS ENGINEERING
              </span>
              <p className="text-xs text-orange-400 font-mono tracking-wider">
                PRECISION MACHINING & FABRICATION
              </p>
            </div>
          </div>

          <p className="text-sm text-steel-400 leading-relaxed max-w-md">
            Premier Indian engineering enterprise specializing in CNC 3/4/5-axis milling, precision lathe turning, heavy structural fabrication, sheet metal laser cutting, and turnkey sub-assemblies.
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-navy-900 border border-navy-700 rounded text-steel-300 font-mono">
              <Award className="w-3.5 h-3.5 text-orange-400" /> ISO 9001:2015
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-navy-900 border border-navy-700 rounded text-steel-300 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> MSME Registered
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-navy-900 border border-navy-700 rounded text-steel-300 font-mono">
              <CreditCard className="w-3.5 h-3.5 text-sky-400" /> GST Compliant
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
            Engineering Services
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/services#cnc" className="hover:text-orange-400 transition-colors">
                CNC Precision Milling & Turning
              </Link>
            </li>
            <li>
              <Link href="/services#fabrication" className="hover:text-orange-400 transition-colors">
                Heavy Industrial Fabrication
              </Link>
            </li>
            <li>
              <Link href="/services#laser" className="hover:text-orange-400 transition-colors">
                Fiber Laser Sheet Cutting
              </Link>
            </li>
            <li>
              <Link href="/services#spares" className="hover:text-orange-400 transition-colors">
                Custom Spares & Tooling
              </Link>
            </li>
            <li>
              <Link href="/services#assemblies" className="hover:text-orange-400 transition-colors">
                Turnkey Mechanical Sub-Assemblies
              </Link>
            </li>
            <li>
              <Link href="/stock" className="text-orange-400 hover:text-orange-300 font-medium transition-colors flex items-center gap-1">
                Stock & Ready Inventory <ArrowRight className="w-3 h-3" />
              </Link>
            </li>
          </ul>
        </div>

        {/* Portals & Trust */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
            Portals & Resources
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/quote" className="hover:text-orange-400 transition-colors">
                Submit Drawing for Quote
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-orange-400 transition-colors">
                Customer Order Tracking
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:text-orange-400 transition-colors">
                Manufacturing Gallery
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-orange-400 transition-colors">
                Machinery & Quality Lab
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-orange-400 transition-colors">
                Bank & Payment Details
              </Link>
            </li>
            <li>
              <Link href="/admin" className="text-steel-400 hover:text-white transition-colors">
                Admin Operations
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info (India Specific) */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
            Works & Office
          </h4>
          <ul className="space-y-2.5 text-xs text-steel-400">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <span>
                <strong>Works:</strong> VS Engineering Works, Coimbatore, Tamil Nadu, India
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-orange-400 shrink-0" />
              <a href="tel:+919345804547" className="hover:text-orange-400 font-mono">
                +91 93458 04547
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-orange-400 shrink-0" />
              <a href="mailto:godwin6945@gmail.com" className="hover:text-orange-400 font-mono">
                godwin6945@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <span>
                Mon - Sat: 08:30 AM – 07:30 PM IST<br />
                Sunday: Emergency Spares Only
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="border-t border-navy-900 bg-navy-950 py-6 px-4 sm:px-6 lg:px-8 text-xs text-steel-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} VS Engineering (India) Private Limited. All rights reserved.
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>GSTIN: [GSTIN: 33AAAAA0000A1Z5]</span>
            <span>•</span>
            <span>HSN Codes: 8466 / 7326 / 8483</span>
            <span>•</span>
            <span>Currency: INR (₹)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
