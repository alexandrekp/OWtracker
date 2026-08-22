const CORS_HEADERS = {
  "Access-Control-Allow-Origin":
    "*",
  "Access-Control-Allow-Headers":
    "Content-Type",
  "Access-Control-Allow-Methods":
    "GET, OPTIONS",
};

type Confidence =
  | "very-high"
  | "high"
  | "good"
  | "medium"
  | "low";

type Role =
  | "Tank"
  | "Damage"
  | "Support"
  | null;

type Matchup = {
  heroId: string;
  opponentId: string;
  opponentName: string;
  opponentRole: Role;
  counterRating: number;
  estimatedFightSwing:
    number | null;
  confidence:
    Confidence;
  contributors:
    number | null;
};

type RankStat = {
  rank: string;
  winRate: number;
  pickRate: number;
  matches: number;
};

type CounterwatchHeroStats = {
  heroId: string;
  heroName: string;
  role: Role;
  tier: string | null;
  winRate: number | null;
  matches: number | null;
  updatedAt: string | null;
  counters: Matchup[];
  strongAgainst: Matchup[];
  rankStats: RankStat[];
  sourceUrl: string;
};

function json(
  body: unknown,
  status = 200,
) {
  return new Response(
    JSON.stringify(
      body,
    ),
    {
      status,
      headers: {
        ...CORS_HEADERS,
        "Content-Type":
          "application/json; charset=utf-8",
        "Cache-Control":
          "public, max-age=900",
      },
    },
  );
}

function normalizeText(
  value: string,
) {
  return value
    .replace(/\s+/g, " ")
    .trim();
}

function slugifyHeroName(
  name: string,
) {
  return name
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      "-",
    )
    .replace(
      /^-+|-+$/g,
      "",
    )
    .replace(
      /^d-mon$/,
      "dmon",
    )
    .replace(
      /^d-va$/,
      "dva",
    )
    .replace(
      /^soldier-76$/,
      "soldier-76",
    );
}

function parseNumber(
  value:
    string | undefined,
) {
  if (!value) {
    return null;
  }

  const parsed =
    Number(
      value.replace(
        /,/g,
        "",
      ),
    );

  return Number.isFinite(
    parsed,
  )
    ? parsed
    : null;
}

function confidenceValue(
  label:
    string | undefined,
): Confidence {
  const normalized =
    (
      label ?? ""
    )
      .trim()
      .toLowerCase();

  if (
    normalized ===
    "very high"
  ) {
    return "very-high";
  }

  if (
    normalized ===
    "high"
  ) {
    return "high";
  }

  if (
    normalized ===
    "good"
  ) {
    return "good";
  }

  if (
    normalized ===
    "medium"
  ) {
    return "medium";
  }

  return "low";
}

function roleValue(
  value:
    string | undefined,
): Role {
  if (
    value === "Tank" ||
    value === "Damage" ||
    value === "Support"
  ) {
    return value;
  }

  return null;
}

function parseMatchups(
  section: string,
  heroId: string,
) {
  const results:
    Matchup[] = [];

  const rows =
    section.split(
      /Counters\s*→/i,
    );

  for (
    const rawRow of rows
  ) {
    let row =
      rawRow
        .replace(
          /\s+/g,
          " ",
        )
        .trim();

    if (!row) {
      continue;
    }

    /*
      The first row contains the section heading.
      Keep only what follows the last "Top 5".
    */
    const topFiveMatch =
      /Top 5\s+/gi;

    let topFive:
      RegExpExecArray | null;

    let lastTopFive:
      RegExpExecArray | null =
        null;

    while (
      (
        topFive =
          topFiveMatch.exec(
            row,
          )
      ) !== null
    ) {
      lastTopFive =
        topFive;
    }

    if (
      lastTopFive
    ) {
      row =
        row.slice(
          lastTopFive.index +
            lastTopFive[0].length,
        );
    }

    /*
      Counterwatch may insert labels such as
      "Team pressure" between the role and rating.
      Parse the stable pieces and tolerate those labels.
    */
    const match =
      row.match(
        /(.+?)\s+(Tank|Damage|Support)\b.*?\+([0-9]+(?:\.[0-9]+)?)(?:\s*≈\s*\+([0-9]+(?:\.[0-9]+)?)%)?\s+(Very high|High|Good|Medium|Low)\s*$/i,
      );

    if (!match) {
      continue;
    }

    const opponentName =
      match[1]
        .trim();

    const rating =
      parseNumber(
        match[3],
      );

    if (
      rating === null
    ) {
      continue;
    }

    results.push({
      heroId,

      opponentId:
        slugifyHeroName(
          opponentName,
        ),

      opponentName,

      opponentRole:
        roleValue(
          normalizeRoleLabel(
            match[2],
          ),
        ),

      counterRating:
        rating,

      estimatedFightSwing:
        parseNumber(
          match[4],
        ),

      confidence:
        confidenceValue(
          normalizeConfidenceLabel(
            match[5],
          ),
        ),

      contributors:
        null,
    });
  }

  return results;
}

