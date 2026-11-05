import pool from "../config/db.js";

export async function getAllTrainers() {
    const [rows] = await pool.execute(
        `
        SELECT
            Trainers.id,
            Trainers.user_id,
            Trainers.specialization,
            Trainers.experience_years,
            Trainers.biography,
            Users.first_name,
            Users.last_name,
            Users.email,
            Users.phone
        FROM Trainers
        INNER JOIN Users ON Trainers.user_id = Users.id
        ORDER BY Trainers.specialization, Trainers.experience_years DESC
        `
    );

    return rows;
}

export async function findTrainerById(id) {
    const [rows] = await pool.execute(
        `
        SELECT
            Trainers.id,
            Trainers.user_id,
            Trainers.specialization,
            Trainers.experience_years,
            Trainers.biography,
            Users.first_name,
            Users.last_name,
            Users.email,
            Users.phone
        FROM Trainers
        INNER JOIN Users ON Trainers.user_id = Users.id
        WHERE Trainers.id = ?
        `,
        [id]
    );

    return rows[0];
}

export async function createTrainer(trainer) {
    await pool.execute(
        `
        INSERT INTO Trainers
        (
            user_id,
            specialization,
            experience_years,
            biography
        )
        VALUES
        (
            ?,
            ?,
            ?,
            ?
        )
        `,
        [
            trainer.user_id,
            trainer.specialization ?? null,
            trainer.experience_years ?? 0,
            trainer.biography ?? null
        ]
    );
}

export async function updateTrainer(id, trainer) {
    await pool.execute(
        `
        UPDATE Trainers
        SET
            specialization = ?,
            experience_years = ?,
            biography = ?
        WHERE id = ?
        `,
        [
            trainer.specialization ?? null,
            trainer.experience_years ?? 0,
            trainer.biography ?? null,
            id
        ]
    );
}

export async function deleteTrainer(id) {
    await pool.execute(
        `
        DELETE FROM Trainers
        WHERE id = ?
        `,
        [id]
    );
}
