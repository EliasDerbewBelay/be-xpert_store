import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function CategorySkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col rounded-lg border border-border bg-card overflow-hidden"
        >
          <Skeleton className="aspect-video w-full" />
          <div className="p-4 flex justify-between items-center">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}
