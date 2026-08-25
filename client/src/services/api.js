const BASE_URL = "http://localhost:3000/api";

async function apiRequest(
    endpoint,
    options = {}
) {

    const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

    const headers = {
        ...options.headers,
    };

    if (!(options.body instanceof FormData)) {

        headers["Content-Type"] = "application/json";

    }

    if (token) {

        headers.Authorization = `Bearer ${token}`;

    }

    const response = await fetch(
        `${BASE_URL}${endpoint}`,
        {
            ...options,
            headers,
        }
    );

    if (response.status === 401) {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        window.location.href = "/login";

        return;

    }

    const data = await response.json();

    if (!response.ok) {

        throw {
            message: data.message,

            status: response.status,

            response: {
                status: response.status,
                data
            }
        };

    }

    return data;

}
export async function getClasses() {

    return await apiRequest("/classes");

}

export async function registerToClass(classId) {

    return await apiRequest(
        `/classes/${classId}/register`,
        {
            method: "POST"
        }
    );

}

export async function getMyClasses() {

    return await apiRequest("/classes/my");

}

export async function getClassDateCounts(start, end) {

    return await apiRequest(
        `/classes/date-counts?start=${start}&end=${end}`
    );

}

export async function getClassesByDate(date) {

    return await apiRequest(`/classes/by-date/${date}`);

}

export async function cancelClassRegistration(classId) {

    return await apiRequest(
        `/classes/${classId}/register`,
        {
            method: "DELETE"
        }
    );

}

export default apiRequest;