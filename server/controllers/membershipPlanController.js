import {
    getMembershipPlans,
    getMembershipPlan,
    addMembershipPlan,
    editMembershipPlan,
    removeMembershipPlan
} from "../services/membershipPlanService.js";

// get all membership plans
export async function getAllMembershipPlans(req, res) {

    try {

        const plans = await getMembershipPlans();

        res.status(200).json(plans);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

}

// get membership plan by id
export async function getMembershipPlanById(req, res) {

    try {

        const plan = await getMembershipPlan(req.params.id);

        res.status(200).json(plan);

    } catch (error) {

        res.status(404).json({
            message: error.message
        });

    }

}

// create membership plan
export async function createMembershipPlan(req, res) {

    try {

        await addMembershipPlan(req.body);

        res.status(201).json({
            message: "membership plan created successfully"
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }

}

// update membership plan
export async function updateMembershipPlan(req, res) {

    try {

        const plan = await editMembershipPlan(
            req.params.id,
            req.body
        );

        res.status(200).json({
            message: "membership plan updated successfully",
            plan
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }

}

// delete membership plan
export async function deleteMembershipPlan(req, res) {

    try {

        await removeMembershipPlan(req.params.id);

        res.status(200).json({
            message: "membership plan deleted successfully"
        });

    } catch (error) {

        res.status(404).json({
            message: error.message
        });

    }

}