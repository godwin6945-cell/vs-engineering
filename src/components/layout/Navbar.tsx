"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Wrench, 
  Menu, 
  X, 
  FileText, 
  Layers, 
  Image as ImageIcon, 
  Info, 
  Phone, 
  ShoppingBag, 
  User, 
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "../ui/Button";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Services", href: "/services", icon: Layers },
    { name: "Gallery", href: "/gallery", icon: ImageIcon },
    { name: "Available Stock", href: "/stock", icon: ShoppingBag, badge: "Ready" },
    { name: "About Us", href: "/about", icon: Info },
    { name: "Contact", href: "/contact", icon: Phone },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-steel-200 dark:border-steel-800 bg-white/95 dark:bg-navy-950/95 backdrop-blur-md transition-colors">
      {/* Top micro bar for Indian industrial context */}
      <div className="hidden md:block bg-navy-900 text-steel-300 text-[11px] py-1 px-4 border-b border-navy-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              ISO 9001:2015 Precision Workshop • Coimbatore, Tamil Nadu
            </span>
            <span className="text-navy-600">|</span>
            <a href="tel:+919345804547" className="hover:text-orange-400 font-mono font-semibold">
              Call / WhatsApp: +91 93458 04547
            </a>
            <span className="text-navy-600">|</span>
            <a href="mailto:godwin6945@gmail.com" className="hover:text-orange-400 font-mono">
              godwin6945@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-steel-400">Timezone: Asia/Kolkata (IST)</span>
            <Link href="/admin" className="text-orange-400 hover:text-orange-300 flex items-center gap-1 font-mono text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> Admin Desk
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="w-11 h-11 rounded-lg bg-navy-900 dark:bg-orange-500 text-white flex items-center justify-center font-display font-black text-xl shadow-md border border-navy-700 dark:border-orange-600 group-hover:scale-105 transition-transform">
              VS
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-lg tracking-tight text-navy-900 dark:text-steel-50 leading-none">
                VS ENGINEERING
              </span>
              <span className="text-[10px] font-mono tracking-widest text-steel-500 dark:text-steel-400 uppercase mt-1">
                Precision CNC & Fabrication • India
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all relative ${
                    active
                      ? "text-orange-600 dark:text-orange-400 font-semibold bg-orange-50/60 dark:bg-orange-950/30"
                      : "text-steel-700 dark:text-steel-300 hover:text-navy-900 dark:hover:text-white hover:bg-steel-50 dark:hover:bg-navy-900"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {link.name}
                    {link.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 rounded font-mono">
                        {link.badge}
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-1.5 text-steel-700 dark:text-steel-300">
                <User className="w-4 h-4 text-steel-500" />
                Customer Portal
              </Button>
            </Link>

            <Link href="/quote">
              <Button variant="orange" size="sm" className="shadow-orange-500/20 shadow-md">
                <FileText className="w-4 h-4" />
                Request a Quote
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-steel-700 dark:text-steel-300 hover:bg-steel-100 dark:hover:bg-navy-900 focus:outline-none"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-steel-200 dark:border-steel-800 bg-white dark:bg-navy-950 px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive(link.href)
                      ? "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400"
                      : "text-steel-700 dark:text-steel-300 hover:bg-steel-50 dark:hover:bg-navy-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-steel-500" />
                    <span>{link.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-steel-400" />
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-steel-200 dark:border-steel-800 flex flex-col gap-2">
            <Link href="/quote" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="orange" className="w-full justify-center">
                <FileText className="w-4 h-4" />
                Request a Quote
              </Button>
            </Link>
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="secondary" className="w-full justify-center">
                <User className="w-4 h-4" />
                Customer Login / Orders
              </Button>
            </Link>
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" size="sm" className="w-full justify-center text-xs text-steel-500">
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Team Portal
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
