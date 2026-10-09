import React from "react";
import Link from "next/link";
import { PackageX, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
      <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
        <PackageX className="h-8 w-8" />
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Product not found</h1>
        <p className="text-sm text-muted-foreground">
          We couldn&apos;t find the product you were looking for. It may have been removed or the ID is invalid.
        </p>
      </div>

      <div className="pt-2 flex justify-center">
        <Button asChild>
          <Link href="/products" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Products</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
