import {
  BadgeCheck,
  CalendarCheck,
  Gauge,
  Users,
} from "lucide-react";

import "./FeaturesSection.css";

import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";

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
        <SectionTitle
          eyebrow="Why Choose Us"
          title="Everything You Need To"
          highlightedText="Become Stronger"
          description="The Muscle Lab gives every member the tools, guidance and environment needed to build lasting results."
        />

        <div className="features-grid">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <Card
                key={benefit.id}
                className="feature-card"
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
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;