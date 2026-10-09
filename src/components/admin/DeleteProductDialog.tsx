"use client";

import React, { useState } from "react";
import type { Product } from "@/types";
import { deleteProduct } from "@/lib/api/products";
import { useToast } from "@/lib/toast/toast-context";
import { formatPrice } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DeleteProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSuccess: (deletedId: number) => void;
}

export function DeleteProductDialog({
  open,
  onOpenChange,
  product,
  onSuccess,
}: DeleteProductDialogProps) {
  const { success, error } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!product) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProduct(product.id);
      success(`Product "${product.title}" has been deleted.`);
      onSuccess(product.id);
      onOpenChange(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete product.";
      error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="gap-2">
          <div className="mx-auto sm:mx-0 h-10 w-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogDescription className="text-sm">
            Are you sure you want to delete <span className="font-semibold text-foreground">&quot;{product.title}&quot;</span> (ID: #{product.id}, {formatPrice(product.price)})?
            This operation will call the EscuelaJS delete endpoint.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0 pt-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
