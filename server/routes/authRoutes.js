import express from "express";
import { createAuthRateLimit } from "../middlewares/authRateLimit.js";

import {
    registerUser,
    loginUser
} from "../controllers/authController.js";

const router = express.Router();

// register user
router.post("/register", createAuthRateLimit({ limit: 15, windowMs: 60 * 60 * 1000 }), registerUser);

// login user
router.post("/login", createAuthRateLimit({ skipSuccessfulRequests: true }), loginUser);

export default router;