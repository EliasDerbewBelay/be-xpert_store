import React, { Suspense } from "react";
import type { Metadata } from "next";
import { AdminProductsClient } from "@/components/admin/AdminProductsClient";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Admin Products",
  description: "Manage Be-xpert Store product catalog.",
};

function ProductsFallback() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-10 w-full max-w-md" />
      <Skeleton className="h-96 w-full rounded-2xl" />
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<ProductsFallback />}>
      <AdminProductsClient />
    </Suspense>
  );
}
