import {
  useEffect,
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

import {
  heroes,
} from "../data/heroes";

import {
  fetchCounterwatchHero,
} from "../services/counterwatch";

import type {
  CounterwatchHeroStats,
  CounterwatchMatchup,
} from "../services/counterwatch";

import "./HeroCounters.css";

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
  | "stats"
  | "counters";

type MetaTier =
  | "S"
  | "A"
  | "B"
  | "C"
  | "D";

type HeroMetaInfo = {
  score: number;
  tier: MetaTier;
  roleRank: number;
  overallRank: number;
};

type MetaTrend =
  | "rising"
  | "falling"
  | "stable";

type StoredHeroMeta = {
  score: number;
  signature: string;
  trend?: MetaTrend;
};

type HeroPositioning = {
  winRateVsRoster:
    number | null;

  pickRateLevel:
    string;

  banRateLevel:
    string;

  metaStanding:
    string;
};

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

  const metaInfo =
    useMemo(
      () =>
        getHeroMetaInfo(
          hero,
        ),
      [hero],
    );

  const positioning =
    useMemo(
      () =>
        getHeroPositioning(
          hero,
          metaInfo,
        ),
      [
        hero,
        metaInfo,
      ],
    );

  const [
    counterData,
    setCounterData,
  ] =
    useState<CounterwatchHeroStats | null>(
      null,
    );

  const [
    counteredBy,
    setCounteredBy,
  ] =
    useState<CounterwatchMatchup[]>(
      [],
    );

  const [
    strongAgainst,
    setStrongAgainst,
  ] =
    useState<CounterwatchMatchup[]>(
      [],
    );

  const [
    countersLoading,
    setCountersLoading,
  ] = useState(false);

  const [
    countersError,
    setCountersError,
  ] =
    useState<string | null>(
      null,
    );

  useEffect(() => {
    let cancelled =
      false;

    setCountersLoading(
      true,
    );

    setCountersError(
      null,
    );

    setCounterData(
      null,
    );

    setCounteredBy(
      [],
    );

    setStrongAgainst(
      [],
    );

    fetchCounterwatchHero(
      hero.id,
    )
      .then(
        (data) => {
          if (
            cancelled
          ) {
            return;
          }

          setCounterData(
            data,
          );

          setCounteredBy(
            data.counters,
          );

          setStrongAgainst(
            data.strongAgainst,
          );
        },
      )
      .catch(
        (reason) => {
          if (
            cancelled
          ) {
            return;
          }

          setCountersError(
            reason instanceof
            Error
              ? reason.message
              : "Unable to load Counterwatch matchup data.",
          );
        },
      )
      .finally(
        () => {
          if (
            !cancelled
          ) {
            setCountersLoading(
              false,
            );
          }
        },
      );

    return () => {
      cancelled =
        true;
    };
  }, [
    hero.id,
  ]);


  const [
    metaTrend,
    setMetaTrend,
  ] =
    useState<MetaTrend | null>(
      null,
    );

  useEffect(() => {
    if (!metaInfo) {
      setMetaTrend(
        null,
      );
      return;
    }

    const storageKey =
      `owtracker.heroMeta.${hero.id}`;

    const signature =
      [
        hero.winRate ?? "na",
        hero.pickRate ?? "na",
        hero.banRate ?? "na",
      ].join("|");

    try {
      const raw =
        localStorage.getItem(
          storageKey,
        );

      if (!raw) {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            score:
              metaInfo.score,

            signature,
          } satisfies StoredHeroMeta),
        );

        setMetaTrend(
          null,
        );
        return;
      }

      const previous =
        JSON.parse(
          raw,
        ) as StoredHeroMeta;

      if (
        previous.signature ===
        signature
      ) {
        setMetaTrend(
          previous.trend ??
            null,
        );
        return;
      }

      const difference =
        metaInfo.score -
        previous.score;

      const trend:
        MetaTrend =
        difference >= 2
          ? "rising"
          : difference <= -2
            ? "falling"
            : "stable";

      localStorage.setItem(
        storageKey,
        JSON.stringify({
          score:
            metaInfo.score,

          signature,

          trend,
        } satisfies StoredHeroMeta),
      );

      setMetaTrend(
        trend,
      );
    } catch {
      setMetaTrend(
        null,
      );
    }
  }, [
    hero.id,
    hero.winRate,
    hero.pickRate,
    hero.banRate,
    metaInfo,
  ]);

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

        <button
          className={
            activeTab === "counters"
              ? "hero-tab active"
              : "hero-tab"
          }
          onClick={() =>
            setActiveTab(
              "counters",
            )
          }
        >
          <Swords size={15} />

          Counters
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
          metaInfo={
            metaInfo
          }
          metaTrend={
            metaTrend
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
          metaInfo={
            metaInfo
          }
          metaTrend={
            metaTrend
          }
          positioning={
            positioning
          }
        />
      )}

      {activeTab ===
        "counters" && (
        <CountersTab
          hero={hero}
          data={
            counterData
          }
          counteredBy={
            counteredBy
          }
          strongAgainst={
            strongAgainst
          }
          loading={
            countersLoading
          }
          error={
            countersError
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

  metaInfo:
    HeroMetaInfo | null;

  metaTrend:
    MetaTrend | null;
};

function OverviewTab({
  hero,
  playerContext,
  recommendedMinor,
  recommendedMajor,
  metaInfo,
  metaTrend,
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

        <article className="detail-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-eyebrow">
                META PERFORMANCE
              </span>

              <h2>
                Current position
              </h2>
            </div>

            <span className="data-source">
              OWTracker
            </span>
          </div>

          <div className="performance-grid">
            <div>
              <span>
                Tier
              </span>

              <strong>
                {metaInfo?.tier ??
                  "—"}
              </strong>
            </div>

            <div>
              <span>
                Meta score
              </span>

              <strong>
                {metaInfo
                  ? metaInfo.score.toFixed(
                      0,
                    )
                  : "—"}
              </strong>
            </div>

            <div>
              <span>
                Role rank
              </span>

              <strong>
                {metaInfo
                  ? `#${metaInfo.roleRank} ${hero.role}`
                  : "—"}
              </strong>
            </div>
          </div>

          <div
            style={{
              marginTop: "18px",
              paddingTop: "14px",
              borderTop:
                "1px solid var(--border, rgba(255,255,255,0.08))",
              display: "flex",
              alignItems: "center",
              justifyContent:
                "space-between",
              gap: "14px",
              flexWrap: "wrap",
              fontSize: "12px",
              lineHeight: 1.4,
              textAlign: "left",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  opacity: 0.7,
                }}
              >
                Score weighting ·
              </span>

              <strong
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                WR 60% · PR 30% · BR 10%
              </strong>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
              }}
            >
              <span
                style={{
                  opacity: 0.7,
                }}
              >
                Trend ·
              </span>

              <strong
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                {metaTrend
                  ? formatMetaTrend(
                      metaTrend,
                    )
                  : "Collecting data"}
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

  metaInfo:
    HeroMetaInfo | null;

  metaTrend:
    MetaTrend | null;

  positioning:
    HeroPositioning;
};

function StatsTab({
  hero,
  playerContext,
  metaInfo,
  metaTrend,
  positioning,
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

      <section
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(2, minmax(0, 1fr))",
          gap: "16px",
        }}
      >
        <article className="detail-panel">
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
              Blizzard
            </span>
          </div>

          <div
            style={{
              marginTop: "18px",
              borderTop:
                "1px solid var(--border, rgba(255,255,255,0.08))",
            }}
          >
            <StatsTableRow
              label="Win rate"
              value={
                hero.winRate !==
                undefined
                  ? `${hero.winRate}%`
                  : "—"
              }
            />

            <StatsTableRow
              label="Pick rate"
              value={
                hero.pickRate !==
                undefined
                  ? `${hero.pickRate}%`
                  : "—"
              }
            />

            <StatsTableRow
              label="Ban rate"
              value={
                hero.banRate !==
                undefined
                  ? `${hero.banRate}%`
                  : "—"
              }
            />

            <StatsTableRow
              label="Role"
              value={hero.role}
              last
            />
          </div>
        </article>

        <article className="detail-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-eyebrow">
                META RANKING
              </span>

              <h2>
                Current position
              </h2>
            </div>

            <span className="data-source">
              OWTracker
            </span>
          </div>

          <div
            style={{
              marginTop: "18px",
              borderTop:
                "1px solid var(--border, rgba(255,255,255,0.08))",
            }}
          >
            <StatsTableRow
              label="Meta score"
              value={
                metaInfo
                  ? metaInfo.score.toFixed(
                      0,
                    )
                  : "—"
              }
            />

            <StatsTableRow
              label="Tier"
              value={
                metaInfo?.tier ??
                "—"
              }
            />

            <StatsTableRow
              label="Overall rank"
              value={
                metaInfo
                  ? `#${metaInfo.overallRank}`
                  : "—"
              }
            />

            <StatsTableRow
              label="Role rank"
              value={
                metaInfo
                  ? `#${metaInfo.roleRank} ${hero.role}`
                  : "—"
              }
            />

            <StatsTableRow
              label="Trend"
              value={
                metaTrend
                  ? formatMetaTrend(
                      metaTrend,
                    )
                  : "Collecting data"
              }
              last
            />
          </div>

          <div
            style={{
              marginTop: "14px",
              paddingTop: "12px",
              borderTop:
                "1px solid var(--border, rgba(255,255,255,0.08))",
              fontSize: "12px",
              opacity: 0.72,
            }}
          >
            Score weighting ·{" "}
            <strong
              style={{
                opacity: 1,
              }}
            >
              WR 60% · PR 30% · BR 10%
            </strong>
          </div>
        </article>
      </section>

      <section
        className="detail-panel"
        style={{
          marginTop: "16px",
        }}
      >
        <div className="panel-heading">
          <div>
            <span className="panel-eyebrow">
              POSITIONING
            </span>

            <h2>
              Roster comparison
            </h2>
          </div>

          <span className="data-source">
            OWTracker
          </span>
        </div>

        <div
          style={{
            marginTop: "18px",
            borderTop:
              "1px solid var(--border, rgba(255,255,255,0.08))",
          }}
        >
          <StatsTableRow
            label="Win rate vs roster"
            value={
              positioning.winRateVsRoster !==
              null
                ? `${positioning.winRateVsRoster >= 0 ? "+" : ""}${positioning.winRateVsRoster.toFixed(
                    1,
                  )} pts`
                : "—"
            }
          />

          <StatsTableRow
            label="Pick rate"
            value={
              positioning.pickRateLevel
            }
          />

          <StatsTableRow
            label="Ban rate"
            value={
              positioning.banRateLevel
            }
          />

          <StatsTableRow
            label="Meta standing"
            value={
              positioning.metaStanding
            }
            last
          />
        </div>
      </section>
    </>
  );
}

