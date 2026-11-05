import pool from "../config/db.js";
import {
    findMembershipByUserId,
    createUserMembership,
    updateMembershipStatus
} from "../models/userMembershipModel.js";

import {
    findMembershipPlanById
} from "../models/membershipPlanModel.js";

// get current membership
export async function getCurrentMembership(userId) {

    const membership =
        await findMembershipByUserId(userId);

    return membership;

}

// purchase membership
export async function purchaseMembership(
    userId,
    membershipPlanId
) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        // Serialize enrollments for the same user without changing the schema.
        await connection.execute("SELECT id FROM Users WHERE id = ? FOR UPDATE", [userId]);

        const currentMembership =
            await findMembershipByUserId(userId, connection);

        if (currentMembership) {

            throw new Error(
                "You already have an active membership."
            );

        }

        const plan =
            await findMembershipPlanById(
                membershipPlanId,
                connection
            );

        if (!plan) {

            throw new Error(
                "membership plan not found"
            );

        }

        const startDate = new Date();

        const endDate = new Date();

        endDate.setMonth(
            endDate.getMonth() +
            plan.duration_months
        );

        await createUserMembership({

            user_id: userId,

            membership_plan_id:
                membershipPlanId,

            start_date:
                startDate.toISOString()
                    .split("T")[0],

            end_date:
                endDate.toISOString()
                    .split("T")[0],

            status: "Active"

        }, connection);

        const membership = await findMembershipByUserId(userId, connection);
        await connection.commit();
        return membership;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

// cancel membership
export async function cancelMembership(
    userId
) {

    const membership =
        await findMembershipByUserId(
            userId
        );

    if (!membership) {

        throw new Error(
            "membership not found"
        );

    }

    await updateMembershipStatus(
        membership.id,
        "Cancelled"
    );

}