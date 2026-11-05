import pool from "../config/db.js";

// get membership by user id
export async function findMembershipByUserId(userId, database = pool) {

    const [rows] = await database.query(
        `
        SELECT
            um.id,
            um.start_date,
            um.end_date,
            um.status,
            mp.id AS membership_plan_id,
            mp.name,
            mp.price,
            mp.duration_months
        FROM UserMemberships um
        JOIN MembershipPlans mp
            ON um.membership_plan_id = mp.id
        WHERE um.user_id = ?
        AND um.status = 'Active'
        AND um.end_date >= CURRENT_DATE
        LIMIT 1
        `,

        [userId]

    );

    return rows[0] || null;

}

// create membership
export async function createUserMembership(membership, database = pool) {

    await database.execute(
        `
        INSERT INTO UserMemberships
        (
            user_id,
            membership_plan_id,
            start_date,
            end_date,
            status
        )
        VALUES
        (
            ?,
            ?,
            ?,
            ?,
            ?
        )
        `,
        [
            membership.user_id,
            membership.membership_plan_id,
            membership.start_date,
            membership.end_date,
            membership.status
        ]
    );
}

// update membership status
export async function updateMembershipStatus(
    id,
    status
) {

    await pool.execute(
        `
        UPDATE UserMemberships
        SET status = ?
        WHERE id = ?
        `,
        [
            status,
            id
        ]
    );
}