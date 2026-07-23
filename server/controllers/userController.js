import {
    getUserProfile,
    updateUserProfile,
    changeUserPassword,
    getUsers,
    getUserById,
    removeUser,
    uploadUserProfileImage
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
// get all users
export async function getAllUsers(req, res) {

    try {

        const users = await getUsers();

        res.status(200).json(users);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
}

// get user by id
export async function getUser(req, res) {

    try {

        const user = await getUserById(req.params.id);

        res.status(200).json(user);

    } catch (error) {

        res.status(404).json({
            message: error.message
        });

    }
}

// delete user
export async function deleteUser(req, res) {

    try {

        await removeUser(req.params.id);

        res.status(200).json({
            message: "user deleted successfully"
        });

    } catch (error) {

        res.status(404).json({
            message: error.message
        });

    }
}
// upload profile image
export async function uploadProfileImage(req, res) {

    try {

        if (!req.file) {

            return res.status(400).json({
                message: "image file is required"
            });

        }

        const imagePath =
            `/uploads/profile-images/${req.file.filename}`;

        const user = await uploadUserProfileImage(
            req.user.id,
            imagePath
        );

        res.status(200).json({
            message: "profile image uploaded successfully",
            user
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

}