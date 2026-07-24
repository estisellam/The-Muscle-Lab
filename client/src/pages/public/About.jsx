import {
    Dumbbell,
    Target,
    Users,
    Trophy,
    HeartPulse
} from "lucide-react";

import "./About.css";

function About() {

    const features = [
        {
            icon: <Dumbbell />,
            title: "Professional Training",
            text: "Train with professional equipment and experienced trainers."
        },
        {
            icon: <Users />,
            title: "Strong Community",
            text: "Join a motivating community that helps you reach your goals."
        },
        {
            icon: <Target />,
            title: "Personal Goals",
            text: "Create your own fitness journey and track your progress."
        },
        {
            icon: <Trophy />,
            title: "Better Results",
            text: "Stay consistent and improve your performance every day."
        }
    ];


    return (

        <div className="about-page">


            <section className="about-hero">

                <div className="about-content">

                    <h1>

                        About
                        <span> The Muscle Lab</span>

                    </h1>


                    <p>

                        The Muscle Lab is a modern fitness management system
                        designed to help members manage their training,
                        memberships and classes in one place.

                    </p>


                    <p>

                        Our goal is to create a simple and powerful experience
                        that connects members, trainers and the gym community.

                    </p>


                </div>


                <div className="about-icon">

                    <Dumbbell size={90}/>

                </div>


            </section>



            <section className="about-cards">


                {
                    features.map((item,index)=>(

                        <div
                            className="about-card"
                            key={index}
                        >

                            <div className="about-card-icon">

                                {item.icon}

                            </div>


                            <h3>

                                {item.title}

                            </h3>


                            <p>

                                {item.text}

                            </p>


                        </div>

                    ))
                }


            </section>



            <section className="about-story">


                <HeartPulse />

                <div>

                    <h2>

                        Our Mission

                    </h2>


                    <p>

                        We believe that fitness should be accessible,
                        organized and motivating.
                        The Muscle Lab provides everything members need
                        to manage their fitness lifestyle easily.

                    </p>

                </div>


            </section>


        </div>

    );

}


export default About;