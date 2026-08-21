import { generatedPerks } from "./generatedPerks";
import { generatedPerkPopularity } from "./generatedPerkPopularity";

import type { HeroPerks } from "../types/perk";

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

export const heroPerks: HeroPerks[] =
  generatedPerks.map((hero) => {
    const popularity =
      generatedPerkPopularity[
        hero.heroId
      ] ?? {};

    return {
      heroId:
        hero.heroId,

      perks:
        hero.perks.map(
          (perk) => ({
            ...perk,

            icon:
              publicAssetPath(
                perk.icon,
              ),

            popularity:
              popularity[
                perk.id
              ],
          }),
        ),
    };
  });

export function getPerksForHero(
  heroId: string,
) {
  return heroPerks.find(
    (entry) =>
      entry.heroId === heroId,
  );
}