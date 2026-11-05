import express from "express";
import {
    getAllTrainerControllers,
    getTrainerById,
    createTrainerController,
    updateTrainerController,
    deleteTrainerController
} from "../controllers/trainerController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAllTrainerControllers);
router.get("/:id", authMiddleware, getTrainerById);
router.post("/", authMiddleware, authorizeRoles("Admin"), createTrainerController);
router.put("/:id", authMiddleware, authorizeRoles("Admin"), updateTrainerController);
router.delete("/:id", authMiddleware, authorizeRoles("Admin"), deleteTrainerController);

export default router;
