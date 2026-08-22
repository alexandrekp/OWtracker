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

/*
  Blizzard's Hero Statistics page exposes
  ranked 6v6 Open Queue with rq=1 and
  ranked 5v5 Role Queue with rq=2.
*/
export type BlizzardFormat =
  | "5v5"
  | "6v6";

export type BlizzardHeroStats = {
  heroId: string;
  heroName: string;
  role:
    | "Tank"
    | "Damage"
    | "Support";
  winRate: number | null;
  pickRate: number | null;
  banRate: number | null;
};

export type BlizzardStatsResponse = {
  heroes: BlizzardHeroStats[];
  rq: number | null;
  region: BlizzardRegion;
  tier: BlizzardTier;
  role: BlizzardRole;
  map: string;
  updatedAt: number;
};

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://worker.akidneyperks.workers.dev";

export function formatToRq(
  format: BlizzardFormat,
) {
  return format === "6v6"
    ? 1
    : 2;
}

async function refreshFromTauri(
  region: BlizzardRegion,
  tier: BlizzardTier,
  role: BlizzardRole,
  map: string,
  format: BlizzardFormat,
): Promise<BlizzardStatsResponse> {
  return invoke(
    "refresh_blizzard_stats",
    {
      region,
      tier,
      role,
      map,
      rq:
        formatToRq(
          format,
        ),
    },
  );
}

async function refreshFromWeb(
  region: BlizzardRegion,
  tier: BlizzardTier,
  role: BlizzardRole,
  map: string,
  format: BlizzardFormat,
): Promise<BlizzardStatsResponse> {
  const params =
    new URLSearchParams({
      region,
      tier,
      role,
      map,
      rq: String(
        formatToRq(
          format,
        ),
      ),
    });

  const response =
    await fetch(
      `${API_BASE_URL}/api/blizzard?${params.toString()}`,
    );

  if (!response.ok) {
    let message =
      `API returned HTTP ${response.status}`;

    try {
      const payload =
        await response.json();

      if (
        payload &&
        typeof payload ===
          "object" &&
        "error" in payload &&
        typeof payload.error ===
          "string"
      ) {
        message =
          payload.error;
      }
    } catch {
      // Keep HTTP message.
    }

    throw new Error(
      message,
    );
  }

  return (
    await response.json()
  ) as BlizzardStatsResponse;
}

export async function refreshBlizzardStats(
  region: BlizzardRegion,
  tier: BlizzardTier,
  role: BlizzardRole,
  map = "all-maps",
  format: BlizzardFormat = "5v5",
) {
  return isTauri()
    ? refreshFromTauri(
        region,
        tier,
        role,
        map,
        format,
      )
    : refreshFromWeb(
        region,
        tier,
        role,
        map,
        format,
      );
}
