import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ChevronRight } from "lucide-react";
import {
  getCategory,
  getCategoryBySlug,
  getCategoryProducts,
} from "@/lib/api/categories";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductImage } from "@/components/ui/product-image";
import { Button } from "@/components/ui/button";
import type { Category, Product } from "@/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const isNumeric = !isNaN(Number(slug));
    const category = isNumeric
      ? await getCategory(Number(slug))
      : await getCategoryBySlug(slug);

    return {
      title: `${category.name} - Products`,
      description: `Browse all products in ${category.name}`,
    };
  } catch {
    return {
      title: "Category Products",
      description: "Browse products by category",
    };
  }
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let category: Category;
  let products: Product[] = [];

  try {
    const isNumeric = !isNaN(Number(slug));
    if (isNumeric) {
      category = await getCategory(Number(slug));
    } else {
      category = await getCategoryBySlug(slug);
    }
  } catch {
    // If not found by slug/id
    return notFound();
  }

  if (!category || !category.id) {
    return notFound();
  }

  try {
    const prodData = await getCategoryProducts(category.id);
    products = Array.isArray(prodData) ? prodData : [];
  } catch (err) {
    console.error("Failed to load category products:", err);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
        <Link
          href="/categories"
          className="hover:text-foreground transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Categories</span>
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">{category.name}</span>
      </div>

      {/* Category Banner / Header */}
      <div className="relative rounded-xl border border-border bg-card overflow-hidden p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 justify-between shadow-sm">
        <div className="space-y-2 text-center sm:text-left">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Category
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {category.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {products.length} {products.length === 1 ? "product" : "products"}{" "}
            available
          </p>
        </div>

        {category.image && (
          <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-lg overflow-hidden border border-border shrink-0 bg-muted">
            <ProductImage
              src={category.image}
              alt={category.name}
              fill
              sizes="128px"
              className="object-cover"
            />
          </div>
        )}
      </div>

      {/* Products in this Category */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">
            Products in {category.name}
          </h2>
          <Button asChild variant="outline" size="sm">
            <Link href={`/products?category=${category.id}`}>
              Filter in Catalog &rarr;
            </Link>
          </Button>
        </div>

        <ProductGrid
          products={products}
          emptyMessage={`No products available in ${category.name}.`}
        />
      </div>
    </div>
  );
}
