import {
  Activity,
  ArrowRight,
  Dumbbell,
  ShieldCheck,
  Trophy,
} from "lucide-react";

import "./HeroSection.css";

import heroMan from "../../assets/images/hero-man.png";
import heroBackground from "../../assets/images/hero-background.png";

import Button from "../ui/Button";
import Card from "../ui/Card";

const features = [
  {
    id: 1,
    icon: Dumbbell,
    title: "Modern Equipment",
    description: "Premium machines and professional training equipment.",
  },
  {
    id: 2,
    icon: Trophy,
    title: "Expert Coaching",
    description: "Professional guidance that helps you reach your goals.",
  },
  {
    id: 3,
    icon: Activity,
    title: "Personal Progress",
    description: "Track your journey and keep improving every day.",
  },
  {
    id: 4,
    icon: ShieldCheck,
    title: "Strong Community",
    description: "Train in a motivating and supportive environment.",
  },
];

function HeroSection() {
  return (
    <section className="hero-section">
      <div
        className="hero-background"
        style={{
          backgroundImage: `url(${heroBackground})`,
        }}
      />

      <div className="container hero-container">
        <div className="hero-grid">
          <div className="hero-content">
            <h1 className="hero-title">
              Build Your
              <span>Best Version</span>
            </h1>

            <p className="hero-description">
              Train with purpose, improve your strength and transform your body
              in a modern gym designed to help you achieve real results.
            </p>

            <div className="hero-buttons">
              <Button to="/register">
                Join Now
                <ArrowRight size={18} style={{ marginLeft: 8 }} />
              </Button>

              <Button to="/about" variant="secondary">
                Learn More
              </Button>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <strong>500+</strong>
                <span>Active Members</span>
              </div>

              <div className="hero-divider" />

              <div className="hero-stat">
                <strong>15+</strong>
                <span>Professional Trainers</span>
              </div>

              <div className="hero-divider" />

              <div className="hero-stat">
                <strong>24/7</strong>
                <span>Member Access</span>
              </div>
            </div>
          </div>

          <div className="hero-image-wrapper">
            <div className="hero-circle-outline" />

            <div className="hero-shadow" />

            <img
              src={heroMan}
              alt="Athlete training with dumbbells"
              className="hero-image"
            />
          </div>
        </div>

        <div className="hero-features">
          <div className="hero-features-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.id}
                  className={`hero-feature ${
                    index !== features.length - 1
                      ? "hero-feature-border"
                      : ""
                  }`}
                >
                  <div className="hero-feature-icon">
                    <Icon size={25} />
                  </div>

                  <div>
                    <h2 className="hero-feature-title">
                      {feature.title}
                    </h2>

                    <p className="hero-feature-description">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;