export default function getStartDateForRange(range){
    const now = Date.now();

    const ranges = {
        "1m": 30 * 24 * 60 * 60 * 1000,
        "3m": 90 * 24 * 60 * 60 * 1000,
        "6m": 180 * 24 * 60 * 60 * 1000,
        "1y": 365 * 24 * 60 * 60 * 1000
    };

    //By default,return all the applications throughout the life of the user, not filtering by date
    const duration = ranges[range] || Infinity;
    return new Date(now - duration);
}