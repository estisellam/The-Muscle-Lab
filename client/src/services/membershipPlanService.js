import { API_BASE_URL } from "./config.js";
const API_URL = `${API_BASE_URL}/membership-plans`;

/*
    Get all membership plans
*/
export async function getMembershipPlans() {

    const response = await fetch(API_URL);

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to load membership plans"
        );

    }

    return data;

    
}


/*
    Get one membership plan by id
*/
export async function getMembershipPlanById(planId) {

    const response = await fetch(
        `${API_URL}/${planId}`
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to load membership plan"
        );

    }

    return data;

}