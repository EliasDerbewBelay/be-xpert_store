import { apiClient } from "./client";
import type { Product, ProductFilterParams } from "@/types";

export async function getProducts(
  params?: ProductFilterParams,
  options?: RequestInit
): Promise<Product[]> {
  const queryParams: Record<string, string | number | undefined> = {};

  if (params?.title) queryParams.title = params.title.trim();
  if (params?.categoryId) queryParams.categoryId = params.categoryId;
  if (params?.price_min !== undefined) queryParams.price_min = params.price_min;
  if (params?.price_max !== undefined) queryParams.price_max = params.price_max;
  if (params?.offset !== undefined) queryParams.offset = params.offset;
  if (params?.limit !== undefined) queryParams.limit = params.limit;

  return apiClient<Product[]>("/products", {
    params: queryParams,
    ...options,
  });
}

export async function getProduct(
  id: number | string,
  options?: RequestInit
): Promise<Product> {
  return apiClient<Product>(`/products/${id}`, options);
}

export async function getProductBySlug(
  slug: string,
  options?: RequestInit
): Promise<Product> {
  return apiClient<Product>(`/products/slug/${encodeURIComponent(slug)}`, options);
}

export async function getRelatedProducts(
  id: number | string,
  options?: RequestInit
): Promise<Product[]> {
  return apiClient<Product[]>(`/products/${id}/related`, options);
}

export async function getRelatedProductsBySlug(
  slug: string,
  options?: RequestInit
): Promise<Product[]> {
  return apiClient<Product[]>(
    `/products/slug/${encodeURIComponent(slug)}/related`,
    options
  );
}
