<div align="center">

<img src="./public/owtracker-logo.png" alt="OWTracker" width="170" />

# OWTracker

**Understand the meta.**

Overwatch statistics, live hero counters, meta rankings, perks and player analysis in one focused interface.

[Open OWTracker](https://owtracker.net/) · [View repository](https://github.com/alexandrekp/OWtracker)

</div>

---

## About

OWTracker is an independent Overwatch companion available as both a web app and a desktop app.

The project brings together official Blizzard hero statistics, live community matchup data from Counterwatch, player data from OverFast, an OWTracker meta ranking, perk popularity and player comparison tools in a compact interface designed for quick competitive analysis.

The web version includes a public landing page and SEO-friendly deep routes, while the desktop version launches directly into the OWTracker interface.

## Features

### Statistics

- Official Blizzard hero statistics
- Win Rate, Pick Rate and Ban Rate
- Region filter
- Competitive rank filter
- Role filter
- Competitive format filter:
  - `5v5 · Role Queue`
  - `6v6 · Open Queue`
- Apply-based filter workflow
- Manual Blizzard refresh
- Local caching with configurable refresh intervals
- Role leaders
- OWTracker meta tier list
- Role-specific hero rankings

### Meta ranking

OWTracker generates its own Meta Score from the active Blizzard hero dataset.

Current weighting:

```text
Win Rate  = 60%
Pick Rate = 30%
Ban Rate  = 10%
```

The values are normalized across the selected dataset before the final score is calculated.

Current tiers:

```text
S ≥ 85
A ≥ 70
B ≥ 55
C ≥ 40
D < 40
```

The Meta Score is an OWTracker interpretation and is not an official Blizzard ranking.

### Heroes

- Full hero database
- Search by hero name
- Filter by role
- Sort by:
  - Meta Score
  - Win Rate
  - Pick Rate
  - Ban Rate
  - Name
- Detailed hero pages
- Current tier and Meta Score
- Overall and role ranking
- Recommended perks
- Hero positioning inside the current roster
- Live Counterwatch matchup tab
- Blizzard data refresh

### Counters

OWTracker retrieves current community matchup data on demand from Counterwatch through the OWTracker Cloudflare Worker.

For each supported hero, the Counters page can display:

- Hardest matchups (`Countered by`)
- Favorable matchups (`Strong against`)
- Counter rating
- Estimated fight swing when available
- Confidence level
- Counterwatch hero win rate when available
- Number of tracked matches
- Counterwatch tier when available
- Source update date
- Rank-by-rank Counterwatch statistics in the backend response

Counter rating is a relative matchup metric and is **not** a raw matchup win rate.

Counterwatch data is community data and is separate from Blizzard's official hero statistics.

### Players

Player profiles are retrieved on demand through OverFast.

Current player tools include:

- BattleTag player search
- Saved players / favorites
- PC and Console platform selection
- Platform-specific career statistics
- Protection against displaying PC statistics as Console statistics
- All Modes, Competitive and Quick Play views
- Competitive season display when available
- Competitive format selector:
  - `5v5 · Role Queue`
  - `6v6 · Open Queue`
- 5v5 role ranks:
  - Tank
  - Damage
  - Support
- 6v6 Open Queue rank
- Overview statistics
- Performance averages per 10 minutes
- Role performance
- Role playtime distribution
- Best-performing heroes
- Career totals
- Advanced career statistics
- Hero-specific advanced career data
- Hero performance table
- Sort by time, games, Win Rate or KDA
- Player comparison
- Shared hero analysis

> Detailed career statistics are only separated when the upstream player data source exposes that distinction. OWTracker does not fabricate separate 5v5 / 6v6 career totals when the source only provides aggregate Competitive statistics.

### Perks

- Minor and Major perks
- Perk popularity
- Recommended community choices
- Search by hero or perk
- Role filtering

### Settings

- Interface language
- Automatic system-language detection
- Default region
- Default competitive rank
- Default role
- Default competitive format
- Configurable cache / refresh interval
- Persistent local preferences
- Data source information
- Meta Score methodology
- Application information

### Languages

OWTracker currently supports:

- English
- Français
- Deutsch
- Español
- Português (Brasil)
- 한국어
- 日本語
- 简体中文
- Русский
- Auto / System language detection

## Data sources

OWTracker combines several data sources depending on the feature.

| Data | Source |
| --- | --- |
| Global hero statistics | Blizzard official Overwatch statistics |
| Win / Pick / Ban rates | Blizzard |
| 5v5 / 6v6 global format data | Blizzard |
| Hero counter ratings and matchup data | Counterwatch |
| Player profiles | OverFast |
| Player ranks and individual statistics | OverFast |
| Player PC / Console career data | OverFast |
| Player 5v5 role ranks / 6v6 Open Queue rank | OverFast |
| Perk popularity | Community data |
| Meta tiers | Calculated locally by OWTracker |

OWTracker does not claim that its generated tier list is an official Blizzard ranking.

Counterwatch and OverFast are third-party services. Their data and availability remain subject to their respective sources.

## Cloudflare Worker

The web version uses a Cloudflare Worker as a small backend layer between the React frontend and external data sources.

It keeps external API logic, parsing and CORS handling outside the frontend.

### Blizzard statistics

```text
/api/blizzard
```

Supported query parameters include:

```text
region
tier
role
map
rq
```

OWTracker uses the Blizzard queue-format parameter to request the selected competitive dataset instead of automatically mixing formats.

### Counterwatch

```text
/api/counterwatch?hero=<heroId>
```

Example:

```text
/api/counterwatch?hero=winston
```

The Worker retrieves the corresponding Counterwatch hero page, parses the public matchup information and returns normalized JSON.

The response can include:

```text
heroId
heroName
role
tier
winRate
matches
updatedAt
counters[]
strongAgainst[]
rankStats[]
sourceUrl
```

This keeps Counterwatch-specific parsing outside the React components and gives the dedicated Counters page and Hero Detail the same normalized data source.

### Player summary

```text
/api/player/<BattleTag>/summary
```

### Player statistics

```text
/api/player/<BattleTag>/stats?platform=pc
/api/player/<BattleTag>/stats?platform=console
```

Optional game mode:

```text
gamemode=competitive
gamemode=quickplay
```

The Worker forwards the selected platform instead of forcing all requests to PC.

### Advanced player career

```text
/api/player/<BattleTag>/career
```

Supported parameters include:

```text
platform=pc|console
gamemode=competitive|quickplay
hero=<heroId>|all-heroes
```

## Architecture

```text
Blizzard statistics ───────┐
                           │
Counterwatch ──────────────┼──> Cloudflare Worker ──> React / OWTracker
                           │
OverFast player API ───────┘

React / TypeScript
        │
        ├── Web build → GitHub Pages / owtracker.net
        │
        └── Desktop → Tauri 2 / Rust
```

## Tech stack

### Frontend

- React 19
- TypeScript
- Vite
- Lucide React
- Responsive CSS
- History API routing
- LocalStorage preferences and cache

### Desktop

- Tauri 2
- Rust

### Data / backend

- Blizzard Overwatch statistics
- Counterwatch community matchup data
- OverFast player API
- Cloudflare Workers

### Deployment

- GitHub
- GitHub Pages
- Cloudflare
- Custom domain: `owtracker.net`

## Installation

### Requirements

Make sure the following are installed:

- Node.js
- npm
- Rust
- Tauri prerequisites for your operating system

Clone the repository:

```bash
git clone https://github.com/alexandrekp/OWtracker.git
cd OWtracker
```

Install dependencies:

```bash
npm install
```

## Web development

Start the Vite development server:

```bash
npm run dev
```

The local web version is available at:

```text
http://localhost:1420/
```

## Desktop development

Start OWTracker with Tauri:

```bash
npm run tauri dev
```

The desktop version opens directly into the application interface.

## Production build

Build the frontend:

```bash
npm run build
```

The build runs TypeScript validation, creates the Vite production bundle and generates the SEO routes.

Production files are generated inside:

```text
dist/
```

For the current GitHub Pages deployment workflow:

```powershell
Remove-Item .\docs\* -Recurse -Force
Copy-Item .\dist\* .\docs\ -Recurse -Force
```

Then commit and push:

```bash
git add .
git commit -m "Deploy latest OWTracker web build"
git push
```

## Worker deployment

After changing `worker/src/index.ts` or `worker/src/counterwatch.ts`:

```powershell
cd worker
npx wrangler deploy
```

The frontend and Worker deployments are independent. Updating the frontend does not automatically deploy Worker changes.

## Project structure

```text
OWtracker/
├── public/
├── scripts/
│   └── generate-seo-routes.mjs
├── src/
│   ├── components/
│   ├── data/
│   ├── i18n/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── src-tauri/
├── worker/
│   └── src/
│       ├── index.ts
│       └── counterwatch.ts
├── docs/
├── index.html
├── package.json
└── README.md
```

## Philosophy

OWTracker is designed around a simple principle:

> **Data without the clutter.**

The interface prioritizes the information that is useful for quickly understanding hero performance, live matchups, the current meta and player profiles without turning each page into an overloaded analytics dashboard.

## Disclaimer

OWTracker is an independent project and is not affiliated with, endorsed by, sponsored by, or otherwise associated with Blizzard Entertainment, Counterwatch or OverFast.

Overwatch, Blizzard Entertainment and related names, logos, characters and assets are trademarks or intellectual property of their respective owners.

Counterwatch and OverFast are third-party data sources. Their statistics and availability remain subject to their respective services.

---

<div align="center">

**OWTracker · Built by AKP**

</div>
