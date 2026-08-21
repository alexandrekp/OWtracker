import {
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  BarChart3,
  Clock3,
  Sparkles,
  Swords,
  Trophy,
  UserRound,
} from "lucide-react";

import type {
  Hero,
} from "../types/hero";

import type {
  Perk,
} from "../types/perk";

import type {
  PlayerStatBlock,
} from "../types/player";

import {
  getPerksForHero,
} from "../data/perks";

type PlayerHeroContext = {
  username: string;
  battleTag: string;
  stats: PlayerStatBlock;
};

type HeroDetailProps = {
  hero: Hero;

  playerContext?:
    PlayerHeroContext | null;

  onBack: () => void;
};

type HeroTab =
  | "overview"
  | "perks"
  | "stats";

function HeroDetail({
  hero,
  playerContext,
  onBack,
}: HeroDetailProps) {
  const [
    activeTab,
    setActiveTab,
  ] = useState<HeroTab>(
    "overview",
  );

  const heroPerks =
    useMemo(
      () =>
        getPerksForHero(
          hero.id,
        ),
      [hero.id],
    );

  const minorPerks =
    heroPerks?.perks.filter(
      (perk) =>
        perk.tier === "Minor",
    ) ?? [];

  const majorPerks =
    heroPerks?.perks.filter(
      (perk) =>
        perk.tier === "Major",
    ) ?? [];

  const recommendedMinor =
    minorPerks
      .filter(
        (perk) =>
          perk.popularity !==
          undefined,
      )
      .sort(
        (a, b) =>
          (b.popularity ?? 0) -
          (a.popularity ?? 0),
      )[0];

  const recommendedMajor =
    majorPerks
      .filter(
        (perk) =>
          perk.popularity !==
          undefined,
      )
      .sort(
        (a, b) =>
          (b.popularity ?? 0) -
          (a.popularity ?? 0),
      )[0];

  return (
    <div className="hero-detail">
      <button
        className="back-button"
        onClick={onBack}
      >
        <ArrowLeft size={16} />

        {playerContext
          ? "Player"
          : "Heroes"}
      </button>

      <section className="hero-detail-header">
        <div className="hero-detail-info">
          <span
            className={`detail-role ${hero.role.toLowerCase()}`}
          >
            {hero.role}
          </span>

          <h1>
            {hero.name}
          </h1>

          <p>
            {playerContext
              ? `${playerContext.username}'s performance compared with global Blizzard statistics.`
              : `Performance, statistics and community perks for ${hero.name}.`}
          </p>
        </div>

        <div className="hero-detail-portrait">
          <img
            src={hero.image}
            alt={hero.name}
          />
        </div>
      </section>

      <nav className="hero-tabs">
        <button
          className={
            activeTab === "overview"
              ? "hero-tab active"
              : "hero-tab"
          }
          onClick={() =>
            setActiveTab(
              "overview",
            )
          }
        >
          Overview
        </button>

        <button
          className={
            activeTab === "perks"
              ? "hero-tab active"
              : "hero-tab"
          }
          onClick={() =>
            setActiveTab(
              "perks",
            )
          }
        >
          <Sparkles size={15} />

          Perks
        </button>

        <button
          className={
            activeTab === "stats"
              ? "hero-tab active"
              : "hero-tab"
          }
          onClick={() =>
            setActiveTab(
              "stats",
            )
          }
        >
          <BarChart3 size={15} />

          Stats
        </button>
      </nav>

      {activeTab ===
        "overview" && (
        <OverviewTab
          hero={hero}
          playerContext={
            playerContext
          }
          recommendedMinor={
            recommendedMinor
          }
          recommendedMajor={
            recommendedMajor
          }
        />
      )}

      {activeTab ===
        "perks" && (
        <PerksTab
          heroName={hero.name}
          minorPerks={
            minorPerks
          }
          majorPerks={
            majorPerks
          }
        />
      )}

      {activeTab ===
        "stats" && (
        <StatsTab
          hero={hero}
          playerContext={
            playerContext
          }
        />
      )}
    </div>
  );
}

/* ========================================
   OVERVIEW
======================================== */

type OverviewTabProps = {
  hero: Hero;

  playerContext?:
    PlayerHeroContext | null;

  recommendedMinor?: Perk;
  recommendedMajor?: Perk;
};

function OverviewTab({
  hero,
  playerContext,
  recommendedMinor,
  recommendedMajor,
}: OverviewTabProps) {
  return (
    <>
      {playerContext && (
        <PlayerVsGlobal
          hero={hero}
          context={
            playerContext
          }
        />
      )}

      <section className="overview-layout">
        <article className="detail-panel performance-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-eyebrow">
                PERFORMANCE
              </span>

              <h2>
                Competitive stats
              </h2>
            </div>

            <span className="data-source">
              Blizzard
            </span>
          </div>

          <div className="performance-grid">
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

            <div>
              <span>
                Ban rate
              </span>

              <strong>
                {hero.banRate !==
                undefined
                  ? `${hero.banRate}%`
                  : "—"}
              </strong>
            </div>
          </div>
        </article>

        <article className="detail-panel overview-perks-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-eyebrow">
                RECOMMENDED PERKS
              </span>

              <h2>
                Community picks
              </h2>
            </div>
          </div>

          <div className="overview-perks">
            <RecommendedPerk
              label="Minor"
              perk={
                recommendedMinor
              }
            />

            <RecommendedPerk
              label="Major"
              perk={
                recommendedMajor
              }
            />
          </div>
        </article>
      </section>
    </>
  );
}

