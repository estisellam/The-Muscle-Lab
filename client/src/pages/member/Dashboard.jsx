import { useEffect, useState } from "react";
import {
    CalendarDays,
    CreditCard,
    Dumbbell,
    Flame,
    Trophy,
    User,
    ArrowRight
} from "lucide-react";

import { useUser } from "../../context/UserContext";
import Button from "../../components/ui/Button";
import "./Dashboard.css";
import apiRequest, {getMyClasses,cancelClassRegistration} from "../../services/api";

function formatDate(date) {
    return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function formatTime(time) {

    if (!time) return "";

    return time.slice(0, 5);

}

function Dashboard() {

    const { user } = useUser();

    const [membership, setMembership] = useState(null);
    const [myClasses, setMyClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    
    async function handleCancel(classId) {

    try {

        await cancelClassRegistration(classId);

        setMyClasses(current =>
            current.filter(
                gymClass => gymClass.id !== classId
            )
        );

    } catch (err) {

        console.error(err);

    }

}
    // load dashboard data

    useEffect(() => {

        async function loadDashboard() {

            try {

                const membershipData =
                    await apiRequest("/user-memberships/me");

                const classesData =
                    await getMyClasses();

                setMembership(membershipData);
                setMyClasses(classesData);

            }
            catch (err) {

                console.error(err);

            }
            finally {

                setLoading(false);

            }

        }

        loadDashboard();

    }, []);

    if (loading) {

        return (

            <div className="dashboard-loading">

                Loading...

            </div>

        );

    }

    const firstName =
        user?.first_name ||
        user?.firstName ||
        "Member";

    const nextClass =
        myClasses.length > 0
            ? myClasses[0]
            : null;

    const goal = 10;

    const progress =
        Math.min(
            (myClasses.length / goal) * 100,
            100
        );

    return (

        <div className="dashboard-page">

            {/* statistics */}

            <div className="dashboard-stats">

                <div className="stat-card">

                    <div className="stat-icon">

                        <CreditCard />

                    </div>

                    <h3>

                        Membership

                    </h3>

                    <span>

                        {membership?.name || "No Membership"}

                    </span>

                </div>

                <div className="stat-card">

                    <div className="stat-icon">

                        <CalendarDays />

                    </div>

                    <h3>

                        Registered Classes

                    </h3>

                    <span>

                        {myClasses.length}

                    </span>

                </div>

                <div className="stat-card">

                    <div className="stat-icon">

                        <Flame />

                    </div>

                    <h3>

                        Next Class

                    </h3>

                    <span>

                        {nextClass
                            ? nextClass.title
                            : "No Class"}

                    </span>

                </div>

                <div className="stat-card">

                    <div className="stat-icon">

                        <Trophy />

                    </div>

                    <h3>

                        Membership Ends

                    </h3>

                    <span>

                        {formatDate(membership?.end_date)}

                    </span>

                </div>

            </div>

            {/* main content */}

            <div className="dashboard-grid">

                <div className="dashboard-left">

                    {/* upcoming classes */}

                    <div className="dashboard-card">

                        <div className="card-header">

                            <CalendarDays />

                            <h2>

                                Upcoming Classes

                            </h2>

                        </div>

                        {myClasses.length > 0 ? (

                            myClasses.slice(0, 3).map(gymClass => (

                                <div
                                    key={gymClass.id}
                                    className="class-item"
                                >

                                    <h3>{gymClass.title}</h3>

                                    <p>{formatDate(gymClass.class_date)}</p>

                                    <span>
                                        {formatTime(gymClass.start_time)} • {gymClass.room}
                                    </span>

                                    <Button
                                        className="cancel-btn"
                                        onClick={() => handleCancel(gymClass.id)}
                                    >
                                        Cancel Registration
                                    </Button>

                                </div>

                            ))

                        ) : (

                            <p>
                                You haven't registered for any classes yet.
                            </p>

                        )}


                    </div>

                    {/* progress */}

                    <div className="dashboard-card">

                        <div className="card-header">

                            <Trophy />

                            <h2>
                                Monthly Goal
                            </h2>

                        </div>

                        <p>
                            Registered classes this month
                        </p>

                        <div className="progress">

                            <div
                                className="progress-fill"
                                style={{
                                    width: `${progress}%`
                                }}
                            />

                        </div>

                        <span>

                            {myClasses.length} / {goal} classes

                        </span>

                    </div>

                </div>

                <div className="dashboard-right">

                    {/* quick actions */}

                    <div className="dashboard-card">

                        <div className="card-header">

                            <ArrowRight />

                            <h2>

                                Quick Actions

                            </h2>

                        </div>

                        <div className="quick-actions">

                            <Button to="/member/classes">

                                View Classes

                            </Button>

                        </div>

                    </div>


                </div>

            </div>

        </div>

    );

}

export default Dashboard;