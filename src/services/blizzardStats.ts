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
  "http://127.0.0.1:8787";

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

  map = "all-maps",
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
      // The API did not
      // return valid JSON.
    }

    throw new Error(
      message,
    );
  }

  const data =
    await response.json();

  return data as
    BlizzardStatsResponse;
}