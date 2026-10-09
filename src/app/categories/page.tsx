import React from "react";
import type { Metadata } from "next";
import { getCategories } from "@/lib/api/categories";
import { CategoryCard } from "@/components/categories/CategoryCard";
import type { Category } from "@/types";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse products by department and category.",
};

export const revalidate = 60;

export default async function CategoriesPage() {
  let categories: Category[] = [];
  try {
    const data = await getCategories();
    categories = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to load categories:", error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-1 pb-4 border-b border-border">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Categories</h1>
        <p className="text-sm text-muted-foreground">
          Find products grouped by department
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-16 border rounded-lg border-dashed border-border p-6 bg-card">
          <p className="text-base font-medium">No categories available</p>
          <p className="text-sm text-muted-foreground mt-1">
            Please check back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      )}
    </div>
  );
}
