"use client";

import React, { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { PLACEHOLDER_IMAGE, sanitizeImageUrl } from "@/lib/utils";

interface ProductImageProps extends Omit<ImageProps, "src" | "onError"> {
  src?: string | null;
  fallbackSrc?: string;
}

export function ProductImage({
  src,
  alt,
  className,
  fallbackSrc = PLACEHOLDER_IMAGE,
  fill,
  ...props
}: ProductImageProps) {
  const sanitized = sanitizeImageUrl(src);
  const [imgSrc, setImgSrc] = useState<string>(sanitized);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    setImgSrc(sanitizeImageUrl(src));
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <Image
      src={imgSrc || fallbackSrc}
      alt={alt || "Product image"}
      className={className}
      onError={handleError}
      fill={fill}
      unoptimized
      {...props}
    />
  );
}
