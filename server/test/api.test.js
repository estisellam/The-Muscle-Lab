import { describe, test, before, after } from "node:test";
import assert from "node:assert/strict";

const enabled = process.env.RUN_DB_TESTS === "1";
describe("HTTP integration against an explicitly isolated test database", { skip: !enabled, concurrency: false }, () => {
    let app, pool, server, base, memberToken, adminToken, memberId, planId, classId, trainerId;
    const suffix = `${Date.now()}-${process.pid}`;
    const email = `member-${suffix}@example.invalid`;
    const password = "Integration-test-only-123";
    const credentials = role => ({ first_name: "Audit", last_name: role, email: `${role}-${suffix}@example.invalid`, password });
    async function request(method, path, body, token) {
        const form = body instanceof FormData;
        const res = await fetch(base + path, {
            method,
            headers: { ...(!form && body !== undefined ? { "Content-Type": "application/json" } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            body: body === undefined ? undefined : form ? body : JSON.stringify(body)
        });
        const type = res.headers.get("content-type") || "";
        return { status: res.status, data: type.includes("application/json") ? await res.json() : await res.text(), headers: res.headers };
    }
    before(async () => {
        assert.match(process.env.DB_NAME || "", /^muscle_lab_test_/, "Integration tests require a dedicated DB_NAME starting with muscle_lab_test_");
        assert.ok(process.env.JWT_SECRET, "Set a test-only JWT_SECRET");
        ({ default: app } = await import("../app.js"));
        ({ default: pool } = await import("../config/db.js"));
        await pool.query("SELECT 1");
        server = app.listen(0, "127.0.0.1");
        await new Promise(resolve => server.once("listening", resolve));
        base = `http://127.0.0.1:${server.address().port}/api`;
        for (const [role, account] of [["member", { ...credentials("member"), email }], ["admin", credentials("admin")]]) {
            assert.equal((await request("POST", "/auth/register", account)).status, 201);
            if (role === "admin") await pool.execute("UPDATE Users SET role_id = (SELECT id FROM Roles WHERE name = 'Admin') WHERE email = ?", [account.email]);
            const login = await request("POST", "/auth/login", { email: account.email, password });
            assert.equal(login.status, 200);
            if (role === "member") { memberToken = login.data.token; memberId = login.data.user.id; }
            else adminToken = login.data.token;
        }
        planId = (await request("GET", "/membership-plans")).data[0].id;
        const classes = (await request("GET", "/classes", undefined, memberToken)).data;
        classId = classes[0].id;
        trainerId = classes[0].trainer_id;
    });
    after(async () => {
        if (server) await new Promise(resolve => server.close(resolve));
        if (pool) await pool.end();
        // Test data stays in the explicitly isolated database; never drop databases here.
    });
    test("public membership list and detail", async () => {
        const list = await request("GET", "/membership-plans");
        assert.equal(list.status, 200); assert.equal(list.data.length, 3);
        assert.equal((await request("GET", `/membership-plans/${planId}`)).status, 200);
    });
    test("protected endpoints reject missing or invalid JWTs", async () => {
        for (const path of ["/users/profile", "/users", "/classes", "/classes/my", "/user-memberships/me", "/trainers", "/dashboard/admin-overview"]) {
            assert.equal((await request("GET", path)).status, 401);
            assert.equal((await request("GET", path, undefined, "invalid")).status, 401);
        }
    });
    test("registration validation, duplicate emails, and invalid credentials", async () => {
        assert.equal((await request("POST", "/auth/register", {})).status, 400);
        assert.equal((await request("POST", "/auth/register", { ...credentials("member"), email })).status, 400);
        assert.equal((await request("POST", "/auth/login", { email, password: "wrong" })).status, 401);
        assert.equal((await request("POST", "/auth/login", {})).status, 401);
    });
    test("Members cannot use Admin APIs", async () => {
        for (const path of ["/users", "/classes/admin", "/dashboard/admin-overview"]) assert.equal((await request("GET", path, undefined, memberToken)).status, 403);
        assert.equal((await request("POST", "/trainers", {}, memberToken)).status, 403);
        assert.equal((await request("POST", "/membership-plans", {}, memberToken)).status, 403);
    });
    test("profile read/update preserves nullable fields and omits password hashes", async () => {
        const profile = await request("GET", "/users/profile", undefined, memberToken);
        assert.equal(profile.data.email, email); assert.equal(profile.data.password_hash, undefined);
        const update = await request("PUT", "/users/profile", { first_name: "Updated", birth_date: "", gender: "" }, memberToken);
        assert.equal(update.status, 200); assert.equal(update.data.user.first_name, "Updated");
        assert.equal(update.data.user.birth_date, null);
    });
    test("image upload works, uses a safe extension, and is served as an image", async () => {
        const form = new FormData();
        form.append("image", new Blob([Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jWZkAAAAASUVORK5CYII=", "base64")], { type: "image/png" }), "avatar.html");
        const upload = await request("PUT", "/users/profile/image", form, memberToken);
        assert.equal(upload.status, 200); assert.match(upload.data.user.profile_image, /\.png$/);
        const image = await fetch(base.replace(/\/api$/, "") + upload.data.user.profile_image);
        assert.equal(image.status, 200); assert.match(image.headers.get("content-type"), /image\/png/);
        assert.equal(image.headers.get("x-content-type-options"), "nosniff");
    });
    test("unsupported and oversized uploads return JSON client errors", async () => {
        for (const [blob, expected] of [[new Blob(["text"], { type: "text/plain" }), 400], [new Blob([new Uint8Array(6 * 1024 * 1024)], { type: "image/png" }), 413]]) {
            const form = new FormData(); form.append("image", blob, "test.png");
            const result = await request("PUT", "/users/profile/image", form, memberToken);
            assert.equal(result.status, expected); assert.ok(result.data.message);
        }
    });
    test("password changes reject wrong current passwords and support a new login", async () => {
        assert.equal((await request("PUT", "/users/change-password", { currentPassword: "wrong", newPassword: "Updated-test-only-123" }, memberToken)).status, 400);
        assert.equal((await request("PUT", "/users/change-password", { currentPassword: password, newPassword: "Updated-test-only-123" }, memberToken)).status, 200);
        assert.equal((await request("POST", "/auth/login", { email, password: "Updated-test-only-123" })).status, 200);
        assert.equal((await request("POST", "/auth/login", { email, password })).status, 401);
    });
    test("membership enrollment, duplicate prevention, read, and cancellation", async () => {
        assert.equal((await request("GET", "/user-memberships/me", undefined, memberToken)).data, null);
        assert.equal((await request("POST", "/user-memberships", { membership_plan_id: planId }, memberToken)).status, 201);
        const current = await request("GET", "/user-memberships/me", undefined, memberToken);
        assert.equal(current.data.membership_plan_id, planId);
        assert.equal((await request("POST", "/user-memberships", { membership_plan_id: planId }, memberToken)).status, 400);
        assert.equal((await request("PUT", "/user-memberships/cancel", undefined, memberToken)).status, 200);
        assert.equal((await request("GET", "/user-memberships/me", undefined, memberToken)).data, null);
    });
    test("calendar counts and date filtering", async () => {
        const counts = await request("GET", "/classes/date-counts?start=2026-08-01&end=2026-08-31", undefined, memberToken);
        assert.equal(counts.status, 200); assert.ok(counts.data.length > 0);
        const date = counts.data[0].class_date;
        const day = await request("GET", `/classes/by-date/${date}`, undefined, memberToken);
        assert.equal(day.status, 200); assert.ok(day.data.every(c => c.class_date === date));
        assert.equal((await request("GET", "/classes/date-counts", undefined, memberToken)).status, 400);
    });
    test("class registration, duplicate handling, cancellation with attendance, and re-registration", async () => {
        assert.equal((await request("POST", `/classes/${classId}/register`, undefined, memberToken)).status, 201);
        assert.equal((await request("POST", `/classes/${classId}/register`, undefined, memberToken)).status, 409);
        await pool.execute("INSERT INTO Attendance (class_registration_id) SELECT id FROM ClassRegistrations WHERE class_id = ? AND user_id = ?", [classId, memberId]);
        const mine = await request("GET", "/classes/my", undefined, memberToken);
        assert.ok(mine.data.some(c => c.id === classId));
        assert.equal((await request("DELETE", `/classes/${classId}/register`, undefined, memberToken)).status, 200);
        assert.equal((await request("POST", `/classes/${classId}/register`, undefined, memberToken)).status, 201);
    });
    test("expired memberships do not prevent a new enrollment", async () => {
        await pool.execute("INSERT INTO UserMemberships (user_id, membership_plan_id, start_date, end_date, status) VALUES (?, ?, '2020-01-01', '2020-02-01', 'Active')", [memberId, planId]);
        assert.equal((await request("GET", "/user-memberships/me", undefined, memberToken)).data, null);
        assert.equal((await request("POST", "/user-memberships", { membership_plan_id: planId }, memberToken)).status, 201);
        assert.equal((await request("PUT", "/user-memberships/cancel", undefined, memberToken)).status, 200);
    });
    test("simultaneous membership enrollments create only one active membership", async () => {
        const results = await Promise.all([1, 2].map(() => request("POST", "/user-memberships", { membership_plan_id: planId }, memberToken)));
        assert.deepEqual(results.map(r => r.status).sort(), [201, 400]);
        const [rows] = await pool.execute("SELECT COUNT(*) AS count FROM UserMemberships WHERE user_id = ? AND status = 'Active' AND end_date >= CURRENT_DATE", [memberId]);
        assert.equal(Number(rows[0].count), 1);
        await request("PUT", "/user-memberships/cancel", undefined, memberToken);
    });
    test("invalid class capacities, dates, and time ranges are rejected", async () => {
        const cls = { trainer_id: trainerId, title: "Invalid fixture", class_date: "2026-12-01", start_time: "10:00", end_time: "11:00", capacity: 1 };
        for (const patch of [{ capacity: -1 }, { capacity: 1.5 }, { end_time: "09:00" }, { class_date: "2026-02-30" }]) {
            assert.equal((await request("POST", "/classes/admin", { ...cls, ...patch }, adminToken)).status, 400);
        }
    });
    test("simultaneous registrations cannot overbook a capacity-one class", async () => {
        const cls = { trainer_id: trainerId, title: `Concurrent ${suffix}`, class_date: "2026-12-01", start_time: "10:00", end_time: "11:00", capacity: 1 };
        assert.equal((await request("POST", "/classes/admin", cls, adminToken)).status, 201);
        const id = (await request("GET", "/classes/admin", undefined, adminToken)).data.find(c => c.title === cls.title).id;
        const results = await Promise.all([memberToken, adminToken].map(token => request("POST", `/classes/${id}/register`, undefined, token)));
        assert.deepEqual(results.map(r => r.status).sort(), [201, 409]);
        const row = (await request("GET", "/classes/admin", undefined, adminToken)).data.find(c => c.id === id);
        assert.equal(Number(row.registered_count), 1);
    });
    test("Admin dashboard and users APIs return real database data", async () => {
        assert.equal((await request("GET", "/users", undefined, adminToken)).status, 200);
        assert.equal((await request("GET", `/users/${memberId}`, undefined, adminToken)).data.id, memberId);
        const overview = await request("GET", "/dashboard/admin-overview", undefined, adminToken);
        assert.equal(overview.status, 200); assert.ok(overview.data.classCount >= 5);
    });
    test("Admin membership plan CRUD", async () => {
        const plan = { name: `Audit ${suffix}`, duration_months: 1, price: 50, description: "Synthetic test plan" };
        assert.equal((await request("POST", "/membership-plans", plan, adminToken)).status, 201);
        const id = (await request("GET", "/membership-plans")).data.find(p => p.name === plan.name).id;
        assert.equal((await request("PUT", `/membership-plans/${id}`, { price: 60 }, adminToken)).status, 200);
        assert.equal((await request("DELETE", `/membership-plans/${id}`, undefined, adminToken)).status, 200);
    });
    test("Admin trainer CRUD on an unreferenced synthetic user", async () => {
        const account = credentials("trainer");
        assert.equal((await request("POST", "/auth/register", account)).status, 201);
        const users = (await request("GET", "/users", undefined, adminToken)).data;
        const userId = users.find(u => u.email === account.email).id;
        assert.equal((await request("POST", "/trainers", { user_id: userId, specialization: "Testing" }, adminToken)).status, 201);
        const id = (await request("GET", "/trainers", undefined, adminToken)).data.find(t => t.user_id === userId).id;
        assert.equal((await request("PUT", `/trainers/${id}`, { specialization: "Updated", experience_years: 2, biography: "Test" }, adminToken)).status, 200);
        assert.equal((await request("GET", `/trainers/${id}`, undefined, adminToken)).data.specialization, "Updated");
        assert.equal((await request("DELETE", `/trainers/${id}`, undefined, adminToken)).status, 200);
        assert.equal((await request("DELETE", `/users/${userId}`, undefined, adminToken)).status, 200);
    });
    test("Admin class CRUD and participant lookup", async () => {
        const cls = { trainer_id: trainerId, title: `Audit ${suffix}`, class_date: "2026-12-01", start_time: "10:00:00", end_time: "11:00:00", room: "Test", capacity: 2 };
        assert.equal((await request("POST", "/classes/admin", cls, adminToken)).status, 201);
        const id = (await request("GET", "/classes/admin", undefined, adminToken)).data.find(c => c.title === cls.title).id;
        assert.equal((await request("PUT", `/classes/admin/${id}`, { ...cls, capacity: 3 }, adminToken)).status, 200);
        assert.equal((await request("GET", `/classes/admin/${id}/participants`, undefined, adminToken)).status, 200);
        assert.equal((await request("DELETE", `/classes/admin/${id}`, undefined, adminToken)).status, 200);
    });
});
