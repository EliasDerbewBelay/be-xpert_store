import { apiClient } from "./client";
import type { Product, ProductFilterParams } from "@/types";
import { isTestOrMockProduct } from "../utils";

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

  const products = await apiClient<Product[]>("/products", {
    params: queryParams,
    ...options,
  });

  return Array.isArray(products)
    ? products.filter((p) => !isTestOrMockProduct(p))
    : [];
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
  const products = await apiClient<Product[]>(`/products/${id}/related`, options);
  return Array.isArray(products)
    ? products.filter((p) => !isTestOrMockProduct(p))
    : [];
}

export async function getRelatedProductsBySlug(
  slug: string,
  options?: RequestInit
): Promise<Product[]> {
  const products = await apiClient<Product[]>(
    `/products/slug/${encodeURIComponent(slug)}/related`,
    options
  );
  return Array.isArray(products)
    ? products.filter((p) => !isTestOrMockProduct(p))
    : [];
}

export async function createProduct(
  data: import("@/types").CreateProductRequest,
  options?: RequestInit
): Promise<Product> {
  return apiClient<Product>("/products", {
    method: "POST",
    body: JSON.stringify(data),
    ...options,
  });
}

export async function updateProduct(
  id: number | string,
  data: import("@/types").UpdateProductRequest,
  options?: RequestInit
): Promise<Product> {
  return apiClient<Product>(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    ...options,
  });
}

export async function deleteProduct(
  id: number | string,
  options?: RequestInit
): Promise<boolean> {
  return apiClient<boolean>(`/products/${id}`, {
    method: "DELETE",
    ...options,
  });
}
