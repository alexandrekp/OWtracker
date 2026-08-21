import fs from "node:fs/promises";
import path from "node:path";

const API_BASE_URL = "https://overfast-api.tekrop.fr";

const PERKS_OUTPUT_DIR = path.resolve(
  "public/perks"
);

const DATA_OUTPUT_FILE = path.resolve(
  "src/data/generatedPerks.ts"
);

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

async function downloadImage(
  url,
  destination
) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Image download failed: ${response.status} ${response.statusText}`
    );
  }

  const buffer = Buffer.from(
    await response.arrayBuffer()
  );

  await fs.writeFile(
    destination,
    buffer
  );
}

function getExtension(url) {
  try {
    const pathname =
      new URL(url).pathname;

    const extension =
      path.extname(pathname);

    if (extension) {
      return extension;
    }
  } catch {
    // fallback below
  }

  return ".png";
}

async function processPerk({
  heroKey,
  perk,
  tier,
}) {
  const perkId = slugify(perk.name);

  const heroDirectory = path.join(
    PERKS_OUTPUT_DIR,
    heroKey
  );

  await fs.mkdir(
    heroDirectory,
    {
      recursive: true,
    }
  );

  let localIcon = "";

  if (perk.icon) {
    const extension =
      getExtension(perk.icon);

    const fileName =
      `${perkId}${extension}`;

    const destination =
      path.join(
        heroDirectory,
        fileName
      );

    await downloadImage(
      perk.icon,
      destination
    );

    localIcon =
      `/perks/${heroKey}/${fileName}`;
  }

  return {
    id: perkId,
    name: perk.name,
    tier,
    description:
      perk.description ?? "",
    icon: localIcon,
  };
}

async function main() {
  console.log(
    "Fetching Overwatch hero list..."
  );

  await fs.mkdir(
    PERKS_OUTPUT_DIR,
    {
      recursive: true,
    }
  );

  const heroes = await fetchJson(
    `${API_BASE_URL}/heroes`
  );

  console.log(
    `${heroes.length} heroes found.\n`
  );

  const generatedPerks = [];

  let totalPerks = 0;
  let heroesWithPerks = 0;

  for (const hero of heroes) {
    const heroKey = hero.key;

    try {
      const heroDetails =
        await fetchJson(
          `${API_BASE_URL}/heroes/${heroKey}`
        );

      const minor =
        heroDetails.perks?.minor ?? [];

      const major =
        heroDetails.perks?.major ?? [];

      if (
        minor.length === 0 &&
        major.length === 0
      ) {
        console.log(
          `- ${hero.name}: no perks`
        );

        continue;
      }

      const perks = [];

      for (const perk of minor) {
        try {
          const generatedPerk =
            await processPerk({
              heroKey,
              perk,
              tier: "Minor",
            });

          perks.push(
            generatedPerk
          );

          totalPerks += 1;
        } catch (error) {
          console.error(
            `  ✗ ${hero.name} / ${perk.name}`
          );

          console.error(
            `    ${error.message}`
          );
        }
      }

      for (const perk of major) {
        try {
          const generatedPerk =
            await processPerk({
              heroKey,
              perk,
              tier: "Major",
            });

          perks.push(
            generatedPerk
          );

          totalPerks += 1;
        } catch (error) {
          console.error(
            `  ✗ ${hero.name} / ${perk.name}`
          );

          console.error(
            `    ${error.message}`
          );
        }
      }

      generatedPerks.push({
        heroId: heroKey,
        perks,
      });

      heroesWithPerks += 1;

      console.log(
        `✓ ${hero.name} — ${perks.length} perks`
      );
    } catch (error) {
      console.error(
        `✗ ${hero.name}`
      );

      console.error(
        `  ${error.message}`
      );
    }
  }

  const fileContent = `import type { HeroPerks } from "../types/perk";

export const generatedPerks: HeroPerks[] = ${JSON.stringify(
    generatedPerks,
    null,
    2
  )};
`;

  await fs.writeFile(
    DATA_OUTPUT_FILE,
    fileContent,
    "utf8"
  );

  console.log(
    "\n--------------------------------"
  );

  console.log(
    `${heroesWithPerks} heroes with perks.`
  );

  console.log(
    `${totalPerks} perks downloaded.`
  );

  console.log(
    "Icons: public/perks/"
  );

  console.log(
    "Data: src/data/generatedPerks.ts"
  );
}

main().catch((error) => {
  console.error(
    "\nPerk synchronization failed:"
  );

  console.error(error);

  process.exit(1);
});