type StatsTableRowProps = {
  label: string;
  value: string;
  last?: boolean;
};

function StatsTableRow({
  label,
  value,
  last = false,
}: StatsTableRowProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "minmax(0, 1fr) auto",
        alignItems: "center",
        gap: "20px",
        minHeight: "52px",
        borderBottom:
          last
            ? "none"
            : "1px solid var(--border, rgba(255,255,255,0.08))",
      }}
    >
      <span
        style={{
          fontSize: "13px",
          opacity: 0.7,
        }}
      >
        {label}
      </span>

      <strong
        style={{
          fontSize: "15px",
          textAlign: "right",
        }}
      >
        {value}
      </strong>
    </div>
  );
}

/* ========================================
   COUNTERS
======================================== */

type CountersTabProps = {
  hero: Hero;

  data:
    CounterwatchHeroStats | null;

  counteredBy:
    CounterwatchMatchup[];

  strongAgainst:
    CounterwatchMatchup[];

  loading: boolean;

  error:
    string | null;
};

function CountersTab({
  hero,
  data,
  counteredBy,
  strongAgainst,
  loading,
  error,
}: CountersTabProps) {
  if (loading) {
    return (
      <section className="tab-empty">
        <Swords size={24} />

        <span className="panel-eyebrow">
          COUNTERS
        </span>

        <h2>
          Loading Counterwatch data
        </h2>
      </section>
    );
  }

  if (error) {
    return (
      <section className="tab-empty">
        <Swords size={24} />

        <span className="panel-eyebrow">
          COUNTERS
        </span>

        <h2>
          Matchup data unavailable
        </h2>

        <p>
          {error}
        </p>
      </section>
    );
  }

  const hasData =
    counteredBy.length > 0 ||
    strongAgainst.length > 0;

  if (!hasData) {
    return (
      <section className="tab-empty">
        <Swords size={24} />

        <span className="panel-eyebrow">
          COUNTERS
        </span>

        <h2>
          No matchup data available
        </h2>

        <p>
          Counterwatch returned no
          matchup entries for{" "}
          {hero.name}.
        </p>
      </section>
    );
  }

  return (
    <>
      <section className="detail-panel counterwatch-summary">
        <div className="panel-heading">
          <div>
            <span className="panel-eyebrow">
              COUNTERWATCH
            </span>

            <h2>
              Community matchup overview
            </h2>
          </div>

          <span className="data-source">
            LIVE
          </span>
        </div>

        <div className="performance-grid">
          <div>
            <span>
              Win rate
            </span>

            <strong>
              {data?.winRate !==
              null &&
              data?.winRate !==
              undefined
                ? `${data.winRate}%`
                : "—"}
            </strong>
          </div>

          <div>
            <span>
              Tracked matches
            </span>

            <strong>
              {data?.matches !==
              null &&
              data?.matches !==
              undefined
                ? data.matches.toLocaleString()
                : "—"}
            </strong>
          </div>

          <div>
            <span>
              Counterwatch tier
            </span>

            <strong>
              {data?.tier ??
                "—"}
            </strong>
          </div>
        </div>

        <div
          style={{
            marginTop: "14px",
            paddingTop: "12px",
            borderTop:
              "1px solid var(--border, rgba(255,255,255,0.08))",
            display: "flex",
            justifyContent:
              "space-between",
            gap: "12px",
            flexWrap: "wrap",
            fontSize: "12px",
            opacity: 0.72,
          }}
        >
          <span>
            Counter rating is not matchup win rate.
          </span>

          <span>
            {data?.updatedAt
              ? `Updated ${data.updatedAt}`
              : "Community data"}
          </span>
        </div>
      </section>

      <section
        className="counters-layout"
        style={{
          marginTop: "16px",
        }}
      >
        <MatchupGroup
          eyebrow="COUNTERED BY"
          title={`Best counters to ${hero.name}`}
          entries={
            counteredBy
          }
        />

        <MatchupGroup
          eyebrow="STRONG AGAINST"
          title={`${hero.name} performs well against`}
          entries={
            strongAgainst
          }
        />
      </section>
    </>
  );
}