function normalizeRoleLabel(
  value:
    string | undefined,
) {
  const normalized =
    (
      value ?? ""
    )
      .trim()
      .toLowerCase();

  if (
    normalized ===
    "tank"
  ) {
    return "Tank";
  }

  if (
    normalized ===
    "damage"
  ) {
    return "Damage";
  }

  if (
    normalized ===
    "support"
  ) {
    return "Support";
  }

  return undefined;
}

function normalizeConfidenceLabel(
  value:
    string | undefined,
) {
  const normalized =
    (
      value ?? ""
    )
      .trim()
      .toLowerCase();

  if (
    normalized ===
    "very high"
  ) {
    return "Very high";
  }

  if (
    normalized ===
    "high"
  ) {
    return "High";
  }

  if (
    normalized ===
    "good"
  ) {
    return "Good";
  }

  if (
    normalized ===
    "medium"
  ) {
    return "Medium";
  }

  return "Low";
}

function parseRanks(
  text: string,
) {
  const ranks = [
    "Bronze",
    "Silver",
    "Gold",
    "Platinum",
    "Emerald",
    "Diamond",
    "Master",
    "Grandmaster+",
  ];

  const results:
    RankStat[] = [];

  for (
    const rank of ranks
  ) {
    const escaped =
      rank.replace(
        "+",
        "\\+",
      );

    const pattern =
      new RegExp(
        `${escaped}\\s+([0-9]+(?:\\.[0-9]+)?)%\\s+([0-9]+(?:\\.[0-9]+)?)%\\s+([0-9,]+)`,
      );

    const match =
      text.match(
        pattern,
      );

    if (!match) {
      continue;
    }

    const winRate =
      parseNumber(
        match[1],
      );

    const pickRate =
      parseNumber(
        match[2],
      );

    const matches =
      parseNumber(
        match[3],
      );

    if (
      winRate === null ||
      pickRate === null ||
      matches === null
    ) {
      continue;
    }

    results.push({
      rank,
      winRate,
      pickRate,
      matches,
    });
  }

  return results;
}