/* ========================================
   PLAYER VS GLOBAL
======================================== */

type PlayerVsGlobalProps = {
  hero: Hero;
  context: PlayerHeroContext;
};

function PlayerVsGlobal({
  hero,
  context,
}: PlayerVsGlobalProps) {
  const player =
    context.stats;

  const globalWinRate =
    hero.winRate;

  const difference =
    globalWinRate !== undefined
      ? player.winrate -
        globalWinRate
      : null;

  return (
    <section className="player-vs-global">
      <div className="player-vs-global-header">
        <div>
          <span className="panel-eyebrow">
            PLAYER VS GLOBAL
          </span>

          <h2>
            {context.username}
          </h2>

          <span className="player-vs-battletag">
            {context.battleTag}
          </span>
        </div>

        {difference !==
          null && (
          <div
            className={
              difference >= 0
                ? "player-vs-result positive"
                : "player-vs-result negative"
            }
          >
            <strong>
              {difference >= 0
                ? "+"
                : ""}
              {difference.toFixed(
                2,
              )}
              pts
            </strong>

            <span>
              {difference >= 0
                ? "Above global"
                : "Below global"}
            </span>
          </div>
        )}
      </div>

      <div className="player-vs-table">
        <div className="player-vs-row player-vs-heading">
          <span>
            Metric
          </span>

          <span>
            {context.username}
          </span>

          <span>
            Global
          </span>
        </div>

        <ComparisonRow
          label="Win rate"
          player={`${player.winrate.toFixed(
            2,
          )}%`}
          global={
            globalWinRate !==
            undefined
              ? `${globalWinRate}%`
              : "—"
          }
          highlight
        />

        <ComparisonRow
          label="Games"
          player={
            String(
              player.games_played,
            )
          }
          global="—"
        />

        <ComparisonRow
          label="Wins"
          player={
            String(
              player.games_won,
            )
          }
          global="—"
        />

        <ComparisonRow
          label="KDA"
          player={
            player.kda.toFixed(
              2,
            )
          }
          global="—"
        />

        <ComparisonRow
          label="Time played"
          player={
            formatDuration(
              player.time_played,
            )
          }
          global="—"
        />

        <ComparisonRow
          label="Pick rate"
          player="—"
          global={
            hero.pickRate !==
            undefined
              ? `${hero.pickRate}%`
              : "—"
          }
        />

        <ComparisonRow
          label="Ban rate"
          player="—"
          global={
            hero.banRate !==
            undefined
              ? `${hero.banRate}%`
              : "—"
          }
        />
      </div>

      <div className="player-vs-mini-stats">
        <div>
          <Trophy
            size={15}
          />

          <span>
            Record
          </span>

          <strong>
            {player.games_won}W ·{" "}
            {player.games_lost}L
          </strong>
        </div>

        <div>
          <Swords
            size={15}
          />

          <span>
            KDA
          </span>

          <strong>
            {player.kda.toFixed(
              2,
            )}
          </strong>
        </div>

        <div>
          <Clock3
            size={15}
          />

          <span>
            Played
          </span>

          <strong>
            {formatDuration(
              player.time_played,
            )}
          </strong>
        </div>

        <div>
          <UserRound
            size={15}
          />

          <span>
            Player
          </span>

          <strong>
            {context.username}
          </strong>
        </div>
      </div>
    </section>
  );
}

type ComparisonRowProps = {
  label: string;
  player: string;
  global: string;
  highlight?: boolean;
};

function ComparisonRow({
  label,
  player,
  global,
  highlight = false,
}: ComparisonRowProps) {
  return (
    <div
      className={
        highlight
          ? "player-vs-row highlight"
          : "player-vs-row"
      }
    >
      <span>
        {label}
      </span>

      <strong>
        {player}
      </strong>

      <strong>
        {global}
      </strong>
    </div>
  );
}

/* ========================================
   RECOMMENDED PERK
======================================== */

type RecommendedPerkProps = {
  label: string;
  perk?: Perk;
};

function RecommendedPerk({
  label,
  perk,
}: RecommendedPerkProps) {
  return (
    <div className="overview-perk">
      <span className="overview-perk-label">
        {label}
      </span>

      {perk ? (
        <>
          <div className="overview-perk-main">
            <div className="overview-perk-icon">
              {perk.icon ? (
                <img
                  src={perk.icon}
                  alt={perk.name}
                />
              ) : (
                <Sparkles
                  size={18}
                />
              )}
            </div>

            <div>
              <strong>
                {perk.name}
              </strong>

              <span>
                Community preference
              </span>
            </div>
          </div>

          <strong className="overview-perk-score">
            {perk.popularity !==
            undefined
              ? `${perk.popularity}%`
              : "—"}
          </strong>
        </>
      ) : (
        <span className="overview-perk-empty">
          No data
        </span>
      )}
    </div>
  );
}

