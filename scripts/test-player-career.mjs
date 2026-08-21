const battleTag =
  process.argv[2] ??
  "AKP-21265";

const API_BASE =
  "https://overfast-api.tekrop.fr";

async function main() {
  console.log(
    `Fetching player data for ${battleTag}...\n`,
  );

  const urls = [
    `${API_BASE}/players/${encodeURIComponent(
      battleTag,
    )}/summary`,

    `${API_BASE}/players/${encodeURIComponent(
      battleTag,
    )}/stats/summary`,

    `${API_BASE}/players/${encodeURIComponent(
      battleTag,
    )}/stats/career`,
  ];

  for (const url of urls) {
    console.log(
      "================================",
    );

    console.log(url);

    const response =
      await fetch(url);

    console.log(
      `HTTP ${response.status}`,
    );

    const text =
      await response.text();

    try {
      const json =
        JSON.parse(text);

      console.log(
        JSON.stringify(
          json,
          null,
          2,
        ),
      );
    } catch {
      console.log(text);
    }

    console.log("");
  }
}

main().catch(
  (error) => {
    console.error(
      "\nPlayer data test failed:",
    );

    console.error(error);

    process.exit(1);
  },
);