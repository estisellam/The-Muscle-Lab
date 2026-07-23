import pool from "../config/db.js";

// find user by email
export async function findUserByEmail(email) {

    const [rows] = await pool.execute(
        `
        SELECT
            Users.*,
            Roles.name AS role
        FROM Users
        INNER JOIN Roles
            ON Users.role_id = Roles.id
        WHERE Users.email = ?
        `,
        [email]
    );

    return rows[0];
}

// find user by id
export async function findUserById(id) {

    const [rows] = await pool.execute(
        `
        SELECT
            Users.id,
            Users.first_name,
            Users.last_name,
            Users.email,
            Users.phone,
            Users.birth_date,
            Users.gender,
            Users.profile_image,
            Users.join_date,
            Roles.name AS role
        FROM Users
        INNER JOIN Roles
            ON Users.role_id = Roles.id
        WHERE Users.id = ?
        `,
        [id]
    );

    return rows[0];
}

// find user password by id
export async function findUserPasswordById(id) {

    const [rows] = await pool.execute(
        `
        SELECT password_hash
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
            Users.first_name,
            Users.last_name,
            Users.email,
            Users.phone,
            Users.birth_date,
            Users.gender,
            Users.profile_image,
            Users.join_date,
            Roles.name AS role
        FROM Users
        INNER JOIN Roles
            ON Users.role_id = Roles.id
        ORDER BY Users.first_name, Users.last_name
        `
    );

    return rows;
}

// create user
export async function createUser(user) {

    const [roles] = await pool.execute(
        `
        SELECT id
        FROM Roles
        WHERE name = 'Member'
        `
    );

    if (roles.length === 0) {
        throw new Error("member role not found");
    }

    const roleId = roles[0].id;

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
// update profile image
export async function updateProfileImage(id, imagePath) {

    await pool.execute(
        `
        UPDATE Users
        SET profile_image = ?
        WHERE id = ?
        `,
        [
            imagePath,
            id
        ]
    );
}