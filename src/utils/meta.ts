import type {
  Hero,
  HeroRole,
} from "../types/hero";

export type MetaTier =
  | "S"
  | "A"
  | "B"
  | "C"
  | "D";

export type MetaHero = {
  hero: Hero;

  score: number;

  tier: MetaTier;

  overallRank: number;

  roleRank: number;
};

/* ========================================
   BUILD META
======================================== */

export function buildMetaTierList(
  dataset: Hero[],
): MetaHero[] {
  const validHeroes =
    dataset.filter(
      (hero) =>
        hero.winRate !==
          undefined ||
        hero.pickRate !==
          undefined ||
        hero.banRate !==
          undefined,
    );

  if (
    validHeroes.length ===
    0
  ) {
    return [];
  }

  const winRates =
    validHeroes.map(
      (hero) =>
        hero.winRate ?? 0,
    );

  const pickRates =
    validHeroes.map(
      (hero) =>
        hero.pickRate ?? 0,
    );

  const banRates =
    validHeroes.map(
      (hero) =>
        hero.banRate ?? 0,
    );

  const minWin =
    Math.min(
      ...winRates,
    );

  const maxWin =
    Math.max(
      ...winRates,
    );

  const minPick =
    Math.min(
      ...pickRates,
    );

  const maxPick =
    Math.max(
      ...pickRates,
    );

  const minBan =
    Math.min(
      ...banRates,
    );

  const maxBan =
    Math.max(
      ...banRates,
    );

  const rawScores =
    validHeroes.map(
      (hero) => {
        const win =
          normalizeMetric(
            hero.winRate ??
              minWin,
            minWin,
            maxWin,
          );

        const pick =
          normalizeMetric(
            hero.pickRate ??
              minPick,
            minPick,
            maxPick,
          );

        const ban =
          normalizeMetric(
            hero.banRate ??
              minBan,
            minBan,
            maxBan,
          );

        return {
          hero,

          rawScore:
            win * 0.5 +
            pick * 0.3 +
            ban * 0.2,
        };
      },
    );

  const scores =
    rawScores.map(
      (entry) =>
        entry.rawScore,
    );

  const minScore =
    Math.min(
      ...scores,
    );

  const maxScore =
    Math.max(
      ...scores,
    );

  const ranked =
    rawScores
      .map(
        ({
          hero,
          rawScore,
        }) => {
          const score =
            normalizeMetric(
              rawScore,
              minScore,
              maxScore,
            );

          return {
            hero,
            score,
            tier:
              getMetaTier(
                score,
              ),
          };
        },
      )
      .sort(
        (a, b) =>
          b.score -
          a.score,
      );

  return ranked.map(
    (
      entry,
      index,
    ) => {
      const roleHeroes =
        ranked.filter(
          (other) =>
            other.hero.role ===
            entry.hero.role,
        );

      const roleRank =
        roleHeroes.findIndex(
          (other) =>
            other.hero.id ===
            entry.hero.id,
        ) + 1;

      return {
        ...entry,

        overallRank:
          index + 1,

        roleRank,
      };
    },
  );
}

/* ========================================
   HERO POSITION
======================================== */

export function getHeroMetaPosition(
  heroId: string,

  dataset: Hero[],
) {
  return buildMetaTierList(
    dataset,
  ).find(
    (entry) =>
      entry.hero.id ===
      heroId,
  );
}

/* ========================================
   ROLE COUNT
======================================== */

export function getRoleHeroCount(
  dataset: Hero[],

  role: HeroRole,
) {
  return dataset.filter(
    (hero) =>
      hero.role === role &&
      (
        hero.winRate !==
          undefined ||
        hero.pickRate !==
          undefined ||
        hero.banRate !==
          undefined
      ),
  ).length;
}

/* ========================================
   NORMALIZATION
======================================== */

function normalizeMetric(
  value: number,
  min: number,
  max: number,
) {
  if (
    max === min
  ) {
    return 100;
  }

  return (
    ((value - min) /
      (max - min)) *
    100
  );
}

function getMetaTier(
  score: number,
): MetaTier {
  if (
    score >= 85
  ) {
    return "S";
  }

  if (
    score >= 70
  ) {
    return "A";
  }

  if (
    score >= 55
  ) {
    return "B";
  }

  if (
    score >= 40
  ) {
    return "C";
  }

  return "D";
}