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
    GiWeightLiftingUp
} from "react-icons/gi";

import {
    FaDumbbell
} from "react-icons/fa";

import {
    MdWorkspacePremium
} from "react-icons/md";

import "./MembershipPlans.css";

function MembershipPlans() {

    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadPlans();

    }, []);

    async function loadPlans() {

        try {

            setLoading(true);

            const data = await getMembershipPlans();

            setPlans(data);

        } catch (error) {

            toast.error(
                error.message ||
                "Failed to load membership plans."
            );

        } finally {

            setLoading(false);

        }

    }

    function getPlanFeatures(plan) {

        if (!plan.description) {

            return [
                "Full Gym Access",
                "Modern Equipment",
                `${plan.duration_months} Month Membership`
            ];

        }

        return plan.description
            .split(",")
            .map(feature => feature.trim())
            .filter(feature => feature !== "");

    }

    function getPlanIcon(planName) {

        const name = planName.toLowerCase();

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

                Loading Membership Plans...

            </div>

        );

    }

    return (

        <div className="membership-page">

            <div className="membership-header">

                <h1>

                    Membership Plans

                </h1>

            </div>

            <section className="plans-section">

                <div className="plans-grid">

                    {plans.map(plan => (

                        <div
                            key={plan.id}
                            className="plan-card"
                        >

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
                                    ? "Month"
                                    : "Months"}

                            </p>

                            <div className="plan-price">

                                <span>

                                    ₪

                                </span>

                                <strong>

                                    {Number(plan.price).toFixed(0)}

                                </strong>

                            </div>

                            <div className="plan-features">

                                {getPlanFeatures(plan).map(

                                    (feature, index) => (

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

                            <Button to="/register">

                                Join Now

                            </Button>

                        </div>

                    ))}

                </div>

            </section>

        </div>

    );

}

export default MembershipPlans;