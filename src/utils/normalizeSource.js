export function normalizeSource(raw) {
  if (!raw || typeof raw !== "string") return "Unknown";

  const src = raw.trim().toLowerCase();

  // ---- COMMON SOURCES ----
  if (src.includes("linkedin") || src.includes("li.com")) return "LinkedIn";
  if (src.includes("indeed")) return "Indeed";
  if (src.includes("glassdoor")) return "Glassdoor";
  if (src.includes("angellist") || src.includes("angel.co")) return "AngelList";

  // ---- COMPANY WEBSITE HEURISTICS ----
  const companyKeywords = ["company", "career", "jobs", "www.", "http", ".com", ".in", ".co"];
  if (companyKeywords.some((kw) => src.includes(kw))) {
    return "Company Website";
  }

  // ---- FALLBACK: Title Case the raw source ----
  return src.charAt(0).toUpperCase() + src.slice(1);
}
