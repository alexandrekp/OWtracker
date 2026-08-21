import {
  ArrowRight,
} from "lucide-react";

import type {
  Hero,
} from "../types/hero";

type HeroCardProps = {
  hero: Hero;

  onOpen:
    (hero: Hero) => void;
};

function HeroCard({
  hero,
  onOpen,
}: HeroCardProps) {
  return (
    <article
      className="hero-card"
      onClick={() =>
        onOpen(hero)
      }
    >
      <div className="hero-art">
        <img
          src={hero.image}
          alt={hero.name}
          className="hero-image"
          loading="lazy"
        />

        <span
          className={`role-badge ${hero.role.toLowerCase()}`}
        >
          {hero.role}
        </span>
      </div>

      <div className="hero-content">
        <div className="hero-heading">
          <div>
            <h2>
              {hero.name}
            </h2>

            <p>
              {hero.role}
            </p>
          </div>

          <button
            className="open-button"
            aria-label={`Open ${hero.name}`}
            onClick={(
              event,
            ) => {
              event.stopPropagation();

              onOpen(hero);
            }}
          >
            <ArrowRight
              size={16}
            />
          </button>
        </div>

        <div className="hero-stats">
          <div>
            <span>
              Win rate
            </span>

            <strong>
              {hero.winRate !==
              undefined
                ? `${hero.winRate}%`
                : "—"}
            </strong>
          </div>

          <div>
            <span>
              Pick rate
            </span>

            <strong>
              {hero.pickRate !==
              undefined
                ? `${hero.pickRate}%`
                : "—"}
            </strong>
          </div>
        </div>

        <div className="hero-tools">
          <span>
            Perks
          </span>

          <span>
            Stats
          </span>
        </div>
      </div>
    </article>
  );
}

export default HeroCard;