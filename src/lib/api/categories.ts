import { apiClient } from "./client";
import type { Category, Product } from "@/types";
import { isTestOrMockCategory, isTestOrMockProduct } from "../utils";

export async function getCategories(
  options?: RequestInit
): Promise<Category[]> {
  const categories = await apiClient<Category[]>("/categories", options);
  return Array.isArray(categories)
    ? categories.filter((c) => !isTestOrMockCategory(c))
    : [];
}

export async function getCategory(
  id: number | string,
  options?: RequestInit
): Promise<Category> {
  return apiClient<Category>(`/categories/${id}`, options);
}

export async function getCategoryBySlug(
  slug: string,
  options?: RequestInit
): Promise<Category> {
  return apiClient<Category>(`/categories/slug/${encodeURIComponent(slug)}`, options);
}

export async function getCategoryProducts(
  id: number | string,
  options?: RequestInit
): Promise<Product[]> {
  const products = await apiClient<Product[]>(`/categories/${id}/products`, options);
  return Array.isArray(products)
    ? products.filter((p) => !isTestOrMockProduct(p))
    : [];
}
