export default function getStartDateForRange(range){
    const now = Date.now();

    const ranges = {
        "1m": 30 * 24 * 60 * 60 * 1000,
        "3m": 90 * 24 * 60 * 60 * 1000,
        "6m": 180 * 24 * 60 * 60 * 1000,
        "1y": 365 * 24 * 60 * 60 * 1000
    };

    // For all-time analytics, return null so callers can skip date filtering entirely.
    const duration = ranges[range];
    if (!duration) return null

    return new Date(now - duration);
}