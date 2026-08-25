import {
    getTrainers,
    getTrainer,
    addTrainer,
    editTrainer,
    removeTrainer
} from "../services/trainerService.js";

export async function getAllTrainerControllers(req, res) {
    try {
        const trainers = await getTrainers();
        res.status(200).json(trainers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getTrainerById(req, res) {
    try {
        const trainer = await getTrainer(req.params.id);
        res.status(200).json(trainer);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export async function createTrainerController(req, res) {
    try {
        await addTrainer(req.body);
        res.status(201).json({ message: "trainer created successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export async function updateTrainerController(req, res) {
    try {
        const trainer = await editTrainer(req.params.id, req.body);
        res.status(200).json({ message: "trainer updated successfully", trainer });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export async function deleteTrainerController(req, res) {
    try {
        await removeTrainer(req.params.id);
        res.status(200).json({ message: "trainer deleted successfully" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
