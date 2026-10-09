"use client";

import React from "react";
import type { Category } from "@/types";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface ProductFiltersProps {
  categories: Category[];
  selectedCategoryId: number | undefined;
  onSelectCategory: (id: number | undefined) => void;
  priceMin: string;
  priceMax: string;
  onPriceMinChange: (val: string) => void;
  onPriceMaxChange: (val: string) => void;
  onReset: () => void;
}

export function ProductFilters({
  categories,
  selectedCategoryId,
  onSelectCategory,
  priceMin,
  priceMax,
  onPriceMinChange,
  onPriceMaxChange,
  onReset,
}: ProductFiltersProps) {
  const hasActiveFilters =
    selectedCategoryId !== undefined || priceMin !== "" || priceMax !== "";

  return (
    <div className="space-y-6">
      {/* Header with Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <h4 className="font-semibold text-sm">Filters</h4>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </Button>
        )}
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <h5 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Category
        </h5>
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => onSelectCategory(undefined)}
            className={`w-full text-left px-2.5 py-1.5 rounded-md text-sm transition-colors ${
              selectedCategoryId === undefined
                ? "bg-secondary font-medium text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full text-left px-2.5 py-1.5 rounded-md text-sm transition-colors truncate ${
                selectedCategoryId === cat.id
                  ? "bg-secondary font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3 pt-2 border-t border-border">
        <h5 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Price Range ($)
        </h5>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] text-muted-foreground block mb-1">
              Min
            </label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={priceMin}
              onChange={(e) => onPriceMinChange(e.target.value)}
              className="w-full h-8 px-2.5 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-[11px] text-muted-foreground block mb-1">
              Max
            </label>
            <input
              type="number"
              min="0"
              placeholder="Any"
              value={priceMax}
              onChange={(e) => onPriceMaxChange(e.target.value)}
              className="w-full h-8 px-2.5 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
