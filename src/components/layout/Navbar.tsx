"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
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
  ChevronRight,
  Wrench,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "../ui/Button";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Services", href: "/services", icon: Layers },
    { name: "Gallery", href: "/gallery", icon: ImageIcon },
    { name: "Stock", href: "/stock", icon: ShoppingBag, badge: "Ready" },
    { name: "About", href: "/about", icon: Info },
    { name: "Contact", href: "/contact", icon: Phone },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* ── Top info bar (desktop only) ── */}
      <div className="hidden md:block bg-navy-900 text-steel-300 text-[11px] py-1 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              ISO 9001:2015 Precision Workshop • Coimbatore, Tamil Nadu
            </span>
            <span className="text-navy-600">|</span>
            <a href="tel:+919345804547" className="hover:text-orange-400 font-mono font-semibold">
              +91 93458 04547
            </a>
            <span className="text-navy-600">|</span>
            <a href="mailto:godwin6945@gmail.com" className="hover:text-orange-400 font-mono">
              godwin6945@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-steel-400">Timezone: Asia/Kolkata (IST)</span>
            <Link
              href="/admin"
              className="text-orange-400 hover:text-orange-300 flex items-center gap-1 font-mono text-xs font-bold"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Admin Desk
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main sticky navbar ── */}
      <header
        className={`sticky top-0 z-50 w-full border-b border-steel-200 dark:border-steel-800 bg-white/95 dark:bg-navy-950/95 backdrop-blur-md transition-shadow ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">

            {/* Brand logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group focus:outline-none shrink-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-navy-900 dark:bg-orange-500 text-white flex items-center justify-center font-display font-black text-base sm:text-xl shadow-md border border-navy-700 dark:border-orange-600 group-hover:scale-105 transition-transform shrink-0">
                VS
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-black text-sm sm:text-lg tracking-tight text-navy-900 dark:text-steel-50">
                  VS ENGINEERING
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono tracking-wider text-steel-500 dark:text-steel-400 uppercase mt-0.5 hidden xs:block">
                  Precision CNC &amp; Fabrication
                </span>
              </div>
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all relative flex items-center gap-1.5 ${
                      active
                        ? "text-orange-600 dark:text-orange-400 font-semibold bg-orange-50/60 dark:bg-orange-950/30"
                        : "text-steel-700 dark:text-steel-300 hover:text-navy-900 dark:hover:text-white hover:bg-steel-50 dark:hover:bg-navy-900"
                    }`}
                  >
                    {link.name}
                    {link.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 rounded font-mono">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop right actions */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3">
              <ThemeToggle />
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-1.5 text-steel-700 dark:text-steel-300">
                  <User className="w-4 h-4 text-steel-500" />
                  <span className="hidden lg:inline">Customer Portal</span>
                </Button>
              </Link>
              <Link href="/quote">
                <Button variant="orange" size="sm" className="shadow-orange-500/20 shadow-md gap-1.5">
                  <FileText className="w-4 h-4" />
                  <span className="hidden lg:inline">Request a Quote</span>
                  <span className="lg:hidden">Quote</span>
                </Button>
              </Link>
            </div>

            {/* Mobile right: theme toggle + hamburger */}
            <div className="flex md:hidden items-center gap-1.5">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-steel-700 dark:text-steel-300 hover:bg-steel-100 dark:hover:bg-navy-900 focus:outline-none transition-colors"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile full-screen slide-down drawer ── */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-steel-200 dark:border-steel-800 bg-white dark:bg-navy-950 shadow-xl">
            {/* Contact quick strip */}
            <div className="bg-navy-900 px-4 py-2.5 flex items-center justify-between">
              <a
                href="tel:+919345804547"
                className="text-orange-400 font-mono text-xs font-bold flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                +91 93458 04547
              </a>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-steel-400 font-mono text-xs flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                Admin
              </Link>
            </div>

            {/* Nav links */}
            <nav className="px-3 pt-3 pb-2 flex flex-col gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-colors ${
                      active
                        ? "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400"
                        : "text-steel-700 dark:text-steel-200 hover:bg-steel-50 dark:hover:bg-navy-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${active ? "bg-orange-100 dark:bg-orange-900/40" : "bg-steel-100 dark:bg-navy-800"}`}>
                        <Icon className={`w-4 h-4 ${active ? "text-orange-600 dark:text-orange-400" : "text-steel-500 dark:text-steel-400"}`} />
                      </div>
                      <span>{link.name}</span>
                      {link.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 rounded font-mono">
                          {link.badge}
                        </span>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-steel-400" />
                  </Link>
                );
              })}
            </nav>

            {/* CTA buttons */}
            <div className="px-4 pb-5 pt-2 border-t border-steel-100 dark:border-steel-800 flex flex-col gap-2.5 mt-1">
              <Link href="/quote" onClick={() => setMobileMenuOpen(false)} className="w-full">
                <Button variant="orange" className="w-full justify-center gap-2 h-12 text-sm font-bold">
                  <FileText className="w-4 h-4" />
                  Request a Quote
                </Button>
              </Link>
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="w-full">
                <Button variant="secondary" className="w-full justify-center gap-2 h-11 text-sm">
                  <User className="w-4 h-4" />
                  Customer Login / Orders
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
