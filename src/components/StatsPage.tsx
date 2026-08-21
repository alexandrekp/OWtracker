import {
  ArrowRight,
  RefreshCw,
  Search,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import {
  heroes,
} from "../data/heroes";

import {
  refreshBlizzardStats,
} from "../services/blizzardStats";

import type {
  BlizzardRegion,
  BlizzardRole,
  BlizzardTier,
} from "../services/blizzardStats";

import type {
  Hero,
} from "../types/hero";

import "./StatsPage.css";
import "./StatsRefresh.css";
import "./MetaOverview.css";

type StatsPageProps = {
  onOpenHero:
    (hero: Hero) => void;
};

type SortMetric =
  | "winRate"
  | "pickRate"
  | "banRate";

type MetaTier =
  | "S"
  | "A"
  | "B"
  | "C"
  | "D";

type MetaHero = {
  hero: Hero;
  score: number;
  tier: MetaTier;
};

type CachedStatsDataset = {
  region: BlizzardRegion;
  tier: BlizzardTier;
  role: BlizzardRole;

  heroes: Hero[];

  rq: number | null;

  updatedAt: number;
};

const REGIONS:
  BlizzardRegion[] = [
    "Europe",
    "Americas",
    "Asia",
  ];

const TIERS:
  BlizzardTier[] = [
    "All",
    "Bronze",
    "Silver",
    "Gold",
    "Platinum",
    "Diamond",
    "Master",
    "Grandmaster",
    "Champion",
  ];

const ROLES:
  BlizzardRole[] = [
    "All",
    "Tank",
    "Damage",
    "Support",
  ];

const CACHE_PREFIX =
  "owtracker.blizzardStats";

const CACHE_MAX_AGE =
  30 * 60 * 1000;

/* ========================================
   PAGE
======================================== */

function StatsPage({
  onOpenHero,
}: StatsPageProps) {
  const [
    search,
    setSearch,
  ] = useState("");

  const [
    sortBy,
    setSortBy,
  ] =
    useState<SortMetric>(
      "winRate",
    );

  /* ========================================
     FILTERS
  ======================================== */

  const [
    selectedRegion,
    setSelectedRegion,
  ] =
    useState<BlizzardRegion>(
      "Europe",
    );

  const [
    selectedTier,
    setSelectedTier,
  ] =
    useState<BlizzardTier>(
      "All",
    );

  const [
    selectedRole,
    setSelectedRole,
  ] =
    useState<BlizzardRole>(
      "All",
    );

  const [
    activeRegion,
    setActiveRegion,
  ] =
    useState<BlizzardRegion>(
      "Europe",
    );

  const [
    activeTier,
    setActiveTier,
  ] =
    useState<BlizzardTier>(
      "All",
    );

  const [
    activeRole,
    setActiveRole,
  ] =
    useState<BlizzardRole>(
      "All",
    );

  /* ========================================
     CACHE INIT
  ======================================== */

  const initialCache =
    loadCachedDataset(
      "Europe",
      "All",
      "All",
    );

  const [
    currentHeroes,
    setCurrentHeroes,
  ] =
    useState<Hero[]>(
      initialCache?.heroes ??
        heroes,
    );

  const [
    refreshing,
    setRefreshing,
  ] =
    useState(false);

  const [
    refreshError,
    setRefreshError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    lastUpdated,
    setLastUpdated,
  ] =
    useState<Date | null>(
      initialCache
        ? new Date(
            initialCache.updatedAt,
          )
        : null,
    );

  /* ========================================
     CACHE
  ======================================== */

  function applySelectedDataset() {
    const cached =
      loadCachedDataset(
        selectedRegion,
        selectedTier,
        selectedRole,
      );

    if (!cached) {
      return false;
    }

    setCurrentHeroes(
      cached.heroes,
    );

    setActiveRegion(
      cached.region,
    );

    setActiveTier(
      cached.tier,
    );

    setActiveRole(
      cached.role,
    );

    setLastUpdated(
      new Date(
        cached.updatedAt,
      ),
    );

    setRefreshError(
      null,
    );

    return true;
  }

  /* ========================================
     REFRESH
  ======================================== */

  async function handleRefresh() {
    if (refreshing) {
      return;
    }

    setRefreshing(true);
    setRefreshError(null);

    try {
      const response =
        await refreshBlizzardStats(
          selectedRegion,
          selectedTier,
          selectedRole,
          "all-maps",
        );

      const statsMap =
        new Map(
          response.heroes.map(
            (stats) => [
              stats.heroId,
              stats,
            ],
          ),
        );

      const baseHeroes =
        selectedRole === "All"
          ? heroes
          : heroes.filter(
              (hero) =>
                hero.role ===
                selectedRole,
            );

      const updatedHeroes =
        baseHeroes.map(
          (hero) => {
            const stats =
              statsMap.get(
                hero.id,
              );

            if (!stats) {
              return {
                ...hero,

                winRate:
                  undefined,

                pickRate:
                  undefined,

                banRate:
                  undefined,
              };
            }

            return {
              ...hero,

              winRate:
                stats.winRate ??
                undefined,

              pickRate:
                stats.pickRate ??
                undefined,

              banRate:
                stats.banRate ??
                undefined,
            };
          },
        );

      const updatedAt =
        response.updatedAt *
        1000;

      setCurrentHeroes(
        updatedHeroes,
      );

      setActiveRegion(
        response.region,
      );

      setActiveTier(
        response.tier,
      );

      setActiveRole(
        response.role,
      );

      setLastUpdated(
        new Date(
          updatedAt,
        ),
      );

      saveCachedDataset({
        region:
          response.region,

        tier:
          response.tier,

        role:
          response.role,

        heroes:
          updatedHeroes,

        rq:
          response.rq,

        updatedAt,
      });
    } catch (error) {
      console.error(
        "Refresh error:",
        error,
      );

      setRefreshError(
        error instanceof Error
          ? error.message
          : "Unable to refresh Blizzard data.",
      );
    } finally {
      setRefreshing(false);
    }
  }

  /* ========================================
     TABLE
  ======================================== */

  const filteredHeroes =
    useMemo(() => {
      return [
        ...currentHeroes,
      ]
        .filter(
          (hero) =>
            hero.name
              .toLowerCase()
              .includes(
                search.toLowerCase(),
              ),
        )
        .sort(
          (a, b) => {
            const aValue =
              a[sortBy] ?? -1;

            const bValue =
              b[sortBy] ?? -1;

            return (
              bValue -
              aValue
            );
          },
        );
    }, [
      currentHeroes,
      search,
      sortBy,
    ]);

  /* ========================================
     META
  ======================================== */

  const metaHeroes =
    useMemo(
      () =>
        buildMetaTierList(
          currentHeroes,
        ),
      [
        currentHeroes,
      ],
    );

  const metaGroups =
    useMemo(() => {
      const groups:
        Record<
          MetaTier,
          MetaHero[]
        > = {
          S: [],
          A: [],
          B: [],
          C: [],
          D: [],
        };

      for (
        const entry of
        metaHeroes
      ) {
        groups[
          entry.tier
        ].push(
          entry,
        );
      }

      return groups;
    }, [
      metaHeroes,
    ]);

  /* ========================================
     META OVERVIEW
  ======================================== */

  const bestOverall =
    metaHeroes[0];

  const bestTank =
    getBestMetaHeroByRole(
      metaHeroes,
      "Tank",
    );

  const bestDamage =
    getBestMetaHeroByRole(
      metaHeroes,
      "Damage",
    );

  const bestSupport =
    getBestMetaHeroByRole(
      metaHeroes,
      "Support",
    );

  const topTanks =
    getTopMetaHeroesByRole(
      metaHeroes,
      "Tank",
      3,
    );

  const topDamage =
    getTopMetaHeroesByRole(
      metaHeroes,
      "Damage",
      3,
    );

  const topSupports =
    getTopMetaHeroesByRole(
      metaHeroes,
      "Support",
      3,
    );

  const sTierCount =
    metaGroups.S.length;

  const aTierCount =
    metaGroups.A.length;

  /* ========================================
     STATUS
  ======================================== */

  const filtersChanged =
    selectedRegion !==
      activeRegion ||
    selectedTier !==
      activeTier ||
    selectedRole !==
      activeRole;

  const selectedCachedDataset =
    loadCachedDataset(
      selectedRegion,
      selectedTier,
      selectedRole,
    );

  const selectedHasCache =
    selectedCachedDataset !==
    null;

  const currentCacheAge =
    lastUpdated
      ? Date.now() -
        lastUpdated.getTime()
      : null;

  const cacheIsStale =
    currentCacheAge !==
      null &&
    currentCacheAge >
      CACHE_MAX_AGE;

  /* ========================================
     RENDER
  ======================================== */

  return (
    <div className="global-page">
      {/* ===================================
          HEADER
      ==================================== */}

      <header className="stats-header">
        <div className="stats-header-main">
          <div className="stats-header-copy">
            <p className="eyebrow">
              HERO STATISTICS
            </p>

            <h1>
              Stats
            </h1>
            
          </div>

          <div className="stats-header-actions">
            <div className="live-status">
              <span className="status-dot" />

              Blizzard data
            </div>

            <button
              className={
                filtersChanged ||
                cacheIsStale
                  ? "stats-refresh-button pending"
                  : "stats-refresh-button"
              }
              onClick={
                handleRefresh
              }
              disabled={
                refreshing
              }
            >
              <RefreshCw
                size={14}
                className={
                  refreshing
                    ? "refresh-spinning"
                    : ""
                }
              />

              {refreshing
                ? "Refreshing..."
                : filtersChanged
                  ? "Apply & Refresh"
                  : cacheIsStale
                    ? "Refresh data"
                    : "Refresh"}
            </button>
          </div>
        </div>

        <div className="stats-header-bottom">
          <div className="stats-update-info">
            {lastUpdated ? (
              <>
                <span>
                  Updated
                </span>

                <strong>
                  {formatRelativeAge(
                    lastUpdated,
                  )}
                </strong>

                <span>
                  ·{" "}
                  {lastUpdated.toLocaleTimeString(
                    [],
                    {
                      hour:
                        "2-digit",

                      minute:
                        "2-digit",
                    },
                  )}
                </span>
              </>
            ) : null}

            {refreshError && (
              <strong className="stats-refresh-error">
                {refreshError}
              </strong>
            )}
          </div>
        </div>
      </header>

      {/* ===================================
          FILTERS
      ==================================== */}

      <section className="stats-data-filters">
        <div className="stats-data-filter">
          <label>
            Region
          </label>

          <select
            value={
              selectedRegion
            }
            onChange={(
              event,
            ) =>
              setSelectedRegion(
                event.target
                  .value as
                  BlizzardRegion,
              )
            }
          >
            {REGIONS.map(
              (region) => (
                <option
                  key={
                    region
                  }
                  value={
                    region
                  }
                >
                  {region}
                </option>
              ),
            )}
          </select>
        </div>

        <div className="stats-data-filter">
          <label>
            Rank
          </label>

          <select
            value={
              selectedTier
            }
            onChange={(
              event,
            ) =>
              setSelectedTier(
                event.target
                  .value as
                  BlizzardTier,
              )
            }
          >
            {TIERS.map(
              (tier) => (
                <option
                  key={
                    tier
                  }
                  value={
                    tier
                  }
                >
                  {tier ===
                  "All"
                    ? "All ranks"
                    : tier}
                </option>
              ),
            )}
          </select>
        </div>

        <div className="stats-data-filter">
          <label>
            Role
          </label>

          <select
            value={
              selectedRole
            }
            onChange={(
              event,
            ) =>
              setSelectedRole(
                event.target
                  .value as
                  BlizzardRole,
              )
            }
          >
            {ROLES.map(
              (role) => (
                <option
                  key={
                    role
                  }
                  value={
                    role
                  }
                >
                  {role ===
                  "All"
                    ? "All roles"
                    : role}
                </option>
              ),
            )}
          </select>
        </div>

        <div className="stats-filter-summary">
          <span>
            Dataset
          </span>

          <strong>
            {selectedRegion}
            {" · "}
            {selectedTier ===
            "All"
              ? "All"
              : selectedTier}
            {" · "}
            {selectedRole ===
            "All"
              ? "All"
              : selectedRole}
          </strong>

          {filtersChanged ? (
            <>
              {selectedHasCache ? (
                <button
                  className="stats-load-cache-button"
                  type="button"
                  onClick={
                    applySelectedDataset
                  }
                >
                  Load cached dataset
                </button>
              ) : (
                <small>
                  No cache · refresh required
                </small>
              )}
            </>
          ) : (
            <small className="stats-filter-applied">
              Active dataset
            </small>
          )}
        </div>
      </section>

      {/* ===================================
          META OVERVIEW
      ==================================== */}

      <section className="meta-overview-section">
        <div className="meta-overview-heading">
          <div>
            <span className="panel-eyebrow">
              META OVERVIEW
            </span>

            <h2>
              Role leaders
            </h2>

            <p>
              Best performing heroes
              in the active Blizzard
              dataset.
            </p>
          </div>

          <div className="meta-tier-counts">
            <div>
              <span>
                S TIER
              </span>

              <strong>
                {sTierCount}
              </strong>
            </div>

            <div>
              <span>
                A TIER
              </span>

              <strong>
                {aTierCount}
              </strong>
            </div>
          </div>
        </div>

        <div className="meta-leader-grid">
          <MetaLeaderCard
            label="Best overall"
            entry={
              bestOverall
            }
            onOpenHero={
              onOpenHero
            }
          />

          <MetaLeaderCard
            label="Best Tank"
            entry={
              bestTank
            }
            onOpenHero={
              onOpenHero
            }
          />

          <MetaLeaderCard
            label="Best Damage"
            entry={
              bestDamage
            }
            onOpenHero={
              onOpenHero
            }
          />

          <MetaLeaderCard
            label="Best Support"
            entry={
              bestSupport
            }
            onOpenHero={
              onOpenHero
            }
          />
        </div>

        <div className="meta-role-rankings">
          <MetaRoleRanking
            title="Tank"
            entries={
              topTanks
            }
            onOpenHero={
              onOpenHero
            }
          />

          <MetaRoleRanking
            title="Damage"
            entries={
              topDamage
            }
            onOpenHero={
              onOpenHero
            }
          />

          <MetaRoleRanking
            title="Support"
            entries={
              topSupports
            }
            onOpenHero={
              onOpenHero
            }
          />
        </div>
      </section>

      {/* ===================================
          META TIER LIST
      ==================================== */}

      <section className="meta-tier-section">
        <div className="meta-tier-heading">
          <div>
            <span className="panel-eyebrow">
              META TIER LIST
            </span>

            <h2>
              Current meta
            </h2>

            <p>
              Statistical tier list
              based on the active
              Blizzard dataset.
            </p>
          </div>

          <div className="meta-score-note">
            <span>
              META SCORE
            </span>

            <strong>
              WR 50% · PR 30% · BR 20%
            </strong>
          </div>
        </div>

        <div className="meta-tier-list">
          {(
            [
              "S",
              "A",
              "B",
              "C",
              "D",
            ] as MetaTier[]
          ).map(
            (tier) => (
              <MetaTierRow
                key={
                  tier
                }
                tier={
                  tier
                }
                heroes={
                  metaGroups[
                    tier
                  ]
                }
                onOpenHero={
                  onOpenHero
                }
              />
            ),
          )}
        </div>
      </section>

      {/* ===================================
          SORT + SEARCH
      ==================================== */}

      <section className="stats-controls">
        <div className="stats-control-group">
          <span className="stats-control-label">
            Rank heroes by
          </span>

          <div className="metric-filters">
            <MetricButton
              active={
                sortBy ===
                "winRate"
              }
              label="Win Rate"
              onClick={() =>
                setSortBy(
                  "winRate",
                )
              }
            />

            <MetricButton
              active={
                sortBy ===
                "pickRate"
              }
              label="Pick Rate"
              onClick={() =>
                setSortBy(
                  "pickRate",
                )
              }
            />

            <MetricButton
              active={
                sortBy ===
                "banRate"
              }
              label="Ban Rate"
              onClick={() =>
                setSortBy(
                  "banRate",
                )
              }
            />
          </div>
        </div>

        <div className="stats-control-divider" />

        <div className="stats-toolbar">
          <div className="search-wrapper">
            <Search
              size={14}
            />

            <input
              type="text"
              placeholder="Search hero..."
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
        </div>
      </section>

      {/* ===================================
          TABLE
      ==================================== */}

      <section className="stats-table">
        <div className="stats-table-header">
          <span>
            Hero
          </span>

          <span>
            Role
          </span>

          <span
            className={
              sortBy ===
              "winRate"
                ? "stats-column-active"
                : ""
            }
          >
            Win rate
          </span>

          <span
            className={
              sortBy ===
              "pickRate"
                ? "stats-column-active"
                : ""
            }
          >
            Pick rate
          </span>

          <span
            className={
              sortBy ===
              "banRate"
                ? "stats-column-active"
                : ""
            }
          >
            Ban rate
          </span>

          <span />
        </div>

        {filteredHeroes.map(
          (
            hero,
            index,
          ) => (
            <button
              className="stats-row"
              key={
                hero.id
              }
              onClick={() =>
                onOpenHero(
                  hero,
                )
              }
            >
              <div className="stats-hero">
                <span className="stats-rank">
                  {index + 1}
                </span>

                <div className="stats-avatar">
                  <img
                    src={
                      hero.image
                    }
                    alt={
                      hero.name
                    }
                  />
                </div>

                <strong>
                  {hero.name}
                </strong>
              </div>

              <div>
                <span
                  className={`stats-role ${hero.role.toLowerCase()}`}
                >
                  {hero.role}
                </span>
              </div>

              <strong
                className={
                  sortBy ===
                  "winRate"
                    ? "stats-value-active"
                    : ""
                }
              >
                {formatRate(
                  hero.winRate,
                )}
              </strong>

              <strong
                className={
                  sortBy ===
                  "pickRate"
                    ? "stats-value-active"
                    : ""
                }
              >
                {formatRate(
                  hero.pickRate,
                )}
              </strong>

              <strong
                className={
                  sortBy ===
                  "banRate"
                    ? "stats-value-active"
                    : ""
                }
              >
                {formatRate(
                  hero.banRate,
                )}
              </strong>

              <div className="stats-open">
                <ArrowRight
                  size={15}
                />
              </div>
            </button>
          ),
        )}
      </section>
    </div>
  );
}

/* ========================================
   META LEADER CARD
======================================== */

type MetaLeaderCardProps = {
  label: string;

  entry?:
    MetaHero;

  onOpenHero:
    (hero: Hero) => void;
};

function MetaLeaderCard({
  label,
  entry,
  onOpenHero,
}: MetaLeaderCardProps) {
  if (!entry) {
    return (
      <div className="meta-leader-card empty">
        <span className="meta-leader-label">
          {label}
        </span>

        <strong>
          —
        </strong>
      </div>
    );
  }

  return (
    <button
      className="meta-leader-card"
      onClick={() =>
        onOpenHero(
          entry.hero,
        )
      }
    >
      <span className="meta-leader-label">
        {label}
      </span>

      <div className="meta-leader-main">
        <div className="meta-leader-avatar">
          <img
            src={
              entry.hero.image
            }
            alt={
              entry.hero.name
            }
          />
        </div>

        <div className="meta-leader-identity">
          <strong>
            {entry.hero.name}
          </strong>

          <span>
            {entry.hero.role}
          </span>
        </div>
      </div>

      <div className="meta-leader-score">
        <span>
          META SCORE
        </span>

        <strong>
          {entry.score.toFixed(
            0,
          )}
        </strong>
      </div>

      <div className="meta-leader-stats">
        <span>
          WR{" "}
          {formatRate(
            entry.hero.winRate,
          )}
        </span>

        <span>
          PR{" "}
          {formatRate(
            entry.hero.pickRate,
          )}
        </span>

        <span>
          BR{" "}
          {formatRate(
            entry.hero.banRate,
          )}
        </span>
      </div>
    </button>
  );
}

/* ========================================
   META ROLE RANKING
======================================== */

type MetaRoleRankingProps = {
  title: string;

  entries:
    MetaHero[];

  onOpenHero:
    (hero: Hero) => void;
};

function MetaRoleRanking({
  title,
  entries,
  onOpenHero,
}: MetaRoleRankingProps) {
  return (
    <div className="meta-role-ranking">
      <div className="meta-role-ranking-header">
        <span>
          {title}
        </span>

        <span>
          Score
        </span>
      </div>

      {entries.map(
        (
          entry,
          index,
        ) => (
          <button
            key={
              entry.hero.id
            }
            className="meta-role-ranking-row"
            onClick={() =>
              onOpenHero(
                entry.hero,
              )
            }
          >
            <span className="meta-role-position">
              {index + 1}
            </span>

            <div className="meta-role-avatar">
              <img
                src={
                  entry.hero.image
                }
                alt={
                  entry.hero.name
                }
              />
            </div>

            <strong>
              {entry.hero.name}
            </strong>

            <span className="meta-role-score">
              {entry.score.toFixed(
                0,
              )}
            </span>
          </button>
        ),
      )}

      {entries.length ===
        0 && (
        <div className="meta-role-empty">
          No data
        </div>
      )}
    </div>
  );
}

/* ========================================
   META TIER ROW
======================================== */

type MetaTierRowProps = {
  tier:
    MetaTier;

  heroes:
    MetaHero[];

  onOpenHero:
    (hero: Hero) => void;
};

function MetaTierRow({
  tier,
  heroes,
  onOpenHero,
}: MetaTierRowProps) {
  return (
    <div
      className={`meta-tier-row meta-tier-${tier.toLowerCase()}`}
    >
      <div className="meta-tier-label">
        {tier}
      </div>

      <div className="meta-tier-heroes">
        {heroes.length > 0 ? (
          heroes.map(
            (entry) => (
              <button
                key={
                  entry.hero.id
                }
                className="meta-hero-card"
                onClick={() =>
                  onOpenHero(
                    entry.hero,
                  )
                }
              >
                <div className="meta-hero-avatar">
                  <img
                    src={
                      entry.hero.image
                    }
                    alt={
                      entry.hero.name
                    }
                  />
                </div>

                <div className="meta-hero-info">
                  <strong>
                    {entry.hero.name}
                  </strong>

                  <span>
                    Score{" "}
                    {entry.score.toFixed(
                      0,
                    )}
                  </span>
                </div>
              </button>
            ),
          )
        ) : (
          <span className="meta-tier-empty">
            No heroes
          </span>
        )}
      </div>
    </div>
  );
}

/* ========================================
   METRIC BUTTON
======================================== */

type MetricButtonProps = {
  active: boolean;

  label: string;

  onClick:
    () => void;
};

function MetricButton({
  active,
  label,
  onClick,
}: MetricButtonProps) {
  return (
    <button
      className={
        active
          ? "metric-filter active"
          : "metric-filter"
      }
      onClick={onClick}
    >
      {label}

      {active && (
        <span className="metric-sort-direction">
          ↓
        </span>
      )}
    </button>
  );
}

/* ========================================
   META HELPERS
======================================== */

function getBestMetaHeroByRole(
  entries:
    MetaHero[],

  role:
    Hero["role"],
) {
  return entries.find(
    (entry) =>
      entry.hero.role ===
      role,
  );
}

function getTopMetaHeroesByRole(
  entries:
    MetaHero[],

  role:
    Hero["role"],

  limit:
    number,
) {
  return entries
    .filter(
      (entry) =>
        entry.hero.role ===
        role,
    )
    .slice(
      0,
      limit,
    );
}

/* ========================================
   META SCORE
======================================== */

function buildMetaTierList(
  dataset: Hero[],
): MetaHero[] {
  const validHeroes =
    dataset.filter(
      (hero) =>
        hero.winRate !==
          undefined ||
        hero.pickRate !==
          undefined ||
        hero.banRate !==
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
      (hero) =>
        hero.winRate ?? 0,
    );

  const pickRates =
    validHeroes.map(
      (hero) =>
        hero.pickRate ?? 0,
    );

  const banRates =
    validHeroes.map(
      (hero) =>
        hero.banRate ?? 0,
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

  /* ========================================
     RAW META SCORE

     Win Rate  = 50%
     Pick Rate = 30%
     Ban Rate  = 20%
  ======================================== */

  const rawScores =
    validHeroes.map(
      (hero) => {
        const normalizedWin =
          normalizeMetric(
            hero.winRate ??
              minWin,
            minWin,
            maxWin,
          );

        const normalizedPick =
          normalizeMetric(
            hero.pickRate ??
              minPick,
            minPick,
            maxPick,
          );

        const normalizedBan =
          normalizeMetric(
            hero.banRate ??
              minBan,
            minBan,
            maxBan,
          );

        const rawScore =
          normalizedWin *
            0.5 +
          normalizedPick *
            0.3 +
          normalizedBan *
            0.2;

        return {
          hero,
          rawScore,
        };
      },
    );

  /*
    Final normalization.

    The strongest hero in the
    active dataset becomes 100.

    The weakest becomes 0.
  */

  const scores =
    rawScores.map(
      (entry) =>
        entry.rawScore,
    );

  const minScore =
    Math.min(
      ...scores,
    );

  const maxScore =
    Math.max(
      ...scores,
    );

  return rawScores
    .map(
      ({
        hero,
        rawScore,
      }) => {
        const score =
          normalizeMetric(
            rawScore,
            minScore,
            maxScore,
          );

        return {
          hero,

          score,

          tier:
            getMetaTier(
              score,
            ),
        };
      },
    )
    .sort(
      (a, b) =>
        b.score -
        a.score,
    );
}

/* ========================================
   NORMALIZATION
======================================== */

function normalizeMetric(
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

/* ========================================
   META TIER
======================================== */

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

/* ========================================
   CACHE
======================================== */

function getCacheKey(
  region:
    BlizzardRegion,

  tier:
    BlizzardTier,

  role:
    BlizzardRole,
) {
  return `${CACHE_PREFIX}.${region}.${tier}.${role}`;
}

function saveCachedDataset(
  dataset:
    CachedStatsDataset,
) {
  try {
    localStorage.setItem(
      getCacheKey(
        dataset.region,
        dataset.tier,
        dataset.role,
      ),

      JSON.stringify(
        dataset,
      ),
    );
  } catch (error) {
    console.warn(
      "Unable to save stats cache:",
      error,
    );
  }
}

function loadCachedDataset(
  region:
    BlizzardRegion,

  tier:
    BlizzardTier,

  role:
    BlizzardRole,
): CachedStatsDataset | null {
  try {
    const value =
      localStorage.getItem(
        getCacheKey(
          region,
          tier,
          role,
        ),
      );

    if (!value) {
      return null;
    }

    const parsed =
      JSON.parse(
        value,
      ) as CachedStatsDataset;

    if (
      !Array.isArray(
        parsed.heroes,
      ) ||
      !parsed.updatedAt
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

/* ========================================
   HELPERS
======================================== */

function formatRate(
  value?: number,
) {
  if (
    value === undefined
  ) {
    return "—";
  }

  return `${value}%`;
}

function formatRelativeAge(
  date:
    Date,
) {
  const elapsed =
    Date.now() -
    date.getTime();

  const minutes =
    Math.floor(
      elapsed /
        60000,
    );

  if (minutes < 1) {
    return "just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours =
    Math.floor(
      minutes / 60,
    );

  return `${hours}h ago`;
}

export default StatsPage;