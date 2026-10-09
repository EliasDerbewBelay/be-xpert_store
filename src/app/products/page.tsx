import React, { Suspense } from "react";
import type { Metadata } from "next";
import { ProductsClient } from "@/components/products/ProductsClient";
import { ProductGridSkeleton } from "@/components/products/ProductGridSkeleton";

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse and filter our complete catalog of products.",
};

export default function ProductsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Suspense
        fallback={
          <div className="space-y-6">
            <div className="h-10 w-48 bg-muted animate-pulse rounded" />
            <ProductGridSkeleton count={8} />
          </div>
        }
      >
        <ProductsClient />
      </Suspense>
    </div>
  );
}
