const DEFAULT_IMAGE = "/images/placeholder-fashion.svg";

export function resolveImageUrl(image?: string | null, fallback: string = DEFAULT_IMAGE): string {
  if (typeof image === "string") {
    const trimmed = image.trim();
    if (trimmed) {
      return trimmed;
    }
  }

  return fallback;
}

export function normalizeImageArray(images?: Array<string | null | undefined> | string | null, fallback: string = DEFAULT_IMAGE): string[] {
  if (Array.isArray(images)) {
    const filtered = images.map((image) => resolveImageUrl(image, "")).filter(Boolean);
    return filtered.length > 0 ? filtered : [fallback];
  }

  const singleImage = resolveImageUrl(typeof images === "string" ? images : undefined, "");
  return singleImage ? [singleImage] : [fallback];
}

export function getProductImage(images?: Array<string | null | undefined> | string | null, index = 0, fallback: string = DEFAULT_IMAGE): string {
  const normalized = normalizeImageArray(images, fallback);
  return normalized[Math.min(index, normalized.length - 1)] ?? fallback;
}
