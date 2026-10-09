import React from "react";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { getCategories } from "@/lib/api/categories";
import { getProducts } from "@/lib/api/products";
import { ProductGrid } from "@/components/products/ProductGrid";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { Button } from "@/components/ui/button";
import type { Category, Product } from "@/types";

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  let categories: Category[] = [];
  let featuredProducts: Product[] = [];

  try {
    const [catData, prodData] = await Promise.all([
      getCategories(),
      getProducts({ limit: 8, offset: 0 }),
    ]);
    categories = Array.isArray(catData) ? catData.slice(0, 4) : [];
    featuredProducts = Array.isArray(prodData) ? prodData : [];
  } catch (error) {
    console.error("Failed to load home page data:", error);
  }

  return (
    <div className="space-y-12 sm:space-y-16 py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Minimal Hero Section */}
      <section className="rounded-xl border border-border bg-card p-6 sm:p-10 lg:p-12 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="max-w-xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
            <ShoppingBag className="h-3.5 w-3.5" />
            Curated Collection
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Discover products you&apos;ll love.
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Browse a simple, modern collection of quality products across diverse categories, powered by real-time inventory.
          </p>
          <div className="pt-2 flex flex-wrap gap-3 justify-center sm:justify-start">
            <Button asChild size="lg" className="gap-2">
              <Link href="/products">
                Shop Products <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/categories">Browse Categories</Link>
            </Button>
          </div>
        </div>

        <div className="w-full sm:w-auto shrink-0 flex items-center justify-center p-6 bg-secondary/50 rounded-lg border border-border">
          <div className="text-center space-y-1">
            <p className="text-3xl font-bold text-foreground">
              {featuredProducts.length > 0 ? `${featuredProducts.length}+` : "25+"}
            </p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              Curated Items
            </p>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      {categories.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Popular Categories
            </h2>
            <Link
              href="/categories"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              All Categories <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </section>
      )}

      {/* Featured / Latest Products */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Featured Products
            </h2>
            <p className="text-sm text-muted-foreground">
              Hand-picked selections from our catalog
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <ProductGrid products={featuredProducts} />
      </section>

      {/* Simple Call to Action */}
      <section className="rounded-xl border border-border bg-card p-8 sm:p-10 text-center space-y-4 shadow-sm">
        <h2 className="text-2xl font-bold tracking-tight">
          Ready to start shopping?
        </h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Explore all our categories, search for items by name, or filter by price to find exactly what you need.
        </p>
        <Button asChild size="lg">
          <Link href="/products">Explore Catalog</Link>
        </Button>
      </section>
    </div>
  );
}
