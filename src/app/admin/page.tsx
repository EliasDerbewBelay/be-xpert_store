import React from "react";
import type { Metadata } from "next";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Product catalog and inventory administration.",
};

export default function AdminPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AdminGuard>
        <AdminDashboardClient />
      </AdminGuard>
    </div>
  );
}
