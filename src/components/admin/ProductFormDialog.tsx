"use client";

import React, { useState, useEffect } from "react";
import type { Category, Product, CreateProductRequest, UpdateProductRequest } from "@/types";
import { createProduct, updateProduct } from "@/lib/api/products";
import { useToast } from "@/lib/toast/toast-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductImage } from "@/components/ui/product-image";
import { AlertCircle, Image as ImageIcon } from "lucide-react";

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  productToEdit?: Product | null;
  onSuccess: (product: Product, isNew: boolean) => void;
}

export function ProductFormDialog({
  open,
  onOpenChange,
  categories,
  productToEdit,
  onSuccess,
}: ProductFormDialogProps) {
  const isEditing = Boolean(productToEdit);
  const { success, error: toastError } = useToast();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setTitle(productToEdit.title);
      setPrice(String(productToEdit.price));
      setCategoryId(productToEdit.category?.id ? String(productToEdit.category.id) : "");
      setDescription(productToEdit.description || "");
      setImageUrl(
        productToEdit.images && productToEdit.images.length > 0
          ? productToEdit.images[0]
          : ""
      );
    } else {
      setTitle("");
      setPrice("");
      setCategoryId(categories.length > 0 ? String(categories[0].id) : "");
      setDescription("");
      setImageUrl("");
    }
    setError(null);
  }, [productToEdit, categories, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Product title is required.");
      return;
    }

    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setError("Please provide a valid price greater than $0.");
      return;
    }

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    if (!description.trim()) {
      setError("Product description is required.");
      return;
    }

    if (!imageUrl.trim()) {
      setError("At least one image URL is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing && productToEdit) {
        const payload: UpdateProductRequest = {
          title: title.trim(),
          price: numPrice,
          description: description.trim(),
          categoryId: Number(categoryId),
          images: [imageUrl.trim()],
        };

        const updated = await updateProduct(productToEdit.id, payload);
        success(`Product "${updated.title}" updated successfully.`);
        onSuccess(updated, false);
      } else {
        const payload: CreateProductRequest = {
          title: title.trim(),
          price: numPrice,
          description: description.trim(),
          categoryId: Number(categoryId),
          images: [imageUrl.trim()],
        };

        const created = await createProduct(payload);
        success(`Product "${created.title}" created successfully.`);
        onSuccess(created, true);
      }
      onOpenChange(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save product.";
      setError(msg);
      toastError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Product" : "Create New Product"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error && (
            <div
              role="alert"
              className="flex items-center gap-2 p-3 text-sm rounded-md bg-destructive/10 text-destructive border border-destructive/20"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="product-title">Title *</Label>
              <Input
                id="product-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Ergonomic Office Chair"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="product-price">Price ($) *</Label>
              <Input
                id="product-price"
                type="number"
                min="1"
                step="any"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="49"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label htmlFor="product-category">Category *</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger id="product-category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="product-desc">Description *</Label>
            <textarea
              id="product-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description and specifications..."
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              required
            />
          </div>

          {/* Image URL & Preview */}
          <div className="space-y-2">
            <Label htmlFor="product-image">Image URL *</Label>
            <div className="flex gap-2">
              <Input
                id="product-image"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.example.com/product.jpg"
                required
              />
            </div>

            {/* Live Preview */}
            <div className="flex items-center gap-3 pt-2 p-2.5 rounded-md border border-border bg-muted/40">
              <div
                className="relative h-14 w-14 rounded overflow-hidden bg-muted border border-border shrink-0"
                style={{ position: "relative" }}
              >
                {imageUrl ? (
                  <ProductImage
                    src={imageUrl}
                    alt="Preview"
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                    <ImageIcon className="h-5 w-5" />
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                Preview of product image that will appear in the catalog
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEditing
                  ? "Saving changes..."
                  : "Creating product..."
                : isEditing
                ? "Save Changes"
                : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
