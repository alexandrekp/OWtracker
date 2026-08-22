import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Database,
} from "lucide-react";

import "./DataStatus.css";

type DataStatusSection =
  | "stats"
  | "heroes"
  | "players"
  | "perks";

type DataStatusProps = {
  section: DataStatusSection;
};

type CachedDataset = {
  updatedAt?: number;
};

const BLIZZARD_CACHE_PREFIX =
  "owtracker.blizzardStats";

const HEROES_CACHE_KEY =
  "owtracker.blizzardStats.Europe.All.All";

const FRESH_WINDOW =
  30 * 60 * 1000;

function DataStatus({
  section,
}: DataStatusProps) {
  const [
    now,
    setNow,
  ] = useState(
    () => Date.now(),
  );

  useEffect(() => {
    const timer =
      window.setInterval(
        () => {
          setNow(
            Date.now(),
          );
        },
        60 * 1000,
      );

    return () =>
      window.clearInterval(
        timer,
      );
  }, []);

  const blizzardUpdatedAt =
    useMemo(
      () =>
        section === "heroes"
          ? readCacheTimestamp(
              HEROES_CACHE_KEY,
            )
          : section === "stats"
            ? readLatestBlizzardCacheTimestamp()
            : null,
      [
        section,
        now,
      ],
    );

  if (
    section === "players"
  ) {
    return (
      <StatusBar
        source="OVERFAST"
        state="ON DEMAND"
        detail="Player profiles are fetched when searched."
        tone="neutral"
      />
    );
  }

  if (
    section === "perks"
  ) {
    return (
      <StatusBar
        source="COMMUNITY DATA"
        state="STATIC"
        detail="Perk popularity dataset."
        tone="neutral"
      />
    );
  }

  if (
    blizzardUpdatedAt === null
  ) {
    return (
      <StatusBar
        source="BLIZZARD"
        state="WAITING"
        detail="No cached Blizzard dataset yet."
        tone="neutral"
      />
    );
  }

  const age =
    Math.max(
      0,
      now -
        blizzardUpdatedAt,
    );

  const isFresh =
    age <= FRESH_WINDOW;

  return (
    <StatusBar
      source="BLIZZARD"
      state={
        isFresh
          ? "FRESH"
          : "CACHED"
      }
      detail={`Updated ${formatAge(age)}.`}
      tone={
        isFresh
          ? "fresh"
          : "cached"
      }
    />
  );
}

type StatusBarProps = {
  source: string;
  state: string;
  detail: string;
  tone:
    | "fresh"
    | "cached"
    | "neutral";
};

function StatusBar({
  source,
  state,
  detail,
  tone,
}: StatusBarProps) {
  return (
    <div
      className={`data-status data-status-${tone}`}
      title={detail}
    >
      <div className="data-status-source">
        <Database size={13} />

        <span>
          {source}
        </span>
      </div>

      <span
        className="data-status-divider"
        aria-hidden="true"
      />

      <span className="data-status-state">
        <i aria-hidden="true" />

        {state}
      </span>

      <span className="data-status-detail">
        {detail}
      </span>
    </div>
  );
}

function readLatestBlizzardCacheTimestamp() {
  try {
    let latest:
      number | null =
      null;

    for (
      let index = 0;
      index <
      window.localStorage.length;
      index += 1
    ) {
      const key =
        window.localStorage.key(
          index,
        );

      if (
        !key ||
        !key.startsWith(
          BLIZZARD_CACHE_PREFIX,
        )
      ) {
        continue;
      }

      const timestamp =
        readCacheTimestamp(
          key,
        );

      if (
        timestamp !== null &&
        (
          latest === null ||
          timestamp > latest
        )
      ) {
        latest =
          timestamp;
      }
    }

    return latest;
  } catch {
    return null;
  }
}

function readCacheTimestamp(
  key: string,
) {
  try {
    const raw =
      window.localStorage.getItem(
        key,
      );

    if (!raw) {
      return null;
    }

    const parsed =
      JSON.parse(
        raw,
      ) as CachedDataset;

    if (
      typeof parsed.updatedAt !==
      "number"
    ) {
      return null;
    }

    /*
      OWTracker cache currently stores
      timestamps in milliseconds.

      Keep compatibility with a possible
      seconds timestamp as well.
    */
    return parsed.updatedAt <
      10_000_000_000
      ? parsed.updatedAt *
          1000
      : parsed.updatedAt;
  } catch {
    return null;
  }
}

function formatAge(
  ageMs: number,
) {
  const minutes =
    Math.floor(
      ageMs /
        60_000,
    );

  if (minutes < 1) {
    return "just now";
  }

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours =
    Math.floor(
      minutes / 60,
    );

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days =
    Math.floor(
      hours / 24,
    );

  return `${days}d ago`;
}

export default DataStatus;
