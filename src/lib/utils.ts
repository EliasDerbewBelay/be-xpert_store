import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format numerical price consistently across the entire application.
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

/**
 * Fallback placeholder image URL (clean neutral SVG data URI)
 */
export const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'><rect width='100%' height='100%' fill='%23f4f4f5'/><path d='M250 260a30 30 0 1 0 0-60 30 30 0 0 0 0 60zm-70 120h240l-75-100-60 80-45-50-60 70z' fill='%23a1a1aa'/><text x='50%' y='75%' text-anchor='middle' fill='%2371717a' font-family='sans-serif' font-size='20'>No Image Available</text></svg>";

const DEAD_DOMAINS = [
  "placeimg.com",
  "lorem.space",
  "image-1.co",
  "example.com",
];

/**
 * EscuelaJS sometimes returns images as JSON strings like `["[\"https://...\"]"]`, raw unparsed arrays,
 * or pointing to defunct domains like placeimg.com.
 * This helper cleans and extracts valid URLs.
 */
export function sanitizeImageUrl(url: unknown): string {
  if (typeof url !== "string") {
    return PLACEHOLDER_IMAGE;
  }

  let cleaned = url.trim();

  // Handle bracketed/escaped JSON strings often submitted to EscuelaJS
  if (cleaned.startsWith("[") || cleaned.startsWith('"')) {
    cleaned = cleaned.replace(/^[\["'\s]+|[\]"'\s]+$/g, "");
  }

  // Remove trailing or leading quotes
  cleaned = cleaned.replace(/^["']|["']$/g, "");

  if (!cleaned.startsWith("http://") && !cleaned.startsWith("https://")) {
    return PLACEHOLDER_IMAGE;
  }

  // Check for dead or dummy domains in EscuelaJS DB
  const isDead = DEAD_DOMAINS.some((domain) => cleaned.includes(domain));
  if (isDead) {
    return PLACEHOLDER_IMAGE;
  }

  return cleaned;
}

export function sanitizeImageUrls(urls: unknown): string[] {
  if (!Array.isArray(urls)) {
    if (typeof urls === "string") {
      const single = sanitizeImageUrl(urls);
      return [single];
    }
    return [PLACEHOLDER_IMAGE];
  }

  const sanitized = urls
    .map((u) => sanitizeImageUrl(u))
    .filter((u) => u !== PLACEHOLDER_IMAGE);

  return sanitized.length > 0 ? sanitized : [PLACEHOLDER_IMAGE];
}

/**
 * Identifies test, mock, or bot-generated products from public sandbox APIs.
 */
export function isTestOrMockProduct(product: {
  title?: string;
  description?: string;
  category?: { name?: string };
}): boolean {
  if (!product) return true;
  const title = (product.title || "").toLowerCase().trim();
  const desc = (product.description || "").toLowerCase().trim();
  const catName = (product.category?.name || "").toLowerCase().trim();

  // Automated bot patterns like title-<uuid> or desc-<uuid>
  if (/^title-[0-9a-f-]{8,}/i.test(title)) return true;
  if (/^desc-[0-9a-f-]{8,}/i.test(desc)) return true;

  // Generic test/mock titles
  if (/^(test|mock|dummy|sample)\b/i.test(title)) return true;
  if (title === "test" || title === "mock" || title === "dummy") return true;

  // Bot-generated category patterns
  if (/_[0-9a-f]{12,}/i.test(catName)) return true;
  if (catName === "test" || /^test\b/i.test(catName)) return true;

  return false;
}

/**
 * Identifies test or mock categories from public sandbox APIs.
 */
export function isTestOrMockCategory(category: { name?: string }): boolean {
  if (!category || !category.name) return true;
  const name = category.name.toLowerCase().trim();

  if (/^(test|mock|dummy|sample)\b/i.test(name)) return true;
  if (/_[0-9a-f]{12,}/i.test(name)) return true;
  if (/^new category\b/i.test(name)) return true;
  if (name === "my category" || name === "updated category name") return true;

  return false;
}

