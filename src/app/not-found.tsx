import React from "react";
import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
      <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
        <FileQuestion className="h-8 w-8" />
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Page Not Found</h1>
        <p className="text-sm text-muted-foreground">
          The requested page or product could not be found. It may have been moved or removed.
        </p>
      </div>

      <div className="pt-2 flex justify-center gap-3">
        <Button asChild variant="outline">
          <Link href="/products" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Products</span>
          </Link>
        </Button>
        <Button asChild>
          <Link href="/">Home</Link>
        </Button>
      </div>
    </div>
  );
}
