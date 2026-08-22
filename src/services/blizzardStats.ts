import {
  invoke,
  isTauri,
} from "@tauri-apps/api/core";

export type BlizzardRegion =
  | "Europe"
  | "Americas"
  | "Asia";

export type BlizzardTier =
  | "All"
  | "Bronze"
  | "Silver"
  | "Gold"
  | "Platinum"
  | "Diamond"
  | "Master"
  | "Grandmaster"
  | "Champion";

export type BlizzardRole =
  | "All"
  | "Tank"
  | "Damage"
  | "Support";

export type LiveHeroStats = {
  heroId: string;
  heroName: string;

  role:
    | "Tank"
    | "Damage"
    | "Support";

  winRate:
    number | null;

  pickRate:
    number | null;

  banRate:
    number | null;
};

export type BlizzardStatsResponse = {
  heroes:
    LiveHeroStats[];

  rq: number;

  region:
    BlizzardRegion;

  tier:
    BlizzardTier;

  role:
    BlizzardRole;

  map: string;

  updatedAt:
    number;
};

/* ========================================
   API
======================================== */

const API_BASE_URL =
  import.meta.env
    .VITE_API_URL ||
  "https://worker.akidneyperks.workers.dev";

/* ========================================
   TAURI
======================================== */

async function refreshFromTauri(
  region:
    BlizzardRegion,

  tier:
    BlizzardTier,

  role:
    BlizzardRole,

  map:
    string,
): Promise<BlizzardStatsResponse> {
  return invoke<BlizzardStatsResponse>(
    "refresh_blizzard_stats",
    {
      region,
      tier,
      role,
      map,
    },
  );
}

/* ========================================
   WEB API
======================================== */

async function refreshFromApi(
  region:
    BlizzardRegion,

  tier:
    BlizzardTier,

  role:
    BlizzardRole,

  map:
    string,
): Promise<BlizzardStatsResponse> {
  const params =
    new URLSearchParams({
      region,
      tier,
      role,
      map,
    });

  const response =
    await fetch(
      `${API_BASE_URL}/api/blizzard?${params.toString()}`,
    );

  if (!response.ok) {
    let message =
      `API returned HTTP ${response.status}`;

    try {
      const body:
        unknown =
        await response.json();

      if (
        typeof body ===
          "object" &&
        body !== null &&
        "error" in body &&
        typeof (
          body as {
            error?: unknown;
          }
        ).error ===
          "string"
      ) {
        message =
          (
            body as {
              error: string;
            }
          ).error;
      }
    } catch {
      // Invalid JSON response.
    }

    throw new Error(
      message,
    );
  }

  return (
    await response.json()
  ) as BlizzardStatsResponse;
}

/* ========================================
   BLIZZARD STATS
======================================== */

export async function refreshBlizzardStats(
  region:
    BlizzardRegion,

  tier:
    BlizzardTier,

  role:
    BlizzardRole,

  map =
    "all-maps",
): Promise<BlizzardStatsResponse> {
  if (
    isTauri()
  ) {
    return refreshFromTauri(
      region,
      tier,
      role,
      map,
    );
  }

  return refreshFromApi(
    region,
    tier,
    role,
    map,
  );
}
