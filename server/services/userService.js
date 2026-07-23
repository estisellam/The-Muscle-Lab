import {
    findUserById,
    findUserPasswordById,
    getAllUsers,
    updateUser,
    updatePassword,
    deleteUser,
    updateProfileImage
} from "../models/userModel.js";

import {
    hashPassword,
    comparePassword
} from "../utils/hashPassword.js";

// get user profile
export async function getUserProfile(id) {

    const user = await findUserById(id);

    if (!user) {
        throw new Error("user not found");
    }

    return user;
}

// update user profile
export async function updateUserProfile(id, userData) {

    const currentUser = await findUserById(id);

    if (!currentUser) {
        throw new Error("user not found");
    }

    const updatedUser = {
        first_name:
            userData.first_name ?? currentUser.first_name,

        last_name:
            userData.last_name ?? currentUser.last_name,

        phone:
            userData.phone ?? currentUser.phone,

        birth_date:
            userData.birth_date ?? currentUser.birth_date,

        gender:
            userData.gender ?? currentUser.gender,

        profile_image:
            userData.profile_image ?? currentUser.profile_image
    };

    await updateUser(id, updatedUser);

    return await findUserById(id);
}

// change user password
export async function changeUserPassword(
    id,
    currentPassword,
    newPassword
) {

    if (!currentPassword || !newPassword) {
        throw new Error(
            "current password and new password are required"
        );
    }

    if (newPassword.length < 6) {
        throw new Error(
            "new password must contain at least 6 characters"
        );
    }

    const user = await findUserPasswordById(id);

    if (!user) {
        throw new Error("user not found");
    }

    const isMatch = await comparePassword(
        currentPassword,
        user.password_hash
    );

    if (!isMatch) {
        throw new Error("current password is incorrect");
    }

    const isSamePassword = await comparePassword(
        newPassword,
        user.password_hash
    );

    if (isSamePassword) {
        throw new Error(
            "new password must be different"
        );
    }

    const passwordHash = await hashPassword(newPassword);

    await updatePassword(id, passwordHash);
}
// get all users
export async function getUsers() {

    return await getAllUsers();
}

// get user by id
export async function getUserById(id) {

    const user = await findUserById(id);

    if (!user) {
        throw new Error("user not found");
    }

    return user;
}

// delete user
export async function removeUser(id) {

    const user = await findUserById(id);

    if (!user) {
        throw new Error("user not found");
    }

    await deleteUser(id);
}
// upload profile image
export async function uploadUserProfileImage(
    id,
    imagePath
) {

    const user = await findUserById(id);

    if (!user) {
        throw new Error("user not found");
    }

    await updateProfileImage(
        id,
        imagePath
    );

    return await findUserById(id);
}