function parseCounterwatchHero(
  rawText: string,
  heroId: string,
  sourceUrl: string,
): CounterwatchHeroStats {
  const text =
    normalizeText(
      rawText,
    );

  const titleMatch =
    text.match(
      /\b([A-Za-zÀ-ÖØ-öø-ÿ0-9.' :-]+?)\s+Counters,\s*win rate\s*&\s*synergies\b/i,
    );

  const heroName =
    titleMatch?.[1]?.trim() ??
    formatHeroId(
      heroId,
    );

  /*
    Parse overview fields independently.

    Counterwatch's visible page text contains both
    the hero header and a natural-language summary,
    so use several tolerant fallbacks instead of
    depending on one exact DOM layout.
  */

  const overviewHead =
    text.slice(
      0,
      Math.min(
        text.length,
        2500,
      ),
    );

  const roleMatch =
    overviewHead.match(
      /\b(Tank|Damage|Support)\b\s+Tier\b/i,
    ) ??
    text.match(
      /\bis a\s+(Tank|Damage|Support)\s+hero\b/i,
    );

  const tierMatch =
    overviewHead.match(
      /\bTier\s+([A-FS])\b/i,
    );

  const winRateMatch =
    overviewHead.match(
      /([0-9]+(?:\.[0-9]+)?)%\s+Win Rate\b/i,
    ) ??
    text.match(
      /\bholds a\s+([0-9]+(?:\.[0-9]+)?)%\s+win rate\b/i,
    );

  const matchesMatch =
    overviewHead.match(
      /\bWin Rate\s+([0-9,]+)\s+matches\b/i,
    ) ??
    text.match(
      /\bacross\s+([0-9,]+)\s+community-tracked matches\b/i,
    );

  const updatedMatch =
    text.match(
      /last updated\s+([A-Z][a-z]{2}\s+[0-9]{1,2},\s+[0-9]{4})/i,
    );

  /*
    Counterwatch can mention section names
    more than once elsewhere on the page.

    Find the sections in sequence instead of
    taking the first global occurrence.
  */

  const hardestMatch =
    /hardest matchups/i.exec(
      text,
    );

  const hardestStart =
    hardestMatch?.index ??
    -1;

  const afterHardest =
    hardestStart >= 0
      ? text.slice(
          hardestStart +
            "hardest matchups".length,
        )
      : "";

  const easiestMatch =
    /easiest matchups/i.exec(
      afterHardest,
    );

  const easiestStart =
    hardestStart >= 0 &&
    easiestMatch
      ? hardestStart +
        "hardest matchups".length +
        easiestMatch.index
      : -1;

  const afterEasiest =
    easiestStart >= 0
      ? text.slice(
          easiestStart +
            "easiest matchups".length,
        )
      : "";

  const duosMatch =
    /strongest duos/i.exec(
      afterEasiest,
    );

  const duosStart =
    easiestStart >= 0 &&
    duosMatch
      ? easiestStart +
        "easiest matchups".length +
        duosMatch.index
      : -1;

  const hardestSection =
    hardestStart >= 0 &&
    easiestStart >
      hardestStart
      ? text.slice(
          hardestStart,
          easiestStart,
        )
      : "";

  const easiestSection =
    easiestStart >= 0 &&
    duosStart >
      easiestStart
      ? text.slice(
          easiestStart,
          duosStart,
        )
      : "";

  return {
    heroId,
    heroName,
    role:
      roleValue(
        normalizeRoleLabel(
          roleMatch?.[1],
        ),
      ),
    tier:
      tierMatch?.[1]?.toUpperCase() ??
      null,
    winRate:
      parseNumber(
        winRateMatch?.[1],
      ),
    matches:
      parseNumber(
        matchesMatch?.[1],
      ),
    updatedAt:
      updatedMatch?.[1] ??
      null,
    counters:
      parseMatchups(
        hardestSection,
        heroId,
      ),
    strongAgainst:
      parseMatchups(
        easiestSection,
        heroId,
      ),
    rankStats:
      parseRanks(
        text,
      ),
    sourceUrl,
  };
}

function formatHeroId(
  heroId: string,
) {
  const specialNames:
    Record<string, string> = {
      dva: "D.Va",
      dmon: "D.Mon",
      lucio: "Lúcio",
      torbjorn: "Torbjörn",
      "soldier-76":
        "Soldier: 76",
    };

  if (
    specialNames[
      heroId
    ]
  ) {
    return specialNames[
      heroId
    ];
  }

  return heroId
    .split("-")
    .map(
      (part) =>
        part
          .charAt(0)
          .toUpperCase() +
        part.slice(1),
    )
    .join(" ");
}

function escapeRegExp(
  value: string,
) {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );
}

function getCounterwatchHeroSlug(
  heroId: string,
) {
  const slugAliases:
    Record<string, string> = {
      "jetpack-cat":
        "jetpackcat",
  };

  return (
    slugAliases[heroId] ??
    heroId
  );
}

export async function handleCounterwatchRequest(
  request: Request,
) {
  try {
    if (
      request.method ===
      "OPTIONS"
    ) {
      return new Response(
        null,
        {
          status: 204,
          headers:
            CORS_HEADERS,
        },
      );
    }

    if (
      request.method !==
      "GET"
    ) {
      return json(
        {
          error:
            "Method not allowed.",
        },
        405,
      );
    }

    const url =
      new URL(
        request.url,
      );

    const hero =
      (
        url.searchParams.get(
          "hero",
        ) ?? ""
      )
        .trim()
        .toLowerCase();

    if (
      !/^[a-z0-9-]+$/.test(
        hero,
      )
    ) {
      return json(
        {
          error:
            "Invalid hero id.",
        },
        400,
      );
    }

    const sourceSlug =
      getCounterwatchHeroSlug(
        hero,
      );

    const sourceUrl =
      `https://www.counterwatch.gg/stats/overwatch/heroes/${sourceSlug}`;

    const sourceResponse =
      await fetch(
        sourceUrl,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) OWTracker/0.1",
            "Accept":
              "text/html,application/xhtml+xml",
            "Accept-Language":
              "en-US,en;q=0.9",
          },
        },
      );

    if (
      !sourceResponse.ok
    ) {
      return json(
        {
          error:
            `Counterwatch returned HTTP ${sourceResponse.status}.`,
          sourceUrl,
        },
        sourceResponse.status ===
        404
          ? 404
          : 502,
      );
    }

    const html =
      await sourceResponse.text();

    const visibleText =
      htmlToSearchText(
        html,
      );

    const parsed =
      parseCounterwatchHero(
        visibleText,
        hero,
        sourceUrl,
      );

    if (
      parsed.counters.length ===
        0 &&
      parsed.strongAgainst.length ===
        0
    ) {
      const hardestMatch =
        /hardest matchups/i.exec(
          visibleText,
        );

      const hardestStart =
        hardestMatch?.index ??
        -1;

      return json(
        {
          error:
            "Counterwatch page was reached, but matchup data could not be parsed.",
          sourceUrl,
          parserVersion:
            "counterwatch-v10",
          htmlLength:
            html.length,
          textLength:
            visibleText.length,
          sectionDebug: {
            hardestStart:
              /hardest matchups/i.exec(
                visibleText,
              )?.index ??
              -1,
            firstEasiestStart:
              /easiest matchups/i.exec(
                visibleText,
              )?.index ??
              -1,
          },
          matchupPreview:
            hardestStart >= 0
              ? visibleText.slice(
                  hardestStart,
                  Math.min(
                    visibleText.length,
                    hardestStart +
                      1800,
                  ),
                )
              : visibleText.slice(
                  0,
                  1400,
                ),
        },
        502,
      );
    }

    return json(
      parsed,
    );
  } catch (error) {
    console.error(
      "Counterwatch worker error:",
      error,
    );

    return json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown Counterwatch worker error.",
        parserVersion:
          "counterwatch-v10",
      },
      500,
    );
  }
}

