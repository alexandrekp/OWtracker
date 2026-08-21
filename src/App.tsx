import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  SearchX,
} from "lucide-react";

import "./App.css";
import "./AppUx.css";

import Sidebar from "./components/Sidebar";
import HeroCard from "./components/HeroCard";
import HeroDetail from "./components/HeroDetail";
import RoleFilter from "./components/RoleFilter";
import StatsPage from "./components/StatsPage";
import PlayersPage from "./components/PlayersPage";
import PerksPage from "./components/PerksPage";

import AppLoader from "./components/ui/AppLoader";
import EmptyState from "./components/ui/EmptyState";
import AppErrorBoundary from "./components/ui/AppErrorBoundary";

import {
  heroes,
} from "./data/heroes";

import type {
  Hero,
  HeroRole,
} from "./types/hero";

import type {
  PlayerStatBlock,
} from "./types/player";

import type {
  AppSection,
} from "./types/navigation";

export type PlayerHeroContext = {
  username: string;

  battleTag: string;

  stats:
    PlayerStatBlock;
};

function App() {
  /* ========================================
     STARTUP
  ======================================== */

  const [
    appReady,
    setAppReady,
  ] = useState(false);

  useEffect(() => {
    /*
      Small startup transition.

      This is intentionally short:
      we are not faking a long load,
      just avoiding an abrupt Tauri
      window appearance.
    */

    const timer =
      window.setTimeout(
        () => {
          setAppReady(true);
        },
        450,
      );

    return () =>
      window.clearTimeout(
        timer,
      );
  }, []);

  /* ========================================
     NAVIGATION
  ======================================== */

  const [
    activeSection,
    setActiveSection,
  ] =
    useState<AppSection>(
      "stats",
    );

  const [
    activeRole,
    setActiveRole,
  ] =
    useState<
      "All" | HeroRole
    >("All");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    selectedHero,
    setSelectedHero,
  ] =
    useState<Hero | null>(
      null,
    );

  const [
    playerHeroContext,
    setPlayerHeroContext,
  ] =
    useState<PlayerHeroContext | null>(
      null,
    );

  /* ========================================
     HERO FILTER
  ======================================== */

  const filteredHeroes =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return heroes.filter(
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
      );
    }, [
      activeRole,
      search,
    ]);

  /* ========================================
     ACTIONS
  ======================================== */

  function navigate(
    section: AppSection,
  ) {
    setSelectedHero(null);

    setPlayerHeroContext(
      null,
    );

    setActiveSection(
      section,
    );
  }

  function openHero(
    hero: Hero,
  ) {
    setPlayerHeroContext(
      null,
    );

    setSelectedHero(
      hero,
    );
  }

  function openPlayerHero(
    hero: Hero,

    stats:
      PlayerStatBlock,

    player: {
      username: string;
      battleTag: string;
    },
  ) {
    setPlayerHeroContext({
      username:
        player.username,

      battleTag:
        player.battleTag,

      stats,
    });

    setSelectedHero(
      hero,
    );
  }

  function closeHero() {
    setSelectedHero(
      null,
    );

    setPlayerHeroContext(
      null,
    );
  }

  /* ========================================
     PRESERVED PLAYER PAGE
  ======================================== */

  const heroOpenedFromPlayer =
    selectedHero !== null &&
    playerHeroContext !==
      null &&
    activeSection ===
      "players";

  /* ========================================
     STARTUP SCREEN
  ======================================== */

  if (!appReady) {
    return (
      <AppLoader />
    );
  }

  /* ========================================
     APP
  ======================================== */

  return (
    <AppErrorBoundary>
      <div className="app-shell app-ready">
        <Sidebar
          activeSection={
            activeSection
          }
          onNavigate={
            navigate
          }
        />

        <main className="main-content">
          {/* ===============================
              PLAYER PAGE
              Kept mounted intentionally.
          ================================ */}

          {activeSection ===
            "players" && (
            <div
              className={
                heroOpenedFromPlayer
                  ? "page-preserved-hidden"
                  : "page-preserved-visible page-transition"
              }
            >
              <PlayersPage
                onOpenHero={
                  openPlayerHero
                }
              />
            </div>
          )}

          {/* ===============================
              HERO DETAIL
          ================================ */}

          {selectedHero && (
            <div
              className="page-transition"
              key={`hero-${selectedHero.id}`}
            >
              <HeroDetail
                hero={
                  selectedHero
                }
                playerContext={
                  playerHeroContext
                }
                onBack={
                  closeHero
                }
              />
            </div>
          )}

          {/* ===============================
              NORMAL SECTIONS
          ================================ */}

          {!selectedHero && (
            <>
              {activeSection ===
                "stats" && (
                <div
                  className="page-transition"
                  key="stats"
                >
                  <StatsPage
                    onOpenHero={
                      openHero
                    }
                  />
                </div>
              )}

              {activeSection ===
                "heroes" && (
                <div
                  className="page-transition"
                  key="heroes"
                >
                  <HeroesPage
                    activeRole={
                      activeRole
                    }
                    setActiveRole={
                      setActiveRole
                    }
                    search={
                      search
                    }
                    setSearch={
                      setSearch
                    }
                    filteredHeroes={
                      filteredHeroes
                    }
                    onOpenHero={
                      openHero
                    }
                  />
                </div>
              )}

              {activeSection ===
                "perks" && (
                <div
                  className="page-transition"
                  key="perks"
                >
                  <PerksPage
                    onOpenHero={
                      openHero
                    }
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </AppErrorBoundary>
  );
}

/* ========================================
   HEROES PAGE
======================================== */

type HeroesPageProps = {
  activeRole:
    | "All"
    | HeroRole;

  setActiveRole: (
    role:
      | "All"
      | HeroRole,
  ) => void;

  search:
    string;

  setSearch:
    (value: string) => void;

  filteredHeroes:
    Hero[];

  onOpenHero:
    (hero: Hero) => void;
};

function HeroesPage({
  activeRole,
  setActiveRole,
  search,
  setSearch,
  filteredHeroes,
  onOpenHero,
}: HeroesPageProps) {
  const hasFilters =
    search.trim() !== "" ||
    activeRole !== "All";

  function resetFilters() {
    setSearch("");
    setActiveRole("All");
  }

  return (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">
            OVERWATCH COMPANION
          </p>

          <h1>
            Heroes
          </h1>

          <p className="subtitle">
            Stats and community
            perks in one place.
          </p>
        </div>

        <div className="live-status">
          <span className="status-dot" />

          Blizzard data
        </div>
      </header>

      <section className="stats-overview">
        <div className="summary-card">
          <span className="summary-label">
            Heroes tracked
          </span>

          <strong>
            {heroes.length}
          </strong>

          <span className="summary-detail">
            Current hero roster
          </span>
        </div>

        <div className="summary-card">
          <span className="summary-label">
            Current region
          </span>

          <strong>
            EU
          </strong>

          <span className="summary-detail">
            PC
          </span>
        </div>

        <div className="summary-card">
          <span className="summary-label">
            Mode
          </span>

          <strong>
            Competitive
          </strong>

          <span className="summary-detail">
            Blizzard statistics
          </span>
        </div>
      </section>

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
        <EmptyState
          icon={
            <SearchX
              size={24}
            />
          }
          eyebrow="NO RESULTS"
          title="No hero found"
          description={
            hasFilters
              ? "No hero matches the current search and role filters."
              : "No hero data is currently available."
          }
          actionLabel={
            hasFilters
              ? "Clear filters"
              : undefined
          }
          onAction={
            hasFilters
              ? resetFilters
              : undefined
          }
        />
      )}
    </>
  );
}

export default App;