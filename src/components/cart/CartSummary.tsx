"use client";

import React from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart/cart-context";
import { Button } from "@/components/ui/button";

export function CartSummary() {
  const { totalPrice, totalItems, clearCart } = useCart();

  return (
    <div className="rounded-lg border border-border bg-card p-5 space-y-4">
      <h3 className="font-semibold text-base">Order Summary</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Items ({totalItems})</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Shipping estimate</span>
          <span className="text-foreground font-medium">Free</span>
        </div>
        <div className="border-t border-border pt-2 flex justify-between font-semibold text-base">
          <span>Total</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <Button asChild className="w-full" size="lg">
          <Link href="/checkout">Proceed to Checkout</Link>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={clearCart}
          className="w-full text-xs text-muted-foreground hover:text-destructive"
        >
          Clear Cart
        </Button>
      </div>
    </div>
  );
}
