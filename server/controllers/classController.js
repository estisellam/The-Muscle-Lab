import {
    getAllClasses,
    registerToClass,
    getMyClasses,
    cancelClassRegistration,
    getAllClassesAdmin,
    findClassById,
    createClass,
    updateClass,
    deleteClass,
    getClassParticipants,
    getClassDateCounts,
    getClassesByDate
} from "../services/classService.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

// member endpoints
export async function getAllClassesController(req, res) {
    try {
        const classes = await getAllClasses(req.user.id);
        res.status(200).json(classes);
    } catch (error) {
        res.status(500).json({ message: "Failed to load classes." });
    }
}

export async function getMyClassesController(req, res) {
    try {
        const classes = await getMyClasses(req.user.id);
        res.status(200).json(classes);
    } catch (error) {
        res.status(500).json({ message: "Failed to load classes." });
    }
}

export async function registerToClassController(req, res) {
    try {
        const classId = req.params.id;
        const userId = req.user.id;

        await registerToClass(classId, userId);

        res.status(201).json({ message: "Registered successfully." });

    } catch (error) {
        res.status(500).json({ message: "Registration failed." });
    }
}

export async function getClassDateCountsController(req, res) {
    try {
        const { start, end } = req.query;

        if (!start || !end) {
            return res.status(400).json({ message: "start and end query params are required." });
        }

        const counts = await getClassDateCounts(start, end);
        res.status(200).json(counts);
    } catch (error) {
        res.status(500).json({ message: "Failed to load class date counts." });
    }
}

export async function getClassesByDateController(req, res) {
    try {
        const classes = await getClassesByDate(req.params.date, req.user.id);
        res.status(200).json(classes);
    } catch (error) {
        res.status(500).json({ message: "Failed to load classes." });
    }
}

export async function cancelClassRegistrationController(req, res) {
    try {
        await cancelClassRegistration(req.params.id, req.user.id);
        res.json({ message: "Registration cancelled." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// admin endpoints
export async function getAllClassesAdminController(req, res) {
    try {
        const classes = await getAllClassesAdmin();
        res.status(200).json(classes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getClassByIdController(req, res) {
    try {
        const cls = await findClassById(req.params.id);
        res.status(200).json(cls);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export async function createClassController(req, res) {
    try {
        await createClass(req.body);
        res.status(201).json({ message: "class created successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export async function updateClassController(req, res) {
    try {
        const cls = await updateClass(req.params.id, req.body);
        res.status(200).json({ message: "class updated successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export async function deleteClassController(req, res) {
    try {
        await deleteClass(req.params.id);
        res.status(200).json({ message: "class deleted successfully" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export async function getClassParticipantsController(req, res) {
    try {
        const participants = await getClassParticipants(req.params.id);
        res.status(200).json(participants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
