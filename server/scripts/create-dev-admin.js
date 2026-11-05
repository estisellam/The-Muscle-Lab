import pool from "../config/db.js";
import { register } from "../services/authService.js";

if (process.env.NODE_ENV === "production") throw new Error("Development setup is disabled in production");
const email = process.env.DEV_ADMIN_EMAIL;
const password = process.env.DEV_ADMIN_PASSWORD;
if (!email || !password) throw new Error("Set DEV_ADMIN_EMAIL and DEV_ADMIN_PASSWORD for a new local account");
try {
    // register rejects existing emails; this command never resets another account.
    await register({ first_name: "Demo", last_name: "Admin", email, password });
    await pool.execute(`UPDATE Users SET role_id = (SELECT id FROM Roles WHERE name = 'Admin') WHERE email = ?`, [email]);
    console.log("Created development Admin account. Sign in with the credentials you supplied.");
} finally {
    await pool.end();
}
