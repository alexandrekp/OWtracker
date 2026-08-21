import fs from "node:fs/promises";
import path from "node:path";

const API_URL = "https://overfast-api.tekrop.fr/heroes";
const OUTPUT_DIR = path.resolve("public/heroes");
const DATA_FILE = path.resolve("src/data/generatedHeroes.ts");

async function downloadImage(url, destination) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Image download failed: ${response.status} ${response.statusText}`
    );
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(destination, buffer);
}

async function main() {
  console.log("Fetching Overwatch heroes...");

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(
      `API error: ${response.status} ${response.statusText}`
    );
  }

  const heroes = await response.json();

  console.log(`${heroes.length} heroes found.\n`);

  const generatedHeroes = [];

  for (const hero of heroes) {
    const extension =
      new URL(hero.portrait).pathname.split(".").pop() || "png";

    const fileName = `${hero.key}.${extension}`;
    const destination = path.join(OUTPUT_DIR, fileName);

    try {
      await downloadImage(hero.portrait, destination);

      generatedHeroes.push({
        id: hero.key,
        name: hero.name,
        role:
          hero.role === "tank"
            ? "Tank"
            : hero.role === "damage"
            ? "Damage"
            : "Support",
        image: `/heroes/${fileName}`,
      });

      console.log(`✓ ${hero.name}`);
    } catch (error) {
      console.error(`✗ ${hero.name}`);
      console.error(error.message);
    }
  }

  const fileContent = `import type { HeroRole } from "../types/hero";

export type GeneratedHero = {
  id: string;
  name: string;
  role: HeroRole;
  image: string;
};

export const generatedHeroes: GeneratedHero[] = ${JSON.stringify(
    generatedHeroes,
    null,
    2
  )};
`;

  await fs.writeFile(DATA_FILE, fileContent, "utf8");

  console.log("\n--------------------------------");
  console.log(`${generatedHeroes.length} heroes downloaded.`);
  console.log("Images: public/heroes/");
  console.log("Data: src/data/generatedHeroes.ts");
}

main().catch((error) => {
  console.error("\nDownload failed:");
  console.error(error);
  process.exit(1);
});