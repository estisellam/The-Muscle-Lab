import {
    getUserProfile,
    updateUserProfile,
    changeUserPassword
} from "../services/userService.js";

// get profile
export async function getProfile(req, res) {

    try {

        const user = await getUserProfile(req.user.id);

        return res.status(200).json(user);

    } catch (error) {

        return res.status(404).json({
            message: error.message
        });

    }
}

// update profile
export async function updateProfile(req, res) {

    try {

        const user = await updateUserProfile(
            req.user.id,
            req.body
        );

        return res.status(200).json({
            message: "profile updated successfully",
            user
        });

    } catch (error) {

        return res.status(400).json({
            message: error.message
        });

    }
}

// change password
export async function changePassword(req, res) {

    try {

        const {
            currentPassword,
            newPassword
        } = req.body;

        await changeUserPassword(
            req.user.id,
            currentPassword,
            newPassword
        );

        return res.status(200).json({
            message: "password changed successfully"
        });

    } catch (error) {

        return res.status(400).json({
            message: error.message
        });

    }
}