import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { getProduct } from "@/lib/api/products";
import { formatPrice } from "@/lib/utils";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductActions } from "@/components/products/ProductActions";
import { RelatedProducts } from "@/components/products/RelatedProducts";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await getProduct(id);
    return {
      title: product.title,
      description: product.description.slice(0, 160),
    };
  } catch {
    return {
      title: "Product Details",
      description: "View product details and specifications",
    };
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;

  let product;
  try {
    product = await getProduct(id);
  } catch {
    return notFound();
  }

  if (!product || !product.id) {
    return notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb / Back button */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
        <Link href="/products" className="hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Products</span>
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        {product.category?.name && (
          <>
            <Link
              href={`/categories/${product.category.slug || product.category.id}`}
              className="hover:text-foreground transition-colors"
            >
              {product.category.name}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
          </>
        )}
        <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-xs">
          {product.title}
        </span>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Left: Image Gallery */}
        <div>
          <ProductGallery images={product.images} title={product.title} />
        </div>

        {/* Right: Info, Price, Description, Actions */}
        <div className="space-y-6">
          <div className="space-y-2">
            {product.category?.name && (
              <Link
                href={`/categories/${product.category.slug || product.category.id}`}
                className="inline-block text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              >
                {product.category.name}
              </Link>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {product.title}
            </h1>
            <p className="text-2xl sm:text-3xl font-semibold text-foreground pt-1">
              {formatPrice(product.price)}
            </p>
          </div>

          <div className="space-y-2 border-t border-border pt-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Description
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quantity Selector & Add to Cart */}
          <ProductActions product={product} />
        </div>
      </div>

      {/* Related Products Section */}
      <RelatedProducts productId={product.id} />
    </div>
  );
}
