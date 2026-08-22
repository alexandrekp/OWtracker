import {
  useEffect,
  useState,
} from "react";

import {
  isTauri,
} from "@tauri-apps/api/core";

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
import LandingPage from "./components/LandingPage";

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

const WEB_ROUTES:
  Partial<Record<AppSection, string>> = {
    stats: "/stats",
    heroes: "/heroes",
    players: "/players",
    perks: "/perks",
    settings: "/settings",
  };

const ROUTE_SECTIONS:
  Record<string, AppSection> = {
    "/stats": "stats",
    "/heroes": "heroes",
    "/players": "players",
    "/perks": "perks",
    "/settings": "settings",
  };

const PAGE_META:
  Record<
    AppSection,
    {
      title: string;
      description: string;
    }
  > = {
    stats: {
      title:
        "Overwatch Stats & Meta — OWTracker",
      description:
        "Explore Overwatch hero win rates, pick rates, ban rates and OWTracker meta rankings by region, rank and role.",
    },

    heroes: {
      title:
        "Overwatch Hero Stats — OWTracker",
      description:
        "Browse Overwatch heroes and compare meta score, win rate, pick rate, ban rate, role ranking and perks.",
    },

    players: {
      title:
        "Overwatch Player Stats — OWTracker",
      description:
        "Search Overwatch player profiles, inspect competitive ranks and compare hero performance side by side.",
    },

    perks: {
      title:
        "Overwatch Hero Perks — OWTracker",
      description:
        "Explore Overwatch hero perks, perk popularity and community choices by hero and role.",
    },

    settings: {
      title:
        "Settings — OWTracker",
      description:
        "Configure OWTracker statistics defaults, cache behavior and view application data sources.",
    },
  };

function normalizePath(
  pathname: string,
) {
  if (
    pathname.length > 1 &&
    pathname.endsWith("/")
  ) {
    return pathname.slice(
      0,
      -1,
    );
  }

  return pathname;
}

function sectionFromPath():
  AppSection | null {
  const path =
    normalizePath(
      window.location.pathname,
    );

  return (
    ROUTE_SECTIONS[path] ??
    null
  );
}

function updateMeta(
  section: AppSection | null,
) {
  const landingTitle =
    "OWTracker — Overwatch Stats & Meta";

  const landingDescription =
    "Overwatch statistics, hero win rates, meta rankings, perks and player comparison in one focused interface.";

  const meta =
    section
      ? PAGE_META[section]
      : {
          title:
            landingTitle,
          description:
            landingDescription,
        };

  document.title =
    meta.title;

  const description =
    document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );

  if (description) {
    description.content =
      meta.description;
  }

  const ogTitle =
    document.querySelector<HTMLMetaElement>(
      'meta[property="og:title"]',
    );

  if (ogTitle) {
    ogTitle.content =
      meta.title;
  }

  const ogDescription =
    document.querySelector<HTMLMetaElement>(
      'meta[property="og:description"]',
    );

  if (ogDescription) {
    ogDescription.content =
      meta.description;
  }

  const canonical =
    document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );

  if (canonical) {
    canonical.href =
      section
        ? `https://owtracker.net${WEB_ROUTES[section]}`
        : "https://owtracker.net/";
  }
}

function App() {
  const runningInTauri =
    isTauri();

  /* ========================================
     STARTUP
  ======================================== */

  const [
    appReady,
    setAppReady,
  ] = useState(false);

  const initialWebSection =
    !runningInTauri
      ? sectionFromPath()
      : null;

  const [
    dashboardOpen,
    setDashboardOpen,
  ] =
    useState(
      () =>
        runningInTauri ||
        initialWebSection !== null,
    );

  useEffect(() => {
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
      initialWebSection ??
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

  useEffect(() => {
    if (runningInTauri) {
      return;
    }

    updateMeta(
      dashboardOpen
        ? activeSection
        : null,
    );
  }, [
    runningInTauri,
    dashboardOpen,
    activeSection,
  ]);

  useEffect(() => {
    if (runningInTauri) {
      return;
    }

    function handlePopState() {
      const section =
        sectionFromPath();

      setSelectedHero(
        null,
      );

      setPlayerHeroContext(
        null,
      );

      if (section) {
        setActiveSection(
          section,
        );

        setDashboardOpen(
          true,
        );
      } else {
        setDashboardOpen(
          false,
        );
      }
    }

    window.addEventListener(
      "popstate",
      handlePopState,
    );

    return () =>
      window.removeEventListener(
        "popstate",
        handlePopState,
      );
  }, [
    runningInTauri,
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

    if (!runningInTauri) {
      const route =
        WEB_ROUTES[section];

      if (
        route &&
        normalizePath(
          window.location.pathname,
        ) !== route
      ) {
        window.history.pushState(
          {},
          "",
          route,
        );
      }
    }
  }

  function openDashboard() {
    setDashboardOpen(
      true,
    );

    setActiveSection(
      "stats",
    );

    if (!runningInTauri) {
      window.history.pushState(
        {},
        "",
        "/stats",
      );
    }
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
     WEB LANDING
  ======================================== */

  if (
    !runningInTauri &&
    !dashboardOpen
  ) {
    return (
      <LandingPage
        onOpenDashboard={
          openDashboard
        }
      />
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
