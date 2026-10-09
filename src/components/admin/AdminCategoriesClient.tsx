"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Tag } from "lucide-react";
import type { Category } from "@/types";
import { getCategories } from "@/lib/api/categories";
import {
  formatAdminDate,
  getCategoryBadgeClass,
} from "@/lib/admin/utils";
import { cn } from "@/lib/utils";
import { ProductImage } from "@/components/ui/product-image";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminCategoriesClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getCategories();
        if (!cancelled) setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load categories.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Categories
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse storefront departments powered by EscuelaJS.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-secondary text-xs font-medium uppercase tracking-wide text-muted-foreground dark:border-border dark:bg-muted/40 dark:text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Category</th>
                <th className="hidden px-4 py-3 sm:table-cell">Slug</th>
                <th className="hidden px-4 py-3 md:table-cell">Created</th>
                <th className="px-4 py-3 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <Skeleton className="h-4 w-28" />
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="ml-auto h-4 w-16" />
                    </td>
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-destructive">
                    {error}
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr
                    key={category.id}
                    className="transition-colors hover:bg-secondary dark:hover:bg-muted/30"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border bg-muted dark:border-border">
                          <ProductImage
                            src={category.image}
                            alt={category.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Tag className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                          <span
                            className={cn(
                              "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium",
                              getCategoryBadgeClass(category.name)
                            )}
                          >
                            {category.name}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 font-mono text-xs text-muted-foreground sm:table-cell">
                      {category.slug || "—"}
                    </td>
                    <td className="hidden px-4 py-3 text-xs text-muted-foreground md:table-cell">
                      {formatAdminDate(category.creationAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={
                          category.slug
                            ? `/categories/${category.slug}`
                            : `/categories`
                        }
                        className="text-sm font-medium text-primary hover:text-primary/80"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
