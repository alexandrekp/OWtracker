import {
  Activity,
  ArrowRight,
  Clock3,
  Copy,
  HeartPulse,
  Monitor,
  Gamepad2,
  Percent,
  RefreshCw,
  Search,
  Shield,
  Skull,
  Star,
  Swords,
  Trash2,
  Trophy,
  UserRound,
} from "lucide-react";

import {
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getPlayerCareer,
  getPlayerData,
  PlayerApiError,
} from "../services/playerApi";

import type {
  PlayerCareerStats,
  PlayerGamemode,
  PlayerPlatform,
} from "../services/playerApi";

import {
  heroes,
} from "../data/heroes";

import type {
  Hero,
} from "../types/hero";

import type {
  PlayerData,
  PlayerRank,
  PlayerStatBlock,
} from "../types/player";

import {
  useI18n,
} from "../i18n/i18n";

import "./PlayerSearchPage.css";

/* ========================================
   TYPES
======================================== */

type PlayerSearchPageProps = {
  onOpenHero: (
    hero: Hero,
    stats: PlayerStatBlock,
    player: {
      username: string;
      battleTag: string;
    },
  ) => void;
};

type FavoritePlayer = {
  battleTag: string;
  username: string;
  avatar: string | null;
};

type PlayerLookupError = {
  message: string;
  status: number | null;
  retryAfter: number | null;
  nextCheckAt: number | null;
  checkCount: number | null;
};

type HeroSortMetric =
  | "time"
  | "games"
  | "winrate"
  | "kda";

type CareerCategory =
  | "combat"
  | "game"
  | "best"
  | "average"
  | "assists"
  | "hero_specific";

type CompetitiveFormat =
  | "role"
  | "open";

const FAVORITES_STORAGE_KEY =
  "owtracker.favoritePlayers";

/* ========================================
   PAGE
======================================== */

