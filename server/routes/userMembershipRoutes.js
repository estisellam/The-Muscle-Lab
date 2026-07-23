import express from "express";

import {
    getMyMembership,
    createMembership,
    cancelMyMembership
} from "../controllers/userMembershipController.js";

import {
    authMiddleware
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
    "/me",
    authMiddleware,
    getMyMembership
);

router.post(
    "/",
    authMiddleware,
    createMembership
);

router.put(
    "/cancel",
    authMiddleware,
    cancelMyMembership
);

export default router;