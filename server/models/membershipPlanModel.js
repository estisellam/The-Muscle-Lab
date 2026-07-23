import pool from "../config/db.js";

// get all membership plans
export async function getAllMembershipPlans() {

    const [rows] = await pool.execute(
        `
        SELECT
            id,
            name,
            duration_months,
            price,
            description
        FROM MembershipPlans
        ORDER BY price
        `
    );

    return rows;
}

// find membership plan by id
export async function findMembershipPlanById(id) {

    const [rows] = await pool.execute(
        `
        SELECT
            id,
            name,
            duration_months,
            price,
            description
        FROM MembershipPlans
        WHERE id = ?
        `,
        [id]
    );

    return rows[0];
}

// create membership plan
export async function createMembershipPlan(plan) {

    await pool.execute(
        `
        INSERT INTO MembershipPlans
        (
            name,
            duration_months,
            price,
            description
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
            plan.name,
            plan.duration_months,
            plan.price,
            plan.description
        ]
    );
}

// update membership plan
export async function updateMembershipPlan(id, plan) {

    await pool.execute(
        `
        UPDATE MembershipPlans
        SET
            name = ?,
            duration_months = ?,
            price = ?,
            description = ?
        WHERE id = ?
        `,
        [
            plan.name,
            plan.duration_months,
            plan.price,
            plan.description,
            id
        ]
    );
}

// delete membership plan
export async function deleteMembershipPlan(id) {

    await pool.execute(
        `
        DELETE FROM MembershipPlans
        WHERE id = ?
        `,
        [id]
    );
}