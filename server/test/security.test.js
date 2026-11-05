import { test } from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

function response() {
    return { statusCode: 200, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } };
}
test("bcrypt verifies a password and rejects an incorrect password", async () => {
    const hash = await hashPassword("test-only-password");
    assert.notEqual(hash, "test-only-password");
    assert.equal(await comparePassword("test-only-password", hash), true);
    assert.equal(await comparePassword("wrong-password", hash), false);
});
test("authentication rejects missing and invalid tokens", () => {
    for (const authorization of [undefined, "Bearer invalid"]) {
        const res = response();
        authMiddleware({ headers: { authorization } }, res, () => assert.fail("must not authorize"));
        assert.equal(res.statusCode, 401);
    }
});
test("authentication accepts a valid JWT and rejects an expired JWT", () => {
    const previous = process.env.JWT_SECRET;
    process.env.JWT_SECRET = "unit-test-only-key";
    try {
        const req = { headers: { authorization: `Bearer ${jwt.sign({ id: "test", role: "Member" }, process.env.JWT_SECRET)}` } };
        let called = false;
        authMiddleware(req, response(), () => { called = true; });
        assert.equal(called, true);
        assert.equal(req.user.id, "test");
        req.headers.authorization = `Bearer ${jwt.sign({ id: "test" }, process.env.JWT_SECRET, { expiresIn: -1 })}`;
        const res = response();
        authMiddleware(req, res, () => assert.fail("expired token"));
        assert.equal(res.statusCode, 401);
    } finally {
        if (previous === undefined) delete process.env.JWT_SECRET;
        else process.env.JWT_SECRET = previous;
    }
});
test("RBAC requires authentication and blocks Member access to Admin handlers", () => {
    for (const [user, expected] of [[undefined, 401], [{ role: "Member" }, 403]]) {
        const res = response();
        authorizeRoles("Admin")({ user }, res, () => assert.fail("must not authorize"));
        assert.equal(res.statusCode, expected);
    }
    let called = false;
    authorizeRoles("Admin")({ user: { role: "Admin" } }, response(), () => { called = true; });
    assert.equal(called, true);
});
