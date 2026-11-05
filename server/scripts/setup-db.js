import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { readFile } from "node:fs/promises";

dotenv.config({ path: new URL("../.env", import.meta.url).pathname });
const database = process.env.DB_NAME;
if (!database || !/^[A-Za-z0-9_]+$/.test(database)) {
    throw new Error("Set DB_NAME to a database name containing only letters, numbers, and underscores");
}
const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD ?? "",
    multipleStatements: true
});
try {
    // CREATE (without IF NOT EXISTS) refuses existing databases. Never run DROP.
    await connection.query(`CREATE DATABASE \`${database}\``);
    await connection.query(`USE \`${database}\``);
    const schema = await readFile(new URL("../database/schema.sql", import.meta.url), "utf8");
    const seed = await readFile(new URL("../database/seed.sql", import.meta.url), "utf8");
    await connection.query(schema.replace(/^(?:DROP DATABASE|CREATE DATABASE|USE )[^\n]*\n?/gm, ""));
    await connection.query(seed.replace(/^USE [^\n]*\n?/gm, ""));
    console.log("Created database, 10 tables, and development seed data.");
} finally {
    await connection.end();
}
