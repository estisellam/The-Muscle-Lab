import {
    getAllMembershipPlans,
    findMembershipPlanById,
    createMembershipPlan,
    updateMembershipPlan,
    deleteMembershipPlan
} from "../models/membershipPlanModel.js";

// get all membership plans
export async function getMembershipPlans() {

    return await getAllMembershipPlans();
}

// get membership plan by id
export async function getMembershipPlan(id) {

    const plan = await findMembershipPlanById(id);

    if (!plan) {
        throw new Error("membership plan not found");
    }

    return plan;
}

// create membership plan
export async function addMembershipPlan(planData) {

    if (!planData.name) {
        throw new Error("name is required");
    }

    if (!planData.duration_months) {
        throw new Error("duration is required");
    }

    if (!planData.price) {
        throw new Error("price is required");
    }

    await createMembershipPlan(planData);
}

// update membership plan
export async function editMembershipPlan(id, planData) {

    const currentPlan = await findMembershipPlanById(id);

    if (!currentPlan) {
        throw new Error("membership plan not found");
    }

    const updatedPlan = {

        name:
            planData.name ?? currentPlan.name,

        duration_months:
            planData.duration_months ?? currentPlan.duration_months,

        price:
            planData.price ?? currentPlan.price,

        description:
            planData.description ?? currentPlan.description
    };

    await updateMembershipPlan(
        id,
        updatedPlan
    );

    return await findMembershipPlanById(id);
}

// delete membership plan
export async function removeMembershipPlan(id) {

    const plan = await findMembershipPlanById(id);

    if (!plan) {
        throw new Error("membership plan not found");
    }

    await deleteMembershipPlan(id);
}