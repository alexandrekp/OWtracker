import fs from "node:fs/promises";
import path from "node:path";

const args = process.argv.slice(2);

function getArgument(name, fallback) {
  const prefix = `--${name}=`;

  const argument = args.find(
    (value) => value.startsWith(prefix),
  );

  if (!argument) {
    return fallback;
  }

  return argument.slice(prefix.length);
}

const input =
  getArgument(
    "input",
    "PC",
  );

const region =
  getArgument(
    "region",
    "Europe",
  );

const tier =
  getArgument(
    "tier",
    "All",
  );

const map =
  getArgument(
    "map",
    "all-maps",
  );

const OUTPUT_FILE =
  path.resolve(
    "src/data/generatedHeroStats.ts",
  );

function buildUrl(rq) {
  return (
    "https://overwatch.blizzard.com/en-us/rates/" +
    `?input=${encodeURIComponent(input)}` +
    `&map=${encodeURIComponent(map)}` +
    `&region=${encodeURIComponent(region)}` +
    "&role=All" +
    `&rq=${rq}` +
    `&tier=${encodeURIComponent(tier)}`
  );
}

function decodeHtmlEntities(value) {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&amp;", "&")
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function convertRole(role) {
  switch (role) {
    case "TANK":
      return "Tank";

    case "DAMAGE":
      return "Damage";

    case "SUPPORT":
      return "Support";

    default:
      throw new Error(
        `Unknown Blizzard role: ${role}`,
      );
  }
}

async function fetchHtml(url) {
  const response =
    await fetch(
      url,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/151 Safari/537.36",

          Accept:
            "text/html,application/xhtml+xml",

          "Accept-Language":
            "en-US,en;q=0.9",
        },
      },
    );

  if (!response.ok) {
    throw new Error(
      `Blizzard returned ${response.status} ${response.statusText}`,
    );
  }

  return response.text();
}

function extractAllRows(html) {
  const match =
    html.match(
      /allrows="([^"]+)"/,
    );

  if (!match) {
    throw new Error(
      "Unable to find Blizzard allrows data.",
    );
  }

  const decoded =
    decodeHtmlEntities(
      match[1],
    );

  return JSON.parse(
    decoded,
  );
}

function convertRows(rows) {
  return rows.map(
    (row) => ({
      heroId:
        row.id,

      heroName:
        row.cells.name,

      role:
        convertRole(
          row.hero.role,
        ),

      winRate:
        row.cells.winrate ===
          null ||
        row.cells.winrate ===
          undefined
          ? null
          : Number(
              row.cells.winrate,
            ),

      pickRate:
        row.cells.pickrate ===
          null ||
        row.cells.pickrate ===
          undefined
          ? null
          : Number(
              row.cells.pickrate,
            ),

      banRate:
        row.cells.banrate ===
          null ||
        row.cells.banrate ===
          undefined
          ? null
          : Number(
              row.cells.banrate,
            ),
    }),
  );
}

function getBanScore(heroStats) {
  return heroStats.reduce(
    (total, hero) =>
      total +
      (hero.banRate ?? 0),
    0,
  );
}

async function getDatasetForRq(rq) {
  const url =
    buildUrl(rq);

  console.log(
    `Testing rq=${rq}...`,
  );

  const html =
    await fetchHtml(url);

  const rows =
    extractAllRows(
      html,
    );

  const heroStats =
    convertRows(
      rows,
    );

  const banScore =
    getBanScore(
      heroStats,
    );

  const nonZeroBans =
    heroStats.filter(
      (hero) =>
        (hero.banRate ?? 0) >
        0,
    ).length;

  console.log(
    `  ${heroStats.length} heroes`,
  );

  console.log(
    `  ${nonZeroBans} heroes with non-zero ban rate`,
  );

  console.log(
    `  Total ban score: ${banScore.toFixed(1)}\n`,
  );

  return {
    rq,
    url,
    heroStats,
    banScore,
    nonZeroBans,
  };
}

async function main() {
  console.log(
    "Fetching Blizzard hero statistics...\n",
  );

  console.log(
    `Input: ${input}`,
  );

  console.log(
    `Region: ${region}`,
  );

  console.log(
    `Tier: ${tier}`,
  );

  console.log(
    `Map: ${map}\n`,
  );

  const datasets = [];

  for (const rq of [0, 1, 2]) {
    try {
      const dataset =
        await getDatasetForRq(
          rq,
        );

      datasets.push(
        dataset,
      );
    } catch (error) {
      console.error(
        `rq=${rq} failed: ${error.message}\n`,
      );
    }
  }

  if (
    datasets.length === 0
  ) {
    throw new Error(
      "No Blizzard dataset could be fetched.",
    );
  }

  /*
    Competitive data is identified by
    meaningful non-zero ban rates.

    Prefer the dataset with the largest
    number of non-zero ban rates.

    If tied, use the highest cumulative
    ban-rate score.
  */

  datasets.sort(
    (a, b) => {
      if (
        b.nonZeroBans !==
        a.nonZeroBans
      ) {
        return (
          b.nonZeroBans -
          a.nonZeroBans
        );
      }

      return (
        b.banScore -
        a.banScore
      );
    },
  );

  const selected =
    datasets[0];

  console.log(
    "--------------------------------",
  );

  console.log(
    `Selected rq=${selected.rq}`,
  );

  console.log(
    `Source: ${selected.url}`,
  );

  console.log(
    "--------------------------------\n",
  );

  if (
    selected.nonZeroBans === 0
  ) {
    console.warn(
      "WARNING: Blizzard returned no non-zero ban rates.",
    );

    console.warn(
      "The selected dataset may not represent competitive Role Queue.\n",
    );
  }

  for (
    const hero
    of selected.heroStats
  ) {
    const win =
      hero.winRate ??
      "—";

    const pick =
      hero.pickRate ??
      "—";

    const ban =
      hero.banRate ??
      "—";

    console.log(
      `✓ ${hero.heroName} — WR ${win}% · PR ${pick}% · BR ${ban}%`,
    );
  }

  const updatedAt =
    new Date()
      .toISOString();

  const metadata = {
    source:
      "Blizzard",

    input,

    region,

    map,

    tier,

    competitive:
      selected.nonZeroBans >
      0,

    rq:
      selected.rq,

    updatedAt,
  };

  const fileContent = `/*
  AUTO-GENERATED FILE.

  Source:
  Blizzard Hero Statistics

  Do not edit manually.
*/

import type {
  HeroStats,
  HeroStatsMetadata,
} from "../types/heroStats";

export const heroStatsMetadata: HeroStatsMetadata = ${JSON.stringify(
    metadata,
    null,
    2,
  )};

export const generatedHeroStats: HeroStats[] = ${JSON.stringify(
    selected.heroStats,
    null,
    2,
  )};
`;

  await fs.writeFile(
    OUTPUT_FILE,
    fileContent,
    "utf8",
  );

  console.log(
    "\n--------------------------------",
  );

  console.log(
    `${selected.heroStats.length} hero statistics generated.`,
  );

  console.log(
    `Competitive rq: ${selected.rq}`,
  );

  console.log(
    `Updated: ${updatedAt}`,
  );

  console.log(
    "Data: src/data/generatedHeroStats.ts",
  );
}

main().catch(
  (error) => {
    console.error(
      "\nBlizzard statistics synchronization failed:",
    );

    console.error(
      error,
    );

    process.exit(1);
  },
);