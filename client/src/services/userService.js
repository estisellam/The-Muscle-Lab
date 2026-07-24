import apiRequest from "./api";

// get logged in user profile
export async function getProfile() {

    return await apiRequest(
        "/users/profile",
        {
            method: "GET",
        }
    );

}

// update user profile
export async function updateProfile(userData) {

    return await apiRequest(
        "/users/profile",
        {
            method: "PUT",
            body: JSON.stringify(userData),
        }
    );

}

// upload profile image
export async function uploadProfileImage(image) {

    const formData = new FormData();

    formData.append("image", image);

    return await apiRequest(
        "/users/profile/image",
        {
            method: "PUT",
            body: formData,
        }
    );

}

// change password
export async function changePassword(passwordData) {

    return await apiRequest(
        "/users/change-password",
        {
            method: "PUT",
            body: JSON.stringify(passwordData),
        }
    );

}