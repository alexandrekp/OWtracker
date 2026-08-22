import {
  ArrowRight,
  Search,
  Sparkles,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import {
  heroPerks,
} from "../data/perks";

import {
  heroes,
} from "../data/heroes";

import type {
  Hero,
  HeroRole,
} from "../types/hero";

import type {
  Perk,
} from "../types/perk";

import "./PerksPage.css";

type PerksPageProps = {
  onOpenHero:
    (hero: Hero) => void;
};

function PerksPage({
  onOpenHero,
}: PerksPageProps) {
  const [
    search,
    setSearch,
  ] = useState("");

  const [
    role,
    setRole,
  ] =
    useState<
      "All" | HeroRole
    >("All");

  const filteredHeroes =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return heroes.filter(
        (hero) => {
          const perks =
            heroPerks.find(
              (entry) =>
                entry.heroId ===
                hero.id,
            )?.perks ?? [];

          const matchesRole =
            role === "All" ||
            hero.role === role;

          const matchesSearch =
            normalizedSearch === "" ||
            hero.name
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            perks.some(
              (perk) =>
                perk.name
                  .toLowerCase()
                  .includes(
                    normalizedSearch,
                  ),
            );

          return (
            matchesRole &&
            matchesSearch
          );
        },
      );
    }, [
      search,
      role,
    ]);

  return (
    <div className="perks-page perks-v2-page">
      <header className="topbar">
        <div>
          <p className="eyebrow">
            COMMUNITY PERKS
          </p>

          <h1>
            Perks
          </h1>

          <p className="subtitle">
            Compare perk popularity
            across every hero.
          </p>
        </div>

        <div className="live-status">
          <span className="status-dot" />

          Community data
        </div>
      </header>

      {/* ===================================
          TOOLBAR
      ==================================== */}

      <section className="perks-toolbar">
        <div className="role-filters">
          {[
            "All",
            "Tank",
            "Damage",
            "Support",
          ].map(
            (value) => (
              <button
                key={value}
                className={
                  role === value
                    ? "filter-button active"
                    : "filter-button"
                }
                onClick={() =>
                  setRole(
                    value as
                      | "All"
                      | HeroRole,
                  )
                }
              >
                {value}
              </button>
            ),
          )}
        </div>

        <div className="search-wrapper">
          <Search
            size={14}
          />

          <input
            type="text"
            placeholder="Search hero or perk..."
            value={
              search
            }
            onChange={(
              event,
            ) =>
              setSearch(
                event.target
                  .value,
              )
            }
          />
        </div>
      </section>

      {/* ===================================
          HEROES
      ==================================== */}

      <section className="perks-heroes-list">
        {filteredHeroes.map(
          (hero) => {
            const perks =
              heroPerks.find(
                (entry) =>
                  entry.heroId ===
                  hero.id,
              )?.perks ?? [];

            return (
              <HeroPerksCard
                key={
                  hero.id
                }
                hero={
                  hero
                }
                perks={
                  perks
                }
                onOpenHero={
                  onOpenHero
                }
              />
            );
          },
        )}
      </section>

      {filteredHeroes.length ===
        0 && (
        <div className="empty-state">
          No hero or perk found.
        </div>
      )}
    </div>
  );
}

/* ========================================
   HERO PERKS CARD
======================================== */

type HeroPerksCardProps = {
  hero: Hero;

  perks: Perk[];

  onOpenHero:
    (hero: Hero) => void;
};

