import type {
  PlayerData,
  PlayerStatsSummary,
  PlayerSummary,
} from "../types/player";

const API_URL =
  "https://overfast-api.tekrop.fr";

/* ========================================
   GAMEMODE
======================================== */

export type PlayerGamemode =
  | "all"
  | "competitive"
  | "quickplay";

/* ========================================
   API ERROR
======================================== */

type OverFastErrorResponse = {
  error?: string;

  retry_after?: number;

  next_check_at?: number;

  check_count?: number;
};

export class PlayerApiError extends Error {
  status: number;

  retryAfter:
    number | null;

  nextCheckAt:
    number | null;

  checkCount:
    number | null;

  constructor(
    message: string,
    options: {
      status: number;

      retryAfter?:
        number | null;

      nextCheckAt?:
        number | null;

      checkCount?:
        number | null;
    },
  ) {
    super(message);

    this.name =
      "PlayerApiError";

    this.status =
      options.status;

    this.retryAfter =
      options.retryAfter ??
      null;

    this.nextCheckAt =
      options.nextCheckAt ??
      null;

    this.checkCount =
      options.checkCount ??
      null;
  }
}

/* ========================================
   BATTLETAG
======================================== */

export function normalizeBattleTag(
  battleTag: string,
) {
  return battleTag
    .trim()
    .replace("#", "-");
}

/* ========================================
   REQUEST
======================================== */

async function requestJson<T>(
  url: string,
): Promise<T> {
  const response =
    await fetch(url);

  if (response.ok) {
    return response.json();
  }

  let apiError:
    OverFastErrorResponse =
    {};

  try {
    apiError =
      await response.json();
  } catch {
    // Response body is not JSON.
  }

  if (response.status === 404) {
    throw new PlayerApiError(
      apiError.error ??
        "Player data is currently unavailable.",
      {
        status:
          response.status,

        retryAfter:
          apiError.retry_after,

        nextCheckAt:
          apiError.next_check_at,

        checkCount:
          apiError.check_count,
      },
    );
  }

  if (response.status === 403) {
    throw new PlayerApiError(
      "This profile is private.",
      {
        status:
          response.status,
      },
    );
  }

  if (response.status === 429) {
    throw new PlayerApiError(
      "Too many requests. Please try again later.",
      {
        status:
          response.status,

        retryAfter:
          apiError.retry_after,

        nextCheckAt:
          apiError.next_check_at,

        checkCount:
          apiError.check_count,
      },
    );
  }

  throw new PlayerApiError(
    apiError.error ??
      `Unable to load player data (${response.status}).`,
    {
      status:
        response.status,

      retryAfter:
        apiError.retry_after,

      nextCheckAt:
        apiError.next_check_at,

      checkCount:
        apiError.check_count,
    },
  );
}

/* ========================================
   SUMMARY
======================================== */

export async function getPlayerSummary(
  battleTag: string,
): Promise<PlayerSummary> {
  const normalized =
    normalizeBattleTag(
      battleTag,
    );

  if (!normalized) {
    throw new Error(
      "Enter a BattleTag.",
    );
  }

  return requestJson<PlayerSummary>(
    `${API_URL}/players/${encodeURIComponent(
      normalized,
    )}/summary`,
  );
}

/* ========================================
   STATS
======================================== */

export async function getPlayerStats(
  battleTag: string,
  gamemode:
    PlayerGamemode = "all",
): Promise<PlayerStatsSummary> {
  const normalized =
    normalizeBattleTag(
      battleTag,
    );

  if (!normalized) {
    throw new Error(
      "Enter a BattleTag.",
    );
  }

  const params =
    new URLSearchParams();

  params.set(
    "platform",
    "pc",
  );

  /*
    OverFast accepts:
    - competitive
    - quickplay

    For "all", we simply omit
    the gamemode parameter.
  */

  if (gamemode !== "all") {
    params.set(
      "gamemode",
      gamemode,
    );
  }

  return requestJson<PlayerStatsSummary>(
    `${API_URL}/players/${encodeURIComponent(
      normalized,
    )}/stats/summary?${params.toString()}`,
  );
}

/* ========================================
   COMPLETE PLAYER
======================================== */

export async function getPlayerData(
  battleTag: string,
  gamemode:
    PlayerGamemode = "all",
): Promise<PlayerData> {
  const normalized =
    normalizeBattleTag(
      battleTag,
    );

  if (!normalized) {
    throw new Error(
      "Enter a BattleTag.",
    );
  }

  const [
    summary,
    stats,
  ] = await Promise.all([
    getPlayerSummary(
      normalized,
    ),

    getPlayerStats(
      normalized,
      gamemode,
    ),
  ]);

  return {
    summary,
    stats,
  };
}