/* ========================================
   STATS
======================================== */

type StatsTabProps = {
  hero: Hero;

  playerContext?:
    PlayerHeroContext | null;
};

function StatsTab({
  hero,
  playerContext,
}: StatsTabProps) {
  return (
    <>
      {playerContext && (
        <PlayerVsGlobal
          hero={hero}
          context={
            playerContext
          }
        />
      )}

      <section className="detail-panel">
        <div className="panel-heading">
          <div>
            <span className="panel-eyebrow">
              BLIZZARD STATS
            </span>

            <h2>
              Global performance
            </h2>
          </div>

          <span className="data-source">
            PC · Europe · Competitive
          </span>
        </div>

        <div className="performance-grid">
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

          <div>
            <span>
              Ban rate
            </span>

            <strong>
              {hero.banRate !==
              undefined
                ? `${hero.banRate}%`
                : "—"}
            </strong>
          </div>
        </div>
      </section>
    </>
  );
}

/* ========================================
   PERKS
======================================== */

type PerksTabProps = {
  heroName: string;
  minorPerks: Perk[];
  majorPerks: Perk[];
};

function PerksTab({
  heroName,
  minorPerks,
  majorPerks,
}: PerksTabProps) {
  const hasPerks =
    minorPerks.length > 0 ||
    majorPerks.length > 0;

  if (!hasPerks) {
    return (
      <section className="tab-empty">
        <Sparkles
          size={24}
        />

        <span className="panel-eyebrow">
          PERKS
        </span>

        <h2>
          No perk data available
        </h2>

        <p>
          No perk information
          was found for{" "}
          {heroName}.
        </p>
      </section>
    );
  }

  return (
    <section className="perks-layout">
      <PerkGroup
        tier="MINOR"
        title="Minor perks"
        subtitle="Choose one minor perk"
        perks={
          minorPerks
        }
      />

      <PerkGroup
        tier="MAJOR"
        title="Major perks"
        subtitle="Choose one major perk"
        perks={
          majorPerks
        }
      />
    </section>
  );
}

type PerkGroupProps = {
  tier: string;
  title: string;
  subtitle: string;
  perks: Perk[];
};

function PerkGroup({
  tier,
  title,
  subtitle,
  perks,
}: PerkGroupProps) {
  const perksWithPopularity =
    perks.filter(
      (perk) =>
        perk.popularity !==
        undefined,
    );

  const highestPopularity =
    perksWithPopularity.length >
    0
      ? Math.max(
          ...perksWithPopularity.map(
            (perk) =>
              perk.popularity ??
              0,
          ),
        )
      : undefined;

  return (
    <article className="perk-group">
      <div className="perk-group-header">
        <div>
          <span className="panel-eyebrow">
            {tier}
          </span>

          <h2>
            {title}
          </h2>

          <p>
            {subtitle}
          </p>
        </div>
      </div>

      <div className="perk-list">
        {perks.map(
          (perk) => {
            const recommended =
              perk.popularity !==
                undefined &&
              highestPopularity !==
                undefined &&
              perk.popularity ===
                highestPopularity;

            return (
              <div
                className={
                  recommended
                    ? "perk-card recommended"
                    : "perk-card"
                }
                key={
                  perk.id
                }
              >
                <div className="perk-card-main">
                  <div className="perk-icon-container">
                    {perk.icon ? (
                      <img
                        className="perk-icon"
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
                        size={22}
                      />
                    )}
                  </div>

                  <div className="perk-content">
                    <div className="perk-name-row">
                      <h3>
                        {perk.name}
                      </h3>

                      {recommended && (
                        <span className="recommended-badge">
                          Recommended
                        </span>
                      )}
                    </div>

                    <p>
                      {perk.description}
                    </p>
                  </div>

                  <div className="perk-score">
                    {perk.popularity !==
                    undefined ? (
                      <>
                        <strong>
                          {perk.popularity}%
                        </strong>

                        <span>
                          PICK
                        </span>
                      </>
                    ) : (
                      <>
                        <strong>
                          —
                        </strong>

                        <span>
                          PICK
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {perk.popularity !==
                  undefined && (
                  <>
                    <div className="perk-progress">
                      <span
                        style={{
                          width: `${perk.popularity}%`,
                        }}
                      />
                    </div>

                    <span className="perk-community">
                      Community preference
                    </span>
                  </>
                )}
              </div>
            );
          },
        )}
      </div>
    </article>
  );
}

/* ========================================
   HELPERS
======================================== */

function formatDuration(
  seconds: number,
) {
  if (!seconds) {
    return "0m";
  }

  const hours =
    Math.floor(
      seconds / 3600,
    );

  const minutes =
    Math.floor(
      (seconds % 3600) /
        60,
    );

  if (hours > 0) {
    return `${hours}h ${minutes
      .toString()
      .padStart(
        2,
        "0",
      )}m`;
  }

  return `${minutes}m`;
}

export default HeroDetail;