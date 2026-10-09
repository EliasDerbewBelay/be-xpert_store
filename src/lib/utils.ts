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
