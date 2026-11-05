// VITE_API_URL is the backend origin, without /api.
export const API_ORIGIN = (import.meta.env?.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");
export const API_BASE_URL = `${API_ORIGIN}/api`;

export function profileImageUrl(image) {
    if (!image) return "/avatar.svg";
    if (image.startsWith("/uploads/")) return `${API_ORIGIN}${image}`;
    return /^https?:\/\//.test(image) ? image : "/avatar.svg";
}
