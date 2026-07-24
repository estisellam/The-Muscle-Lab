import { useEffect, useState } from "react";
import {
    Flame,
    Leaf,
    Dumbbell,
    Bike,
    HeartPulse,
    User,
    Calendar,
    Clock3,
    MapPin,
    Users
} from "lucide-react";

import { getClasses, registerToClass } from "../../services/api";
import "./Classes.css";

function Classes() {

    const [classes, setClasses] = useState([]);

    useEffect(() => {

        loadClasses();

    }, []);

    async function loadClasses() {

        try {

            const data = await getClasses();

            setClasses(data);

        }

        catch (error) {

            console.error(error);

        }

    }

    async function handleRegister(id) {

        try {

            const result = await registerToClass(id);

            alert(result.message);

            loadClasses();

        }

        catch (error) {

            alert(error.message);

        }

    }

    function getClassIcon(title) {

        switch (title) {

            case "HIIT":
                return <Flame size={34} />;

            case "Yoga":
                return <Leaf size={34} />;

            case "CrossFit":
                return <Dumbbell size={34} />;

            case "Spinning":
                return <Bike size={34} />;

            case "Pilates":
                return <HeartPulse size={34} />;

            default:
                return <Dumbbell size={34} />;

        }

    }

    function formatDate(date) {

        return new Date(date).toLocaleDateString(
            "en-GB",
            {
                weekday: "short",
                day: "numeric",
                month: "short"
            }
        );

    }

    return (

        <div className="classes-page">

            <h1>Gym Classes</h1>

            <div className="classes-grid">

                {

                    classes.map(gymClass => (

                        <div
                            key={gymClass.id}
                            className="class-card"
                        >

                            <div className="class-header">

                                <div className="class-icon">

                                    {getClassIcon(gymClass.title)}

                                </div>

                                <h2>

                                    {gymClass.title}

                                </h2>

                            </div>

                            <p className="class-description">

                                {gymClass.description}

                            </p>

                            <div className="class-info">

                                <p>

                                    <User size={18} />

                                    {gymClass.trainer_name}

                                </p>

                                <p>

                                    <Calendar size={18} />

                                    {formatDate(gymClass.class_date)}

                                </p>

                                <p>

                                    <Clock3 size={18} />

                                    {gymClass.start_time}

                                    {" - "}

                                    {gymClass.end_time}

                                </p>

                                <p>

                                    <MapPin size={18} />

                                    {gymClass.room}

                                </p>

                                <p>

                                    <Users size={18} />

                                    {gymClass.available_spots}

                                    {" spots left"}

                                </p>

                            </div>

                            {
                                gymClass.is_registered ? (

                                    <button
                                        className="registered-button"
                                        disabled
                                    >
                                        ✓ Registered
                                    </button>

                                ) : (

                                    <button
                                        className="register-button"
                                        onClick={() => handleRegister(gymClass.id)}
                                    >
                                        Register
                                    </button>

                                )
                            }

                        </div>

                    ))

                }

            </div>

        </div>

    );

}

export default Classes;