import apiRequest from "./api";

// login
export async function login(credentials) {

    return await apiRequest(
        "/auth/login",
        {
            method: "POST",
            body: JSON.stringify(credentials),
        }
    );

}

// register
export async function register(userData) {

    return await apiRequest(
        "/auth/register",
        {
            method: "POST",
            body: JSON.stringify(userData),
        }
    );

}

// logout
export function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

}

// get current user
export function getCurrentUser() {

    const user =
        localStorage.getItem("user") ||
        sessionStorage.getItem("user");

    return user
        ? JSON.parse(user)
        : null;

}

// get token
export function getToken() {

    return (
        localStorage.getItem("token") ||
        sessionStorage.getItem("token")
    );

}

// save login
export function saveLogin(
    token,
    user,
    rememberMe
) {

    if (rememberMe) {

        localStorage.setItem("token", token);

        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );

    } else {

        sessionStorage.setItem("token", token);

        sessionStorage.setItem(
            "user",
            JSON.stringify(user)
        );

    }

}