"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { ProductImage } from "@/components/ui/product-image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart/cart-context";
import { useToast } from "@/lib/toast/toast-context";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { success } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    success(`Added "${product.title}" to cart`);
  };

  const primaryImage =
    product.images && product.images.length > 0 ? product.images[0] : "";

  return (
    <div className="group flex flex-col justify-between rounded-lg border border-border bg-card overflow-hidden transition-colors hover:border-foreground/20">
      <div>
        <Link
          href={`/products/${product.id}`}
          className="block relative aspect-square w-full overflow-hidden bg-muted"
          style={{ position: "relative" }}
        >
          <ProductImage
            src={primaryImage}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-200 group-hover:scale-105"
          />
        </Link>

        <div className="p-3.5 space-y-1.5">
          {product.category?.name && (
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium line-clamp-1">
              {product.category.name}
            </p>
          )}

          <h3 className="text-sm font-medium leading-snug line-clamp-2">
            <Link
              href={`/products/${product.id}`}
              className="hover:underline underline-offset-2"
            >
              {product.title}
            </Link>
          </h3>
        </div>
      </div>

      <div className="p-3.5 pt-0 flex items-center justify-between gap-2 mt-2">
        <span className="font-semibold text-sm sm:text-base">
          {formatPrice(product.price)}
        </span>

        <Button
          onClick={handleAddToCart}
          variant="outline"
          size="sm"
          className="h-8 px-2.5 text-xs gap-1.5 shrink-0"
          aria-label={`Add ${product.title} to cart`}
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add</span>
        </Button>
      </div>
    </div>
  );
}
