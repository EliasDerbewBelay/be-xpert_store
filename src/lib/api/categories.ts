import { apiClient } from "./client";
import type { Category, Product } from "@/types";

export async function getCategories(
  options?: RequestInit
): Promise<Category[]> {
  return apiClient<Category[]>("/categories", options);
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
  return apiClient<Product[]>(`/categories/${id}/products`, options);
}