function htmlToSearchText(
  html: string,
) {
  return normalizeText(
    decodeHtmlEntities(
      html
        .replace(
          /<script\b[^>]*>[\s\S]*?<\/script>/gi,
          " ",
        )
        .replace(
          /<style\b[^>]*>[\s\S]*?<\/style>/gi,
          " ",
        )
        .replace(
          /<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi,
          " ",
        )
        .replace(
          /<[^>]+>/g,
          " ",
        ),
    ),
  );
}

function decodeHtmlEntities(
  value: string,
) {
  return value
    .replaceAll(
      "&nbsp;",
      " ",
    )
    .replaceAll(
      "&quot;",
      '"',
    )
    .replaceAll(
      "&#39;",
      "'",
    )
    .replaceAll(
      "&apos;",
      "'",
    )
    .replaceAll(
      "&amp;",
      "&",
    )
    .replaceAll(
      "&lt;",
      "<",
    )
    .replaceAll(
      "&gt;",
      ">",
    )
    .replace(
      /&#(\d+);/g,
      (
        _match,
        decimal,
      ) =>
        String.fromCodePoint(
          Number(decimal),
        ),
    )
    .replace(
      /&#x([0-9a-f]+);/gi,
      (
        _match,
        hex,
      ) =>
        String.fromCodePoint(
          parseInt(
            hex,
            16,
          ),
        ),
    );
}
