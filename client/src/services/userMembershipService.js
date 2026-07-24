import api from "./api";

/*
    Get current user's membership
*/
export async function getCurrentMembership() {

    return await api(
        "/user-memberships/me"
    );

}

/*
    Purchase membership
*/
export async function purchaseMembership(
    membershipPlanId
) {

    return await api(
        "/user-memberships",
        {
            method: "POST",

            body: JSON.stringify({
                membership_plan_id: membershipPlanId
            })
        }
    );

}

/*
    Cancel current membership
*/
export async function cancelMembership() {

    return await api(
        "/user-memberships/cancel",
        {
            method: "PUT"
        }
    );

}