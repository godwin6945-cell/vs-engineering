"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Package,
  CreditCard,
  Layers,
  Boxes,
} from "lucide-react";

export function AdminNav() {
  const pathname = usePathname();

  const links = [
    { href: "/admin",            label: "Dashboard",  shortLabel: "Dash",      icon: LayoutDashboard },
    { href: "/admin/quotes",     label: "Quotes",     shortLabel: "Quotes",    icon: FileText },
    { href: "/admin/orders",     label: "Orders",     shortLabel: "Orders",    icon: Package },
    { href: "/admin/payments",   label: "Payments",   shortLabel: "Pay",       icon: CreditCard },
    { href: "/admin/materials",  label: "Materials",  shortLabel: "Materials", icon: Layers, highlight: true },
    { href: "/admin/stock",      label: "Stock",      shortLabel: "Stock",     icon: Boxes },
  ];

  return (
    <div className="bg-white dark:bg-navy-900 border-b border-steel-200 dark:border-steel-800 sticky top-16 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 overflow-x-auto py-2 no-scrollbar">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-lg whitespace-nowrap transition-all duration-200 text-[11px] sm:text-xs font-mono font-semibold shrink-0 ${
                  isActive
                    ? "bg-orange-500 text-white shadow-sm"
                    : link.highlight
                    ? "text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/40"
                    : "text-steel-600 dark:text-steel-400 hover:text-navy-900 dark:hover:text-white hover:bg-steel-100 dark:hover:bg-navy-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {/* Show short label on mobile, full label on sm+ */}
                <span className="sm:hidden">{link.shortLabel}</span>
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
