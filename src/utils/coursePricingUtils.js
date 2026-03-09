/**
 * Format money value with currency
 */
export const formatMoney = (amount, currency) => {
    if (amount == null) return "";
    return currency ? `${amount} ${currency}` : String(amount);
};

/**
 * Get pricing information from course
 */
export const getCoursePricing = (course) => ({
    effective: null,
    comboFee: course?.comboFee ?? null,
    currency: course?.currency ?? "BDT",
});

/**
 * Resolve asset URL.
 * Handles:
 *  - Already-absolute URLs (http/https) → returned as-is
 *  - Windows absolute paths (e.g. D:/scholarX-backend/uploads/file.jpg)
 *    → extract everything from "uploads/" onward and prefix with API base
 *  - Relative paths (e.g. uploads/file.jpg or /uploads/file.jpg)
 *    → prefix with API base
 */
export const resolveAssetUrl = (url) => {
    if (typeof url !== "string" || !url) return "";
    // Already a valid http/https URL
    if (/^https?:\/\//i.test(url)) return url;
    const base = (import.meta.env.VITE_API_BASE_URL || window.location.origin).replace(/\/+$/, "");
    // Windows absolute path or any path containing a drive letter (e.g. C:\ or D:/)
    // Extract from "uploads/" onward so we end up with /uploads/<filename>
    const uploadsMatch = url.replace(/\\/g, "/").match(/uploads\/.+/);
    if (uploadsMatch) {
        return `${base}/${uploadsMatch[0]}`;
    }
    // Normal relative path
    const path = url.startsWith("/") ? url : `/${url}`;
    return base + path;
};

/**
 * Format date to YYYY-MM-DD format
 */
export const formatDate = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value).slice(0, 10);
    return d.toISOString().slice(0, 10);
};
