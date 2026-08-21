import { generatedPerks } from "./generatedPerks";
import { generatedPerkPopularity } from "./generatedPerkPopularity";

import type { HeroPerks } from "../types/perk";

/*
  OWtracker perk data architecture

  generatedPerks:
  - perk names
  - descriptions
  - icons
  - Minor / Major tier

  generatedPerkPopularity:
  - community pick percentages

  Both datasets are generated automatically.
*/

export const heroPerks: HeroPerks[] =
  generatedPerks.map((hero) => {
    const popularity =
      generatedPerkPopularity[
        hero.heroId
      ] ?? {};

    return {
      heroId: hero.heroId,

      perks: hero.perks.map(
        (perk) => ({
          ...perk,

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