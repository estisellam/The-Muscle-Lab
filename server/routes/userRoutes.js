import express from "express";

import {
    getProfile,
    updateProfile,
    changePassword,
    getAllUsers,
    getUser,
    deleteUser,
    uploadProfileImage
} from "../controllers/userController.js";

import {
    authMiddleware
} from "../middlewares/authMiddleware.js";

import {
    authorizeRoles
} from "../middlewares/roleMiddleware.js";

import {
    uploadProfileImage as uploadProfileImageMiddleware
} from "../middlewares/uploadProfileImage.js";

const router = express.Router();

// member routes

router.get(
    "/profile",
    authMiddleware,
    getProfile
);

router.put(
    "/profile",
    authMiddleware,
    updateProfile
);

router.put(
    "/profile/image",
    authMiddleware,
    uploadProfileImageMiddleware.single("image"),
    uploadProfileImage
);

router.put(
    "/change-password",
    authMiddleware,
    changePassword
);


// admin routes

router.get(
    "/",
    authMiddleware,
    authorizeRoles("Admin"),
    getAllUsers
);

router.get(
    "/:id",
    authMiddleware,
    authorizeRoles("Admin"),
    getUser
);

router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("Admin"),
    deleteUser
);

export default router;