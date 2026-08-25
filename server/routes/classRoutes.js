import express from "express";
import {
    getAllClassesController,
    getMyClassesController,
    registerToClassController,
    cancelClassRegistrationController,
    getAllClassesAdminController,
    createClassController,
    updateClassController,
    deleteClassController,
    getClassParticipantsController,
    getClassDateCountsController,
    getClassesByDateController
} from "../controllers/classController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Member endpoints
router.get("/", authMiddleware, getAllClassesController);
router.get("/my", authMiddleware, getMyClassesController);
router.get("/date-counts", authMiddleware, getClassDateCountsController);
router.get("/by-date/:date", authMiddleware, getClassesByDateController);
router.post("/:id/register", authMiddleware, registerToClassController);
router.delete("/:id/register", authMiddleware, cancelClassRegistrationController);

// Admin endpoints
router.get("/admin", authMiddleware, authorizeRoles("Admin"), getAllClassesAdminController);
router.post("/admin", authMiddleware, authorizeRoles("Admin"), createClassController);
router.put("/admin/:id", authMiddleware, authorizeRoles("Admin"), updateClassController);
router.delete("/admin/:id", authMiddleware, authorizeRoles("Admin"), deleteClassController);
router.get("/admin/:id/participants", authMiddleware, authorizeRoles("Admin"), getClassParticipantsController);

export default router;