import { test } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import cors from "cors";
import { createCorsOptions } from "../config/cors.js";
import { createAuthRateLimit } from "../middlewares/authRateLimit.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import jwt from "jsonwebtoken";

async function withServer(app, run) {
    const server = app.listen(0, "127.0.0.1");
    await new Promise(resolve => server.once("listening", resolve));
    try { await run(`http://127.0.0.1:${server.address().port}`); }
    finally { await new Promise(resolve => server.close(resolve)); }
}
function originCheck(options, origin) {
    return new Promise((resolve, reject) => options.origin(origin, (error, allowed) => error ? reject(error) : resolve(allowed)));
}
test("development CORS permits loopback browsers and rejects unrelated origins", async () => {
    const options = createCorsOptions({ production: false, origins: "" });
    for (const origin of [undefined, "http://localhost:5173", "http://127.0.0.1:35174", "http://[::1]:5173"]) assert.equal(await originCheck(options, origin), true);
    for (const origin of ["https://untrusted.example", "http://localhost.evil.example", "null"]) await assert.rejects(originCheck(options, origin), error => error.status === 403);
});
test("production CORS requires exact configured origins", async () => {
    assert.throws(() => createCorsOptions({ production: true, origins: "" }), /CORS_ORIGINS/);
    assert.throws(() => createCorsOptions({ production: true, origins: "https://gym.example/path" }));
    const options = createCorsOptions({ production: true, origins: "https://gym.example, https://admin.gym.example" });
    assert.equal(await originCheck(options, "https://gym.example"), true);
    assert.equal(await originCheck(options, undefined), true);
    await assert.rejects(originCheck(options, "https://gym.example.attacker.invalid"), error => error.status === 403);
});
test("CORS sends a matching preflight header and rejects disallowed browser requests", async () => {
    const app = express();
    app.use(cors(createCorsOptions({ production: true, origins: "https://gym.example" })));
    app.get("/", (req, res) => res.json({ ok: true }));
    app.use((error, req, res, next) => res.status(error.status || 500).json({ message: error.message }));
    await withServer(app, async base => {
        const preflight = await fetch(base, { method: "OPTIONS", headers: { Origin: "https://gym.example", "Access-Control-Request-Method": "GET" } });
        assert.equal(preflight.status, 204);
        assert.equal(preflight.headers.get("access-control-allow-origin"), "https://gym.example");
        assert.equal((await fetch(base, { headers: { Origin: "https://attacker.invalid" } })).status, 403);
        assert.equal((await fetch(base)).status, 200);
    });
});
test("authentication throttling returns JSON 429 and Retry-After", async () => {
    const app = express();
    app.post("/login", createAuthRateLimit({ limit: 2 }), (req, res) => res.status(401).json({ message: "invalid credentials" }));
    await withServer(app, async base => {
        assert.equal((await fetch(`${base}/login`, { method: "POST" })).status, 401);
        assert.equal((await fetch(`${base}/login`, { method: "POST" })).status, 401);
        const blocked = await fetch(`${base}/login`, { method: "POST" });
        assert.equal(blocked.status, 429);
        assert.ok(blocked.headers.get("retry-after"));
        assert.match((await blocked.json()).message, /Too many/);
    });
});
test("successful logins do not exhaust the failed-login budget", async () => {
    const app = express();
    app.post("/login", createAuthRateLimit({ limit: 1, skipSuccessfulRequests: true }), (req, res) => res.json({ ok: true }));
    await withServer(app, async base => {
        for (let i = 0; i < 3; i++) assert.equal((await fetch(`${base}/login`, { method: "POST" })).status, 200);
    });
});
test("a valid JWT cannot be supplied under a non-Bearer scheme", () => {
    const previous = process.env.JWT_SECRET;
    process.env.JWT_SECRET = "hardening-test-only-key";
    try {
        const token = jwt.sign({ id: "fixture", role: "Member" }, process.env.JWT_SECRET);
        for (const authorization of [`Basic ${token}`, token, `Bearer ${token} extra`]) {
            const res = { status(code) { this.code = code; return this; }, json() { return this; } };
            authMiddleware({ headers: { authorization } }, res, () => assert.fail("invalid scheme must be rejected"));
            assert.equal(res.code, 401);
        }
    } finally {
        if (previous === undefined) delete process.env.JWT_SECRET;
        else process.env.JWT_SECRET = previous;
    }
});
