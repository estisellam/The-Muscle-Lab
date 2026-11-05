import {
    getAllTrainers,
    findTrainerById,
    createTrainer,
    updateTrainer,
    deleteTrainer
} from "../models/trainerModel.js";

export async function getTrainers() {
    return await getAllTrainers();
}

export async function getTrainer(id) {
    const trainer = await findTrainerById(id);

    if (!trainer) {
        throw new Error("trainer not found");
    }

    return trainer;
}

export async function addTrainer(trainerData) {
    if (!trainerData.user_id) {
        throw new Error("user_id is required");
    }

    await createTrainer(trainerData);
}

export async function editTrainer(id, trainerData) {
    const trainer = await findTrainerById(id);

    if (!trainer) {
        throw new Error("trainer not found");
    }

    await updateTrainer(id, trainerData);

    return await findTrainerById(id);
}

export async function removeTrainer(id) {
    const trainer = await findTrainerById(id);

    if (!trainer) {
        throw new Error("trainer not found");
    }

    await deleteTrainer(id);
}