function PlayerSearchPage({
  onOpenHero,
}: PlayerSearchPageProps) {
  const {
    t,
  } = useI18n();

  const [
    battleTag,
    setBattleTag,
  ] = useState("");

  const [
    searchedBattleTag,
    setSearchedBattleTag,
  ] = useState("");

  const [
    selectedGamemode,
    setSelectedGamemode,
  ] =
    useState<PlayerGamemode>(
      "all",
    );

  const [
    activeGamemode,
    setActiveGamemode,
  ] =
    useState<PlayerGamemode>(
      "all",
    );

  const [
    selectedPlatform,
    setSelectedPlatform,
  ] =
    useState<PlayerPlatform>(
      "pc",
    );

  const [
    activePlatform,
    setActivePlatform,
  ] =
    useState<PlayerPlatform>(
      "pc",
    );

  const [
    careerData,
    setCareerData,
  ] =
    useState<PlayerCareerStats | null>(
      null,
    );

  const [
    careerHero,
    setCareerHero,
  ] = useState("all-heroes");

  const [
    careerLoading,
    setCareerLoading,
  ] = useState(false);

  const [
    careerError,
    setCareerError,
  ] = useState<string | null>(null);

  const [
    playerData,
    setPlayerData,
  ] =
    useState<PlayerData | null>(
      null,
    );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    lookupError,
    setLookupError,
  ] =
    useState<PlayerLookupError | null>(
      null,
    );

  const [
    retrySeconds,
    setRetrySeconds,
  ] =
    useState<number | null>(
      null,
    );

  const [
    favorites,
    setFavorites,
  ] =
    useState<FavoritePlayer[]>(
      () => {
        try {
          const saved =
            localStorage.getItem(
              FAVORITES_STORAGE_KEY,
            );

          if (!saved) {
            return [];
          }

          const parsed =
            JSON.parse(saved);

          if (!Array.isArray(parsed)) {
            return [];
          }

          return parsed;
        } catch {
          return [];
        }
      },
    );

  /* ========================================
     RETRY COUNTDOWN
  ======================================== */

  useEffect(() => {
    if (lookupError?.nextCheckAt) {
      const updateCountdown =
        () => {
          const now =
            Math.floor(
              Date.now() / 1000,
            );

          const remaining =
            Math.max(
              0,
              lookupError.nextCheckAt! -
                now,
            );

          setRetrySeconds(
            remaining,
          );
        };

      updateCountdown();

      const interval =
        window.setInterval(
          updateCountdown,
          1000,
        );

      return () =>
        window.clearInterval(
          interval,
        );
    }

    if (
      lookupError?.retryAfter !==
        null &&
      lookupError?.retryAfter !==
        undefined
    ) {
      setRetrySeconds(
        lookupError.retryAfter,
      );

      const interval =
        window.setInterval(
          () => {
            setRetrySeconds(
              (current) => {
                if (
                  current === null ||
                  current <= 0
                ) {
                  return 0;
                }

                return current - 1;
              },
            );
          },
          1000,
        );

      return () =>
        window.clearInterval(
          interval,
        );
    }

    setRetrySeconds(null);
  }, [lookupError]);

  /* ========================================
     FAVORITES
  ======================================== */

  function saveFavorites(
    nextFavorites:
      FavoritePlayer[],
  ) {
    setFavorites(
      nextFavorites,
    );

    localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(
        nextFavorites,
      ),
    );
  }

  function isFavorite(
    tag: string,
  ) {
    return favorites.some(
      (favorite) =>
        favorite.battleTag
          .toLowerCase() ===
        tag.toLowerCase(),
    );
  }

  function addFavorite() {
    if (
      !playerData ||
      !searchedBattleTag
    ) {
      return;
    }

    if (
      isFavorite(
        searchedBattleTag,
      )
    ) {
      return;
    }

    const newFavorite:
      FavoritePlayer = {
        battleTag:
          searchedBattleTag,

        username:
          playerData.summary
            .username,

        avatar:
          playerData.summary
            .avatar,
      };

    saveFavorites([
      ...favorites,
      newFavorite,
    ]);
  }

  function removeFavorite(
    tag: string,
  ) {
    const nextFavorites =
      favorites.filter(
        (favorite) =>
          favorite.battleTag
            .toLowerCase() !==
          tag.toLowerCase(),
      );

    saveFavorites(
      nextFavorites,
    );
  }

  /* ========================================
     SEARCH
  ======================================== */

  async function searchPlayer(
    value: string,
    gamemode:
      PlayerGamemode =
      selectedGamemode,
    platform:
      PlayerPlatform =
      selectedPlatform,
  ) {
    const normalizedValue =
      value.trim();

    if (!normalizedValue) {
      setLookupError({
        message:
          "Enter a BattleTag.",
        status: null,
        retryAfter: null,
        nextCheckAt: null,
        checkCount: null,
      });

      return;
    }

    setBattleTag(
      normalizedValue,
    );

    setSearchedBattleTag(
      normalizedValue,
    );

    setLoading(true);
    setLookupError(null);
    setRetrySeconds(null);

    try {
      const result =
        await getPlayerData(
          normalizedValue,
          gamemode,
          platform,
        );

      setPlayerData(result);
      setActiveGamemode(gamemode);
      setSelectedGamemode(gamemode);
      setActivePlatform(platform);
      setSelectedPlatform(platform);

      if (gamemode !== "all") {
        await loadCareer(
          normalizedValue,
          gamemode,
          platform,
          "all-heroes",
        );
      } else {
        setCareerData(null);
        setCareerError(null);
        setCareerHero("all-heroes");
      }
    } catch (error) {
      setPlayerData(null);
      setCareerData(null);

      if (
        error instanceof
        PlayerApiError
      ) {
        setLookupError({
          message:
            error.message.startsWith(
              "No Console statistics",
            )
              ? t(
                  "player.error.noConsoleStats",
                )
              : error.message.startsWith(
                    "No PC statistics",
                  )
                ? t(
                    "player.error.noPcStats",
                  )
                : error.message,
          status:
            error.status,
          retryAfter:
            error.retryAfter,
          nextCheckAt:
            error.nextCheckAt,
          checkCount:
            error.checkCount,
        });

        return;
      }

      if (
        error instanceof Error
      ) {
        setLookupError({
          message:
            error.message,
          status: null,
          retryAfter: null,
          nextCheckAt: null,
          checkCount: null,
        });

        return;
      }

      setLookupError({
        message:
          "Unable to load this player.",
        status: null,
        retryAfter: null,
        nextCheckAt: null,
        checkCount: null,
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(
    event: FormEvent,
  ) {
    event.preventDefault();

    await searchPlayer(
      battleTag,
      selectedGamemode,
      selectedPlatform,
    );
  }

  async function handleGamemodeChange(
    gamemode:
      PlayerGamemode,
  ) {
    setSelectedGamemode(
      gamemode,
    );

    if (searchedBattleTag) {
      await searchPlayer(
        searchedBattleTag,
        gamemode,
      );
    }
  }

  async function handlePlatformChange(
    platform: PlayerPlatform,
  ) {
    setSelectedPlatform(platform);

    if (searchedBattleTag) {
      await searchPlayer(
        searchedBattleTag,
        selectedGamemode,
        platform,
      );
    }
  }

  async function loadCareer(
    tag: string,
    gamemode: Exclude<PlayerGamemode, "all">,
    platform: PlayerPlatform,
    hero: string,
  ) {
    setCareerLoading(true);
    setCareerError(null);

    try {
      const result =
        await getPlayerCareer(
          tag,
          gamemode,
          platform,
          hero,
        );

      setCareerData(result);
      setCareerHero(hero);
    } catch (error) {
      setCareerData(null);
      setCareerError(
        error instanceof Error
          ? error.message
          : "Advanced career stats are unavailable.",
      );
    } finally {
      setCareerLoading(false);
    }
  }

  async function handleCareerHeroChange(
    hero: string,
  ) {
    setCareerHero(hero);

    if (
      !searchedBattleTag ||
      activeGamemode === "all"
    ) {
      return;
    }

    await loadCareer(
      searchedBattleTag,
      activeGamemode,
      activePlatform,
      hero,
    );
  }

  const canRetry =
    retrySeconds === null ||
    retrySeconds <= 0;

  /* ========================================
     RENDER
  ======================================== */

  return (
    <div className="player-page">
      <header className="topbar">
        <div>
          <p className="eyebrow">
            PLAYER LOOKUP
          </p>

          <h1>
            Players
          </h1>

          <p className="subtitle">
            Search an Overwatch
            player and explore
            their public career
            statistics.
          </p>
        </div>

        <div className="player-source-stack">
          <div className="live-status">
            <span className="status-dot" />

            Player data
          </div>

          <div className="player-source-meta">
            <span className="player-source-name">
              OVERFAST
            </span>

            <span className="player-source-separator">
              ·
            </span>

            <span className="player-source-state">
              ON DEMAND
            </span>
          </div>
        </div>
      </header>

      <section className="player-search-panel">
        <div className="player-search-heading">
          <div className="player-search-icon">
            <UserRound
              size={18}
            />
          </div>

          <div>
            <h2>
              Find a player
            </h2>

            <p>
              Enter a complete
              BattleTag.
            </p>
          </div>
        </div>

        <form
          className="player-search-form"
          onSubmit={
            handleSearch
          }
        >
          <div className="player-search-input">
            <Search size={16} />

            <input
              type="text"
              value={battleTag}
              onChange={(
                event,
              ) =>
                setBattleTag(
                  event.target.value,
                )
              }
              placeholder="BattleTag#1234"
              autoComplete="off"
            />
          </div>

          <button
            className="player-search-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Searching..."
              : "Search"}
          </button>
        </form>

        <p className="player-search-help">
          Example: Player#1234
        </p>

        <div className="player-platform-selector">
          <div>
            <span className="player-mode-label">
              {t("player.platform.label")}
            </span>

            <p>
              {t("player.platform.detail")}
            </p>
          </div>

          <div className="player-platform-buttons">
            <PlatformButton
              label={t("player.platform.pc")}
              icon={<Monitor size={13} />}
              active={selectedPlatform === "pc"}
              disabled={loading}
              onClick={() =>
                handlePlatformChange("pc")
              }
            />

            <PlatformButton
              label={t("player.platform.console")}
              icon={<Gamepad2 size={13} />}
              active={selectedPlatform === "console"}
              disabled={loading}
              onClick={() =>
                handlePlatformChange("console")
              }
            />
          </div>
        </div>
      </section>

      {favorites.length > 0 && (
        <section className="player-favorites">
          <div className="player-favorites-header">
            <div>
              <span className="panel-eyebrow">
                FAVORITES
              </span>

              <h2>
                Saved players
              </h2>
            </div>

            <span className="player-favorites-count">
              {favorites.length}
            </span>
          </div>

          <div className="player-favorites-list">
            {favorites.map(
              (favorite) => (
                <div
                  className="player-favorite-card"
                  key={
                    favorite.battleTag
                  }
                >
                  <button
                    className="player-favorite-main"
                    onClick={() =>
                      searchPlayer(
                        favorite.battleTag,
                        selectedGamemode,
                        selectedPlatform,
                      )
                    }
                    disabled={loading}
                  >
                    <div className="player-favorite-avatar">
                      {favorite.avatar ? (
                        <img
                          src={
                            favorite.avatar
                          }
                          alt={
                            favorite.username
                          }
                        />
                      ) : (
                        <UserRound
                          size={18}
                        />
                      )}
                    </div>

                    <div className="player-favorite-info">
                      <strong>
                        {favorite.username}
                      </strong>

                      <span>
                        {favorite.battleTag}
                      </span>
                    </div>

                    <ArrowRight
                      size={14}
                    />
                  </button>

                  <button
                    className="player-favorite-delete"
                    aria-label={`Remove ${favorite.username} from favorites`}
                    onClick={() =>
                      removeFavorite(
                        favorite.battleTag,
                      )
                    }
                  >
                    <Trash2
                      size={14}
                    />
                  </button>
                </div>
              ),
            )}
          </div>
        </section>
      )}

      {loading && (
        <div className="player-loading">
          <div className="player-loading-dot" />

          Loading{" "}
          {formatGamemode(
            selectedGamemode,
          )}{" "}
          statistics...
        </div>
      )}

      {lookupError &&
        !loading && (
        <section className="player-error">
          <strong>
            {lookupError.status ===
            404
              ? "Player temporarily unavailable"
              : "Player unavailable"}
          </strong>

          {searchedBattleTag && (
            <span>
              {searchedBattleTag}
            </span>
          )}

          {lookupError.status ===
          404 ? (
            <>
              <span>
                The BattleTag may
                still be valid, but
                the public profile
                service could not
                retrieve it.
              </span>

              {retrySeconds !==
                null &&
                retrySeconds >
                  0 && (
                  <span>
                    Next lookup
                    available in{" "}
                    <strong>
                      {formatCountdown(
                        retrySeconds,
                      )}
                    </strong>
                  </span>
                )}

              {lookupError.checkCount !==
                null && (
                <span>
                  Lookup attempts:{" "}
                  {
                    lookupError.checkCount
                  }
                </span>
              )}

              <button
                className="player-search-button"
                type="button"
                disabled={
                  !canRetry ||
                  loading
                }
                onClick={() =>
                  searchPlayer(
                    searchedBattleTag ||
                      battleTag,
                    selectedGamemode,
                  )
                }
              >
                <RefreshCw
                  size={14}
                />

                {canRetry
                  ? "Try again"
                  : "Retry unavailable"}
              </button>
            </>
          ) : (
            <span>
              {lookupError.message}
            </span>
          )}
        </section>
      )}

      {playerData && (
        <PlayerProfile
          data={playerData}
          battleTag={
            searchedBattleTag
          }
          gamemode={
            activeGamemode
          }
          selectedGamemode={
            selectedGamemode
          }
          platform={
            activePlatform
          }
          loading={
            loading
          }
          onGamemodeChange={
            handleGamemodeChange
          }
          careerData={
            careerData
          }
          careerHero={
            careerHero
          }
          careerLoading={
            careerLoading
          }
          careerError={
            careerError
          }
          onCareerHeroChange={
            handleCareerHeroChange
          }
          favorite={
            isFavorite(
              searchedBattleTag,
            )
          }
          onAddFavorite={
            addFavorite
          }
          onRemoveFavorite={() =>
            removeFavorite(
              searchedBattleTag,
            )
          }
          onOpenHero={
            onOpenHero
          }
        />
      )}

      {!playerData &&
        !lookupError &&
        !loading && (
          <div className="player-empty">
            <UserRound
              size={25}
            />

            <h2>
              Search for a player
            </h2>

            <p>
              Career stats,
              competitive roles
              and most played
              heroes will appear
              here.
            </p>
          </div>
        )}
    </div>
  );
}

/* ========================================
   MODE BUTTON
======================================== */

type ModeButtonProps = {
  label: string;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
};

function ModeButton({
  label,
  active,
  disabled,
  onClick,
}: ModeButtonProps) {
  return (
    <button
      type="button"
      className={
        active
          ? "player-mode-button active"
          : "player-mode-button"
      }
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

/* ========================================
   PLATFORM BUTTON
======================================== */

type PlatformButtonProps = {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
};

function PlatformButton({
  label,
  icon,
  active,
  disabled,
  onClick,
}: PlatformButtonProps) {
  return (
    <button
      type="button"
      className={
        active
          ? "player-platform-button active"
          : "player-platform-button"
      }
      disabled={disabled}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}

/* ========================================
   PROFILE
======================================== */

type PlayerProfileProps = {
  data: PlayerData;
  battleTag: string;
  gamemode: PlayerGamemode;
  selectedGamemode: PlayerGamemode;
  platform: PlayerPlatform;
  loading: boolean;
  onGamemodeChange: (
    gamemode: PlayerGamemode,
  ) => void | Promise<void>;
  careerData: PlayerCareerStats | null;
  careerHero: string;
  careerLoading: boolean;
  careerError: string | null;
  onCareerHeroChange: (hero: string) => void;
  favorite: boolean;
  onAddFavorite: () => void;
  onRemoveFavorite: () => void;

  onOpenHero: (
    hero: Hero,
    stats: PlayerStatBlock,
    player: {
      username: string;
      battleTag: string;
    },
  ) => void;
};

function PlayerProfile({
  data,
  battleTag,
  gamemode,
  selectedGamemode,
  platform,
  loading,
  onGamemodeChange,
  careerData,
  careerHero,
  careerLoading,
  careerError,
  onCareerHeroChange,
  favorite,
  onAddFavorite,
  onRemoveFavorite,
  onOpenHero,
}: PlayerProfileProps) {
  const {
    t,
  } = useI18n();

  const {
    summary,
    stats,
  } = data;

  const ranks =
    summary.competitive?.[platform];

  const [
    competitiveFormat,
    setCompetitiveFormat,
  ] =
    useState<CompetitiveFormat>(
      "role",
    );

  const [
    heroSortMetric,
    setHeroSortMetric,
  ] =
    useState<HeroSortMetric>(
      "time",
    );

  const [
    showAllHeroes,
    setShowAllHeroes,
  ] = useState(false);

  const [
    careerCategory,
    setCareerCategory,
  ] = useState<CareerCategory>(
    "combat",
  );

  const activeCareerStats =
    getCareerHeroStats(
      careerData,
      careerHero,
    );

  const allSortedHeroes =
    useMemo(() => {
      return Object.entries(
        stats.heroes ?? {},
      )
        .filter(
          ([, heroStats]) =>
            heroStats.time_played >
            0,
        )
        .sort(
          (
            [, a],
            [, b],
          ) => {
            switch (
              heroSortMetric
            ) {
              case "games":
                return (
                  b.games_played -
                  a.games_played
                );

              case "winrate":
                return (
                  b.winrate -
                  a.winrate
                );

              case "kda":
                return (
                  b.kda -
                  a.kda
                );

              case "time":
              default:
                return (
                  b.time_played -
                  a.time_played
                );
            }
          },
        );
    }, [
      stats.heroes,
      heroSortMetric,
    ]);

  const sortedHeroes =
    showAllHeroes
      ? allSortedHeroes
      : allSortedHeroes.slice(
          0,
          10,
        );

  const bestPerformingHeroes =
    useMemo(() => {
      return Object.entries(
        stats.heroes ?? {},
      )
        .filter(
          ([, heroStats]) =>
            heroStats.games_played >=
            10,
        )
        .sort(
          (
            [, a],
            [, b],
          ) => {
            if (
              b.winrate !==
              a.winrate
            ) {
              return (
                b.winrate -
                a.winrate
              );
            }

            return (
              b.games_played -
              a.games_played
            );
          },
        )
        .slice(
          0,
          3,
        );
    }, [
      stats.heroes,
    ]);

  const roleDistribution =
    useMemo(() => {
      const roles = [
        {
          label: t("player.role.tank"),
          value:
            stats.roles?.tank
              ?.time_played ??
            0,
        },
        {
          label: t("player.role.damage"),
          value:
            stats.roles?.damage
              ?.time_played ??
            0,
        },
        {
          label: t("player.role.support"),
          value:
            stats.roles?.support
              ?.time_played ??
            0,
        },
      ];

      const total =
        roles.reduce(
          (
            sum,
            role,
          ) =>
            sum +
            role.value,
          0,
        );

      return roles.map(
        (role) => ({
          ...role,
          percent:
            total > 0
              ? (
                  role.value /
                  total
                ) *
                100
              : 0,
        }),
      );
    }, [
      stats.roles,
      t,
    ]);

  async function copyBattleTag() {
    try {
      await navigator.clipboard.writeText(
        battleTag,
      );
    } catch {
      // Clipboard access can be unavailable
      // in some embedded contexts.
    }
  }

  return (
    <section className="player-profile">
      <div className="player-identity">
        <div className="player-avatar">
          {summary.avatar ? (
            <img
              src={
                summary.avatar
              }
              alt={
                summary.username
              }
            />
          ) : (
            <UserRound
              size={30}
            />
          )}
        </div>

        <div className="player-identity-text">
          <span className="panel-eyebrow">
            PLAYER
          </span>

          <h2>
            {summary.username}
          </h2>

          <div className="player-battletag-row">
            <span className="player-battletag">
              {battleTag}
            </span>

            <button
              type="button"
              className="player-copy-battletag"
              onClick={copyBattleTag}
              aria-label={t("player.copyBattleTag")}
              title={t("player.copyBattleTag")}
            >
              <Copy size={12} />
            </button>
          </div>

          {summary.title && (
            <p>
              {summary.title}
            </p>
          )}

          <span className="player-active-mode">
            {formatGamemode(
              gamemode,
            )}{" "}
            statistics
          </span>
        </div>

        <div className="player-profile-actions">
          <button
            className={
              favorite
                ? "player-favorite-toggle active"
                : "player-favorite-toggle"
            }
            onClick={
              favorite
                ? onRemoveFavorite
                : onAddFavorite
            }
          >
            <Star
              size={14}
              fill={
                favorite
                  ? "currentColor"
                  : "none"
              }
            />

            {favorite
              ? "Favorited"
              : "Add to favorites"}
          </button>

          {summary.endorsement && (
            <div className="player-endorsement">
              <span>
                Endorsement
              </span>

              <strong>
                {summary.endorsement
                  .level ?? "—"}
              </strong>
            </div>
          )}
        </div>

        <div className="player-profile-mode-selector">
          <div className="player-mode-selector">
            <div>
              <span className="player-mode-label">
                {t("player.mode.label")}
              </span>

              <p>
                {t("player.mode.detail")}
              </p>
            </div>

            <div className="player-mode-buttons">
              <ModeButton
                label={t("player.mode.all")}
                active={
                  selectedGamemode ===
                  "all"
                }
                disabled={loading}
                onClick={() =>
                  onGamemodeChange(
                    "all",
                  )
                }
              />

              <ModeButton
                label={t("player.mode.competitive")}
                active={
                  selectedGamemode ===
                  "competitive"
                }
                disabled={loading}
                onClick={() =>
                  onGamemodeChange(
                    "competitive",
                  )
                }
              />

              <ModeButton
                label={t("player.mode.quickplay")}
                active={
                  selectedGamemode ===
                  "quickplay"
                }
                disabled={loading}
                onClick={() =>
                  onGamemodeChange(
                    "quickplay",
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>

      <SectionHeader
        eyebrow="OVERVIEW"
        title={`${formatGamemode(
          gamemode,
        )} overview`}
      />

      <div className="player-overview-grid">
        <OverviewCard
          icon={
            <Clock3 size={16} />
          }
          label="Time played"
          value={
            formatDuration(
              stats.general
                .time_played,
            )
          }
        />

        <OverviewCard
          icon={
            <Activity size={16} />
          }
          label="Games played"
          value={
            formatNumber(
              stats.general
                .games_played,
            )
          }
        />

        <OverviewCard
          icon={
            <Trophy size={16} />
          }
          label="Games won"
          value={
            formatNumber(
              stats.general
                .games_won,
            )
          }
        />

        <OverviewCard
          icon={
            <Percent size={16} />
          }
          label="Win rate"
          value={`${stats.general.winrate.toFixed(
            2,
          )}%`}
          accent
        />

        <OverviewCard
          icon={
            <Swords size={16} />
          }
          label="KDA"
          value={
            stats.general.kda.toFixed(
              2,
            )
          }
        />
      </div>

      <SectionHeader
        eyebrow={t("player.average.eyebrow")}
        title={t("player.average.title")}
      />

      <div className="player-combat-grid player-average-grid">
        <DecimalStat
          label={t("player.stat.eliminations")}
          value={stats.general.average.eliminations}
        />
        <DecimalStat
          label={t("player.stat.assists")}
          value={stats.general.average.assists}
        />
        <DecimalStat
          label={t("player.stat.deaths")}
          value={stats.general.average.deaths}
        />
        <DecimalStat
          label={t("player.stat.damage")}
          value={stats.general.average.damage}
        />
        <DecimalStat
          label={t("player.stat.healing")}
          value={stats.general.average.healing}
        />
      </div>

      <div className="player-section-heading player-competitive-heading">
        <div>
          <span className="panel-eyebrow">
            {t("player.competitive.eyebrow")}
          </span>

          <h3>
            {formatPlatform(platform)}{" "}
            {t("player.competitive.ranks")}
          </h3>

          {ranks?.season !==
            undefined &&
            ranks?.season !==
              null && (
              <span className="player-season">
                {t("player.competitive.season")}{" "}
                {ranks.season}
              </span>
            )}
        </div>

        <div className="player-rank-format">
          <span className="player-rank-format-label">
            {t("player.competitive.format")}
          </span>

          <div className="player-rank-format-buttons">
            <button
              type="button"
              className={
                competitiveFormat ===
                "role"
                  ? "player-rank-format-button active"
                  : "player-rank-format-button"
              }
              onClick={() =>
                setCompetitiveFormat(
                  "role",
                )
              }
            >
              {t("player.competitive.5v5")}
            </button>

            <button
              type="button"
              className={
                competitiveFormat ===
                "open"
                  ? "player-rank-format-button active"
                  : "player-rank-format-button"
              }
              onClick={() =>
                setCompetitiveFormat(
                  "open",
                )
              }
            >
              {t("player.competitive.6v6")}
            </button>
          </div>
        </div>
      </div>

      {competitiveFormat ===
      "role" ? (
        <div className="player-ranks">
          <RankCard
            label={t("player.role.tank")}
            icon={
              <Shield
                size={18}
              />
            }
            rank={
              ranks?.tank
            }
          />

          <RankCard
            label={t("player.role.damage")}
            icon={
              <Swords
                size={18}
              />
            }
            rank={
              ranks?.damage
            }
          />

          <RankCard
            label={t("player.role.support")}
            icon={
              <HeartPulse
                size={18}
              />
            }
            rank={
              ranks?.support
            }
          />
        </div>
      ) : (
        <div className="player-ranks player-ranks-open">
          <RankCard
            label={t("player.competitive.openQueue")}
            icon={
              <Trophy
                size={18}
              />
            }
            rank={
              ranks?.open
            }
          />
        </div>
      )}

      <SectionHeader
        eyebrow="ROLE PERFORMANCE"
        title="Performance by role"
      />

      <div className="player-role-performance">
        <RolePerformanceCard
          label={t("player.role.tank")}
          icon={
            <Shield
              size={17}
            />
          }
          stats={
            stats.roles?.tank
          }
        />

        <RolePerformanceCard
          label={t("player.role.damage")}
          icon={
            <Swords
              size={17}
            />
          }
          stats={
            stats.roles?.damage
          }
        />

        <RolePerformanceCard
          label={t("player.role.support")}
          icon={
            <HeartPulse
              size={17}
            />
          }
          stats={
            stats.roles?.support
          }
        />
      </div>

      <div className="player-insights-grid">
        <section className="player-insight-card">
          <div className="player-section-heading compact">
            <div>
              <span className="panel-eyebrow">
                {t("player.roleDistribution.eyebrow")}
              </span>

              <h3>
                {t("player.roleDistribution.title")}
              </h3>
            </div>
          </div>

          <div className="player-role-distribution">
            {roleDistribution.map(
              (role) => (
                <div
                  className="player-role-distribution-row"
                  key={role.label}
                >
                  <div>
                    <strong>
                      {role.label}
                    </strong>

                    <span>
                      {formatDuration(
                        role.value,
                      )}
                    </span>
                  </div>

                  <div className="player-role-distribution-bar">
                    <span
                      style={{
                        width:
                          `${role.percent.toFixed(
                            1,
                          )}%`,
                      }}
                    />
                  </div>

                  <strong>
                    {role.percent.toFixed(
                      1,
                    )}
                    %
                  </strong>
                </div>
              ),
            )}
          </div>
        </section>

        <section className="player-insight-card">
          <div className="player-section-heading compact">
            <div>
              <span className="panel-eyebrow">
                {t("player.bestHeroes.eyebrow")}
              </span>

              <h3>
                {t("player.bestHeroes.title")}
              </h3>
            </div>
          </div>

          <div className="player-best-heroes">
            {bestPerformingHeroes.length >
            0 ? (
              bestPerformingHeroes.map(
                ([
                  heroId,
                  heroStats,
                ]) => (
                  <div
                    className="player-best-hero-row"
                    key={heroId}
                  >
                    <div className="player-best-hero-main">
                      <strong>
                        {formatHeroName(
                          heroId,
                        )}
                      </strong>

                      <span>
                        {
                          heroStats.games_played
                        }{" "}
                        {t("player.bestHeroes.games")}
                      </span>
                    </div>

                    <strong>
                      {heroStats.winrate.toFixed(
                        1,
                      )}
                      %
                    </strong>
                  </div>
                ),
              )
            ) : (
              <span className="player-role-no-data">
                {t("player.bestHeroes.notEnough")}
              </span>
            )}
          </div>

          <span className="player-insight-note">
            {t("player.bestHeroes.minimum")}
          </span>
        </section>
      </div>

      <SectionHeader
        eyebrow="CAREER STATS"
        title={`${formatGamemode(
          gamemode,
        )} totals`}
      />

      <div className="player-combat-grid">
        <CombatStat
          label={t("player.stat.eliminations")}
          value={
            stats.general.total
              .eliminations
          }
        />

        <CombatStat
          label={t("player.stat.assists")}
          value={
            stats.general.total
              .assists
          }
        />

        <CombatStat
          label={t("player.stat.deaths")}
          value={
            stats.general.total
              .deaths
          }
        />

        <CombatStat
          label={t("player.stat.damage")}
          value={
            stats.general.total
              .damage
          }
        />

        <CombatStat
          label={t("player.stat.healing")}
          value={
            stats.general.total
              .healing
          }
        />
      </div>

      <SectionHeader
        eyebrow={t("player.career.eyebrow")}
        title={t("player.career.title")}
      />

      {gamemode === "all" ? (
        <div className="player-career-note">
          {t("player.career.chooseMode")}
        </div>
      ) : (
        <section className="player-career-panel">
          <div className="player-career-toolbar">
            <div className="player-career-select">
              <label htmlFor="player-career-hero">
                {t("player.career.hero")}
              </label>

              <select
                id="player-career-hero"
                value={careerHero}
                disabled={careerLoading}
                onChange={(event) =>
                  onCareerHeroChange(
                    event.target.value,
                  )
                }
              >
                <option value="all-heroes">
                  {t("player.career.allHeroes")}
                </option>

                {sortedHeroes.map(([heroId]) => (
                  <option
                    key={heroId}
                    value={heroId}
                  >
                    {getHeroDisplayName(heroId)}
                  </option>
                ))}
              </select>
            </div>

            <div className="player-career-tabs">
              {([
                [
                  "combat",
                  t("player.career.combat"),
                ],
                [
                  "game",
                  t("player.career.game"),
                ],
                [
                  "best",
                  t("player.career.best"),
                ],
                [
                  "average",
                  t("player.career.average"),
                ],
                [
                  "assists",
                  t("player.career.assists"),
                ],
                [
                  "hero_specific",
                  t("player.career.heroSpecific"),
                ],
              ] as [CareerCategory, string][]).map(
                ([category, label]) => (
                  <button
                    key={category}
                    type="button"
                    className={
                      careerCategory === category
                        ? "player-career-tab active"
                        : "player-career-tab"
                    }
                    onClick={() =>
                      setCareerCategory(category)
                    }
                  >
                    {label}
                  </button>
                ),
              )}
            </div>
          </div>

          {careerLoading ? (
            <div className="player-career-state">
              {t("player.career.loading")}
            </div>
          ) : careerError ? (
            <div className="player-career-state error">
              {careerError}
            </div>
          ) : (
            <CareerStatsGrid
              stats={
                activeCareerStats?.[careerCategory]
              }
            />
          )}
        </section>
      )}

      <div className="player-hero-section-top">
        <SectionHeader
          eyebrow="HERO PERFORMANCE"
          title="Most played heroes"
        />

        <div className="player-hero-sort">
          <span>
            Sort by
          </span>

          <div className="player-hero-sort-buttons">
            <HeroSortButton
              label="Time"
              active={
                heroSortMetric ===
                "time"
              }
              onClick={() =>
                setHeroSortMetric(
                  "time",
                )
              }
            />

            <HeroSortButton
              label="Games"
              active={
                heroSortMetric ===
                "games"
              }
              onClick={() =>
                setHeroSortMetric(
                  "games",
                )
              }
            />

            <HeroSortButton
              label="Win rate"
              active={
                heroSortMetric ===
                "winrate"
              }
              onClick={() =>
                setHeroSortMetric(
                  "winrate",
                )
              }
            />

            <HeroSortButton
              label="KDA"
              active={
                heroSortMetric ===
                "kda"
              }
              onClick={() =>
                setHeroSortMetric(
                  "kda",
                )
              }
            />
          </div>
        </div>
      </div>

      <div className="player-heroes-table">
        <div className="player-heroes-header">
          <span>
            Hero
          </span>

          <span>
            Time
          </span>

          <span>
            Games
          </span>

          <span>
            Win rate
          </span>

          <span>
            KDA
          </span>

          <span />
        </div>

        {sortedHeroes.map(
          ([
            heroId,
            heroStats,
          ]) => (
            <HeroStatRow
              key={heroId}
              heroId={heroId}
              stats={
                heroStats
              }
              username={
                summary.username
              }
              battleTag={
                battleTag
              }
              onOpenHero={
                onOpenHero
              }
            />
          ),
        )}
      </div>

      {allSortedHeroes.length >
        10 && (
        <button
          type="button"
          className="player-show-all-heroes"
          onClick={() =>
            setShowAllHeroes(
              (current) =>
                !current,
            )
          }
        >
          {showAllHeroes
            ? t("player.showTop10")
            : `${t(
                "player.showAllHeroes",
              )} (${allSortedHeroes.length})`}
        </button>
      )}
    </section>
  );
}

/* ========================================
   HERO SORT BUTTON
======================================== */

type HeroSortButtonProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

function HeroSortButton({
  label,
  active,
  onClick,
}: HeroSortButtonProps) {
  return (
    <button
      type="button"
      className={
        active
          ? "player-hero-sort-button active"
          : "player-hero-sort-button"
      }
      onClick={onClick}
    >
      {label}

      {active && (
        <span>
          ↓
        </span>
      )}
    </button>
  );
}

/* ========================================
   SECTION HEADER
======================================== */

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
};

function SectionHeader({
  eyebrow,
  title,
}: SectionHeaderProps) {
  return (
    <div className="player-section-heading">
      <div>
        <span className="panel-eyebrow">
          {eyebrow}
        </span>

        <h3>
          {title}
        </h3>
      </div>
    </div>
  );
}

/* ========================================
   OVERVIEW CARD
======================================== */

type OverviewCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
};

function OverviewCard({
  icon,
  label,
  value,
  accent = false,
}: OverviewCardProps) {
  return (
    <div className="player-overview-card">
      <div className="player-overview-icon">
        {icon}
      </div>

      <span>
        {label}
      </span>

      <strong
        className={
          accent
            ? "accent"
            : ""
        }
      >
        {value}
      </strong>
    </div>
  );
}

/* ========================================
   RANK
======================================== */

type RankCardProps = {
  label: string;
  icon: React.ReactNode;
  rank?:
    PlayerRank | null;
};

function RankCard({
  label,
  icon,
  rank,
}: RankCardProps) {
  return (
    <div className="player-rank-card">
      <div className="player-rank-role">
        {icon}

        <span>
          {label}
        </span>
      </div>

      {rank ? (
        <>
          <div className="player-rank-images">
            {rank.rank_icon && (
              <img
                className="player-rank-icon"
                src={
                  rank.rank_icon
                }
                alt={
                  rank.division
                }
              />
            )}

            {rank.tier_icon && (
              <img
                className="player-tier-icon"
                src={
                  rank.tier_icon
                }
                alt={`Tier ${rank.tier}`}
              />
            )}
          </div>

          <strong>
            {formatRank(
              rank,
            )}
          </strong>
        </>
      ) : (
        <strong className="player-unranked">
          Unranked
        </strong>
      )}
    </div>
  );
}

/* ========================================
   ROLE PERFORMANCE
======================================== */

type RolePerformanceCardProps = {
  label: string;
  icon: React.ReactNode;
  stats?:
    PlayerStatBlock;
};

function RolePerformanceCard({
  label,
  icon,
  stats,
}: RolePerformanceCardProps) {
  if (!stats) {
    return (
      <div className="player-role-card">
        <div className="player-role-title">
          {icon}

          <strong>
            {label}
          </strong>
        </div>

        <span className="player-role-no-data">
          No data
        </span>
      </div>
    );
  }

  return (
    <div className="player-role-card">
      <div className="player-role-title">
        {icon}

        <strong>
          {label}
        </strong>
      </div>

      <div className="player-role-primary">
        <strong>
          {stats.winrate.toFixed(
            2,
          )}
          %
        </strong>

        <span>
          Win rate
        </span>
      </div>

      <div className="player-role-secondary">
        <div>
          <span>
            Games
          </span>

          <strong>
            {stats.games_played}
          </strong>
        </div>

        <div>
          <span>
            Wins
          </span>

          <strong>
            {stats.games_won}
          </strong>
        </div>

        <div>
          <span>
            KDA
          </span>

          <strong>
            {stats.kda.toFixed(
              2,
            )}
          </strong>
        </div>
      </div>

      <span className="player-role-time">
        {formatDuration(
          stats.time_played,
        )} played
      </span>
    </div>
  );
}

/* ========================================
   COMBAT
======================================== */

type CombatStatProps = {
  label: string;
  value: number;
};

function CombatStat({
  label,
  value,
}: CombatStatProps) {
  return (
    <div className="player-combat-card">
      <span>
        {label}
      </span>

      <strong>
        {formatNumber(
          value,
        )}
      </strong>
    </div>
  );
}

type DecimalStatProps = {
  label: string;
  value: number;
};

function DecimalStat({
  label,
  value,
}: DecimalStatProps) {
  return (
    <div className="player-combat-card player-average-card">
      <span>{label}</span>
      <strong>{formatDecimal(value)}</strong>
    </div>
  );
}

function CareerStatsGrid({
  stats,
}: {
  stats?: Record<string, number | string | null>;
}) {
  const entries =
    Object.entries(stats ?? {})
      .filter(([, value]) => value !== null)
      .slice(0, 18);

  if (entries.length === 0) {
    return (
      <div className="player-career-state">
        No statistics available for this category.
      </div>
    );
  }

  return (
    <div className="player-career-grid">
      {entries.map(([key, value]) => (
        <div
          className="player-career-stat"
          key={key}
        >
          <span>{formatStatLabel(key)}</span>
          <strong>{formatCareerValue(key, value)}</strong>
        </div>
      ))}
    </div>
  );
}

/* ========================================
   HERO ROW
======================================== */

type HeroStatRowProps = {
  heroId: string;
  stats:
    PlayerStatBlock;
  username: string;
  battleTag: string;

  onOpenHero: (
    hero: Hero,
    stats: PlayerStatBlock,
    player: {
      username: string;
      battleTag: string;
    },
  ) => void;
};

function HeroStatRow({
  heroId,
  stats,
  username,
  battleTag,
  onOpenHero,
}: HeroStatRowProps) {
  const hero =
    heroes.find(
      (entry) =>
        entry.id === heroId,
    );

  const heroName =
    hero?.name ??
    formatHeroName(
      heroId,
    );

  return (
    <button
      className="player-hero-row"
      disabled={!hero}
      onClick={() => {
        if (hero) {
          onOpenHero(
            hero,
            stats,
            {
              username,
              battleTag,
            },
          );
        }
      }}
    >
      <div className="player-hero-identity">
        <div className="player-hero-avatar">
          {hero?.image ? (
            <img
              src={
                hero.image
              }
              alt={
                heroName
              }
            />
          ) : (
            <Skull
              size={16}
            />
          )}
        </div>

        <div>
          <strong>
            {heroName}
          </strong>

          <span>
            {stats.games_won}W
            {" · "}
            {stats.games_lost}L
          </span>
        </div>
      </div>

      <strong>
        {formatDuration(
          stats.time_played,
        )}
      </strong>

      <strong>
        {stats.games_played}
      </strong>

      <strong
        className={
          stats.winrate >= 50
            ? "player-positive-stat"
            : ""
        }
      >
        {stats.winrate.toFixed(
          2,
        )}
        %
      </strong>

      <strong>
        {stats.kda.toFixed(
          2,
        )}
      </strong>

      <span className="player-hero-open">
        <ArrowRight
          size={15}
        />
      </span>
    </button>
  );
}

/* ========================================
   HELPERS
======================================== */

function getCareerHeroStats(
  data: PlayerCareerStats | null,
  hero: string,
) {
  if (!data) {
    return null;
  }

  return (
    data[hero] ??
    data["all-heroes"] ??
    null
  );
}

function getHeroDisplayName(
  heroId: string,
) {
  return (
    heroes.find(
      (hero) => hero.id === heroId,
    )?.name ?? formatHeroName(heroId)
  );
}

function formatPlatform(
  platform: PlayerPlatform,
) {
  return platform === "pc"
    ? "PC"
    : "Console";
}

function formatDecimal(
  value: number,
) {
  return new Intl.NumberFormat(
    "en-US",
    {
      maximumFractionDigits: 2,
    },
  ).format(value);
}

function formatStatLabel(
  value: string,
) {
  return value
    .replace(/_avg_per_10_min$/i, " / 10 min")
    .replace(/_most_in_game$/i, " best game")
    .replace(/_best_in_game$/i, " best game")
    .replace(/_/g, " ")
    .replace(
      /\b\w/g,
      (letter: string) =>
        letter.toUpperCase(),
    );
}

function formatCareerValue(
  key: string,
  value: number | string | null,
) {
  if (value === null) {
    return "—";
  }

  if (typeof value === "string") {
    return value;
  }

  if (
    key.includes("time") &&
    value >= 60
  ) {
    return formatDuration(value);
  }

  if (
    key.includes("accuracy") ||
    key.includes("percentage") ||
    key.includes("win_percentage") ||
    key.includes("rate")
  ) {
    return `${formatDecimal(value)}%`;
  }

  return formatDecimal(value);
}

function formatGamemode(
  gamemode:
    PlayerGamemode,
) {
  switch (gamemode) {
    case "competitive":
      return "Competitive";

    case "quickplay":
      return "Quick Play";

    default:
      return "All modes";
  }
}

function formatRank(
  rank: PlayerRank,
) {
  const division =
    rank.division
      .charAt(0)
      .toUpperCase() +
    rank.division.slice(1);

  return `${division} ${rank.tier}`;
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

function formatNumber(
  value: number,
) {
  return new Intl.NumberFormat(
    "en-US",
  ).format(
    Math.round(value),
  );
}

function formatHeroName(
  heroId: string,
) {
  return heroId
    .split("-")
    .map(
      (word) =>
        word
          .charAt(0)
          .toUpperCase() +
        word.slice(1),
    )
    .join(" ");
}

function formatCountdown(
  seconds: number,
) {
  const safeSeconds =
    Math.max(
      0,
      Math.floor(seconds),
    );

  const hours =
    Math.floor(
      safeSeconds / 3600,
    );

  const minutes =
    Math.floor(
      (safeSeconds % 3600) /
        60,
    );

  const remainingSeconds =
    safeSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes
      .toString()
      .padStart(
        2,
        "0",
      )}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds
      .toString()
      .padStart(
        2,
        "0",
      )}s`;
  }

  return `${remainingSeconds}s`;
}

export default PlayerSearchPage;