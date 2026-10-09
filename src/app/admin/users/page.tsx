import React from "react";
import type { Metadata } from "next";
import { AdminUsersClient } from "@/components/admin/AdminUsersClient";

export const metadata: Metadata = {
  title: "Admin Users",
  description: "View Be-xpert Store registered users.",
};

export default function AdminUsersPage() {
  return <AdminUsersClient />;
}
