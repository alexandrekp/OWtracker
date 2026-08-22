import "./SeoIntro.css";

type SeoSection =
  | "stats"
  | "heroes"
  | "players"
  | "perks";

type SeoIntroProps = {
  section: SeoSection;
};

const CONTENT:
  Record<
    SeoSection,
    {
      eyebrow: string;
      title: string;
      description: string;
    }
  > = {
    stats: {
      eyebrow: "OVERWATCH STATS",
      title: "Overwatch hero stats and meta.",
      description:
        "Compare hero win rates, pick rates and ban rates, then explore OWTracker meta rankings by region, competitive rank and role.",
    },

    heroes: {
      eyebrow: "HERO DATABASE",
      title: "Explore Overwatch hero performance.",
      description:
        "Browse every hero and compare meta score, win rate, pick rate, ban rate, role ranking and recommended perks.",
    },

    players: {
      eyebrow: "PLAYER STATS",
      title: "Search and compare Overwatch players.",
      description:
        "Review competitive ranks, hero performance and role statistics, then compare player profiles side by side.",
    },

    perks: {
      eyebrow: "HERO PERKS",
      title: "Overwatch perk popularity and choices.",
      description:
        "Explore Minor and Major hero perks, community popularity and recommended choices by hero and role.",
    },
  };

const LINKS:
  Array<{
    section: SeoSection;
    label: string;
    href: string;
  }> = [
    {
      section: "stats",
      label: "Stats & Meta",
      href: "/stats",
    },
    {
      section: "heroes",
      label: "Heroes",
      href: "/heroes",
    },
    {
      section: "players",
      label: "Players",
      href: "/players",
    },
    {
      section: "perks",
      label: "Perks",
      href: "/perks",
    },
  ];

function SeoIntro({
  section,
}: SeoIntroProps) {
  const content =
    CONTENT[section];

  return (
    <section
      className="seo-intro"
      aria-label={
        content.title
      }
    >
      <div className="seo-intro-copy">
        <span className="seo-intro-eyebrow">
          {content.eyebrow}
        </span>

        <h1>
          {content.title}
        </h1>

        <p>
          {content.description}
        </p>
      </div>

      <nav
        className="seo-intro-links"
        aria-label="OWTracker sections"
      >
        {LINKS.filter(
          (link) =>
            link.section !== section,
        ).map((link) => (
          <a
            key={link.section}
            href={link.href}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </section>
  );
}

export default SeoIntro;
