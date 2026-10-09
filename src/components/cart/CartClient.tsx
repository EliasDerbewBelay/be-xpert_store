"use client";

import React from "react";
import { useCart } from "@/lib/cart/cart-context";
import { CartItemRow } from "./CartItemRow";
import { CartSummary } from "./CartSummary";
import { CartEmpty } from "./CartEmpty";
import { Skeleton } from "@/components/ui/skeleton";

export function CartClient() {
  const { items, isInitialized } = useCart();

  if (!isInitialized) {
    return (
      <div className="space-y-6 py-8">
        <Skeleton className="h-8 w-40" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return <CartEmpty />;
  }

  return (
    <div className="space-y-8 py-6">
      <div className="pb-4 border-b border-border">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Cart</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Review your selected items before proceeding to checkout
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 divide-y divide-border">
          {items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </div>

        {/* Order Summary & Checkout Link */}
        <div className="lg:col-span-1 sticky top-24">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
