import pool from "../config/db.js";

// get membership by user id
export async function findMembershipByUserId(userId) {

    const [rows] = await pool.execute(
        `
        SELECT
            UserMemberships.id,
            UserMemberships.start_date,
            UserMemberships.end_date,
            UserMemberships.status,

            MembershipPlans.id AS plan_id,
            MembershipPlans.name,
            MembershipPlans.duration_months,
            MembershipPlans.price,
            MembershipPlans.description

        FROM UserMemberships

        INNER JOIN MembershipPlans
            ON UserMemberships.membership_plan_id = MembershipPlans.id

        WHERE UserMemberships.user_id = ?

        ORDER BY UserMemberships.end_date DESC

        LIMIT 1
        `,
        [userId]
    );

    return rows[0];
}

// create membership
export async function createUserMembership(membership) {

    await pool.execute(
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