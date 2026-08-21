import {
  Activity,
  ArrowRight,
  Clock3,
  HeartPulse,
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
  getPlayerData,
  PlayerApiError,
} from "../services/playerApi";

import type {
  PlayerGamemode,
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

const FAVORITES_STORAGE_KEY =
  "owtracker.favoritePlayers";

/* ========================================
   PAGE
======================================== */

function PlayerSearchPage({
  onOpenHero,
}: PlayerSearchPageProps) {
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
        );

      setPlayerData(result);
      setActiveGamemode(gamemode);
      setSelectedGamemode(gamemode);
    } catch (error) {
      setPlayerData(null);

      if (
        error instanceof
        PlayerApiError
      ) {
        setLookupError({
          message:
            error.message,
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

        <div className="live-status">
          <span className="status-dot" />

          Player data
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

        <div className="player-mode-selector">
          <div>
            <span className="player-mode-label">
              Mode
            </span>

            <p>
              Select which career
              statistics to display.
            </p>
          </div>

          <div className="player-mode-buttons">
            <ModeButton
              label="All modes"
              active={
                selectedGamemode ===
                "all"
              }
              disabled={loading}
              onClick={() =>
                handleGamemodeChange(
                  "all",
                )
              }
            />

            <ModeButton
              label="Competitive"
              active={
                selectedGamemode ===
                "competitive"
              }
              disabled={loading}
              onClick={() =>
                handleGamemodeChange(
                  "competitive",
                )
              }
            />

            <ModeButton
              label="Quick Play"
              active={
                selectedGamemode ===
                "quickplay"
              }
              disabled={loading}
              onClick={() =>
                handleGamemodeChange(
                  "quickplay",
                )
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
   PROFILE
======================================== */

type PlayerProfileProps = {
  data: PlayerData;
  battleTag: string;
  gamemode: PlayerGamemode;
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
  favorite,
  onAddFavorite,
  onRemoveFavorite,
  onOpenHero,
}: PlayerProfileProps) {
  const {
    summary,
    stats,
  } = data;

  const ranks =
    summary.competitive?.pc;

  const [
    heroSortMetric,
    setHeroSortMetric,
  ] =
    useState<HeroSortMetric>(
      "time",
    );

  const sortedHeroes =
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
        )
        .slice(0, 10);
    }, [
      stats.heroes,
      heroSortMetric,
    ]);

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

          <span className="player-battletag">
            {battleTag}
          </span>

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

      <div className="player-section-heading">
        <div>
          <span className="panel-eyebrow">
            COMPETITIVE
          </span>

          <h3>
            PC ranks
          </h3>

          {ranks?.season !==
            undefined &&
            ranks?.season !==
              null && (
              <span className="player-season">
                Season{" "}
                {ranks.season}
              </span>
            )}
        </div>
      </div>

      <div className="player-ranks">
        <RankCard
          label="Tank"
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
          label="Damage"
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
          label="Support"
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

      <SectionHeader
        eyebrow="ROLE PERFORMANCE"
        title="Performance by role"
      />

      <div className="player-role-performance">
        <RolePerformanceCard
          label="Tank"
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
          label="Damage"
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
          label="Support"
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

      <SectionHeader
        eyebrow="CAREER STATS"
        title={`${formatGamemode(
          gamemode,
        )} totals`}
      />

      <div className="player-combat-grid">
        <CombatStat
          label="Eliminations"
          value={
            stats.general.total
              .eliminations
          }
        />

        <CombatStat
          label="Assists"
          value={
            stats.general.total
              .assists
          }
        />

        <CombatStat
          label="Deaths"
          value={
            stats.general.total
              .deaths
          }
        />

        <CombatStat
          label="Damage"
          value={
            stats.general.total
              .damage
          }
        />

        <CombatStat
          label="Healing"
          value={
            stats.general.total
              .healing
          }
        />
      </div>

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