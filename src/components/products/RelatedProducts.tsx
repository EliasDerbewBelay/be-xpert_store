"use client";

import React, { useEffect, useState } from "react";
import type { Product } from "@/types";
import { getRelatedProducts } from "@/lib/api/products";
import { ProductGrid } from "./ProductGrid";
import { ProductGridSkeleton } from "./ProductGridSkeleton";

interface RelatedProductsProps {
  productId: number;
}

export function RelatedProducts({ productId }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadRelated() {
      try {
        setIsLoading(true);
        const data = await getRelatedProducts(productId);
        if (isMounted) {
          // Exclude the current product itself if returned and limit to 4
          const filtered = Array.isArray(data)
            ? data.filter((p) => p.id !== productId).slice(0, 4)
            : [];
          setProducts(filtered);
        }
      } catch {
        if (isMounted) {
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadRelated();
    return () => {
      isMounted = false;
    };
  }, [productId]);

  if (isLoading) {
    return (
      <div className="space-y-4 pt-10 border-t border-border mt-12">
        <h3 className="text-xl font-bold tracking-tight">Related Products</h3>
        <ProductGridSkeleton count={4} />
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 pt-10 border-t border-border mt-12">
      <h3 className="text-xl font-bold tracking-tight">Related Products</h3>
      <ProductGrid products={products} />
    </div>
  );
}
