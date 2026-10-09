"use client";

import React, { useState } from "react";
import { ProductImage } from "@/components/ui/product-image";
import { sanitizeImageUrls } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const sanitizedImages = sanitizeImageUrls(images);
  const [activeIndex, setActiveIndex] = useState(0);

  const activeImage = sanitizedImages[activeIndex] || sanitizedImages[0];

  return (
    <div className="flex flex-col gap-3">
      {/* Main Image */}
      <div
        className="relative aspect-square w-full rounded-lg border border-border bg-muted overflow-hidden"
        style={{ position: "relative" }}
      >
        <ProductImage
          src={activeImage}
          alt={`${title} - view ${activeIndex + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {/* Thumbnails */}
      {sanitizedImages.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
          {sanitizedImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              style={{ position: "relative" }}
              className={`relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-md overflow-hidden border-2 bg-muted transition-all cursor-pointer ${
                activeIndex === idx
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border opacity-70 hover:opacity-100"
              }`}
              aria-label={`View thumbnail ${idx + 1}`}
            >
              <ProductImage
                src={img}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