function HeroPerksCard({
  hero,
  perks,
  onOpenHero,
}: HeroPerksCardProps) {
  const minorPerks =
    perks.filter(
      (perk) =>
        perk.tier === "Minor",
    );

  const majorPerks =
    perks.filter(
      (perk) =>
        perk.tier === "Major",
    );

  const bestMinor =
    getMostPickedPerk(
      minorPerks,
    );

  const bestMajor =
    getMostPickedPerk(
      majorPerks,
    );

  return (
    <article className="global-perk-hero-card">
      <button
        className="global-perk-hero-header"
        onClick={() =>
          onOpenHero(
            hero,
          )
        }
      >
        <div className="global-perk-hero-main">
          <div className="global-perk-hero-portrait">
            <img
              src={
                hero.image
              }
              alt={
                hero.name
              }
            />
          </div>

          <div>
            <span
              className={`stats-role ${hero.role.toLowerCase()}`}
            >
              {hero.role}
            </span>

            <h2>
              {hero.name}
            </h2>
          </div>
        </div>

        <div className="global-perk-open">
          View hero

          <ArrowRight
            size={15}
          />
        </div>
      </button>

      <div className="global-perk-groups">
        <PerkColumn
          label="Minor"
          perks={
            minorPerks
          }
          mostPickedId={
            bestMinor?.id
          }
        />

        <PerkColumn
          label="Major"
          perks={
            majorPerks
          }
          mostPickedId={
            bestMajor?.id
          }
        />
      </div>
    </article>
  );
}

/* ========================================
   PERK COLUMN
======================================== */

type PerkColumnProps = {
  label: string;

  perks: Perk[];

  mostPickedId?:
    string;
};

function PerkColumn({
  label,
  perks,
  mostPickedId,
}: PerkColumnProps) {
  return (
    <div className="global-perk-column">
      <span className="global-perk-tier">
        {label}
      </span>

      <div className="global-perk-list">
        {perks.map(
          (perk) => {
            const mostPicked =
              perk.id ===
              mostPickedId;

            return (
              <PerkItem
                key={
                  perk.id
                }
                perk={
                  perk
                }
                mostPicked={
                  mostPicked
                }
              />
            );
          },
        )}
      </div>
    </div>
  );
}

/* ========================================
   PERK ITEM
======================================== */

type PerkItemProps = {
  perk: Perk;

  mostPicked:
    boolean;
};

function PerkItem({
  perk,
  mostPicked,
}: PerkItemProps) {
  const popularity =
    perk.popularity;

  const barWidth =
    popularity !==
    undefined
      ? Math.max(
          0,
          Math.min(
            100,
            popularity,
          ),
        )
      : 0;

  return (
    <div
      className={
        mostPicked
          ? "global-perk-item most-picked"
          : "global-perk-item"
      }
    >
      <div className="global-perk-item-top">
        <div className="global-perk-icon">
          {perk.icon ? (
            <img
              src={
                perk.icon
              }
              alt={
                perk.name
              }
              loading="lazy"
            />
          ) : (
            <Sparkles
              size={18}
            />
          )}
        </div>

        <div className="global-perk-info">
          <div className="global-perk-name-row">
            <strong>
              {perk.name}
            </strong>

            {mostPicked && (
              <span className="global-perk-most-picked">
                Most picked
              </span>
            )}
          </div>

          <span>
            {perk.description}
          </span>
        </div>

        <div className="global-perk-score">
          <strong>
            {popularity !==
            undefined
              ? `${popularity}%`
              : "—"}
          </strong>

          <span>
            PICK RATE
          </span>
        </div>
      </div>

      <div className="global-perk-popularity">
        <div className="global-perk-popularity-track">
          <div
            className="global-perk-popularity-fill"
            style={{
              width:
                `${barWidth}%`,
            }}
          />
        </div>

        <div className="global-perk-popularity-footer">
          <span>
            Community preference
          </span>

          {popularity !==
            undefined && (
            <strong>
              {popularity}%
            </strong>
          )}
        </div>
      </div>
    </div>
  );
}

/* ========================================
   HELPERS
======================================== */

function getMostPickedPerk(
  perks: Perk[],
) {
  return [
    ...perks,
  ]
    .filter(
      (perk) =>
        perk.popularity !==
        undefined,
    )
    .sort(
      (a, b) =>
        (b.popularity ??
          0) -
        (a.popularity ??
          0),
    )[0];
}

export default PerksPage;