"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ExternalLink,
  RotateCw,
  Package,
  Layers,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Category, Product } from "@/types";
import { getProducts } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";
import { formatPrice } from "@/lib/utils";
import { ProductImage } from "@/components/ui/product-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { useAuth } from "@/lib/auth/auth-context";

const PAGE_SIZE = 10;

export function AdminDashboardClient() {
  const { user } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [page, setPage] = useState(1);

  // Modals state
  const [formOpen, setFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Load categories
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

  // Fetch products
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
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Admin Dashboard
            </h1>
            <Badge variant="secondary" className="gap-1 font-semibold text-xs">
              <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              <span>Admin</span>
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Manage product catalog, inventory, and listings directly with the EscuelaJS API.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button asChild variant="outline" size="sm">
            <Link href="/products" className="gap-1.5 text-xs">
              <ExternalLink className="h-3.5 w-3.5" />
              <span>View Storefront</span>
            </Link>
          </Button>

          <Button onClick={handleOpenCreate} size="sm" className="gap-1.5 text-xs">
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </Button>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-border bg-card p-5 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs uppercase tracking-wider font-medium">Catalog Items</span>
            <Package className="h-4 w-4" />
          </div>
          <p className="text-2xl font-bold">100+</p>
          <p className="text-xs text-muted-foreground">Active in remote inventory</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-5 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs uppercase tracking-wider font-medium">Categories</span>
            <Layers className="h-4 w-4" />
          </div>
          <p className="text-2xl font-bold">{categories.length}</p>
          <p className="text-xs text-muted-foreground">Available departments</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-5 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs uppercase tracking-wider font-medium">Logged in Admin</span>
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-base font-semibold truncate">{user?.name || "Admin"}</p>
          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
        </div>
      </div>

      {/* Search, Filter & Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTitle}
              onChange={(e) => {
                setSearchTitle(e.target.value);
                setPage(1);
              }}
              placeholder="Search products by title..."
              className="pl-9 h-9"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={selectedCategory}
            onValueChange={(val) => {
              setSelectedCategory(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[160px] h-9 text-xs">
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
            className="h-9 w-9 shrink-0"
            aria-label="Refresh product list"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border text-xs text-muted-foreground uppercase font-medium">
              <tr>
                <th scope="col" className="px-4 py-3">Product</th>
                <th scope="col" className="px-4 py-3 hidden sm:table-cell">Category</th>
                <th scope="col" className="px-4 py-3">Price</th>
                <th scope="col" className="px-4 py-3 hidden md:table-cell">ID</th>
                <th scope="col" className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded shrink-0" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <Skeleton className="h-4 w-10" />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Skeleton className="h-8 w-20 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    <p className="text-destructive font-medium">{error}</p>
                    <Button onClick={() => loadProducts()} variant="outline" size="sm" className="mt-2">
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
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="relative h-10 w-10 rounded overflow-hidden bg-muted border border-border shrink-0"
                            style={{ position: "relative" }}
                          >
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
                              className="font-medium text-foreground hover:underline truncate block"
                            >
                              {product.title}
                            </Link>
                            <span className="text-xs text-muted-foreground sm:hidden block truncate">
                              {product.category?.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 hidden sm:table-cell">
                        <Badge variant="outline" className="text-xs font-normal">
                          {product.category?.name || "Uncategorized"}
                        </Badge>
                      </td>

                      <td className="px-4 py-3 font-semibold text-foreground">
                        {formatPrice(product.price)}
                      </td>

                      <td className="px-4 py-3 hidden md:table-cell font-mono text-xs text-muted-foreground">
                        #{product.id}
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

        {/* Pagination Bar */}
        {!isLoading && !error && (products.length > 0 || page > 1) && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-card">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="gap-1 text-xs"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </Button>

            <span className="text-xs text-muted-foreground">
              Page {page}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={products.length < PAGE_SIZE}
              className="gap-1 text-xs"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* Create / Edit Dialog */}
      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        categories={categories}
        productToEdit={productToEdit}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteProductDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        product={productToDelete}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
