import {
  Activity,
  Clock3,
  HeartPulse,
  Search,
  Shield,
  Swords,
  Trophy,
  UserRound,
  UsersRound,
} from "lucide-react";

import {
  type FormEvent,
  useMemo,
  useState,
} from "react";

import {
  getPlayerData,
} from "../services/playerApi";

import type {
  PlayerGamemode,
} from "../services/playerApi";

import {
  heroes,
} from "../data/heroes";

import type {
  PlayerData,
  PlayerRank,
  PlayerStatBlock,
} from "../types/player";

import "./PlayerCompare.css";

/* ========================================
   TYPES
======================================== */

type ComparisonPlayer = {
  battleTag: string;

  data: PlayerData;
};

type SharedHeroSort =
  | "time"
  | "gap"
  | "games";

type SharedHero = {
  heroId: string;

  first:
    PlayerStatBlock;

  second:
    PlayerStatBlock;
};

/* ========================================
   PAGE
======================================== */

function PlayerCompare() {
  const [
    playerOneTag,
    setPlayerOneTag,
  ] = useState("");

  const [
    playerTwoTag,
    setPlayerTwoTag,
  ] = useState("");

  const [
    playerOne,
    setPlayerOne,
  ] =
    useState<ComparisonPlayer | null>(
      null,
    );

  const [
    playerTwo,
    setPlayerTwo,
  ] =
    useState<ComparisonPlayer | null>(
      null,
    );

  const [
    gamemode,
    setGamemode,
  ] =
    useState<PlayerGamemode>(
      "competitive",
    );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  /* ========================================
     SEARCH
  ======================================== */

  async function handleCompare(
    event: FormEvent,
  ) {
    event.preventDefault();

    const first =
      playerOneTag.trim();

    const second =
      playerTwoTag.trim();

    if (
      !first ||
      !second
    ) {
      setError(
        "Enter both BattleTags.",
      );

      return;
    }

    await loadComparison(
      first,
      second,
      gamemode,
    );
  }

  async function loadComparison(
    first: string,
    second: string,
    mode: PlayerGamemode,
  ) {
    setLoading(true);
    setError(null);

    try {
      const [
        firstData,
        secondData,
      ] = await Promise.all([
        getPlayerData(
          first,
          mode,
        ),

        getPlayerData(
          second,
          mode,
        ),
      ]);

      setPlayerOne({
        battleTag:
          first,

        data:
          firstData,
      });

      setPlayerTwo({
        battleTag:
          second,

        data:
          secondData,
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to compare these players.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function changeGamemode(
    nextMode:
      PlayerGamemode,
  ) {
    setGamemode(
      nextMode,
    );

    const first =
      playerOneTag.trim();

    const second =
      playerTwoTag.trim();

    if (
      !first ||
      !second
    ) {
      return;
    }

    await loadComparison(
      first,
      second,
      nextMode,
    );
  }

  /* ========================================
     RENDER
  ======================================== */

  return (
    <div className="player-compare-page">
      <header className="topbar">
        <div>
          <p className="eyebrow">
            PLAYER COMPARISON
          </p>

          <h1>
            Compare
          </h1>

          <p className="subtitle">
            Compare two Overwatch
            players using the same
            game mode.
          </p>
        </div>

        <div className="live-status">
          <span className="status-dot" />

          Player data
        </div>
      </header>

      {/* ===================================
          SEARCH
      ==================================== */}

      <section className="compare-search-panel">
        <form
          onSubmit={
            handleCompare
          }
        >
          <div className="compare-input-grid">
            <CompareInput
              label="Player 1"
              value={
                playerOneTag
              }
              onChange={
                setPlayerOneTag
              }
              placeholder="BattleTag#1234"
            />

            <div className="compare-versus">
              VS
            </div>

            <CompareInput
              label="Player 2"
              value={
                playerTwoTag
              }
              onChange={
                setPlayerTwoTag
              }
              placeholder="BattleTag#5678"
            />
          </div>

          <div className="compare-search-footer">
            <div className="compare-mode-buttons">
              <ModeButton
                label="All modes"
                active={
                  gamemode ===
                  "all"
                }
                disabled={
                  loading
                }
                onClick={() =>
                  changeGamemode(
                    "all",
                  )
                }
              />

              <ModeButton
                label="Competitive"
                active={
                  gamemode ===
                  "competitive"
                }
                disabled={
                  loading
                }
                onClick={() =>
                  changeGamemode(
                    "competitive",
                  )
                }
              />

              <ModeButton
                label="Quick Play"
                active={
                  gamemode ===
                  "quickplay"
                }
                disabled={
                  loading
                }
                onClick={() =>
                  changeGamemode(
                    "quickplay",
                  )
                }
              />
            </div>

            <button
              className="compare-submit"
              type="submit"
              disabled={
                loading
              }
            >
              <Search
                size={14}
              />

              {loading
                ? "Comparing..."
                : "Compare"}
            </button>
          </div>
        </form>
      </section>

      {loading && (
        <div className="compare-loading">
          Comparing player
          statistics...
        </div>
      )}

      {error &&
        !loading && (
        <div className="player-error">
          <strong>
            Comparison unavailable
          </strong>

          <span>
            {error}
          </span>
        </div>
      )}

      {playerOne &&
        playerTwo &&
        !loading && (
        <ComparisonResults
          playerOne={
            playerOne
          }
          playerTwo={
            playerTwo
          }
          gamemode={
            gamemode
          }
        />
      )}

      {!playerOne &&
        !playerTwo &&
        !loading &&
        !error && (
          <div className="player-empty">
            <UsersRound
              size={26}
            />

            <h2>
              Compare two players
            </h2>

            <p>
              Enter two BattleTags
              to compare ranks,
              roles and hero
              performance.
            </p>
          </div>
        )}
    </div>
  );
}

/* ========================================
   INPUT
======================================== */

type CompareInputProps = {
  label: string;

  value: string;

  placeholder: string;

  onChange:
    (value: string) => void;
};

function CompareInput({
  label,
  value,
  placeholder,
  onChange,
}: CompareInputProps) {
  return (
    <label className="compare-player-input">
      <span>
        {label}
      </span>

      <div>
        <UserRound
          size={15}
        />

        <input
          type="text"
          value={
            value
          }
          placeholder={
            placeholder
          }
          onChange={(
            event,
          ) =>
            onChange(
              event.target.value,
            )
          }
        />
      </div>
    </label>
  );
}

/* ========================================
   MODE BUTTON
======================================== */

type ModeButtonProps = {
  label: string;

  active: boolean;

  disabled: boolean;

  onClick:
    () => void;
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
          ? "compare-mode-button active"
          : "compare-mode-button"
      }
      disabled={
        disabled
      }
      onClick={
        onClick
      }
    >
      {label}
    </button>
  );
}

/* ========================================
   RESULTS
======================================== */

type ComparisonResultsProps = {
  playerOne:
    ComparisonPlayer;

  playerTwo:
    ComparisonPlayer;

  gamemode:
    PlayerGamemode;
};

function ComparisonResults({
  playerOne,
  playerTwo,
  gamemode,
}: ComparisonResultsProps) {
  const firstSummary =
    playerOne.data.summary;

  const secondSummary =
    playerTwo.data.summary;

  const firstStats =
    playerOne.data.stats;

  const secondStats =
    playerTwo.data.stats;

  const [
    sharedHeroSort,
    setSharedHeroSort,
  ] =
    useState<SharedHeroSort>(
      "time",
    );

  const sharedHeroes =
    useMemo(
      () =>
        getSharedHeroes(
          firstStats.heroes,
          secondStats.heroes,
          sharedHeroSort,
        ),
      [
        firstStats.heroes,
        secondStats.heroes,
        sharedHeroSort,
      ],
    );

  const biggestWinRateGap =
    useMemo(
      () =>
        [...sharedHeroes].sort(
          (a, b) =>
            getHeroWinRateGap(
              b,
            ) -
            getHeroWinRateGap(
              a,
            ),
        )[0],
      [
        sharedHeroes,
      ],
    );

  const mostPlayedSharedHero =
    useMemo(
      () =>
        [...sharedHeroes].sort(
          (a, b) =>
            getCombinedTime(
              b,
            ) -
            getCombinedTime(
              a,
            ),
        )[0],
      [
        sharedHeroes,
      ],
    );

  const firstRanks =
    firstSummary
      .competitive
      ?.pc;

  const secondRanks =
    secondSummary
      .competitive
      ?.pc;

  return (
    <section className="compare-results">
      <div className="compare-mode-status">
        {formatGamemode(
          gamemode,
        )}{" "}
        statistics
      </div>

      {/* ===================================
          PLAYERS
      ==================================== */}

      <div className="compare-player-heads">
        <PlayerIdentity
          username={
            firstSummary.username
          }
          battleTag={
            playerOne.battleTag
          }
          avatar={
            firstSummary.avatar
          }
        />

        <span className="compare-head-vs">
          VS
        </span>

        <PlayerIdentity
          username={
            secondSummary.username
          }
          battleTag={
            playerTwo.battleTag
          }
          avatar={
            secondSummary.avatar
          }
        />
      </div>

      {/* ===================================
          OVERVIEW
      ==================================== */}

      <ComparisonSectionHeading
        eyebrow="OVERVIEW"
        title="Career comparison"
      />

      <div className="compare-table">
        <ComparisonHeader
          first={
            firstSummary.username
          }
          second={
            secondSummary.username
          }
        />

        <ComparisonRow
          label="Win rate"
          first={`${firstStats.general.winrate.toFixed(
            2,
          )}%`}
          second={`${secondStats.general.winrate.toFixed(
            2,
          )}%`}
          firstValue={
            firstStats.general
              .winrate
          }
          secondValue={
            secondStats.general
              .winrate
          }
        />

        <ComparisonRow
          label="Games"
          first={
            String(
              firstStats.general
                .games_played,
            )
          }
          second={
            String(
              secondStats.general
                .games_played,
            )
          }
          firstValue={
            firstStats.general
              .games_played
          }
          secondValue={
            secondStats.general
              .games_played
          }
        />

        <ComparisonRow
          label="Wins"
          first={
            String(
              firstStats.general
                .games_won,
            )
          }
          second={
            String(
              secondStats.general
                .games_won,
            )
          }
          firstValue={
            firstStats.general
              .games_won
          }
          secondValue={
            secondStats.general
              .games_won
          }
        />

        <ComparisonRow
          label="KDA"
          first={
            firstStats.general
              .kda
              .toFixed(2)
          }
          second={
            secondStats.general
              .kda
              .toFixed(2)
          }
          firstValue={
            firstStats.general
              .kda
          }
          secondValue={
            secondStats.general
              .kda
          }
        />

        <ComparisonRow
          label="Time played"
          first={
            formatDuration(
              firstStats.general
                .time_played,
            )
          }
          second={
            formatDuration(
              secondStats.general
                .time_played,
            )
          }
          firstValue={
            firstStats.general
              .time_played
          }
          secondValue={
            secondStats.general
              .time_played
          }
        />
      </div>

      {/* ===================================
          RANKS
      ==================================== */}

      <ComparisonSectionHeading
        eyebrow="COMPETITIVE"
        title="PC ranks"
        detail={
          firstRanks?.season
            ? `Season ${firstRanks.season}`
            : undefined
        }
      />

      <div className="compare-ranks">
        <RankComparisonRow
          label="Tank"
          icon={
            <Shield
              size={17}
            />
          }
          first={
            firstRanks?.tank
          }
          second={
            secondRanks?.tank
          }
        />

        <RankComparisonRow
          label="Damage"
          icon={
            <Swords
              size={17}
            />
          }
          first={
            firstRanks?.damage
          }
          second={
            secondRanks?.damage
          }
        />

        <RankComparisonRow
          label="Support"
          icon={
            <HeartPulse
              size={17}
            />
          }
          first={
            firstRanks?.support
          }
          second={
            secondRanks?.support
          }
        />
      </div>

      {/* ===================================
          ROLE PERFORMANCE
      ==================================== */}

      <ComparisonSectionHeading
        eyebrow="ROLE PERFORMANCE"
        title="Performance by role"
      />

      <div className="compare-role-list">
        <RoleComparison
          label="Tank"
          icon={
            <Shield
              size={17}
            />
          }
          firstName={
            firstSummary.username
          }
          secondName={
            secondSummary.username
          }
          first={
            firstStats.roles?.tank
          }
          second={
            secondStats.roles?.tank
          }
        />

        <RoleComparison
          label="Damage"
          icon={
            <Swords
              size={17}
            />
          }
          firstName={
            firstSummary.username
          }
          secondName={
            secondSummary.username
          }
          first={
            firstStats.roles?.damage
          }
          second={
            secondStats.roles?.damage
          }
        />

        <RoleComparison
          label="Support"
          icon={
            <HeartPulse
              size={17}
            />
          }
          firstName={
            firstSummary.username
          }
          secondName={
            secondSummary.username
          }
          first={
            firstStats.roles?.support
          }
          second={
            secondStats.roles?.support
          }
        />
      </div>

      {/* ===================================
          SHARED HERO SUMMARY
      ==================================== */}

      <ComparisonSectionHeading
        eyebrow="SHARED HEROES"
        title="Heroes played by both"
        detail={`${sharedHeroes.length} shared heroes`}
      />

      <div className="compare-shared-summary">
        <CompareHighlight
          icon={
            <UsersRound
              size={16}
            />
          }
          label="Shared heroes"
          value={
            String(
              sharedHeroes.length,
            )
          }
        />

        <CompareHighlight
          icon={
            <Trophy
              size={16}
            />
          }
          label="Biggest WR gap"
          value={
            biggestWinRateGap
              ? getSharedHeroGapLabel(
                  biggestWinRateGap,
                  firstSummary.username,
                  secondSummary.username,
                )
              : "—"
          }
        />

        <CompareHighlight
          icon={
            <Clock3
              size={16}
            />
          }
          label="Most played together"
          value={
            mostPlayedSharedHero
              ? getHeroName(
                  mostPlayedSharedHero.heroId,
                )
              : "—"
          }
        />

        <CompareHighlight
          icon={
            <Activity
              size={16}
            />
          }
          label="Combined playtime"
          value={
            mostPlayedSharedHero
              ? formatDuration(
                  getCombinedTime(
                    mostPlayedSharedHero,
                  ),
                )
              : "—"
          }
        />
      </div>

      {/* ===================================
          SHARED HERO SORT
      ==================================== */}

      <div className="compare-shared-toolbar">
        <span>
          Sort shared heroes by
        </span>

        <div className="compare-shared-sort-buttons">
          <SharedSortButton
            label="Combined time"
            active={
              sharedHeroSort ===
              "time"
            }
            onClick={() =>
              setSharedHeroSort(
                "time",
              )
            }
          />

          <SharedSortButton
            label="Win rate gap"
            active={
              sharedHeroSort ===
              "gap"
            }
            onClick={() =>
              setSharedHeroSort(
                "gap",
              )
            }
          />

          <SharedSortButton
            label="Games"
            active={
              sharedHeroSort ===
              "games"
            }
            onClick={() =>
              setSharedHeroSort(
                "games",
              )
            }
          />
        </div>
      </div>

      {/* ===================================
          SHARED HEROES
      ==================================== */}

      {sharedHeroes.length >
      0 ? (
        <div className="compare-shared-heroes-list">
          {sharedHeroes
            .slice(
              0,
              10,
            )
            .map(
              (item) => (
                <SharedHeroCard
                  key={
                    item.heroId
                  }
                  item={
                    item
                  }
                  firstName={
                    firstSummary.username
                  }
                  secondName={
                    secondSummary.username
                  }
                />
              ),
            )}
        </div>
      ) : (
        <div className="compare-no-shared">
          No shared hero data
          available.
        </div>
      )}
    </section>
  );
}

/* ========================================
   PLAYER IDENTITY
======================================== */

type PlayerIdentityProps = {
  username: string;

  battleTag: string;

  avatar:
    string | null;
};

function PlayerIdentity({
  username,
  battleTag,
  avatar,
}: PlayerIdentityProps) {
  return (
    <div className="compare-player-head">
      <div className="compare-avatar">
        {avatar ? (
          <img
            src={
              avatar
            }
            alt={
              username
            }
          />
        ) : (
          <UserRound
            size={24}
          />
        )}
      </div>

      <div>
        <strong>
          {username}
        </strong>

        <span>
          {battleTag}
        </span>
      </div>
    </div>
  );
}

/* ========================================
   SECTION HEADING
======================================== */

type ComparisonSectionHeadingProps = {
  eyebrow: string;

  title: string;

  detail?: string;
};

function ComparisonSectionHeading({
  eyebrow,
  title,
  detail,
}: ComparisonSectionHeadingProps) {
  return (
    <div className="compare-section-heading">
      <div>
        <span className="panel-eyebrow">
          {eyebrow}
        </span>

        <h2>
          {title}
        </h2>

        {detail && (
          <p>
            {detail}
          </p>
        )}
      </div>
    </div>
  );
}

/* ========================================
   GENERAL TABLE
======================================== */

function ComparisonHeader({
  first,
  second,
}: {
  first: string;

  second: string;
}) {
  return (
    <div className="compare-row compare-row-header">
      <span>
        Metric
      </span>

      <span>
        {first}
      </span>

      <span>
        {second}
      </span>
    </div>
  );
}

type ComparisonRowProps = {
  label: string;

  first: string;

  second: string;

  firstValue: number;

  secondValue: number;
};

function ComparisonRow({
  label,
  first,
  second,
  firstValue,
  secondValue,
}: ComparisonRowProps) {
  const firstWins =
    firstValue >
    secondValue;

  const secondWins =
    secondValue >
    firstValue;

  return (
    <div className="compare-row">
      <span>
        {label}
      </span>

      <strong
        className={
          firstWins
            ? "compare-best"
            : ""
        }
      >
        {first}
      </strong>

      <strong
        className={
          secondWins
            ? "compare-best"
            : ""
        }
      >
        {second}
      </strong>
    </div>
  );
}

/* ========================================
   RANK COMPARISON
======================================== */

type RankComparisonRowProps = {
  label: string;

  icon:
    React.ReactNode;

  first?:
    PlayerRank | null;

  second?:
    PlayerRank | null;
};

function RankComparisonRow({
  label,
  icon,
  first,
  second,
}: RankComparisonRowProps) {
  return (
    <div className="compare-rank-row">
      <div className="compare-rank-role">
        {icon}

        <strong>
          {label}
        </strong>
      </div>

      <RankDisplay
        rank={
          first
        }
      />

      <RankDisplay
        rank={
          second
        }
      />
    </div>
  );
}

function RankDisplay({
  rank,
}: {
  rank?:
    PlayerRank | null;
}) {
  if (!rank) {
    return (
      <div className="compare-rank-display unranked">
        <strong>
          Unranked
        </strong>
      </div>
    );
  }

  return (
    <div className="compare-rank-display">
      <div className="compare-rank-icons">
        {rank.rank_icon && (
          <img
            src={
              rank.rank_icon
            }
            alt=""
          />
        )}

        {rank.tier_icon && (
          <img
            src={
              rank.tier_icon
            }
            alt=""
          />
        )}
      </div>

      <strong>
        {formatRank(
          rank,
        )}
      </strong>
    </div>
  );
}

/* ========================================
   ROLE PERFORMANCE
======================================== */

type RoleComparisonProps = {
  label: string;

  icon:
    React.ReactNode;

  firstName: string;

  secondName: string;

  first?:
    PlayerStatBlock;

  second?:
    PlayerStatBlock;
};

function RoleComparison({
  label,
  icon,
  firstName,
  secondName,
  first,
  second,
}: RoleComparisonProps) {
  return (
    <div className="compare-role-card">
      <div className="compare-role-card-header">
        <div>
          {icon}

          <strong>
            {label}
          </strong>
        </div>

        <div className="compare-role-player-names">
          <span>
            {firstName}
          </span>

          <span>
            {secondName}
          </span>
        </div>
      </div>

      {!first &&
      !second ? (
        <div className="compare-role-no-data">
          No role data
          available.
        </div>
      ) : (
        <div className="compare-role-metrics">
          <RoleMetric
            label="Win rate"
            first={
              first
                ? `${first.winrate.toFixed(
                    2,
                  )}%`
                : "—"
            }
            second={
              second
                ? `${second.winrate.toFixed(
                    2,
                  )}%`
                : "—"
            }
            firstValue={
              first?.winrate
            }
            secondValue={
              second?.winrate
            }
          />

          <RoleMetric
            label="Games"
            first={
              first
                ? String(
                    first.games_played,
                  )
                : "—"
            }
            second={
              second
                ? String(
                    second.games_played,
                  )
                : "—"
            }
            firstValue={
              first?.games_played
            }
            secondValue={
              second?.games_played
            }
          />

          <RoleMetric
            label="Wins"
            first={
              first
                ? String(
                    first.games_won,
                  )
                : "—"
            }
            second={
              second
                ? String(
                    second.games_won,
                  )
                : "—"
            }
            firstValue={
              first?.games_won
            }
            secondValue={
              second?.games_won
            }
          />

          <RoleMetric
            label="KDA"
            first={
              first
                ? first.kda.toFixed(
                    2,
                  )
                : "—"
            }
            second={
              second
                ? second.kda.toFixed(
                    2,
                  )
                : "—"
            }
            firstValue={
              first?.kda
            }
            secondValue={
              second?.kda
            }
          />

          <RoleMetric
            label="Time"
            first={
              first
                ? formatDuration(
                    first.time_played,
                  )
                : "—"
            }
            second={
              second
                ? formatDuration(
                    second.time_played,
                  )
                : "—"
            }
            firstValue={
              first?.time_played
            }
            secondValue={
              second?.time_played
            }
          />
        </div>
      )}
    </div>
  );
}

type RoleMetricProps = {
  label: string;

  first: string;

  second: string;

  firstValue?:
    number;

  secondValue?:
    number;
};

function RoleMetric({
  label,
  first,
  second,
  firstValue,
  secondValue,
}: RoleMetricProps) {
  const firstWins =
    firstValue !==
      undefined &&
    secondValue !==
      undefined &&
    firstValue >
      secondValue;

  const secondWins =
    firstValue !==
      undefined &&
    secondValue !==
      undefined &&
    secondValue >
      firstValue;

  return (
    <div className="compare-role-metric">
      <span>
        {label}
      </span>

      <strong
        className={
          firstWins
            ? "compare-best"
            : ""
        }
      >
        {first}
      </strong>

      <strong
        className={
          secondWins
            ? "compare-best"
            : ""
        }
      >
        {second}
      </strong>
    </div>
  );
}

/* ========================================
   HIGHLIGHT
======================================== */

type CompareHighlightProps = {
  icon:
    React.ReactNode;

  label: string;

  value: string;
};

function CompareHighlight({
  icon,
  label,
  value,
}: CompareHighlightProps) {
  return (
    <div className="compare-highlight-card">
      <div>
        {icon}
      </div>

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>
    </div>
  );
}

/* ========================================
   SHARED SORT
======================================== */

type SharedSortButtonProps = {
  label: string;

  active: boolean;

  onClick:
    () => void;
};

function SharedSortButton({
  label,
  active,
  onClick,
}: SharedSortButtonProps) {
  return (
    <button
      type="button"
      className={
        active
          ? "compare-shared-sort-button active"
          : "compare-shared-sort-button"
      }
      onClick={
        onClick
      }
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
   SHARED HERO CARD
======================================== */

type SharedHeroCardProps = {
  item:
    SharedHero;

  firstName: string;

  secondName: string;
};

function SharedHeroCard({
  item,
  firstName,
  secondName,
}: SharedHeroCardProps) {
  const {
    heroId,
    first,
    second,
  } = item;

  const hero =
    heroes.find(
      (entry) =>
        entry.id ===
        heroId,
    );

  const heroName =
    hero?.name ??
    formatHeroName(
      heroId,
    );

  const firstGapWins =
    first.winrate >
    second.winrate;

  const secondGapWins =
    second.winrate >
    first.winrate;

  return (
    <article className="compare-shared-hero-card">
      <div className="compare-shared-hero-header">
        <div className="compare-hero-identity">
          <div className="compare-hero-avatar">
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
              <UserRound
                size={16}
              />
            )}
          </div>

          <div>
            <strong>
              {heroName}
            </strong>

            <span>
              {formatDuration(
                getCombinedTime(
                  item,
                ),
              )}{" "}
              combined
            </span>
          </div>
        </div>

        <div className="compare-shared-gap">
          <span>
            WIN RATE GAP
          </span>

          <strong>
            {Math.abs(
              first.winrate -
                second.winrate,
            ).toFixed(
              1,
            )}
            %
          </strong>
        </div>
      </div>

      <div className="compare-shared-table">
        <div className="compare-shared-row compare-shared-row-header">
          <span>
            Metric
          </span>

          <span>
            {firstName}
          </span>

          <span>
            {secondName}
          </span>
        </div>

        <SharedMetricRow
          label="Win rate"
          first={`${first.winrate.toFixed(
            2,
          )}%`}
          second={`${second.winrate.toFixed(
            2,
          )}%`}
          firstBetter={
            firstGapWins
          }
          secondBetter={
            secondGapWins
          }
        />

        <SharedMetricRow
          label="Time"
          first={
            formatDuration(
              first.time_played,
            )
          }
          second={
            formatDuration(
              second.time_played,
            )
          }
          firstBetter={
            first.time_played >
            second.time_played
          }
          secondBetter={
            second.time_played >
            first.time_played
          }
        />

        <SharedMetricRow
          label="Games"
          first={
            String(
              first.games_played,
            )
          }
          second={
            String(
              second.games_played,
            )
          }
          firstBetter={
            first.games_played >
            second.games_played
          }
          secondBetter={
            second.games_played >
            first.games_played
          }
        />

        <SharedMetricRow
          label="KDA"
          first={
            first.kda.toFixed(
              2,
            )
          }
          second={
            second.kda.toFixed(
              2,
            )
          }
          firstBetter={
            first.kda >
            second.kda
          }
          secondBetter={
            second.kda >
            first.kda
          }
        />

        <SharedMetricRow
          label="Eliminations"
          first={
            formatNumber(
              first.total
                .eliminations,
            )
          }
          second={
            formatNumber(
              second.total
                .eliminations,
            )
          }
          firstBetter={
            first.total
              .eliminations >
            second.total
              .eliminations
          }
          secondBetter={
            second.total
              .eliminations >
            first.total
              .eliminations
          }
        />

        <SharedMetricRow
          label="Deaths"
          first={
            formatNumber(
              first.total
                .deaths,
            )
          }
          second={
            formatNumber(
              second.total
                .deaths,
            )
          }
          /*
            For deaths, lower is
            considered better.
          */
          firstBetter={
            first.total.deaths <
            second.total.deaths
          }
          secondBetter={
            second.total.deaths <
            first.total.deaths
          }
        />
      </div>
    </article>
  );
}

type SharedMetricRowProps = {
  label: string;

  first: string;

  second: string;

  firstBetter:
    boolean;

  secondBetter:
    boolean;
};

function SharedMetricRow({
  label,
  first,
  second,
  firstBetter,
  secondBetter,
}: SharedMetricRowProps) {
  return (
    <div className="compare-shared-row">
      <span>
        {label}
      </span>

      <strong
        className={
          firstBetter
            ? "compare-best"
            : ""
        }
      >
        {first}
      </strong>

      <strong
        className={
          secondBetter
            ? "compare-best"
            : ""
        }
      >
        {second}
      </strong>
    </div>
  );
}

/* ========================================
   SHARED HEROES
======================================== */

function getSharedHeroes(
  first:
    Record<
      string,
      PlayerStatBlock
    >,

  second:
    Record<
      string,
      PlayerStatBlock
    >,

  sort:
    SharedHeroSort,
): SharedHero[] {
  const shared =
    Object.keys(
      first,
    )
      .filter(
        (heroId) =>
          second[
            heroId
          ] &&
          first[
            heroId
          ].time_played >
            0 &&
          second[
            heroId
          ].time_played >
            0,
      )
      .map(
        (heroId) => ({
          heroId,

          first:
            first[
              heroId
            ],

          second:
            second[
              heroId
            ],
        }),
      );

  return shared.sort(
    (a, b) => {
      switch (sort) {
        case "gap":
          return (
            getHeroWinRateGap(
              b,
            ) -
            getHeroWinRateGap(
              a,
            )
          );

        case "games":
          return (
            getCombinedGames(
              b,
            ) -
            getCombinedGames(
              a,
            )
          );

        case "time":
        default:
          return (
            getCombinedTime(
              b,
            ) -
            getCombinedTime(
              a,
            )
          );
      }
    },
  );
}

/* ========================================
   HELPERS
======================================== */

function getCombinedTime(
  item:
    SharedHero,
) {
  return (
    item.first
      .time_played +
    item.second
      .time_played
  );
}

function getCombinedGames(
  item:
    SharedHero,
) {
  return (
    item.first
      .games_played +
    item.second
      .games_played
  );
}

function getHeroWinRateGap(
  item:
    SharedHero,
) {
  return Math.abs(
    item.first
      .winrate -
    item.second
      .winrate,
  );
}

function getSharedHeroGapLabel(
  item:
    SharedHero,

  firstName:
    string,

  secondName:
    string,
) {
  const name =
    getHeroName(
      item.heroId,
    );

  const gap =
    getHeroWinRateGap(
      item,
    ).toFixed(
      1,
    );

  if (
    item.first.winrate ===
    item.second.winrate
  ) {
    return `${name} · Tie`;
  }

  const winner =
    item.first.winrate >
    item.second.winrate
      ? firstName
      : secondName;

  return `${name} · +${gap}% ${winner}`;
}

function getHeroName(
  heroId:
    string,
) {
  const hero =
    heroes.find(
      (entry) =>
        entry.id ===
        heroId,
    );

  return (
    hero?.name ??
    formatHeroName(
      heroId,
    )
  );
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
  rank:
    PlayerRank,
) {
  const division =
    rank.division
      .charAt(0)
      .toUpperCase() +
    rank.division.slice(
      1,
    );

  return `${division} ${rank.tier}`;
}

function formatDuration(
  seconds:
    number,
) {
  if (!seconds) {
    return "0m";
  }

  const hours =
    Math.floor(
      seconds /
        3600,
    );

  const minutes =
    Math.floor(
      (seconds %
        3600) /
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
  value:
    number,
) {
  return new Intl.NumberFormat(
    "en-US",
  ).format(
    Math.round(
      value,
    ),
  );
}

function formatHeroName(
  heroId:
    string,
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

export default PlayerCompare;