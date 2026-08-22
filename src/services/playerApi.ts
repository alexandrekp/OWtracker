import type {
  PlayerData,
  PlayerStatsSummary,
  PlayerSummary,
} from "../types/player";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://worker.akidneyperks.workers.dev";

export type PlayerGamemode =
  | "all"
  | "competitive"
  | "quickplay";

export type PlayerPlatform =
  | "pc"
  | "console";

export type PlayerCareerCategory =
  Record<
    string,
    number | string | null
  >;

export type PlayerCareerHeroStats =
  Partial<
    Record<
      | "assists"
      | "average"
      | "best"
      | "combat"
      | "game"
      | "hero_specific",
      PlayerCareerCategory
    >
  >;

export type PlayerCareerStats =
  Record<
    string,
    PlayerCareerHeroStats | null
  >;

type PlayerApiErrorOptions = {
  status: number;
  retryAfter?: number | null;
  nextCheckAt?: number | null;
  checkCount?: number | null;
};

export class PlayerApiError extends Error {
  status: number;
  retryAfter: number | null;
  nextCheckAt: number | null;
  checkCount: number | null;

  constructor(
    message: string,
    options: PlayerApiErrorOptions,
  ) {
    super(message);
    this.name = "PlayerApiError";
    this.status = options.status;
    this.retryAfter =
      options.retryAfter ?? null;
    this.nextCheckAt =
      options.nextCheckAt ?? null;
    this.checkCount =
      options.checkCount ?? null;
  }
}

function normalizeBattleTag(
  battleTag: string,
) {
  return battleTag
    .trim()
    .replace("#", "-");
}

type ErrorPayload = {
  error?: string;
  retry_after?: number;
  next_check_at?: number;
  check_count?: number;
};

async function fetchJson<T>(
  url: string,
): Promise<T> {
  const response =
    await fetch(url);

  if (response.ok) {
    return (
      await response.json()
    ) as T;
  }

  let payload: ErrorPayload = {};

  try {
    payload =
      await response.json();
  } catch {
    // Keep an empty payload.
  }

  const options = {
    status: response.status,
    retryAfter:
      payload.retry_after,
    nextCheckAt:
      payload.next_check_at,
    checkCount:
      payload.check_count,
  };

  if (response.status === 404) {
    throw new PlayerApiError(
      payload.error ??
        "Player data is currently unavailable.",
      options,
    );
  }

  if (response.status === 403) {
    throw new PlayerApiError(
      "This profile is private.",
      options,
    );
  }

  if (
    response.status === 429 ||
    response.status === 503
  ) {
    throw new PlayerApiError(
      payload.error ??
        "The player service is temporarily busy. Please try again later.",
      options,
    );
  }

  throw new PlayerApiError(
    payload.error ??
      `Unable to load player data (${response.status}).`,
    options,
  );
}

export async function fetchPlayerSummary(
  battleTag: string,
) {
  const normalized =
    normalizeBattleTag(battleTag);

  if (!normalized) {
    throw new Error(
      "Enter a BattleTag.",
    );
  }

  return fetchJson<PlayerSummary>(
    `${API_BASE_URL}/api/player/${encodeURIComponent(
      normalized,
    )}/summary`,
  );
}

export async function fetchPlayerStats(
  battleTag: string,
  gamemode: PlayerGamemode = "all",
  platform: PlayerPlatform = "pc",
) {
  const normalized =
    normalizeBattleTag(battleTag);

  if (!normalized) {
    throw new Error(
      "Enter a BattleTag.",
    );
  }

  const params =
    new URLSearchParams();

  if (gamemode !== "all") {
    params.set(
      "gamemode",
      gamemode,
    );
  }

  params.set(
    "platform",
    platform,
  );

  return fetchJson<PlayerStatsSummary>(
    `${API_BASE_URL}/api/player/${encodeURIComponent(
      normalized,
    )}/stats?${params.toString()}`,
  );
}

export async function getPlayerCareer(
  battleTag: string,
  gamemode: Exclude<
    PlayerGamemode,
    "all"
  >,
  platform: PlayerPlatform = "pc",
  hero = "all-heroes",
) {
  const normalized =
    normalizeBattleTag(battleTag);

  if (!normalized) {
    throw new Error(
      "Enter a BattleTag.",
    );
  }

  const params =
    new URLSearchParams({
      gamemode,
      platform,
      hero,
    });

  return fetchJson<PlayerCareerStats>(
    `${API_BASE_URL}/api/player/${encodeURIComponent(
      normalized,
    )}/career?${params.toString()}`,
  );
}

export async function getPlayerData(
  battleTag: string,
  gamemode: PlayerGamemode = "all",
  platform: PlayerPlatform = "pc",
): Promise<PlayerData> {
  const normalized =
    normalizeBattleTag(battleTag);

  if (!normalized) {
    throw new Error(
      "Enter a BattleTag.",
    );
  }

  const [summary, stats] =
    await Promise.all([
      fetchPlayerSummary(
        normalized,
      ),
      fetchPlayerStats(
        normalized,
        gamemode,
        platform,
      ),
    ]);

  /*
    OverFast can return an empty stats payload for a
    platform on which the player has no public career
    data. Do not let the UI try to read
    stats.general.time_played in that case.
  */
  if (
    !stats ||
    !stats.general ||
    typeof stats.general.time_played !==
      "number"
  ) {
    const platformLabel =
      platform === "pc"
        ? "PC"
        : "Console";

    throw new Error(
      `No ${platformLabel} statistics are available for this public profile.`,
    );
  }

  return {
    summary,
    stats,
  };
}
