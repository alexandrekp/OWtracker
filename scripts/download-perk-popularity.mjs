import fs from "node:fs/promises";
import path from "node:path";
import * as cheerio from "cheerio";

const GENERATED_HEROES_FILE = path.resolve(
  "src/data/generatedHeroes.ts",
);

const GENERATED_PERKS_FILE = path.resolve(
  "src/data/generatedPerks.ts",
);

const OUTPUT_FILE = path.resolve(
  "src/data/generatedPerkPopularity.ts",
);

function extractGeneratedArray(source) {
  const match = source.match(
    /=\s*(\[[\s\S]*\]);?\s*$/,
  );

  if (!match) {
    throw new Error(
      "Unable to extract generated JSON array.",
    );
  }

  return JSON.parse(match[1]);
}

function normalize(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function escapeRegExp(value) {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );
}

function getRolePath(role) {
  switch (role) {
    case "Tank":
      return "tanks";

    case "Damage":
      return "damages";

    case "Support":
      return "supports";

    default:
      throw new Error(
        `Unknown role: ${role}`,
      );
  }
}

function getOwPerksSlug(hero) {
  const aliases = {
    "jetpack-cat": "jetpack_cat",
    "d-mon": "dmon",
    "d.mon": "dmon",
    "d-va": "dva",
    "soldier-76": "soldier-76",
    "wrecking-ball": "wrecking-ball",
    "junker-queen": "junker-queen",
  };

  return aliases[hero.id] ?? hero.id;
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 OWtracker/0.1",
      Accept:
        "text/html,application/xhtml+xml",
    },
  });

  if (!response.ok) {
    throw new Error(
      `${response.status} ${response.statusText}`,
    );
  }

  return response.text();
}

function extractPopularityFromPage(
  html,
  perkName,
) {
  const $ = cheerio.load(html);

  let result;

  $("h1, h2, h3, h4").each(
    (_, element) => {
      if (result !== undefined) {
        return;
      }

      const headingText = $(element)
        .text()
        .replace(/\s+/g, " ")
        .trim();

      if (
        normalize(headingText) !==
        normalize(perkName)
      ) {
        return;
      }

      /*
        OWPerks can insert labels such as:

        New
        Updated
        Community Choice

        between a perk title and its percentage.

        We therefore inspect a larger chunk
        around the perk instead of only the
        direct next element.
      */

      const parentText = $(element)
        .parent()
        .text()
        .replace(/\s+/g, " ")
        .trim();

      const parentMatch =
        parentText.match(
          /(\d{1,3})\s*%/,
        );

      if (parentMatch) {
        result = Number(
          parentMatch[1],
        );

        return;
      }

      /*
        Check the next few DOM siblings too.
      */

      let sibling =
        $(element).next();

      for (
        let index = 0;
        index < 6 &&
        sibling.length;
        index += 1
      ) {
        const siblingText =
          sibling
            .text()
            .replace(
              /\s+/g,
              " ",
            )
            .trim();

        const match =
          siblingText.match(
            /(\d{1,3})\s*%/,
          );

        if (match) {
          result =
            Number(
              match[1],
            );

          return;
        }

        sibling =
          sibling.next();
      }
    },
  );

  if (result !== undefined) {
    return result;
  }

  /*
    Final fallback.

    Allow up to 120 arbitrary characters
    between the perk name and percentage.

    This handles strings such as:

    Giddy Up New 0%
    Focused Rush Updated 60%
  */

  const pageText = $("body")
    .text()
    .replace(/\s+/g, " ");

  const perkPattern =
    escapeRegExp(perkName);

  const regex = new RegExp(
    `${perkPattern}.{0,120}?(\\d{1,3})\\s*%`,
    "i",
  );

  const match =
    pageText.match(regex);

  if (!match) {
    return undefined;
  }

  return Number(
    match[1],
  );
}

async function main() {
  console.log(
    "Loading local OWtracker data...",
  );

  const heroesSource =
    await fs.readFile(
      GENERATED_HEROES_FILE,
      "utf8",
    );

  const perksSource =
    await fs.readFile(
      GENERATED_PERKS_FILE,
      "utf8",
    );

  const heroes =
    extractGeneratedArray(
      heroesSource,
    );

  const perksByHero =
    extractGeneratedArray(
      perksSource,
    );

  const perksMap =
    new Map(
      perksByHero.map(
        (entry) => [
          entry.heroId,
          entry.perks,
        ],
      ),
    );

  console.log(
    `${heroes.length} heroes loaded.\n`,
  );

  const popularity = {};

  let heroesProcessed = 0;
  let perksFound = 0;
  let perksMissing = 0;

  for (const hero of heroes) {
    const perks =
      perksMap.get(hero.id) ?? [];

    if (
      perks.length === 0
    ) {
      console.log(
        `- ${hero.name}: no perks`,
      );

      continue;
    }

    const rolePath =
      getRolePath(
        hero.role,
      );

    const slug =
      getOwPerksSlug(
        hero,
      );

    const url =
      `https://owperks.com/en/${rolePath}/${slug}`;

    try {
      const html =
        await fetchHtml(
          url,
        );

      const heroPopularity = {};

      for (
        const perk
        of perks
      ) {
        const value =
          extractPopularityFromPage(
            html,
            perk.name,
          );

        if (
          value === undefined
        ) {
          console.log(
            `  ? ${hero.name} / ${perk.name}`,
          );

          perksMissing += 1;

          continue;
        }

        heroPopularity[
          perk.id
        ] = value;

        perksFound += 1;
      }

      popularity[
        hero.id
      ] =
        heroPopularity;

      heroesProcessed += 1;

      console.log(
        `✓ ${hero.name} — ${Object.keys(
          heroPopularity,
        ).length}/${perks.length} percentages`,
      );
    } catch (error) {
      console.error(
        `✗ ${hero.name}`,
      );

      console.error(
        `  ${url}`,
      );

      console.error(
        `  ${error.message}`,
      );
    }

    await new Promise(
      (resolve) =>
        setTimeout(
          resolve,
          150,
        ),
    );
  }

  const output = `/*
  AUTO-GENERATED FILE.
  Source: OWPerks community statistics.

  Do not edit manually.
*/

export const generatedPerkPopularity: Record<
  string,
  Record<string, number>
> = ${JSON.stringify(
    popularity,
    null,
    2,
  )};
`;

  await fs.writeFile(
    OUTPUT_FILE,
    output,
    "utf8",
  );

  console.log(
    "\n--------------------------------",
  );

  console.log(
    `${heroesProcessed} heroes processed.`,
  );

  console.log(
    `${perksFound} percentages found.`,
  );

  console.log(
    `${perksMissing} percentages missing.`,
  );

  console.log(
    "Data: src/data/generatedPerkPopularity.ts",
  );
}

main().catch(
  (error) => {
    console.error(
      "\nPopularity synchronization failed:",
    );

    console.error(
      error,
    );

    process.exit(1);
  },
);