import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategories } from "@/lib/api/categories";
import { getProducts } from "@/lib/api/products";
import { Hero } from "@/components/home/Hero";
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
    <div>
      <Hero />

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:space-y-16 sm:px-6 sm:py-12 lg:px-8">
        {/* Popular Categories */}
        {categories.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Popular Categories
              </h2>
              <Link
                href="/categories"
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                All Categories <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 lg:gap-6">
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
              <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Featured Products
              </h2>
              <p className="text-sm text-muted-foreground">
                Hand-picked selections from our catalog
              </p>
            </div>
            <Link
              href="/products"
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <ProductGrid products={featuredProducts} />
        </section>

        {/* Simple Call to Action */}
        <section className="space-y-4 rounded-xl border border-border bg-card p-8 text-center shadow-sm sm:p-10">
          <h2 className="text-2xl font-bold tracking-tight">
            Ready to start shopping?
          </h2>
          <p className="mx-auto max-w-md text-sm text-muted-foreground">
            Explore all our categories, search for items by name, or filter by
            price to find exactly what you need.
          </p>
          <Button asChild size="lg">
            <Link href="/products">Explore Catalog</Link>
          </Button>
        </section>
      </div>
    </div>
  );
}
