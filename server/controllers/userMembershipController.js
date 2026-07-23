import {
    getCurrentMembership,
    purchaseMembership,
    cancelMembership
} from "../services/userMembershipService.js";

// get current membership
export async function getMyMembership(req, res) {

    try {

        const membership =
            await getCurrentMembership(
                req.user.id
            );

        res.status(200).json(
            membership
        );

    } catch (error) {

        res.status(404).json({
            message: error.message
        });

    }

}

// purchase membership
export async function createMembership(req, res) {

    try {

        const membership =
            await purchaseMembership(
                req.user.id,
                req.body.membership_plan_id
            );

        res.status(201).json({

            message:
                "membership purchased successfully",

            membership

        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }

}

// cancel membership
export async function cancelMyMembership(req, res) {

    try {

        await cancelMembership(
            req.user.id
        );

        res.status(200).json({

            message:
                "membership cancelled successfully"

        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }

}