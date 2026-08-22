import {
  useEffect,
  useState,
} from "react";

import "./App.css";
import "./AppUx.css";
import "./Responsive.css";

import Sidebar from "./components/Sidebar";
import HeroDetail from "./components/HeroDetail";
import StatsPage from "./components/StatsPage";
import HeroesPage from "./components/HeroesPage";
import PlayersPage from "./components/PlayersPage";
import PerksPage from "./components/PerksPage";
import SettingsPage from "./components/SettingsPage";


import AppLoader from "./components/ui/AppLoader";
import AppErrorBoundary from "./components/ui/AppErrorBoundary";

import type {
  Hero,
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
      just avoiding an abrupt window
      appearance.
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

              {activeSection ===
                "settings" && (
                <div
                  className="page-transition"
                  key="settings"
                >
                  <SettingsPage />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </AppErrorBoundary>
  );
}

export default App;
