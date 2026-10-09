import React from "react";
import Link from "next/link";
import type { Category } from "@/types";
import { ProductImage } from "@/components/ui/product-image";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  // If slug is available, use slug; otherwise use id
  const targetHref = `/categories/${category.slug || category.id}`;

  return (
    <Link
      href={targetHref}
      className="group flex flex-col rounded-lg border border-border bg-card overflow-hidden transition-colors hover:border-foreground/30 shadow-sm"
    >
      <div
        className="relative aspect-video w-full overflow-hidden bg-muted"
        style={{ position: "relative" }}
      >
        <ProductImage
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-4 flex items-center justify-between">
        <h3 className="font-medium text-base group-hover:underline underline-offset-2">
          {category.name}
        </h3>
        <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
          Browse &rarr;
        </span>
      </div>
    </Link>
  );
}
