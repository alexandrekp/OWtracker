import { handleCounterwatchRequest } from "./counterwatch";

type BlizzardCells = {
  name: string;
  winrate: number | null;
  pickrate: number | null;
  banrate: number | null;
};

type BlizzardRow = {
  id: string;

  cells: BlizzardCells;

  hero: {
    role: string;
  };
};

type HeroStats = {
  heroId: string;
  heroName: string;
  role: string;

  winRate: number | null;
  pickRate: number | null;
  banRate: number | null;
};

const OVERFAST_API =
  "https://overfast-api.tekrop.fr";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(
    request: Request,
  ): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    const url =
      new URL(request.url);

    /* ========================================
       BLIZZARD
    ======================================== */

    if (
      url.pathname ===
      "/api/blizzard"
    ) {
      return handleBlizzard(
        url,
      );
    }

    /* ========================================
       COUNTERWATCH
    ======================================== */

    if (
      url.pathname ===
      "/api/counterwatch"
    ) {
      return handleCounterwatchRequest(
        request,
      );
    }

    /* ========================================
       PLAYER
    ======================================== */

    if (
      url.pathname.startsWith(
        "/api/player/",
      )
    ) {
      return handlePlayer(
        url,
      );
    }

    return json(
      {
        error: "Not found",
      },
      404,
    );
  },
} satisfies ExportedHandler<Env>;

/* ========================================
   PLAYER API
======================================== */

async function handlePlayer(
  url: URL,
): Promise<Response> {
  try {
    const parts =
      url.pathname
        .split("/")
        .filter(Boolean);

    /*
      Expected:
      /api/player/BattleTag-1234/summary

      or

      /api/player/BattleTag-1234/stats
    */

    if (
      parts.length !== 4
    ) {
      return json(
        {
          error:
            "Invalid player endpoint.",
        },
        400,
      );
    }

    const battleTag =
      decodeURIComponent(
        parts[2],
      );

    const action =
      parts[3];

    if (!battleTag) {
      return json(
        {
          error:
            "Missing BattleTag.",
        },
        400,
      );
    }

    if (
      action ===
      "summary"
    ) {
      return proxyOverFast(
        `${OVERFAST_API}/players/${encodeURIComponent(
          battleTag,
        )}/summary`,
      );
    }

    if (
      action ===
      "stats"
    ) {
      const params =
        new URLSearchParams();

      params.set(
        "platform",
        "pc",
      );

      const gamemode =
        url.searchParams.get(
          "gamemode",
        );

      if (
        gamemode ===
          "competitive" ||
        gamemode ===
          "quickplay"
      ) {
        params.set(
          "gamemode",
          gamemode,
        );
      }

      return proxyOverFast(
        `${OVERFAST_API}/players/${encodeURIComponent(
          battleTag,
        )}/stats/summary?${params.toString()}`,
      );
    }

    return json(
      {
        error:
          "Unknown player endpoint.",
      },
      404,
    );
  } catch (error) {
    console.error(
      "Player proxy error:",
      error,
    );

    return json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to retrieve player data.",
      },
      500,
    );
  }
}

async function proxyOverFast(
  target:
    string,
): Promise<Response> {
  const response =
    await fetch(
      target,
      {
        headers: {
          Accept:
            "application/json",

          "User-Agent":
            "OWTracker-Web/0.1",
        },
      },
    );

  const body =
    await response.text();

  return new Response(
    body,
    {
      status:
        response.status,

      headers: {
        ...corsHeaders,

        "Content-Type":
          response.headers.get(
            "Content-Type",
          ) ??
          "application/json",
      },
    },
  );
}

/* ========================================
   BLIZZARD
======================================== */

