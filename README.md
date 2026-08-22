<div align="center">

<img src="./public/owtracker-logo.png" alt="OWTracker" width="170" />

# OWTracker

**Understand the meta.**

Overwatch statistics, live hero counters, meta rankings, perks and player comparison in one focused interface.

[Open OWTracker](https://owtracker.net/) · [View repository](https://github.com/alexandrekp/OWtracker)

</div>

---

## About

OWTracker is an independent Overwatch companion available as both a web app and a desktop app.

The project brings together official Blizzard hero statistics, live community hero matchups from Counterwatch, an OWTracker meta ranking, perk popularity and player comparison tools in a compact interface designed for quick competitive analysis.

The web version includes a public landing page, while the desktop version launches directly into the OWTracker interface.

## Features

### Statistics

- Hero win rate
- Pick rate
- Ban rate
- Region filters
- Rank filters
- Role filters
- Local caching and configurable refresh intervals
- Manual Blizzard data refresh

### Meta ranking

OWTracker generates its own meta score from the active Blizzard hero dataset.

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
- Current tier and meta score
- Overall and role ranking
- Recommended perks
- Hero positioning inside the current roster
- Live Counterwatch matchup tab

### Counters

OWTracker retrieves current community matchup data on demand from Counterwatch hero pages through the OWTracker Cloudflare Worker.

For each supported hero, the Counters page can display:

- Hardest matchups (`Countered by`)
- Favorable matchups (`Strong against`)
- Counter rating
- Estimated fight swing when available
- Confidence level
- Counterwatch hero win rate
- Number of tracked matches
- Counterwatch tier
- Source update date
- Rank-by-rank Counterwatch statistics in the backend response

Counter rating is a relative matchup metric and is **not** a raw matchup win rate.

Counterwatch data is community data and is separate from Blizzard's official hero statistics.

### Players

- Player search
- Competitive ranks
- Role comparison
- Hero performance
- Side-by-side player comparison
- Shared hero analysis

### Perks

- Minor and Major perks
- Perk popularity
- Recommended community choices
- Search by hero or perk
- Role filtering

### Settings

- Default region
- Default competitive rank
- Default role
- Configurable cache / refresh interval
- Persistent local preferences

## Data sources

OWTracker combines several data sources depending on the feature.

| Data | Source |
| --- | --- |
| Global hero statistics | Blizzard official Overwatch statistics |
| Win / Pick / Ban rates | Blizzard |
| Hero counter ratings and matchup data | Counterwatch |
| Player profiles and individual statistics | OverFast |
| Perk popularity | Community data |
| Meta tiers | Calculated locally by OWTracker |

OWTracker does not claim that its generated tier list is an official Blizzard ranking.

Counterwatch matchup data is third-party community data. It is retrieved on demand through the OWTracker Worker and can change as Counterwatch updates its public hero pages.

## Counterwatch integration

The frontend requests matchup data from the OWTracker Worker:

```text
/api/counterwatch?hero=<heroId>
```

Example:

```text
/api/counterwatch?hero=winston
```

The Worker retrieves the corresponding Counterwatch hero page, parses the public matchup information and returns normalized JSON to OWTracker.

The response currently includes:

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

This keeps Counterwatch-specific parsing outside the React components and gives both the dedicated Counters page and Hero Detail the same normalized data source.

## Tech stack

### Frontend

- React 19
- TypeScript
- Vite
- Lucide React
- Responsive CSS

### Desktop

- Tauri 2
- Rust

### Data / backend

- Blizzard Overwatch statistics
- Counterwatch community matchup data
- OverFast player API
- Cloudflare Worker

### Deployment

- GitHub
- GitHub Pages
- Cloudflare

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

The production files are generated inside:

```text
dist/
```

For the current GitHub Pages deployment workflow:

```powershell
Remove-Item .\docs\* -Recurse -Force
Copy-Item .\dist\* .\docs\ -Recurse -Force
```

Then commit and push the generated deployment:

```bash
git add .
git commit -m "Deploy latest OWTracker web build"
git push
```

## Project structure

```text
OWtracker/
├── public/
├── scripts/
├── src/
│   ├── components/
│   ├── data/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── src-tauri/
├── worker/
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

OWTracker is an independent project and is not affiliated with, endorsed by, sponsored by, or otherwise associated with Blizzard Entertainment or Counterwatch.

Overwatch, Blizzard Entertainment and related names, logos, characters and assets are trademarks or intellectual property of their respective owners.

Counterwatch and OverFast are third-party data sources. Their statistics and availability remain subject to their respective services.

---

<div align="center">

**OWTracker · Built by AKP**

</div>
