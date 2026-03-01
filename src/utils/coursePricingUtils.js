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
 * Resolve asset URL
 */
export const resolveAssetUrl = (url) => {
    if (typeof url !== "string" || !url) return "";
    // if it's already absolute, just return it
    if (/^https?:\/\//i.test(url)) return url;
    // otherwise prefix with API base so that relative paths from backend resolve correctly
    const base = import.meta.env.VITE_API_BASE_URL || "";
    // ensure no double slashes when concatenating
    const prefix = base.replace(/\/+$/, "");
    const path = url.startsWith("/") ? url : `/${url}`;
    return prefix + path;
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
