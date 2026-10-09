import React from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CartEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 max-w-md mx-auto">
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
        <ShoppingBag className="h-8 w-8" />
      </div>

      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">
          Your cart is empty
        </h2>
        <p className="text-sm text-muted-foreground">
          Browse products and add something you like.
        </p>
      </div>

      <Button asChild className="mt-2">
        <Link href="/products">Browse Products</Link>
      </Button>
    </div>
  );
}