type MatchupGroupProps = {
  eyebrow: string;
  title: string;

  entries:
    CounterwatchMatchup[];
};

function MatchupGroup({
  eyebrow,
  title,
  entries,
}: MatchupGroupProps) {
  return (
    <article className="detail-panel matchup-group">
      <div className="panel-heading">
        <div>
          <span className="panel-eyebrow">
            {eyebrow}
          </span>

          <h2>
            {title}
          </h2>
        </div>

        <span className="data-source">
          Counterwatch
        </span>
      </div>

      <div className="matchup-list">
        {entries.map(
          (matchup) => {
            const opponent =
              heroes.find(
                (entry) =>
                  entry.id ===
                  matchup.opponentId,
              );

            return (
              <div
                className="matchup-row"
                key={`${matchup.heroId}-${matchup.opponentId}`}
              >
                <div className="matchup-hero">
                  <div className="matchup-hero-avatar">
                    {opponent?.image ? (
                      <img
                        src={
                          opponent.image
                        }
                        alt={
                          opponent.name
                        }
                      />
                    ) : (
                      <UserRound
                        size={18}
                      />
                    )}
                  </div>

                  <div>
                    <strong>
                      {opponent?.name ??
                        matchup.opponentName}
                    </strong>

                    <span>
                      {matchup.contributors
                        ? `${matchup.contributors.toLocaleString()} players`
                        : "Community matchup"}
                    </span>
                  </div>
                </div>

                <div className="matchup-values">
                  <div>
                    <span>
                      Counter rating
                    </span>

                    <strong className="matchup-positive">
                      +{matchup.counterRating.toFixed(
                        1,
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Fight swing
                    </span>

                    <strong>
                      {matchup.estimatedFightSwing !==
                      null
                        ? `≈ +${matchup.estimatedFightSwing}%`
                        : "—"}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Confidence
                    </span>

                    <strong>
                      {formatMatchupConfidence(
                        matchup.confidence,
                      )}
                    </strong>
                  </div>
                </div>
              </div>
            );
          },
        )}
      </div>
    </article>
  );
}

function formatMatchupConfidence(
  confidence:
    CounterwatchMatchup["confidence"],
) {
  switch (confidence) {
    case "very-high":
      return "Very high";

    case "high":
      return "High";

    case "good":
      return "Good";

    case "medium":
      return "Medium";

    default:
      return "Low";
  }
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

function getHeroPositioning(
  selectedHero: Hero,
  metaInfo:
    HeroMetaInfo | null,
): HeroPositioning {
  const validWinRates =
    heroes
      .map(
        (entry) =>
          entry.id ===
          selectedHero.id
            ? selectedHero.winRate
            : entry.winRate,
      )
      .filter(
        (
          value,
        ): value is number =>
          value !==
          undefined,
      );

  const averageWinRate =
    validWinRates.length > 0
      ? validWinRates.reduce(
          (sum, value) =>
            sum + value,
          0,
        ) /
        validWinRates.length
      : null;

  const winRateVsRoster =
    selectedHero.winRate !==
      undefined &&
    averageWinRate !==
      null
      ? selectedHero.winRate -
        averageWinRate
      : null;

  const pickRateLevel =
    classifyRosterMetric(
      selectedHero.pickRate,
      heroes.map(
        (entry) =>
          entry.id ===
          selectedHero.id
            ? selectedHero.pickRate
            : entry.pickRate,
      ),
    );

  const banRateLevel =
    classifyRosterMetric(
      selectedHero.banRate,
      heroes.map(
        (entry) =>
          entry.id ===
          selectedHero.id
            ? selectedHero.banRate
            : entry.banRate,
      ),
    );

  const metaStanding =
    metaInfo
      ? getMetaStandingLabel(
          metaInfo.overallRank,
        )
      : "—";

  return {
    winRateVsRoster,
    pickRateLevel,
    banRateLevel,
    metaStanding,
  };
}

function classifyRosterMetric(
  value:
    number | undefined,

  dataset:
    Array<
      number | undefined
    >,
) {
  if (
    value === undefined
  ) {
    return "—";
  }

  const values =
    dataset.filter(
      (
        entry,
      ): entry is number =>
        entry !== undefined,
    );

  if (
    values.length === 0
  ) {
    return "—";
  }

  const sorted =
    [...values].sort(
      (a, b) =>
        a - b,
    );

  const index =
    sorted.findIndex(
      (entry) =>
        entry >= value,
    );

  const percentile =
    index < 0
      ? 1
      : index /
        Math.max(
          sorted.length - 1,
          1,
        );

  if (
    percentile >= 0.75
  ) {
    return "Very high";
  }

  if (
    percentile >= 0.55
  ) {
    return "High";
  }

  if (
    percentile <= 0.25
  ) {
    return "Low";
  }

  return "Average";
}

function getMetaStandingLabel(
  overallRank: number,
) {
  const totalHeroes =
    heroes.length;

  if (
    totalHeroes <= 0
  ) {
    return "—";
  }

  const percentile =
    Math.ceil(
      (overallRank /
        totalHeroes) *
        100,
    );

  return `Top ${Math.max(
    1,
    percentile,
  )}%`;
}

function getHeroMetaInfo(
  selectedHero: Hero,
): HeroMetaInfo | null {
  const dataset =
    heroes.map(
      (entry) =>
        entry.id ===
        selectedHero.id
          ? selectedHero
          : entry,
    );

  const scored =
    buildMetaScores(
      dataset,
    );

  const selected =
    scored.find(
      (entry) =>
        entry.hero.id ===
        selectedHero.id,
    );

  if (!selected) {
    return null;
  }

  const roleRanking =
    scored.filter(
      (entry) =>
        entry.hero.role ===
        selectedHero.role,
    );

  const roleRank =
    roleRanking.findIndex(
      (entry) =>
        entry.hero.id ===
        selectedHero.id,
    ) + 1;

  const overallRank =
    scored.findIndex(
      (entry) =>
        entry.hero.id ===
        selectedHero.id,
    ) + 1;

  return {
    score:
      selected.score,

    tier:
      getMetaTier(
        selected.score,
      ),

    roleRank:
      roleRank > 0
        ? roleRank
        : 1,

    overallRank:
      overallRank > 0
        ? overallRank
        : 1,
  };
}

function buildMetaScores(
  dataset: Hero[],
) {
  const validHeroes =
    dataset.filter(
      (entry) =>
        entry.winRate !==
          undefined ||
        entry.pickRate !==
          undefined ||
        entry.banRate !==
          undefined,
    );

  if (
    validHeroes.length ===
    0
  ) {
    return [];
  }

  const winRates =
    validHeroes.map(
      (entry) =>
        entry.winRate ?? 0,
    );

  const pickRates =
    validHeroes.map(
      (entry) =>
        entry.pickRate ?? 0,
    );

  const banRates =
    validHeroes.map(
      (entry) =>
        entry.banRate ?? 0,
    );

  const minWin =
    Math.min(
      ...winRates,
    );

  const maxWin =
    Math.max(
      ...winRates,
    );

  const minPick =
    Math.min(
      ...pickRates,
    );

  const maxPick =
    Math.max(
      ...pickRates,
    );

  const minBan =
    Math.min(
      ...banRates,
    );

  const maxBan =
    Math.max(
      ...banRates,
    );

  const rawScores =
    validHeroes.map(
      (entry) => {
        const normalizedWin =
          normalizeMetaMetric(
            entry.winRate ??
              minWin,
            minWin,
            maxWin,
          );

        const normalizedPick =
          normalizeMetaMetric(
            entry.pickRate ??
              minPick,
            minPick,
            maxPick,
          );

        const normalizedBan =
          normalizeMetaMetric(
            entry.banRate ??
              minBan,
            minBan,
            maxBan,
          );

        return {
          hero: entry,

          rawScore:
            normalizedWin *
              0.6 +
            normalizedPick *
              0.3 +
            normalizedBan *
              0.1,
        };
      },
    );

  const values =
    rawScores.map(
      (entry) =>
        entry.rawScore,
    );

  const minScore =
    Math.min(
      ...values,
    );

  const maxScore =
    Math.max(
      ...values,
    );

  return rawScores
    .map(
      (entry) => ({
        hero:
          entry.hero,

        score:
          normalizeMetaMetric(
            entry.rawScore,
            minScore,
            maxScore,
          ),
      }),
    )
    .sort(
      (a, b) =>
        b.score -
        a.score,
    );
}

function normalizeMetaMetric(
  value: number,
  min: number,
  max: number,
) {
  if (max === min) {
    return 100;
  }

  return (
    ((value - min) /
      (max - min)) *
    100
  );
}

function getMetaTier(
  score: number,
): MetaTier {
  if (score >= 85) {
    return "S";
  }

  if (score >= 70) {
    return "A";
  }

  if (score >= 55) {
    return "B";
  }

  if (score >= 40) {
    return "C";
  }

  return "D";
}

function formatMetaTrend(
  trend: MetaTrend,
) {
  if (
    trend === "rising"
  ) {
    return "↑ Rising";
  }

  if (
    trend === "falling"
  ) {
    return "↓ Falling";
  }

  return "→ Stable";
}

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