import {
  Info,
  LoaderCircle,
  Search,
  ShieldCheck,
  Swords,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

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

import type {
  Hero,
} from "../types/hero";

import "./CounterPage.css";

type CounterPageProps = {
  onOpenHero:
    (hero: Hero) => void;
};

function CounterPage({
  onOpenHero,
}: CounterPageProps) {
  const [
    search,
    setSearch,
  ] = useState("");

  const [
    selectedHeroId,
    setSelectedHeroId,
  ] = useState(
    heroes[0]?.id ??
      "ana",
  );

  const [
    data,
    setData,
  ] =
    useState<CounterwatchHeroStats | null>(
      null,
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

  const selectedHero =
    heroes.find(
      (hero) =>
        hero.id ===
        selectedHeroId,
    ) ??
    heroes[0] ??
    null;

  const availableHeroes =
    useMemo(
      () =>
        heroes
          .filter(
            (hero) =>
              hero.name
                .toLowerCase()
                .includes(
                  search
                    .trim()
                    .toLowerCase(),
                ),
          )
          .sort(
            (a, b) =>
              a.name.localeCompare(
                b.name,
              ),
          ),
      [search],
    );

  useEffect(() => {
    let cancelled =
      false;

    setLoading(
      true,
    );

    setError(
      null,
    );

    setData(
      null,
    );

    fetchCounterwatchHero(
      selectedHeroId,
    )
      .then(
        (nextData) => {
          if (
            !cancelled
          ) {
            setData(
              nextData,
            );
          }
        },
      )
      .catch(
        (reason) => {
          if (
            !cancelled
          ) {
            setError(
              reason instanceof
              Error
                ? reason.message
                : "Unable to load Counterwatch data.",
            );
          }
        },
      )
      .finally(
        () => {
          if (
            !cancelled
          ) {
            setLoading(
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
    selectedHeroId,
  ]);

  return (
    <div className="counter-page global-page counters-v2-page">
      <header className="topbar counter-page-header">
        <div>
          <p className="eyebrow">
            HERO COUNTERS
          </p>

          <h1>
            Counters
          </h1>

          <p className="subtitle">
            Live community matchup data
            sourced from Counterwatch hero
            pages.
          </p>
        </div>

        <div className="counter-source-stack">
          <div className="live-status">
            <span className="status-dot" />
            Matchup data
          </div>

          <div className="counter-source-meta">
            COUNTERWATCH · ON DEMAND
          </div>
        </div>
      </header>

      <section className="counter-explainer">
        <div className="counter-explainer-item">
          <TrendingUp size={16} />

          <div>
            <strong>
              Counter rating
            </strong>

            <span>
              Relative matchup score from
              duel and teamfight outcomes.
              Higher is stronger.
            </span>
          </div>
        </div>

        <div className="counter-explainer-item">
          <TrendingDown size={16} />

          <div>
            <strong>
              Fight swing
            </strong>

            <span>
              Approximate effect versus an
              otherwise even fight when
              Counterwatch provides it.
            </span>
          </div>
        </div>

        <div className="counter-explainer-item">
          <ShieldCheck size={16} />

          <div>
            <strong>
              Confidence
            </strong>

            <span>
              Based on contributing
              community players. This is
              not Blizzard data.
            </span>
          </div>
        </div>
      </section>

      <section className="counter-browser">
        <aside className="counter-hero-picker">
          <div className="counter-picker-header">
            <div>
              <span className="panel-eyebrow">
                SELECT HERO
              </span>

              <h2>
                Hero matchup
              </h2>
            </div>
          </div>

          <label className="counter-search">
            <Search size={15} />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search hero..."
            />
          </label>

          <div className="counter-hero-list">
            {availableHeroes.map(
              (hero) => (
                <button
                  key={hero.id}
                  type="button"
                  className={
                    selectedHero?.id ===
                    hero.id
                      ? "counter-hero-button active"
                      : "counter-hero-button"
                  }
                  onClick={() =>
                    setSelectedHeroId(
                      hero.id,
                    )
                  }
                >
                  <img
                    src={hero.image}
                    alt={hero.name}
                  />

                  <div>
                    <strong>
                      {hero.name}
                    </strong>

                    <span>
                      {hero.role}
                    </span>
                  </div>
                </button>
              ),
            )}
          </div>
        </aside>

        <div className="counter-results">
          {selectedHero && (
            <section className="counter-selected-hero">
              <div className="counter-selected-main">
                <img
                  src={
                    selectedHero.image
                  }
                  alt={
                    selectedHero.name
                  }
                />

                <div>
                  <span className="panel-eyebrow">
                    SELECTED HERO
                  </span>

                  <h2>
                    {selectedHero.name}
                  </h2>

                  <p>
                    {data
                      ? `${data.role ?? selectedHero.role} · ${data.matches?.toLocaleString() ?? "—"} tracked matches · ${data.winRate ?? "—"}% WR`
                      : selectedHero.role}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="counter-open-hero"
                onClick={() =>
                  onOpenHero(
                    selectedHero,
                  )
                }
              >
                Open hero
              </button>
            </section>
          )}

          {loading && (
            <section className="counter-empty">
              <LoaderCircle
                size={26}
                className="refresh-spinning"
              />

              <h2>
                Loading Counterwatch data
              </h2>
            </section>
          )}

          {!loading &&
            error && (
            <section className="counter-empty">
              <Swords size={26} />

              <h2>
                Matchup data unavailable
              </h2>

              <p>
                {error}
              </p>
            </section>
          )}

          {!loading &&
            !error &&
            data && (
            <>
              <div className="counter-columns">
                <CounterGroup
                  title="Countered by"
                  eyebrow="HARDEST MATCHUPS"
                  entries={
                    data.counters
                  }
                />

                <CounterGroup
                  title="Strong against"
                  eyebrow="EASIEST MATCHUPS"
                  entries={
                    data.strongAgainst
                  }
                />
              </div>

              <section className="counter-method-note">
                <Info size={16} />

                <div>
                  <strong>
                    How to read this page
                  </strong>

                  <p>
                    Counterwatch says its
                    counter ratings are built
                    from one-on-one duel and
                    teamfight outcomes rather
                    than match win rate.
                    Matchups require at least
                    50 contributing players
                    before appearing.
                  </p>

                  {data.updatedAt && (
                    <p>
                      Source updated{" "}
                      {data.updatedAt}.
                    </p>
                  )}
                </div>
              </section>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

type CounterGroupProps = {
  title: string;
  eyebrow: string;

  entries:
    CounterwatchMatchup[];
};

function CounterGroup({
  title,
  eyebrow,
  entries,
}: CounterGroupProps) {
  return (
    <article className="counter-group detail-panel">
      <div className="panel-heading">
        <div>
          <span className="panel-eyebrow">
            {eyebrow}
          </span>

          <h2>
            {title}
          </h2>
        </div>
      </div>

      {entries.length > 0 ? (
        <div className="counter-matchup-list">
          {entries.map(
            (matchup) => {
              const opponent =
                heroes.find(
                  (hero) =>
                    hero.id ===
                    matchup.opponentId,
                );

              return (
                <div
                  className="counter-matchup-row"
                  key={`${matchup.heroId}-${matchup.opponentId}`}
                >
                  <div className="counter-opponent">
                    {opponent && (
                      <img
                        src={
                          opponent.image
                        }
                        alt={
                          opponent.name
                        }
                      />
                    )}

                    <div>
                      <strong>
                        {opponent?.name ??
                          matchup.opponentName}
                      </strong>

                      <span>
                        {matchup.opponentRole ??
                          "Hero"}
                        {matchup.contributors
                          ? ` · ${matchup.contributors.toLocaleString()} players`
                          : ""}
                      </span>
                    </div>
                  </div>

                  <div className="counter-metrics">
                    <div>
                      <span>
                        COUNTER RATING
                      </span>

                      <strong className="positive">
                        +{matchup.counterRating.toFixed(
                          1,
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        FIGHT SWING
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
                        CONFIDENCE
                      </span>

                      <strong>
                        {formatConfidence(
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
      ) : (
        <div className="counter-group-empty">
          No matchup entries.
        </div>
      )}
    </article>
  );
}

function formatConfidence(
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

export default CounterPage;


