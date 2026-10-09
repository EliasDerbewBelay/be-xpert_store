"use client";

import React from "react";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem } from "@/types";
import { formatPrice } from "@/lib/utils";
import { ProductImage } from "@/components/ui/product-image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart/cart-context";
import { useToast } from "@/lib/toast/toast-context";

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
  const { info } = useToast();

  const handleRemove = () => {
    removeFromCart(item.id);
    info(`Removed "${item.title}" from cart`);
  };

  return (
    <div className="flex gap-4 py-4 border-b border-border items-center">
      {/* Product Image */}
      <Link
        href={`/products/${item.id}`}
        className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-md overflow-hidden bg-muted border border-border"
      >
        <ProductImage
          src={item.image}
          alt={item.title}
          fill
          sizes="96px"
          className="object-cover"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0 space-y-1">
        {item.categoryName && (
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            {item.categoryName}
          </p>
        )}
        <h4 className="text-sm font-medium truncate">
          <Link
            href={`/products/${item.id}`}
            className="hover:underline underline-offset-2"
          >
            {item.title}
          </Link>
        </h4>
        <p className="text-sm font-semibold text-foreground">
          {formatPrice(item.price)}
        </p>

        {/* Quantity Controls (Mobile & Desktop) */}
        <div className="flex items-center gap-2 pt-2">
          <div className="flex items-center border border-border rounded-md">
            <button
              onClick={() => decreaseQuantity(item.id)}
              disabled={item.quantity <= 1}
              className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="h-7 min-w-[28px] px-1 flex items-center justify-center text-xs font-semibold">
              {item.quantity}
            </span>
            <button
              onClick={() => increaseQuantity(item.id)}
              className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            aria-label={`Remove ${item.title} from cart`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Line Total */}
      <div className="text-right shrink-0">
        <span className="text-sm sm:text-base font-semibold">
          {formatPrice(item.price * item.quantity)}
        </span>
      </div>
    </div>
  );
}
