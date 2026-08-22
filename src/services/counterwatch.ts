const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://worker.akidneyperks.workers.dev";

export type CounterwatchConfidence =
  | "very-high"
  | "high"
  | "good"
  | "medium"
  | "low";

export type CounterwatchMatchup = {
  heroId: string;
  opponentId: string;
  opponentName: string;
  opponentRole:
    | "Tank"
    | "Damage"
    | "Support"
    | null;

  counterRating: number;
  estimatedFightSwing:
    number | null;

  confidence:
    CounterwatchConfidence;

  contributors:
    number | null;
};

export type CounterwatchRankStat = {
  rank: string;
  winRate: number;
  pickRate: number;
  matches: number;
};

export type CounterwatchHeroStats = {
  heroId: string;
  heroName: string;
  role:
    | "Tank"
    | "Damage"
    | "Support"
    | null;

  tier: string | null;
  winRate: number | null;
  matches: number | null;
  updatedAt: string | null;

  counters:
    CounterwatchMatchup[];

  strongAgainst:
    CounterwatchMatchup[];

  rankStats:
    CounterwatchRankStat[];

  sourceUrl: string;
};

export async function fetchCounterwatchHero(
  heroId: string,
): Promise<CounterwatchHeroStats> {
  const response =
    await fetch(
      `${API_BASE_URL}/api/counterwatch?hero=${encodeURIComponent(
        heroId,
      )}`,
    );

  if (!response.ok) {
    let message =
      `Counterwatch API returned HTTP ${response.status}`;

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
      // Keep the HTTP error.
    }

    throw new Error(
      message,
    );
  }

  return (
    await response.json()
  ) as CounterwatchHeroStats;
}
