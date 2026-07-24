import express from "express";
import {
    getAllClasses,
    registerToClass,
    getMyClasses
} from "../services/classService.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get all classes
router.get( "/",authMiddleware,async (req, res) => {

    try {

        const classes = await getAllClasses(req.user.id);

        res.json(classes);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to load classes."
        });

    }

});

router.get(
    "/my",
    authMiddleware,
    async (req, res) => {

        try {

            const classes = await getMyClasses(
                req.user.id
            );

            res.json(classes);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Failed to load classes."
            });

        }

    }
);


// Register to class
router.post(
    "/:id/register",
    authMiddleware,
    async (req, res) => {

        try {

            const classId = req.params.id;
            const userId = req.user.id;

            await registerToClass(classId, userId);

            res.status(201).json({
                message: "Registered successfully."
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Registration failed."
            });

        }

    }
);

export default router;