async function handleBlizzard(
  url: URL,
): Promise<Response> {
  try {
    const region =
      url.searchParams.get(
        "region",
      ) ??
      "Europe";

    const tier =
      url.searchParams.get(
        "tier",
      ) ??
      "All";

    const role =
      url.searchParams.get(
        "role",
      ) ??
      "All";

    const map =
      url.searchParams.get(
        "map",
      ) ??
      "all-maps";

    const datasets: {
      rq: number;
      heroes:
        HeroStats[];
      nonZeroBans:
        number;
      banScore:
        number;
    }[] = [];

    for (
      const rq of [
        0,
        1,
        2,
      ]
    ) {
      try {
        const heroes =
          await fetchBlizzardDataset(
            rq,
            region,
            tier,
            role,
            map,
          );

        const nonZeroBans =
          heroes.filter(
            (hero) =>
              (
                hero.banRate ??
                0
              ) > 0,
          ).length;

        const banScore =
          heroes.reduce(
            (
              total,
              hero,
            ) =>
              total +
              (
                hero.banRate ??
                0
              ),
            0,
          );

        datasets.push({
          rq,
          heroes,
          nonZeroBans,
          banScore,
        });
      } catch (
        error
      ) {
        console.error(
          `rq=${rq} failed`,
          error,
        );
      }
    }

    if (
      datasets.length ===
      0
    ) {
      throw new Error(
        "Unable to retrieve Blizzard statistics.",
      );
    }

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

    return json({
      heroes:
        selected.heroes,

      rq:
        selected.rq,

      region,
      tier,
      role,
      map,

      updatedAt:
        Math.floor(
          Date.now() /
            1000,
        ),
    });
  } catch (
    error
  ) {
    console.error(
      "Blizzard error:",
      error,
    );

    return json(
      {
        error:
          error instanceof
          Error
            ? error.message
            : "Unknown error",
      },
      500,
    );
  }
}

/* ========================================
   BLIZZARD FETCH
======================================== */

async function fetchBlizzardDataset(
  rq: number,
  region: string,
  tier: string,
  role: string,
  map: string,
): Promise<HeroStats[]> {
  const params =
    new URLSearchParams({
      input: "PC",
      map,
      region,
      role,
      rq:
        String(rq),
      tier,
    });

  const response =
    await fetch(
      `https://overwatch.blizzard.com/en-us/rates/?${params.toString()}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 OWTracker/0.1",

          Accept:
            "text/html,application/xhtml+xml",

          "Accept-Language":
            "en-US,en;q=0.9",
        },
      },
    );

  if (
    !response.ok
  ) {
    throw new Error(
      `Blizzard returned HTTP ${response.status}`,
    );
  }

  const html =
    await response.text();

  const rows =
    extractAllRows(
      html,
    );

  return rows.map(
    (row) => ({
      heroId:
        row.id,

      heroName:
        row.cells.name,

      role:
        normalizeRole(
          row.hero.role,
        ),

      winRate:
        row.cells.winrate,

      pickRate:
        row.cells.pickrate,

      banRate:
        row.cells.banrate,
    }),
  );
}

/* ========================================
   BLIZZARD PARSER
======================================== */

function extractAllRows(
  html: string,
): BlizzardRow[] {
  const marker =
    'allrows="';

  const start =
    html.indexOf(
      marker,
    );

  if (
    start === -1
  ) {
    throw new Error(
      "Unable to find Blizzard allrows data.",
    );
  }

  const dataStart =
    start +
    marker.length;

  const remaining =
    html.slice(
      dataStart,
    );

  const end =
    remaining.indexOf(
      '"',
    );

  if (
    end === -1
  ) {
    throw new Error(
      "Unable to determine the end of Blizzard data.",
    );
  }

  const encoded =
    remaining.slice(
      0,
      end,
    );

  const decoded =
    decodeHtmlEntities(
      encoded,
    );

  return JSON.parse(
    decoded,
  ) as BlizzardRow[];
}

function decodeHtmlEntities(
  value:
    string,
) {
  return value
    .replaceAll(
      "&quot;",
      '"',
    )
    .replaceAll(
      "&amp;",
      "&",
    )
    .replaceAll(
      "&#39;",
      "'",
    )
    .replaceAll(
      "&lt;",
      "<",
    )
    .replaceAll(
      "&gt;",
      ">",
    );
}

function normalizeRole(
  role:
    string,
) {
  switch (role) {
    case "TANK":
      return "Tank";

    case "DAMAGE":
      return "Damage";

    case "SUPPORT":
      return "Support";

    default:
      return role;
  }
}

/* ========================================
   JSON
======================================== */

function json(
  body:
    unknown,

  status = 200,
) {
  return new Response(
    JSON.stringify(
      body,
    ),
    {
      status,

      headers: {
        ...corsHeaders,

        "Content-Type":
          "application/json",
      },
    },
  );
}
