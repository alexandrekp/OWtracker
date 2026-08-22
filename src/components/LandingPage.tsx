import type {
  ReactNode,
} from "react";

import {
  ArrowRight,
  BarChart3,
  Database,
  Code2,
  Search,
  Sparkles,
  Users,
} from "lucide-react";

import "./LandingPage.css";

type LandingPageProps = {
  onOpenDashboard:
    () => void;
};

function LandingPage({
  onOpenDashboard,
}: LandingPageProps) {
  return (
    <div className="landing-page">
      <header className="landing-nav">
        <div className="landing-brand">
          <div className="landing-brand-mark">
            <img
              src={`${import.meta.env.BASE_URL}owtracker-logo.png`}
              alt="OWTracker"
            />
          </div>

          <div className="landing-brand-copy">
            <div className="landing-brand-name">
              <span className="landing-brand-ow">
                OW
              </span>

              <span className="landing-brand-tracker">
                Tracker
              </span>
            </div>

            <span className="landing-brand-tagline">
              DATA COMPANION
            </span>
          </div>
        </div>

        <div className="landing-nav-actions">
          <a
            className="landing-github"
            href="https://github.com/alexandrekp/OWtracker"
            target="_blank"
            rel="noreferrer"
          >
            <Code2 size={15} />

            GitHub
          </a>
        </div>
      </header>

      <main>
        <section className="landing-hero">
          <div className="landing-hero-copy">
            <div className="landing-kicker">
              <span className="landing-kicker-dot" />

              OVERWATCH DATA COMPANION
            </div>

            <h1>
              Understand the
              <span>
                {" "}meta.
              </span>
            </h1>

            <p className="landing-lead">
              Explore hero statistics,
              current meta rankings, perks
              and player comparisons in one
              focused interface.
            </p>

            <div className="landing-hero-actions">
              <button
                className="landing-primary-button"
                type="button"
                onClick={
                  onOpenDashboard
                }
              >
                Open OWTracker

                <ArrowRight size={17} />
              </button>
            </div>

            <div className="landing-source-line">
              <Database size={14} />

              Blizzard hero statistics ·
              Community perk data
            </div>
          </div>

          <div className="landing-preview">
            <div className="landing-preview-top">
              <div>
                <span>
                  META OVERVIEW
                </span>

                <strong>
                  Current leaders
                </strong>
              </div>

              <div className="landing-live">
                <span />

                Blizzard data
              </div>
            </div>

            <div className="landing-preview-rows">
              <PreviewRow
                rank="01"
                name="Top hero"
                role="SUPPORT"
                tier="S"
                score="100"
              />

              <PreviewRow
                rank="02"
                name="Meta contender"
                role="DAMAGE"
                tier="S"
                score="94"
              />

              <PreviewRow
                rank="03"
                name="Strong pick"
                role="TANK"
                tier="A"
                score="82"
              />
            </div>

            <div className="landing-preview-footer">
              <span>
                META SCORE
              </span>

              <strong>
                WR 60%
              </strong>

              <strong>
                PR 30%
              </strong>

              <strong>
                BR 10%
              </strong>
            </div>
          </div>
        </section>

        <section className="landing-features">
          <FeatureCard
            icon={
              <BarChart3 size={18} />
            }
            eyebrow="STATISTICS"
            title="Blizzard data"
            description="Win, pick and ban rates with filters for region, rank and role."
          />

          <FeatureCard
            icon={
              <Sparkles size={18} />
            }
            eyebrow="META"
            title="OWTracker ranking"
            description="A compact statistical tier list built from the active hero dataset."
          />

          <FeatureCard
            icon={
              <Users size={18} />
            }
            eyebrow="PLAYERS"
            title="Player comparison"
            description="Search profiles, compare ranks and inspect shared hero performance."
          />

          <FeatureCard
            icon={
              <Search size={18} />
            }
            eyebrow="HEROES"
            title="Hero explorer"
            description="Search and sort heroes by meta score, win rate, pick rate or ban rate."
          />
        </section>

        <section className="landing-cta">
          <div>
            <span className="landing-section-eyebrow">
              BUILT FOR QUICK READING
            </span>

            <h2>
              Data without the clutter.
            </h2>

            <p>
              OWTracker keeps the important
              competitive information in a
              single responsive interface.
            </p>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <span>
          OWTracker · Built by AKP
        </span>

        <p>
          Independent project. Not affiliated
          with or endorsed by Blizzard
          Entertainment.
        </p>
      </footer>
    </div>
  );
}

type PreviewRowProps = {
  rank: string;
  name: string;
  role: string;
  tier: string;
  score: string;
};

function PreviewRow({
  rank,
  name,
  role,
  tier,
  score,
}: PreviewRowProps) {
  return (
    <div className="landing-preview-row">
      <span className="landing-preview-rank">
        {rank}
      </span>

      <div className="landing-preview-hero">
        <div className="landing-preview-avatar">
          {name.charAt(0)}
        </div>

        <div>
          <strong>
            {name}
          </strong>

          <span>
            {role}
          </span>
        </div>
      </div>

      <span className="landing-preview-tier">
        {tier}
      </span>

      <strong className="landing-preview-score">
        {score}
      </strong>
    </div>
  );
}

type FeatureCardProps = {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
};

function FeatureCard({
  icon,
  eyebrow,
  title,
  description,
}: FeatureCardProps) {
  return (
    <article className="landing-feature-card">
      <div className="landing-feature-icon">
        {icon}
      </div>

      <span>
        {eyebrow}
      </span>

      <h3>
        {title}
      </h3>

      <p>
        {description}
      </p>
    </article>
  );
}

export default LandingPage;
