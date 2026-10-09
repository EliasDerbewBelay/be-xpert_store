"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ExternalLink,
  RotateCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Category, Product } from "@/types";
import { getProducts, getProduct } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";
import { formatPrice, cn } from "@/lib/utils";
import { getCategoryBadgeClass, formatAdminDate } from "@/lib/admin/utils";
import { ProductImage } from "@/components/ui/product-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductFormDialog } from "./ProductFormDialog";
import { DeleteProductDialog } from "./DeleteProductDialog";

const PAGE_SIZE = 10;

export function AdminProductsClient() {
  const searchParams = useSearchParams();
  const titleFromQuery = searchParams.get("title") || "";
  const editId = searchParams.get("edit");

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTitle, setSearchTitle] = useState(titleFromQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => {
    setSearchTitle(titleFromQuery);
    setPage(1);
  }, [titleFromQuery]);

  useEffect(() => {
    async function loadCats() {
      try {
        const data = await getCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    }
    loadCats();
  }, []);

  useEffect(() => {
    if (!editId) return;
    let cancelled = false;

    async function openEdit() {
      try {
        const product = await getProduct(editId!);
        if (!cancelled && product) {
          setProductToEdit(product);
          setFormOpen(true);
        }
      } catch (err) {
        console.error("Failed to load product for edit:", err);
      }
    }

    openEdit();
    return () => {
      cancelled = true;
    };
  }, [editId]);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const offset = (page - 1) * PAGE_SIZE;
      const catId =
        selectedCategory !== "all" ? Number(selectedCategory) : undefined;

      const data = await getProducts({
        title: searchTitle.trim() || undefined,
        categoryId: catId,
        offset,
        limit: PAGE_SIZE,
      });

      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load products.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [page, searchTitle, selectedCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
    }, 200);
    return () => clearTimeout(timer);
  }, [loadProducts]);

  const handleOpenCreate = () => {
    setProductToEdit(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setProductToEdit(product);
    setFormOpen(true);
  };

  const handleOpenDelete = (product: Product) => {
    setProductToDelete(product);
    setDeleteOpen(true);
  };

  const handleFormSuccess = (savedProduct: Product, isNew: boolean) => {
    if (isNew) {
      setProducts((prev) => [savedProduct, ...prev]);
    } else {
      setProducts((prev) =>
        prev.map((p) => (p.id === savedProduct.id ? savedProduct : p))
      );
    }
  };

  const handleDeleteSuccess = (deletedId: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== deletedId));
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-foreground">
            Products
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-muted-foreground">
            Create, edit, and manage your catalog inventory.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-1.5 bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTitle}
            onChange={(e) => {
              setSearchTitle(e.target.value);
              setPage(1);
            }}
            placeholder="Search products by title..."
            className="h-9 rounded-xl pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={selectedCategory}
            onValueChange={(val) => {
              setSelectedCategory(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-[160px] rounded-xl text-xs">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => loadProducts()}
            className="h-9 w-9 shrink-0 rounded-xl"
            aria-label="Refresh product list"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-border dark:bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-400 dark:border-border dark:bg-muted/40 dark:text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="hidden px-4 py-3 sm:table-cell">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="hidden px-4 py-3 md:table-cell">Created</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Skeleton className="ml-auto h-8 w-20" />
                    </td>
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    <p className="font-medium text-destructive">{error}</p>
                    <Button
                      onClick={() => loadProducts()}
                      variant="outline"
                      size="sm"
                      className="mt-2"
                    >
                      Try Again
                    </Button>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const imageSrc =
                    product.images && product.images.length > 0
                      ? product.images[0]
                      : "";

                  return (
                    <tr
                      key={product.id}
                      className="transition-colors hover:bg-slate-50 dark:hover:bg-muted/30"
                    >
                      <td className="px-4 py-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-muted dark:border-border">
                            <ProductImage
                              src={imageSrc}
                              alt={product.title}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/products/${product.id}`}
                              className="block truncate font-medium text-foreground hover:underline"
                            >
                              {product.title}
                            </Link>
                            <span className="block truncate text-xs text-muted-foreground sm:hidden">
                              {product.category?.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="hidden px-4 py-3 sm:table-cell">
                        <span
                          className={cn(
                            "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium",
                            getCategoryBadgeClass(product.category?.name)
                          )}
                        >
                          {product.category?.name || "Uncategorized"}
                        </span>
                      </td>

                      <td className="px-4 py-3 font-semibold text-foreground">
                        {formatPrice(product.price)}
                      </td>

                      <td className="hidden px-4 py-3 text-xs text-muted-foreground md:table-cell">
                        {formatAdminDate(product.creationAt)}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            aria-label={`View ${product.title} in store`}
                          >
                            <Link href={`/products/${product.id}`}>
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(product)}
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            aria-label={`Edit ${product.title}`}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDelete(product)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            aria-label={`Delete ${product.title}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && !error && (products.length > 0 || page > 1) && (
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 dark:border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="gap-1 rounded-xl text-xs"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </Button>

            <span className="text-xs text-muted-foreground">Page {page}</span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={products.length < PAGE_SIZE}
              className="gap-1 rounded-xl text-xs"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        categories={categories}
        productToEdit={productToEdit}
        onSuccess={handleFormSuccess}
      />

      <DeleteProductDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        product={productToDelete}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
