<div align="center">

<img src="./public/owtracker-logo.png" alt="OWTracker" width="170" />

# OWTracker

**Understand the meta.**

Overwatch statistics, meta rankings, perks and player comparison in one focused interface.

[Open OWTracker](https://owtracker.net/) · [View repository](https://github.com/alexandrekp/OWtracker)

</div>

---

## About

OWTracker is an independent Overwatch companion available as both a web app and a desktop app.

The project brings together hero statistics, an OWTracker meta ranking, perk popularity and player comparison tools in a compact interface designed for quick competitive analysis.

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
S â‰¥ 85
A â‰¥ 70
B â‰¥ 55
C â‰¥ 40
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

OWTracker currently combines several data sources depending on the feature.

| Data | Source |
| --- | --- |
| Global hero statistics | Blizzard official Overwatch statistics |
| Win / Pick / Ban rates | Blizzard |
| Player profiles | OverFast |
| Perk popularity | Community data |
| Meta tiers | Calculated locally by OWTracker |

OWTracker does not claim that its generated tier list is an official Blizzard ranking.

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
â”œâ”€â”€ public/
â”œâ”€â”€ scripts/
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ components/
â”‚   â”œâ”€â”€ data/
â”‚   â”œâ”€â”€ services/
â”‚   â”œâ”€â”€ types/
â”‚   â”œâ”€â”€ utils/
â”‚   â”œâ”€â”€ App.tsx
â”‚   â””â”€â”€ main.tsx
â”œâ”€â”€ src-tauri/
â”œâ”€â”€ worker/
â”œâ”€â”€ docs/
â”œâ”€â”€ index.html
â”œâ”€â”€ package.json
â””â”€â”€ README.md
```

## Philosophy

OWTracker is designed around a simple principle:

> **Data without the clutter.**

The interface prioritizes the information that is useful for quickly understanding hero performance, the current meta and player profiles without turning each page into an overloaded analytics dashboard.

## Disclaimer

OWTracker is an independent project and is not affiliated with, endorsed by, sponsored by, or otherwise associated with Blizzard Entertainment.

Overwatch, Blizzard Entertainment and related names, logos, characters and assets are trademarks or intellectual property of their respective owners.

Third-party statistics and community data remain subject to the availability and accuracy of their respective sources.

---

<div align="center">

**OWTracker · Built by AKP**

</div>



