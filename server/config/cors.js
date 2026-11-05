export function createCorsOptions({
    production = process.env.NODE_ENV === "production",
    origins = process.env.CORS_ORIGINS || ""
} = {}) {
    const allowed = new Set(origins.split(",").map(origin => origin.trim()).filter(Boolean));
    for (const origin of allowed) {
        const url = new URL(origin);
        if (!["http:", "https:"].includes(url.protocol) || url.origin !== origin) {
            throw new Error("CORS_ORIGINS must contain origins without paths or trailing slashes");
        }
    }
    if (production && allowed.size === 0) {
        throw new Error("Set CORS_ORIGINS to explicit frontend origins in production");
    }
    return {
        origin(origin, callback) {
            // Native clients and same-origin requests may omit Origin.
            if (!origin || allowed.has(origin)) return callback(null, true);
            if (!production && allowed.size === 0) {
                try {
                    const url = new URL(origin);
                    if (url.origin === origin && ["http:", "https:"].includes(url.protocol) &&
                        ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) {
                        return callback(null, true);
                    }
                } catch { /* Invalid origins are denied below. */ }
            }
            callback(Object.assign(new Error("Origin is not allowed"), { status: 403 }));
        }
    };
}
