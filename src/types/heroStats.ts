export type HeroStats = {
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

export type HeroStatsMetadata = {
  source: string;

  input: string;

  region: string;

  map: string;

  tier: string;

  competitive: boolean;

  rq: number;

  updatedAt: string;
};