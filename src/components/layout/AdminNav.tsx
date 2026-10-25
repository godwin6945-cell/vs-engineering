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
  Boxes 
} from "lucide-react";

export function AdminNav() {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/quotes", label: "Quotes & Costing", icon: FileText },
    { href: "/admin/orders", label: "Production & Orders", icon: Package },
    { href: "/admin/payments", label: "Payment Verification", icon: CreditCard },
    { href: "/admin/materials", label: "Materials & Pricing Master", icon: Layers, highlight: true },
    { href: "/admin/stock", label: "Stock Inventory", icon: Boxes },
  ];

  return (
    <div className="bg-white dark:bg-navy-900 border-b border-steel-200 dark:border-steel-800 sticky top-16 z-20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 no-scrollbar text-xs font-mono">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "bg-orange-500 text-white font-bold shadow-xs"
                    : link.highlight
                    ? "text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/40 font-semibold"
                    : "text-steel-600 dark:text-steel-400 hover:text-navy-900 dark:hover:text-white hover:bg-steel-100 dark:hover:bg-navy-800"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : ""}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
