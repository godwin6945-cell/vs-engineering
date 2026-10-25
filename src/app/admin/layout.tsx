import React from "react";
import { AdminNav } from "@/components/layout/AdminNav";

export const metadata = {
  title: "Admin Operations Control | VS Engineering",
  description: "Operations desk for quotes, production, dispatch, UPI payments, and raw material pricing master.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-steel-50 dark:bg-navy-950 transition-colors">
      <AdminNav />
      {children}
    </div>
  );
}
