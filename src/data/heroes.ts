import { generatedHeroes } from "./generatedHeroes";
import { generatedHeroStats } from "./generatedHeroStats";

import type { Hero } from "../types/hero";

const statsByHero = new Map(
  generatedHeroStats.map(
    (stats) => [
      stats.heroId,
      stats,
    ],
  ),
);

function publicAssetPath(
  path: string,
) {
  const cleanPath =
    path.replace(
      /^\/+/,
      "",
    );

  return `${import.meta.env.BASE_URL}${cleanPath}`;
}

export const heroes: Hero[] =
  generatedHeroes.map((hero) => {
    const stats =
      statsByHero.get(
        hero.id,
      );

    return {
      ...hero,

      image:
        publicAssetPath(
          hero.image,
        ),

      winRate:
        stats?.winRate ??
        undefined,

      pickRate:
        stats?.pickRate ??
        undefined,

      banRate:
        stats?.banRate ??
        undefined,
    };
  });