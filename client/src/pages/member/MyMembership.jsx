import {
    useEffect,
    useState
} from "react";

import toast from "react-hot-toast";

import Button from "../../components/ui/Button";

import {
    getMembershipPlans
} from "../../services/membershipPlanService";

import {
    getCurrentMembership,
    purchaseMembership,
    cancelMembership
} from "../../services/userMembershipService";

import "./MyMembership.css";

import {
    GiWeightLiftingUp
} from "react-icons/gi";

import {
    FaDumbbell
} from "react-icons/fa";

import {
    MdWorkspacePremium
} from "react-icons/md";

function Membership() {

    const [plans, setPlans] = useState([]);

    const [currentMembership, setCurrentMembership] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [actionLoading, setActionLoading] =
        useState(false);


    useEffect(() => {

        loadMembershipData();

    }, []);


    async function loadMembershipData() {

        try {

            setLoading(true);

            const plansData =
                await getMembershipPlans();

            setPlans(plansData);
            const membershipData = await getCurrentMembership();
            setCurrentMembership(membershipData ?? null);

        } catch (error) {

            toast.error(
                error.message ||
                "Failed to load membership data"
            );

        } finally {

            setLoading(false);

        }

    }


    async function handlePurchase(planId) {

        if (
            currentMembership &&
            currentMembership.status === "Active"
        ) {

            toast.error(
                "You already have an active membership"
            );

            return;

        }

        try {

            setActionLoading(true);

            await purchaseMembership(planId);

            toast.success(
                "Membership purchased successfully"
            );

            await loadMembershipData();

        } catch (error) {

            toast.error(
                error.message ||
                "Failed to purchase membership"
            );

        } finally {

            setActionLoading(false);

        }

    }


    async function handleCancel() {

        const confirmed = window.confirm(
            "Are you sure you want to cancel your membership?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setActionLoading(true);

            await cancelMembership();

            toast.success(
                "Membership cancelled. You can now choose a new plan."
            );

            await loadMembershipData();

        } catch (error) {

            toast.error(
                error.message ||
                "Failed to cancel membership"
            );

        } finally {

            setActionLoading(false);

        }

    }


    function formatDate(date) {

        if (!date) {
            return "-";
        }

        return new Date(date)
            .toLocaleDateString("en-GB");

    }


    function getDaysRemaining(endDate) {

        if (!endDate) {
            return 0;
        }

        const today = new Date();

        const end = new Date(endDate);

        const difference =
            end.getTime() -
            today.getTime();

        const days =
            Math.ceil(
                difference /
                (
                    1000 *
                    60 *
                    60 *
                    24
                )
            );

        return Math.max(
            0,
            days
        );

    }


    function getProgress() {

        if (
            !currentMembership ||
            !currentMembership.start_date ||
            !currentMembership.end_date
        ) {

            return 0;

        }

        const start =
            new Date(
                currentMembership.start_date
            ).getTime();

        const end =
            new Date(
                currentMembership.end_date
            ).getTime();

        const today =
            new Date().getTime();

        const totalTime =
            end - start;

        const passedTime =
            today - start;

        if (totalTime <= 0) {
            return 0;
        }

        const progress =
            Math.round(
                (
                    passedTime /
                    totalTime
                ) * 100
            );

        return Math.min(
            100,
            Math.max(
                0,
                progress
            )
        );

    }


    function getPlanFeatures(plan) {

        if (!plan.description) {

            return [
                "Full gym access",
                `${plan.duration_months} months membership`,
                "Access to gym equipment"
            ];

        }

        return plan.description
            .split(",")
            .map(
                feature =>
                    feature.trim()
            )
            .filter(
                feature =>
                    feature !== ""
            )
            .slice(0, 4);

    }
    function getPlanIcon(planName) {

        const name =
            planName.toLowerCase();

        if (name.includes("basic")) {

            return <GiWeightLiftingUp />;

        }

        if (name.includes("premium")) {

            return <FaDumbbell />;

        }

        if (
            name.includes("elite") ||
            name.includes("vip")
        ) {

            return <MdWorkspacePremium />;

        }

        return <FaDumbbell />;

    }


    if (loading) {

        return (

            <div className="membership-loading">

                Loading membership...

            </div>

        );

    }


    const progress =
        getProgress();

    const daysRemaining =
        getDaysRemaining(
            currentMembership?.end_date
        );


    return (

        <div className="membership-page">

            <div className="membership-header">

                <div>

                    <h1>
                        Membership
                    </h1>

                    <p>
                        Manage your current membership
                        and choose the plan that fits you.
                    </p>

                </div>

            </div>


            <section className="current-membership">

                {currentMembership ? (

                    <>

                        <div className="current-membership-info">

                            <span className="current-label">

                                Current Plan

                            </span>

                            <div className="current-title-row">

                                <h2>

                                    {currentMembership.name}

                                </h2>

                                <span
                                    className={
                                        `membership-status ${
                                            currentMembership.status
                                                ?.toLowerCase()
                                        }`
                                    }
                                >

                                    {currentMembership.status}

                                </span>

                            </div>

                            <p>

                                {currentMembership.description ||
                                    "Your current gym membership plan."}

                            </p>

                        </div>


                        <div className="current-membership-details">

                            <div className="membership-detail">

                                <span>
                                    Start Date
                                </span>

                                <strong>

                                    {formatDate(
                                        currentMembership.start_date
                                    )}

                                </strong>

                            </div>


                            <div className="membership-detail">

                                <span>
                                    End Date
                                </span>

                                <strong>

                                    {formatDate(
                                        currentMembership.end_date
                                    )}

                                </strong>

                            </div>


                            <div className="membership-detail">

                                <span>
                                    Price
                                </span>

                                <strong>

                                    ₪
                                    {Number(
                                        currentMembership.price
                                    ).toFixed(0)}

                                </strong>

                            </div>


                            <div className="membership-detail">

                                <span>
                                    Days Remaining
                                </span>

                                <strong>

                                    {daysRemaining}

                                </strong>

                            </div>

                        </div>


                        <div className="membership-progress">

                            <div className="progress-header">

                                <span>
                                    Membership Progress
                                </span>

                                <span>
                                    {progress}%
                                </span>

                            </div>

                            <div className="progress-bar">

                                <div
                                    className="progress-value"
                                    style={{
                                        width:
                                            `${progress}%`
                                    }}
                                />

                            </div>

                        </div>


                        <div className="current-membership-actions">

                            {currentMembership.status ===
                                "Active" && (

                                <Button
                                    variant="purple"
                                    onClick={handleCancel}
                                    disabled={actionLoading}
                                >

                                    {actionLoading
                                        ? "Processing..."
                                        : "Cancel Plan"}

                                </Button>

                            )}

                        </div>
                        

                    </>

                ) : (

                    <div className="no-membership">

                        <span>
                            No Current Plan
                        </span>

                    </div>

                )}

            </section>


            <section className="plans-section">
              <div className="plans-title">
                  <h2>
                      Available Plans
                  </h2>
              </div>
                <div className="plans-grid">

                    {plans.map(plan => {

                        const isCurrentPlan =

                            currentMembership?.plan_id ===
                                plan.id &&

                            currentMembership?.status ===
                                "Active";


                        return (

                            <div
                                key={plan.id}
                                className={
                                    isCurrentPlan
                                        ? "plan-card current-plan-card"
                                        : "plan-card"
                                }
                            >

                                {isCurrentPlan && (

                                    <span className="current-plan-badge">

                                        Current Plan

                                    </span>

                                )}


                               <div className="plan-header">

                                    <div className="plan-icon">

                                        {getPlanIcon(plan.name)}

                                    </div>

                                    <h3>

                                        {plan.name}

                                    </h3>

                                </div>


                                <p className="plan-duration">

                                    {plan.duration_months}

                                    {" "}

                                    {plan.duration_months === 1
                                        ? "month"
                                        : "months"}

                                </p>


                                <div className="plan-price">

                                    <span>
                                        ₪
                                    </span>

                                    <strong>

                                        {Number(
                                            plan.price
                                        ).toFixed(0)}

                                    </strong>

                                </div>


                                <div className="plan-features">

                                    {getPlanFeatures(plan)
                                        .map(
                                            (
                                                feature,
                                                index
                                            ) => (

                                                <div
                                                    key={index}
                                                    className="plan-feature"
                                                >

                                                    <span className="check-icon">

                                                        ✓

                                                    </span>

                                                    <span>

                                                        {feature}

                                                    </span>

                                                </div>

                                            )
                                        )}

                                </div>


                                <Button
                                    onClick={() =>
                                        handlePurchase(
                                            plan.id
                                        )
                                    }
                                    disabled={
                                        isCurrentPlan ||
                                        actionLoading 
                                    }
                                >

                                    {isCurrentPlan
                                        ? "Active Plan"
                                        : currentMembership
                                            ?.status ===
                                            "Active"
                                            ? "Membership Active"
                                            : actionLoading
                                                ? "Processing..."
                                                : "Choose Plan"}

                                </Button>

                            </div>

                        );

                    })}

                </div>

            </section>

        </div>

    );

}


export default Membership;