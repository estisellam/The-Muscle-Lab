import pool from "../config/db.js";

// Get all classes
export async function getAllClasses(userId) {

    const [rows] = await pool.query(
        `
        SELECT
            c.id,
            c.title,
            c.description,
            c.class_date,
            c.start_time,
            c.end_time,
            c.room,
            c.capacity,

            CONCAT(
                u.first_name,
                ' ',
                u.last_name
            ) AS trainer_name,

            COUNT(cr.id) AS registered_count,

            (
                c.capacity - COUNT(cr.id)
            ) AS available_spots,

            CASE
                WHEN myRegistration.id IS NULL THEN 0
                ELSE 1
            END AS is_registered

        FROM Classes c

        JOIN Trainers t
            ON c.trainer_id = t.id

        JOIN Users u
            ON t.user_id = u.id

        LEFT JOIN ClassRegistrations cr
            ON c.id = cr.class_id

        LEFT JOIN ClassRegistrations myRegistration
            ON myRegistration.class_id = c.id
            AND myRegistration.user_id = ?

        GROUP BY
            c.id

        ORDER BY
            c.class_date,
            c.start_time
        `,
        [userId]
    );

    return rows;

}

export async function registerToClass(classId, userId) {

    const [existing] = await pool.query(
        `
        SELECT id
        FROM ClassRegistrations
        WHERE class_id = ?
        AND user_id = ?
        `,
        [classId, userId]
    );

    if (existing.length > 0) {

        throw new Error("You are already registered for this class.");

    }

    await pool.query(
        `
        INSERT INTO ClassRegistrations
        (
            class_id,
            user_id
        )
        VALUES (?, ?)
        `,
        [classId, userId]
    );

}

// Get classes of logged in user
export async function getMyClasses(userId) {

    const [rows] = await pool.query(
        `
        SELECT
            c.id,
            c.title,
            c.description,
            c.class_date,
            c.start_time,
            c.end_time,
            c.room,

            CONCAT(
                u.first_name,
                ' ',
                u.last_name
            ) AS trainer_name

        FROM ClassRegistrations cr

        JOIN Classes c
            ON cr.class_id = c.id

        JOIN Trainers t
            ON c.trainer_id = t.id

        JOIN Users u
            ON t.user_id = u.id

        WHERE cr.user_id = ?

        ORDER BY
            c.class_date,
            c.start_time
        `,
        [userId]
    );

    return rows;

}

export async function cancelClassRegistration(
    classId,
    userId
) {

    await pool.query(
        `
        DELETE FROM ClassRegistrations
        WHERE class_id = ?
        AND user_id = ?
        `,
        [
            classId,
            userId
        ]
    );

}