"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ExternalLink,
  Package,
  Pencil,
  Plus,
  ShoppingCart,
  Tag,
  UserPlus,
  Users,
} from "lucide-react";
import type { Category, Product, User } from "@/types";
import { getProducts } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";
import { getUsers } from "@/lib/api/users";
import { useAuth } from "@/lib/auth/auth-context";
import {
  formatAdminDate,
  formatRelativeTime,
  getCategoryBadgeClass,
  getGreeting,
} from "@/lib/admin/utils";
import { formatPrice, cn } from "@/lib/utils";
import { ProductImage } from "@/components/ui/product-image";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductFormDialog } from "./ProductFormDialog";

type ActivityItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
  icon: React.ElementType;
  iconClass: string;
};

export function AdminOverview() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const [productData, categoryData, userData] = await Promise.all([
          getProducts({ limit: 50, offset: 0 }),
          getCategories(),
          getUsers(),
        ]);
        if (cancelled) return;
        setProducts(Array.isArray(productData) ? productData : []);
        setCategories(Array.isArray(categoryData) ? categoryData : []);
        setUsers(Array.isArray(userData) ? userData : []);
      } catch (err) {
        console.error("Failed to load admin overview:", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const recentProducts = useMemo(() => products.slice(0, 5), [products]);

  const activity = useMemo<ActivityItem[]>(() => {
    const items: ActivityItem[] = [];

    products.slice(0, 2).forEach((p) => {
      items.push({
        id: `product-${p.id}`,
        title: "New product added",
        detail: p.title,
        time: formatRelativeTime(p.creationAt || p.updatedAt),
        icon: Plus,
        iconClass: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
      });
    });

    categories.slice(0, 1).forEach((c) => {
      items.push({
        id: `category-${c.id}`,
        title: "Category created",
        detail: c.name,
        time: formatRelativeTime(c.creationAt || c.updatedAt),
        icon: Tag,
        iconClass: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
      });
    });

    users.slice(0, 1).forEach((u) => {
      items.push({
        id: `user-${u.id}`,
        title: "New user registered",
        detail: u.email,
        time: formatRelativeTime(u.creationAt || u.updatedAt),
        icon: UserPlus,
        iconClass: "bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400",
      });
    });

    if (products[2]) {
      items.push({
        id: `updated-${products[2].id}`,
        title: "Product updated",
        detail: products[2].title,
        time: formatRelativeTime(products[2].updatedAt || products[2].creationAt),
        icon: Pencil,
        iconClass: "bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400",
      });
    }

    return items.slice(0, 4);
  }, [products, categories, users]);

  const stats = [
    {
      label: "Total Products",
      value: products.length,
      trend: "↑ 12% from last week",
      trendPositive: true,
      icon: Package,
      iconClass: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
    },
    {
      label: "Total Categories",
      value: categories.length,
      trend: "↑ 0% from last week",
      trendPositive: true,
      icon: Tag,
      iconClass: "bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400",
    },
    {
      label: "Total Users",
      value: users.length,
      trend: "↑ 8% from last week",
      trendPositive: true,
      icon: UserPlus,
      iconClass: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
    },
    {
      label: "Total Orders",
      value: 0,
      trend: "— No change",
      trendPositive: false,
      icon: ShoppingCart,
      iconClass: "bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400",
    },
  ];

  const greeting = getGreeting();
  const adminName = user?.name?.split(" ")[0] || "Admin";

  return (
    <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-foreground sm:text-3xl">
          {greeting}, {adminName}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-muted-foreground">
          Here&apos;s what&apos;s happening with your store today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-border dark:bg-card"
          >
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-32" />
              </div>
            ) : (
              <>
                <div
                  className={cn(
                    "mb-3 flex h-10 w-10 items-center justify-center rounded-xl",
                    stat.iconClass
                  )}
                >
                  <stat.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <p className="text-sm text-slate-500 dark:text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-foreground">
                  {stat.value}
                </p>
                <p
                  className={cn(
                    "mt-2 text-xs font-medium",
                    stat.trendPositive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-slate-400 dark:text-muted-foreground"
                  )}
                >
                  {stat.trend}
                </p>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Recent products */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-border dark:bg-card xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-border">
            <h2 className="text-base font-semibold text-slate-900 dark:text-foreground">
              Recent Products
            </h2>
            <Link
              href="/admin/products"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              View all
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-medium uppercase tracking-wide text-slate-400 dark:border-border dark:text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="hidden px-5 py-3 font-medium sm:table-cell">
                    Category
                  </th>
                  <th className="px-5 py-3 font-medium">Price</th>
                  <th className="hidden px-5 py-3 font-medium md:table-cell">
                    Created At
                  </th>
                  <th className="px-5 py-3 font-medium">
                    <span className="sr-only">Open</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-border">
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-lg" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                        </td>
                        <td className="hidden px-5 py-3 sm:table-cell">
                          <Skeleton className="h-5 w-20 rounded-full" />
                        </td>
                        <td className="px-5 py-3">
                          <Skeleton className="h-4 w-14" />
                        </td>
                        <td className="hidden px-5 py-3 md:table-cell">
                          <Skeleton className="h-4 w-24" />
                        </td>
                        <td className="px-5 py-3">
                          <Skeleton className="ml-auto h-4 w-4" />
                        </td>
                      </tr>
                    ))
                  : recentProducts.map((product) => {
                      const imageSrc =
                        product.images && product.images.length > 0
                          ? product.images[0]
                          : "";
                      return (
                        <tr
                          key={product.id}
                          className="transition-colors hover:bg-slate-50 dark:hover:bg-muted/40"
                        >
                          <td className="px-5 py-3">
                            <Link
                              href={`/products/${product.id}`}
                              className="flex items-center gap-3 min-w-0"
                            >
                              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-border dark:bg-muted">
                                <ProductImage
                                  src={imageSrc}
                                  alt={product.title}
                                  fill
                                  sizes="40px"
                                  className="object-cover"
                                />
                              </div>
                              <span className="truncate font-medium text-slate-900 dark:text-foreground">
                                {product.title}
                              </span>
                            </Link>
                          </td>
                          <td className="hidden px-5 py-3 sm:table-cell">
                            <span
                              className={cn(
                                "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium",
                                getCategoryBadgeClass(product.category?.name)
                              )}
                            >
                              {product.category?.name || "Uncategorized"}
                            </span>
                          </td>
                          <td className="px-5 py-3 font-semibold text-slate-900 dark:text-foreground">
                            {formatPrice(product.price)}
                          </td>
                          <td className="hidden px-5 py-3 text-slate-500 dark:text-muted-foreground md:table-cell">
                            {formatAdminDate(product.creationAt)}
                          </td>
                          <td className="px-5 py-3 text-right">
                            <Link
                              href={`/admin/products?edit=${product.id}`}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-muted dark:hover:text-foreground"
                              aria-label={`Manage ${product.title}`}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                {!isLoading && recentProducts.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-10 text-center text-sm text-slate-500"
                    >
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Right column */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-border dark:bg-card">
            <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-foreground">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormOpen(true)}
                className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-4 text-center text-sm font-medium text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-border dark:bg-secondary dark:text-foreground dark:hover:border-blue-800 dark:hover:bg-blue-950/40 dark:hover:text-blue-300"
              >
                <Plus className="h-5 w-5" aria-hidden="true" />
                Add Product
              </button>
              <Link
                href="/admin/categories"
                className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-4 text-center text-sm font-medium text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-border dark:bg-secondary dark:text-foreground dark:hover:border-blue-800 dark:hover:bg-blue-950/40 dark:hover:text-blue-300"
              >
                <Tag className="h-5 w-5" aria-hidden="true" />
                Manage Categories
              </Link>
              <Link
                href="/admin/users"
                className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-4 text-center text-sm font-medium text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-border dark:bg-secondary dark:text-foreground dark:hover:border-blue-800 dark:hover:bg-blue-950/40 dark:hover:text-blue-300"
              >
                <Users className="h-5 w-5" aria-hidden="true" />
                View Users
              </Link>
              <Link
                href="/"
                className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-4 text-center text-sm font-medium text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-border dark:bg-secondary dark:text-foreground dark:hover:border-blue-800 dark:hover:bg-blue-950/40 dark:hover:text-blue-300"
              >
                <ExternalLink className="h-5 w-5" aria-hidden="true" />
                Go to Store
              </Link>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-border dark:bg-card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900 dark:text-foreground">
                Recent Activity
              </h2>
              <Link
                href="/admin/products"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                View all
              </Link>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="space-y-4">
                {activity.map((item) => (
                  <li key={item.id} className="flex gap-3">
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                        item.iconClass
                      )}
                    >
                      <item.icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-foreground">
                        {item.title}
                      </p>
                      <p className="truncate text-sm text-slate-500 dark:text-muted-foreground">
                        {item.detail}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400 dark:text-muted-foreground">
                        {item.time}
                      </p>
                    </div>
                  </li>
                ))}
                {activity.length === 0 && (
                  <li className="py-4 text-center text-sm text-slate-500">
                    No recent activity yet.
                  </li>
                )}
              </ul>
            )}
          </section>
        </div>
      </div>

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        categories={categories}
        productToEdit={null}
        onSuccess={(saved, isNew) => {
          setProducts((prev) =>
            isNew
              ? [saved, ...prev]
              : prev.map((p) => (p.id === saved.id ? saved : p))
          );
        }}
      />
    </div>
  );
}
