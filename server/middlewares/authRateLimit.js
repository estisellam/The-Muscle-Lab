import { rateLimit } from "express-rate-limit";

export function createAuthRateLimit({ limit = 15, windowMs = 15 * 60 * 1000, skipSuccessfulRequests = false } = {}) {
    return rateLimit({
        limit,
        windowMs,
        skipSuccessfulRequests,
        standardHeaders: "draft-8",
        legacyHeaders: false,
        message: { message: "Too many authentication attempts. Please try again later." }
    });
}
