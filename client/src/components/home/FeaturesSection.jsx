import {
  BadgeCheck,
  CalendarCheck,
  Gauge,
  Users,
} from "lucide-react";
import "./FeaturesSection.css";

const benefits = [
  {
    id: 1,
    icon: BadgeCheck,
    title: "Professional Environment",
    description:
      "A clean, modern and fully equipped training environment built for serious progress.",
  },
  {
    id: 2,
    icon: Users,
    title: "Supportive Community",
    description:
      "Train alongside motivated members and professional coaches who help you stay focused.",
  },
  {
    id: 3,
    icon: Gauge,
    title: "Results That Matter",
    description:
      "Build strength, improve endurance and track meaningful progress over time.",
  },
  {
    id: 4,
    icon: CalendarCheck,
    title: "Flexible Memberships",
    description:
      "Choose the membership plan that fits your schedule, goals and training routine.",
  },
];

function FeaturesSection() {
  return (
    <section className="features-section">
      <div className="container">
        <div className="section-title">

            <p className="section-eyebrow">
                Why Choose Us
            </p>

            <h2 className="section-heading">
                Everything You Need To
                <span className="section-highlight">
                    {" "}Become Stronger
                </span>
            </h2>

            <p className="section-description">
                The Muscle Lab gives every member the tools, guidance and environment needed to build lasting results.
            </p>

        </div>

        <div className="features-grid">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                  key={benefit.id}
                  className="card feature-card"
              >
                <div className="feature-icon">
                  <Icon size={28} />
                </div>

                <h3 className="feature-title">
                  {benefit.title}
                </h3>

                <p className="feature-description">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;