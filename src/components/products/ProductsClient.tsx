"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import type { Category, Product, SortOption } from "@/types";
import { getProducts } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";
import { ProductGrid } from "./ProductGrid";
import { ProductGridSkeleton } from "./ProductGridSkeleton";
import { ProductSearch } from "./ProductSearch";
import { ProductSort } from "./ProductSort";
import { ProductFilters } from "./ProductFilters";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const ITEMS_PER_PAGE = 12;

export function ProductsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Query params from URL
  const initialTitle = searchParams.get("title") || "";
  const initialCategory = searchParams.get("category")
    ? Number(searchParams.get("category"))
    : undefined;

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search states
  const [searchTitle, setSearchTitle] = useState(initialTitle);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    initialCategory
  );
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [page, setPage] = useState<number>(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync state if URL query params change
  useEffect(() => {
    const titleParam = searchParams.get("title") || "";
    const catParam = searchParams.get("category")
      ? Number(searchParams.get("category"))
      : undefined;

    setSearchTitle(titleParam);
    setSelectedCategory(catParam);
  }, [searchParams]);

  // Load categories once
  useEffect(() => {
    async function loadCats() {
      try {
        const data = await getCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load categories:", e);
      }
    }
    loadCats();
  }, []);

  // Fetch products with API filters
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const offset = (page - 1) * ITEMS_PER_PAGE;
      const data = await getProducts({
        title: searchTitle.trim() || undefined,
        categoryId: selectedCategory,
        price_min: priceMin ? Number(priceMin) : undefined,
        price_max: priceMax ? Number(priceMax) : undefined,
        offset,
        limit: ITEMS_PER_PAGE,
      });

      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }, [page, searchTitle, selectedCategory, priceMin, priceMax]);

  // Debounced/triggered fetch when filters change
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchProducts();
    }, 250);

    return () => clearTimeout(handler);
  }, [fetchProducts]);

  // Handle frontend sorting
  const sortedProducts = useMemo(() => {
    const list = [...products];

    switch (sortBy) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "name-asc":
        return list.sort((a, b) => a.title.localeCompare(b.title));
      case "name-desc":
        return list.sort((a, b) => b.title.localeCompare(a.title));
      case "oldest":
        return list.sort((a, b) => a.id - b.id);
      case "newest":
      default:
        return list.sort((a, b) => b.id - a.id);
    }
  }, [products, sortBy]);

  const handleSearchChange = (val: string) => {
    setSearchTitle(val);
    setPage(1);
    // Update URL shallowly
    const params = new URLSearchParams(searchParams.toString());
    if (val.trim()) {
      params.set("title", val.trim());
    } else {
      params.delete("title");
    }
    router.replace(`/products?${params.toString()}`);
  };

  const handleCategoryChange = (id: number | undefined) => {
    setSelectedCategory(id);
    setPage(1);
    setIsMobileFilterOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    if (id !== undefined) {
      params.set("category", String(id));
    } else {
      params.delete("category");
    }
    router.replace(`/products?${params.toString()}`);
  };

  const handleResetFilters = () => {
    setSearchTitle("");
    setSelectedCategory(undefined);
    setPriceMin("");
    setPriceMax("");
    setPage(1);
    router.replace("/products");
    setIsMobileFilterOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Title & Mobile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Browse our full catalog with real-time filters
          </p>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          {/* Mobile Filter Button */}
          <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden flex items-center gap-2 h-9 text-xs"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Filters</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <SheetHeader className="text-left pb-4">
                <SheetTitle className="text-base font-semibold">
                  Product Filters
                </SheetTitle>
              </SheetHeader>
              <div className="py-2">
                <ProductFilters
                  categories={categories}
                  selectedCategoryId={selectedCategory}
                  onSelectCategory={handleCategoryChange}
                  priceMin={priceMin}
                  priceMax={priceMax}
                  onPriceMinChange={(v) => {
                    setPriceMin(v);
                    setPage(1);
                  }}
                  onPriceMaxChange={(v) => {
                    setPriceMax(v);
                    setPage(1);
                  }}
                  onReset={handleResetFilters}
                />
              </div>
            </SheetContent>
          </Sheet>

          <ProductSort value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      {/* Search Bar */}
      <div className="w-full">
        <ProductSearch
          value={searchTitle}
          onChange={handleSearchChange}
          placeholder="Search products by title..."
        />
      </div>

      {/* Main Grid & Desktop Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 rounded-lg border border-border bg-card p-5 sticky top-24">
          <ProductFilters
            categories={categories}
            selectedCategoryId={selectedCategory}
            onSelectCategory={handleCategoryChange}
            priceMin={priceMin}
            priceMax={priceMax}
            onPriceMinChange={(v) => {
              setPriceMin(v);
              setPage(1);
            }}
            onPriceMaxChange={(v) => {
              setPriceMax(v);
              setPage(1);
            }}
            onReset={handleResetFilters}
          />
        </aside>

        {/* Product Grid & Pagination */}
        <div className="lg:col-span-3 space-y-8">
          {error ? (
            <div className="text-center py-12 p-6 rounded-lg border border-border bg-card space-y-3">
              <p className="text-destructive font-medium">{error}</p>
              <Button onClick={() => fetchProducts()} variant="outline" size="sm">
                Try Again
              </Button>
            </div>
          ) : isLoading ? (
            <ProductGridSkeleton count={ITEMS_PER_PAGE} />
          ) : (
            <ProductGrid
              products={sortedProducts}
              emptyMessage={
                searchTitle || selectedCategory !== undefined || priceMin || priceMax
                  ? "No products found matching your filters."
                  : "No products available at the moment."
              }
            />
          )}

          {/* Simple Pagination Controls */}
          {!isLoading && !error && (products.length > 0 || page > 1) && (
            <div className="flex items-center justify-between pt-6 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="gap-1 text-xs"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>

              <span className="text-xs text-muted-foreground font-medium">
                Page {page}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={products.length < ITEMS_PER_PAGE}
                className="gap-1 text-xs"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
