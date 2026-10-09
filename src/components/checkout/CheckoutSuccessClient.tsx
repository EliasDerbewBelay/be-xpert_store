"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface LatestOrder {
  orderId: string;
  itemsCount: number;
  total: number;
  customerName: string;
  date: string;
}

export function CheckoutSuccessClient() {
  const [order, setOrder] = useState<LatestOrder | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("latest_order");
      if (stored) {
        setOrder(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, []);

  return (
    <div className="max-w-lg mx-auto py-12 px-4 text-center space-y-6">
      <div className="mx-auto h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
        <CheckCircle2 className="h-10 w-10" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Order placed successfully.
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Thank you for your purchase. We&apos;ve received your order and are processing it.
        </p>
      </div>

      {order && (
        <div className="rounded-lg border border-border bg-card p-5 text-left text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order Reference</span>
            <span className="font-mono font-semibold">{order.orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Customer</span>
            <span className="font-medium">{order.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Items Ordered</span>
            <span className="font-medium">{order.itemsCount}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 font-semibold text-base">
            <span>Total Amount</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <Button asChild size="lg" className="gap-2">
          <Link href="/products">
            <ShoppingBag className="h-4 w-4" />
            <span>Continue Shopping</span>
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/">
            <span>Return to Home</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
