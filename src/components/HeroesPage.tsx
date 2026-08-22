import {
  RefreshCw,
  Search,
  SearchX,
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
  Hero,
  HeroRole,
} from "../types/hero";

import HeroCard from "./HeroCard";
import RoleFilter from "./RoleFilter";

import "./StatsPage.css";
import "./StatsRefresh.css";
import "./DataSourcePlacement.css";

type HeroesPageProps = {
  onOpenHero:
    (hero: Hero) => void;
};

type SortMetric =
  | "name"
  | "metaScore"
  | "winRate"
  | "pickRate"
  | "banRate";

type CachedStatsDataset = {
  region: "Europe";
  tier: "All";
  role: "All";

  heroes: Hero[];

  rq: number | null;

  updatedAt: number;
};

const CACHE_KEY =
  "owtracker.blizzardStats.Europe.All.All";

function HeroesPage({
  onOpenHero,
}: HeroesPageProps) {
  const initialCache =
    loadCachedDataset();

  const [
    currentHeroes,
    setCurrentHeroes,
  ] =
    useState<Hero[]>(
      initialCache?.heroes ??
        heroes,
    );

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    activeRole,
    setActiveRole,
  ] =
    useState<
      "All" | HeroRole
    >("All");

  const [
    sortBy,
    setSortBy,
  ] =
    useState<SortMetric>(
      "metaScore",
    );

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

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

  async function handleRefresh() {
    if (refreshing) {
      return;
    }

    setRefreshing(true);
    setRefreshError(null);

    try {
      const response =
        await refreshBlizzardStats(
          "Europe",
          "All",
          "All",
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

      const updatedHeroes =
        heroes.map(
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

      setLastUpdated(
        new Date(
          updatedAt,
        ),
      );

      saveCachedDataset({
        region: "Europe",
        tier: "All",
        role: "All",

        heroes:
          updatedHeroes,

        rq:
          response.rq,

        updatedAt,
      });
    } catch (error) {
      console.error(
        "Heroes refresh error:",
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

  const metaScores =
    useMemo(
      () =>
        buildMetaScores(
          currentHeroes,
        ),
      [currentHeroes],
    );

  const filteredHeroes =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return [
        ...currentHeroes,
      ]
        .filter(
          (hero) => {
            const matchesRole =
              activeRole ===
                "All" ||
              hero.role ===
                activeRole;

            const matchesSearch =
              normalizedSearch ===
                "" ||
              hero.name
                .toLowerCase()
                .includes(
                  normalizedSearch,
                );

            return (
              matchesRole &&
              matchesSearch
            );
          },
        )
        .sort(
          (a, b) => {
            if (
              sortBy ===
              "name"
            ) {
              return a.name.localeCompare(
                b.name,
              );
            }

            if (
              sortBy ===
              "metaScore"
            ) {
              return (
                (metaScores.get(
                  b.id,
                ) ?? -1) -
                (metaScores.get(
                  a.id,
                ) ?? -1)
              );
            }

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
      activeRole,
      search,
      sortBy,
      metaScores,
    ]);

  const hasFilters =
    search.trim() !== "" ||
    activeRole !== "All";

  function resetFilters() {
    setSearch("");
    setActiveRole("All");
  }

  return (
    <div className="global-page">
      {/* ========================================
          HEADER
      ======================================== */}

      <header className="topbar">
        <div>
          <p className="eyebrow">
            HERO DATABASE
          </p>

          <h1>
            Heroes
          </h1>

          <p className="subtitle">
            Explore heroes and compare
            their Blizzard statistics.
          </p>
        </div>

        <div className="stats-header-actions">
          <div className="stats-header-actions-top">
            <div className="live-status">
              <span className="status-dot" />

              Blizzard data
            </div>

            <button
            className="stats-refresh-button"
            type="button"
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
              : "Refresh"}
          </button>
          </div>

          {lastUpdated && (
            <div className="data-source-meta fresh">
              <span className="data-source-name">
                BLIZZARD
              </span>

              <span className="data-source-separator">
                ·
              </span>

              <span className="data-source-state">
                FRESH
              </span>

              <span className="data-source-age">
                Updated{" "}
                {formatRelativeAge(
                  lastUpdated,
                )}.
              </span>
            </div>
          )}
        </div>
      </header>

      {refreshError && (
        <div className="stats-update-info">
          <strong className="stats-refresh-error">
            {refreshError}
          </strong>
        </div>
      )}

      {/* ========================================
          OVERVIEW
      ======================================== */}

      <section className="stats-overview">
        <div className="summary-card">
          <span className="summary-label">
            Heroes tracked
          </span>

          <strong>
            {currentHeroes.length}
          </strong>

          <span className="summary-detail">
            Current hero roster
          </span>
        </div>

        <div className="summary-card">
          <span className="summary-label">
            Region
          </span>

          <strong>
            Europe
          </strong>

          <span className="summary-detail">
            PC
          </span>
        </div>

        <div className="summary-card">
          <span className="summary-label">
            Rank
          </span>

          <strong>
            All ranks
          </strong>

          <span className="summary-detail">
            Competitive
          </span>
        </div>
      </section>

      {/* ========================================
          HERO BROWSER
      ======================================== */}

      <section className="toolbar">
        <RoleFilter
          activeRole={
            activeRole
          }
          onChange={
            setActiveRole
          }
        />

        <div className="search-wrapper">
          <Search
            size={14}
          />

          <input
            type="text"
            placeholder="Search a hero..."
            value={
              search
            }
            onChange={(
              event,
            ) =>
              setSearch(
                event.target.value,
              )
            }
          />
        </div>
      </section>

      {/* ========================================
          HERO SORT
      ======================================== */}

      <section className="stats-controls">
        <div className="stats-control-group">
          <span className="stats-control-label">
            Sort heroes by
          </span>

          <div className="metric-filters">
            <MetricButton
              active={
                sortBy ===
                "metaScore"
              }
              label="Meta Score"
              onClick={() =>
                setSortBy(
                  "metaScore",
                )
              }
            />

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

            <MetricButton
              active={
                sortBy ===
                "name"
              }
              label="Name"
              onClick={() =>
                setSortBy(
                  "name",
                )
              }
            />
          </div>
        </div>
      </section>

      {filteredHeroes.length >
      0 ? (
        <section className="hero-grid">
          {filteredHeroes.map(
            (hero) => (
              <HeroCard
                key={
                  hero.id
                }
                hero={
                  hero
                }
                onOpen={
                  onOpenHero
                }
              />
            ),
          )}
        </section>
      ) : (
        <div className="empty-state">
          <SearchX
            size={24}
          />

          <span className="panel-eyebrow">
            NO RESULTS
          </span>

          <h2>
            No hero found
          </h2>

          <p>
            No hero matches the current
            search and role filters.
          </p>

          {hasFilters && (
            <button
              type="button"
              onClick={
                resetFilters
              }
            >
              Clear filters
            </button>
          )}
        </div>
      )}
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
      onClick={
        onClick
      }
      type="button"
    >
      {label}

      {active && (
        <span className="metric-sort-direction">
          {label === "Name"
            ? "A–Z"
            : "↓"}
        </span>
      )}
    </button>
  );
}

/* ========================================
   META SCORE
======================================== */

function buildMetaScores(
  dataset: Hero[],
) {
  const validHeroes =
    dataset.filter(
      (hero) =>
        typeof hero.winRate ===
          "number" &&
        typeof hero.pickRate ===
          "number",
    );

  const scoreMap =
    new Map<string, number>();

  if (
    validHeroes.length === 0
  ) {
    return scoreMap;
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

  const winMin =
    Math.min(
      ...winRates,
    );

  const winMax =
    Math.max(
      ...winRates,
    );

  const pickMin =
    Math.min(
      ...pickRates,
    );

  const pickMax =
    Math.max(
      ...pickRates,
    );

  const banMin =
    Math.min(
      ...banRates,
    );

  const banMax =
    Math.max(
      ...banRates,
    );

  const rawScores =
    validHeroes.map(
      (hero) => {
        const normalizedWin =
          normalizeMetric(
            hero.winRate ?? 0,
            winMin,
            winMax,
          );

        const normalizedPick =
          normalizeMetric(
            hero.pickRate ?? 0,
            pickMin,
            pickMax,
          );

        const normalizedBan =
          normalizeMetric(
            hero.banRate ?? 0,
            banMin,
            banMax,
          );

        const rawScore =
          normalizedWin *
            0.6 +
          normalizedPick *
            0.3 +
          normalizedBan *
            0.1;

        return {
          hero,
          rawScore,
        };
      },
    );

  const rawValues =
    rawScores.map(
      (entry) =>
        entry.rawScore,
    );

  const minScore =
    Math.min(
      ...rawValues,
    );

  const maxScore =
    Math.max(
      ...rawValues,
    );

  rawScores.forEach(
    ({
      hero,
      rawScore,
    }) => {
      scoreMap.set(
        hero.id,
        normalizeMetric(
          rawScore,
          minScore,
          maxScore,
        ),
      );
    },
  );

  return scoreMap;
}

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
   CACHE
======================================== */

function saveCachedDataset(
  dataset:
    CachedStatsDataset,
) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify(
        dataset,
      ),
    );
  } catch (error) {
    console.warn(
      "Unable to save heroes cache:",
      error,
    );
  }
}

function loadCachedDataset():
  CachedStatsDataset | null {
  try {
    const value =
      localStorage.getItem(
        CACHE_KEY,
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

export default HeroesPage;
