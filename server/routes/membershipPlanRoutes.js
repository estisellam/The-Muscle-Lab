import express from "express";

import {
    getAllMembershipPlans,
    getMembershipPlanById,
    createMembershipPlan,
    updateMembershipPlan,
    deleteMembershipPlan
} from "../controllers/membershipPlanController.js";

import {
    authMiddleware
} from "../middlewares/authMiddleware.js";

import {
    authorizeRoles
} from "../middlewares/roleMiddleware.js";

const router = express.Router();

// public routes

router.get(
    "/",
    getAllMembershipPlans
);

router.get(
    "/:id",
    getMembershipPlanById
);

// admin routes

router.post(
    "/",
    authMiddleware,
    authorizeRoles("Admin"),
    createMembershipPlan
);

router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("Admin"),
    updateMembershipPlan
);

router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("Admin"),
    deleteMembershipPlan
);

export default router;