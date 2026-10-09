import React from "react";
import type { Metadata } from "next";
import { AdminOverview } from "@/components/admin/AdminOverview";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Be-xpert Store administration overview.",
};

export default function AdminPage() {
  return <AdminOverview />;
}
