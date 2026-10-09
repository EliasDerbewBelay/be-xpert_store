import React from "react";
import type { Metadata } from "next";
import { AdminCategoriesClient } from "@/components/admin/AdminCategoriesClient";

export const metadata: Metadata = {
  title: "Admin Categories",
  description: "Browse Be-xpert Store categories.",
};

export default function AdminCategoriesPage() {
  return <AdminCategoriesClient />;
}
