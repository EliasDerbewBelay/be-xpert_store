"use client";

import React, { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart/cart-context";
import { useToast } from "@/lib/toast/toast-context";

interface ProductActionsProps {
  product: Product;
}

export function ProductActions({ product }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { success } = useToast();

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity((q) => q + 1);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    success(`Added ${quantity} × "${product.title}" to cart`);
  };

  return (
    <div className="space-y-4 pt-4 border-t border-border">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-muted-foreground">Quantity</span>
        <div className="flex items-center border border-border rounded-md bg-background">
          <button
            type="button"
            onClick={handleDecrease}
            disabled={quantity <= 1}
            className="h-9 w-9 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors cursor-pointer"
            aria-label="Decrease quantity"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="h-9 min-w-[36px] px-2 flex items-center justify-center text-sm font-semibold">
            {quantity}
          </span>
          <button
            type="button"
            onClick={handleIncrease}
            className="h-9 w-9 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Increase quantity"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <Button
        onClick={handleAddToCart}
        size="lg"
        className="w-full sm:w-auto min-w-[200px] gap-2"
      >
        <ShoppingCart className="h-4 w-4" />
        <span>Add to Cart</span>
      </Button>
    </div>
  );
}
