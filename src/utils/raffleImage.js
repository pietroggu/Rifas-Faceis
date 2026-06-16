/**
 * Extracts a display-ready image URL from raffle payloads (PT/EN field names).
 * @param {Object} raffle
 * @returns {string|null}
 */
export function getRaffleImageUrl(raffle) {
  if (!raffle || typeof raffle !== "object") return null;

  const raw =
    raffle.imageUrl ??
    raffle.image_url ??
    raffle.imagem ??
    raffle.image ??
    raffle.photo ??
    raffle.prizeImage ??
    null;

  if (!raw || typeof raw !== "string") return null;

  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    const apiBase = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
    return apiBase ? `${apiBase}${trimmed}` : trimmed;
  }

  return trimmed;
}
