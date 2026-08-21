import {
  invoke,
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
  heroes: LiveHeroStats[];

  rq: number;

  region: BlizzardRegion;

  tier: BlizzardTier;

  role: BlizzardRole;

  map: string;

  updatedAt: number;
};

export async function refreshBlizzardStats(
  region: BlizzardRegion,
  tier: BlizzardTier,
  role: BlizzardRole,
  map = "all-maps",
) {
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