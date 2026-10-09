"use client";

import React, { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
      <div className="mx-auto h-14 w-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
        <AlertCircle className="h-7 w-7" />
      </div>

      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight">Something went wrong</h1>
        <p className="text-sm text-muted-foreground">
          We encountered an issue loading this page. Please try again.
        </p>
      </div>

      <div className="pt-2">
        <Button onClick={() => reset()} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </Button>
      </div>
    </div>
  );
}
