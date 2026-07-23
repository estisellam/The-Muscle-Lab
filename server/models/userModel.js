import pool from "../config/db.js";

// find user by email
export async function findUserByEmail(email) {

    const [rows] = await pool.execute(
        `
        SELECT *
        FROM Users
        WHERE email = ?
        `,
        [email]
    );

    return rows[0];
}

// find user by id
export async function findUserById(id) {

    const [rows] = await pool.execute(
        `
        SELECT *
        FROM Users
        WHERE id = ?
        `,
        [id]
    );

    return rows[0];
}

// get all users
export async function getAllUsers() {

    const [rows] = await pool.execute(
        `
        SELECT
            Users.id,
            first_name,
            last_name,
            email,
            phone,
            birth_date,
            gender,
            profile_image,
            join_date,
            Roles.name AS role
        FROM Users
        JOIN Roles
        ON Users.role_id = Roles.id
        `
    );

    return rows;
}

// create user
export async function createUser(user) {

    const [role] = await pool.execute(
        `
        SELECT id
        FROM Roles
        WHERE name = 'Member'
        `
    );

    const roleId = role[0].id;

    await pool.execute(
        `
        INSERT INTO Users
        (
            role_id,
            first_name,
            last_name,
            email,
            password_hash,
            phone,
            birth_date,
            gender
        )
        VALUES
        (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?
        )
        `,
        [
            roleId,
            user.first_name,
            user.last_name,
            user.email,
            user.password_hash,
            user.phone,
            user.birth_date,
            user.gender
        ]
    );
}

// update profile
export async function updateUser(id, user) {

    await pool.execute(
        `
        UPDATE Users
        SET
            first_name = ?,
            last_name = ?,
            phone = ?,
            birth_date = ?,
            gender = ?,
            profile_image = ?
        WHERE id = ?
        `,
        [
            user.first_name,
            user.last_name,
            user.phone,
            user.birth_date,
            user.gender,
            user.profile_image,
            id
        ]
    );
}

// update password
export async function updatePassword(id, passwordHash) {

    await pool.execute(
        `
        UPDATE Users
        SET password_hash = ?
        WHERE id = ?
        `,
        [
            passwordHash,
            id
        ]
    );
}

// delete user
export async function deleteUser(id) {

    await pool.execute(
        `
        DELETE FROM Users
        WHERE id = ?
        `,
        [id]
    );
}