import pool from "../config/db.js";

export async function getAllClasses(userId) {
    const [rows] = await pool.execute(
        `
        SELECT
            c.id,
            c.trainer_id,
            c.title,
            c.description,
            c.class_date,
            c.start_time,
            c.end_time,
            c.room,
            c.capacity,
            CONCAT(u.first_name, ' ', u.last_name) AS trainer_name,
            COALESCE(reg_count.registered_count, 0) AS registered_count,
            c.capacity - COALESCE(reg_count.registered_count, 0) AS available_spots,
            CASE WHEN ur.user_id IS NOT NULL THEN 1 ELSE 0 END AS is_registered
        FROM Classes c
        INNER JOIN Trainers t ON c.trainer_id = t.id
        INNER JOIN Users u ON t.user_id = u.id
        LEFT JOIN (
            SELECT class_id, COUNT(*) AS registered_count
            FROM ClassRegistrations
            WHERE status = 'Registered'
            GROUP BY class_id
        ) reg_count ON reg_count.class_id = c.id
        LEFT JOIN (
            SELECT class_id, user_id
            FROM ClassRegistrations
            WHERE user_id = ? AND status = 'Registered'
        ) ur ON ur.class_id = c.id
        ORDER BY c.class_date, c.start_time
        `,
        [userId]
    );

    return rows;
}

export async function getClassDateCounts(startDate, endDate) {
    const [rows] = await pool.execute(
        `
        SELECT
            class_date,
            COUNT(*) AS count
        FROM Classes
        WHERE class_date BETWEEN ? AND ?
        GROUP BY class_date
        `,
        [startDate, endDate]
    );

    return rows;
}

export async function getClassesByDate(date, userId) {
    const [rows] = await pool.execute(
        `
        SELECT
            c.id,
            c.trainer_id,
            c.title,
            c.description,
            c.class_date,
            c.start_time,
            c.end_time,
            c.room,
            c.capacity,
            CONCAT(u.first_name, ' ', u.last_name) AS trainer_name,
            COALESCE(reg_count.registered_count, 0) AS registered_count,
            c.capacity - COALESCE(reg_count.registered_count, 0) AS available_spots,
            CASE WHEN ur.user_id IS NOT NULL THEN 1 ELSE 0 END AS is_registered
        FROM Classes c
        INNER JOIN Trainers t ON c.trainer_id = t.id
        INNER JOIN Users u ON t.user_id = u.id
        LEFT JOIN (
            SELECT class_id, COUNT(*) AS registered_count
            FROM ClassRegistrations
            WHERE status = 'Registered'
            GROUP BY class_id
        ) reg_count ON reg_count.class_id = c.id
        LEFT JOIN (
            SELECT class_id, user_id
            FROM ClassRegistrations
            WHERE user_id = ? AND status = 'Registered'
        ) ur ON ur.class_id = c.id
        WHERE c.class_date = ?
        ORDER BY c.start_time
        `,
        [userId, date]
    );

    return rows;
}

export async function getMyClasses(userId) {
    const [rows] = await pool.execute(
        `
        SELECT
            c.id,
            c.trainer_id,
            c.title,
            c.description,
            c.class_date,
            c.start_time,
            c.end_time,
            c.room,
            c.capacity,
            CONCAT(u.first_name, ' ', u.last_name) AS trainer_name,
            cr.registration_date,
            cr.status
        FROM Classes c
        INNER JOIN ClassRegistrations cr
            ON cr.class_id = c.id
            AND cr.user_id = ?
        INNER JOIN Trainers t ON c.trainer_id = t.id
        INNER JOIN Users u ON t.user_id = u.id
        WHERE cr.status = 'Registered'
        ORDER BY c.class_date, c.start_time
        `,
        [userId]
    );

    return rows;
}

export async function registerToClass(classId, userId) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [classRows] = await connection.execute(
            `SELECT id, capacity FROM Classes WHERE id = ? FOR UPDATE`,
            [classId]
        );

        const gymClass = classRows[0];

        if (!gymClass) {
            throw Object.assign(new Error("Class not found."), { status: 404 });
        }

        const [registeredRows] = await connection.execute(
            `
            SELECT COUNT(*) AS count
            FROM ClassRegistrations
            WHERE class_id = ?
              AND status = 'Registered'
            `,
            [classId]
        );

        if (registeredRows[0].count >= gymClass.capacity) {
            throw Object.assign(new Error("Class is full."), { status: 409 });
        }

        const [existingRows] = await connection.execute(
            `
            SELECT id, status
            FROM ClassRegistrations
            WHERE class_id = ?
              AND user_id = ?
            `,
            [classId, userId]
        );

        if (existingRows.length > 0) {
            const existing = existingRows[0];
            if (existing.status === "Registered") {
                throw Object.assign(new Error("You are already registered for this class."), { status: 409 });
            }

            await connection.execute(
                `
                UPDATE ClassRegistrations
                SET status = 'Registered', registration_date = CURRENT_TIMESTAMP
                WHERE id = ?
                `,
                [existing.id]
            );

            await connection.commit();
            return;
        }

        await connection.execute(
            `
            INSERT INTO ClassRegistrations
            (
                class_id,
                user_id,
                status
            )
            VALUES
            (
                ?,
                ?,
                'Registered'
            )
            `,
            [classId, userId]
        );

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

