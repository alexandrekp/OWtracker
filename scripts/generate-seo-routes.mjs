import fs from "node:fs";
import path from "node:path";

const distDir = path.resolve("dist");

const sourceFile = path.join(
  distDir,
  "index.html",
);

const routes = {
  stats: {
    title:
      "Overwatch Stats & Meta — OWTracker",
    description:
      "Explore Overwatch hero win rates, pick rates, ban rates and OWTracker meta rankings by region, rank and role.",
  },

  heroes: {
    title:
      "Overwatch Hero Stats — OWTracker",
    description:
      "Browse Overwatch heroes and compare meta score, win rate, pick rate, ban rate, role ranking, perks and live hero counters.",
  },

  counters: {
    title:
      "Overwatch Hero Counters — OWTracker",
    description:
      "Explore live Overwatch hero counters, favorable matchups, counter ratings, fight swing and confidence from Counterwatch community data.",
  },

  players: {
    title:
      "Overwatch Player Stats — OWTracker",
    description:
      "Search Overwatch player profiles, inspect competitive ranks and compare hero performance side by side.",
  },

  perks: {
    title:
      "Overwatch Hero Perks — OWTracker",
    description:
      "Explore Overwatch hero perks, perk popularity and community choices by hero and role.",
  },

  settings: {
    title:
      "Settings — OWTracker",
    description:
      "Configure OWTracker statistics defaults, cache behavior and view application data sources.",
  },
};

if (!fs.existsSync(sourceFile)) {
  throw new Error(
    "dist/index.html not found. Run npm run build first.",
  );
}

const baseHtml =
  fs.readFileSync(
    sourceFile,
    "utf8",
  );

for (
  const [route, meta]
  of Object.entries(routes)
) {
  const canonical =
    `https://owtracker.net/${route}`;

  let html =
    baseHtml;

  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>${meta.title}</title>`,
  );

  html = html.replace(
    /<meta\s+name=["']description["'][^>]*>/i,
    `<meta name="description" content="${meta.description}">`,
  );

  html = html.replace(
    /<meta\s+property=["']og:title["'][^>]*>/i,
    `<meta property="og:title" content="${meta.title}">`,
  );

  html = html.replace(
    /<meta\s+property=["']og:description["'][^>]*>/i,
    `<meta property="og:description" content="${meta.description}">`,
  );

  html = html.replace(
    /<meta\s+property=["']og:url["'][^>]*>/i,
    `<meta property="og:url" content="${canonical}">`,
  );

  html = html.replace(
    /<link\s+rel=["']canonical["'][^>]*>/i,
    `<link rel="canonical" href="${canonical}">`,
  );

  const schema = {
    "@context":
      "https://schema.org",

    "@graph": [
      {
        "@type":
          "WebApplication",

        "@id":
          "https://owtracker.net/#app",

        name:
          "OWTracker",

        url:
          "https://owtracker.net/",

        applicationCategory:
          "GameApplication",

        operatingSystem:
          "Web, Windows",

        description:
          "Overwatch statistics, live hero counters, meta rankings, hero perks and player comparison in one focused companion.",

        isAccessibleForFree:
          true,
      },

      {
        "@type":
          "WebPage",

        "@id":
          `${canonical}#webpage`,

        url:
          canonical,

        name:
          meta.title,

        description:
          meta.description,

        isPartOf: {
          "@id":
            "https://owtracker.net/#app",
        },
      },
    ],
  };

  const schemaTag =
    `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;

  html = html.replace(
    "</head>",
    `  ${schemaTag}\n</head>`,
  );

  const routeDir =
    path.join(
      distDir,
      route,
    );

  fs.mkdirSync(
    routeDir,
    {
      recursive: true,
    },
  );

  fs.writeFileSync(
    path.join(
      routeDir,
      "index.html",
    ),
    html,
    "utf8",
  );

  console.log(
    `Generated /${route}`,
  );
}

console.log(
  "SEO routes generated.",
);