export async function cancelClassRegistration(classId, userId) {
    const [rows] = await pool.execute(
        `
        SELECT id
        FROM ClassRegistrations
        WHERE class_id = ?
          AND user_id = ?
          AND status = 'Registered'
        `,
        [classId, userId]
    );

    if (rows.length === 0) {
        throw new Error("No active registration found for this class.");
    }

    await pool.execute(
        `
        UPDATE ClassRegistrations
        SET status = 'Cancelled'
        WHERE id = ?
        `,
        [rows[0].id]
    );
}

export async function getAllClassesAdmin() {
    const [rows] = await pool.execute(
        `
        SELECT
            c.id,
            c.trainer_id,
            c.title,
            c.description,
            c.class_date,
            c.start_time,
            c.end_time,
            c.room,
            c.capacity,
            CONCAT(u.first_name, ' ', u.last_name) AS trainer_name,
            COALESCE(reg_count.registered_count, 0) AS registered_count,
            c.capacity - COALESCE(reg_count.registered_count, 0) AS available_spots
        FROM Classes c
        INNER JOIN Trainers t ON c.trainer_id = t.id
        INNER JOIN Users u ON t.user_id = u.id
        LEFT JOIN (
            SELECT class_id, COUNT(*) AS registered_count
            FROM ClassRegistrations
            WHERE status = 'Registered'
            GROUP BY class_id
        ) reg_count ON reg_count.class_id = c.id
        ORDER BY c.class_date, c.start_time
        `
    );

    return rows;
}

export async function findClassById(id) {
    const [rows] = await pool.execute(
        `
        SELECT
            c.id,
            c.trainer_id,
            c.title,
            c.description,
            c.class_date,
            c.start_time,
            c.end_time,
            c.room,
            c.capacity,
            CONCAT(u.first_name, ' ', u.last_name) AS trainer_name,
            COALESCE(reg_count.registered_count, 0) AS registered_count,
            c.capacity - COALESCE(reg_count.registered_count, 0) AS available_spots
        FROM Classes c
        INNER JOIN Trainers t ON c.trainer_id = t.id
        INNER JOIN Users u ON t.user_id = u.id
        LEFT JOIN (
            SELECT class_id, COUNT(*) AS registered_count
            FROM ClassRegistrations
            WHERE status = 'Registered'
            GROUP BY class_id
        ) reg_count ON reg_count.class_id = c.id
        WHERE c.id = ?
        `,
        [id]
    );

    if (rows.length === 0) {
        throw new Error("Class not found.");
    }

    return rows[0];
}

function validateClass(gymClass) {
    if (!gymClass.trainer_id || typeof gymClass.title !== "string" || !gymClass.title.trim() ||
        !/^\d{4}-\d{2}-\d{2}$/.test(gymClass.class_date || "") ||
        !/^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(gymClass.start_time || "") ||
        !/^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(gymClass.end_time || "") ||
        !Number.isInteger(Number(gymClass.capacity)) || Number(gymClass.capacity) <= 0) {
        throw new Error("A trainer, title, valid schedule, and positive integer capacity are required.");
    }
    const date = new Date(`${gymClass.class_date}T00:00:00Z`);
    if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== gymClass.class_date ||
        gymClass.end_time.padEnd(8, ":00") <= gymClass.start_time.padEnd(8, ":00")) {
        throw new Error("Class date must be valid and end time must be after start time.");
    }
}

export async function createClass(gymClass) {
    validateClass(gymClass);

    await pool.execute(
        `
        INSERT INTO Classes
        (
            trainer_id,
            title,
            description,
            class_date,
            start_time,
            end_time,
            room,
            capacity
        )
        VALUES
        (
            ?, ?, ?, ?, ?, ?, ?, ?
        )
        `,
        [
            gymClass.trainer_id,
            gymClass.title,
            gymClass.description ?? null,
            gymClass.class_date,
            gymClass.start_time,
            gymClass.end_time,
            gymClass.room ?? null,
            gymClass.capacity
        ]
    );
}

export async function updateClass(id, gymClass) {
    validateClass(gymClass);
    const [result] = await pool.execute(
        `
        UPDATE Classes
        SET
            trainer_id = ?,
            title = ?,
            description = ?,
            class_date = ?,
            start_time = ?,
            end_time = ?,
            room = ?,
            capacity = ?
        WHERE id = ?
        `,
        [
            gymClass.trainer_id,
            gymClass.title,
            gymClass.description ?? null,
            gymClass.class_date,
            gymClass.start_time,
            gymClass.end_time,
            gymClass.room ?? null,
            gymClass.capacity,
            id
        ]
    );

    if (result.affectedRows === 0) {
        throw new Error("Class not found.");
    }
}

export async function deleteClass(id) {
    const [result] = await pool.execute(
        `
        DELETE FROM Classes
        WHERE id = ?
        `,
        [id]
    );

    if (result.affectedRows === 0) {
        throw new Error("Class not found.");
    }
}

export async function getClassParticipants(classId) {
    const [rows] = await pool.execute(
        `
        SELECT
            u.id,
            u.first_name,
            u.last_name,
            u.email,
            cr.registration_date,
            cr.status
        FROM ClassRegistrations cr
        INNER JOIN Users u ON cr.user_id = u.id
        WHERE cr.class_id = ?
        ORDER BY cr.registration_date DESC
        `,
        [classId]
    );

    return rows;
}
