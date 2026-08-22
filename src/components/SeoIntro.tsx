import "./SeoIntro.css";

import {
  useI18n,
} from "../i18n/i18n";

type SeoSection =
  | "stats"
  | "heroes"
  | "counters"
  | "players"
  | "perks";

type SeoIntroProps = {
  section: SeoSection;
};

function SeoIntro({
  section,
}: SeoIntroProps) {
  const {
    t,
  } = useI18n();

  const content = {
    stats: {
      eyebrow:
        t("seo.stats.eyebrow"),
      title:
        t("seo.stats.title"),
      description:
        t("seo.stats.description"),
    },

    heroes: {
      eyebrow:
        t("seo.heroes.eyebrow"),
      title:
        t("seo.heroes.title"),
      description:
        t("seo.heroes.description"),
    },

    counters: {
      eyebrow:
        t("seo.counters.eyebrow"),
      title:
        t("seo.counters.title"),
      description:
        t("seo.counters.description"),
    },

    players: {
      eyebrow:
        t("seo.players.eyebrow"),
      title:
        t("seo.players.title"),
      description:
        t("seo.players.description"),
    },

    perks: {
      eyebrow:
        t("seo.perks.eyebrow"),
      title:
        t("seo.perks.title"),
      description:
        t("seo.perks.description"),
    },
  }[section];

  return (
    <section
      className="seo-intro"
      aria-label={
        content.title
      }
    >
      <span className="seo-intro-eyebrow">
        {content.eyebrow}
      </span>

      <h1>
        {content.title}
      </h1>

      <p>
        {content.description}
      </p>
    </section>
  );
}

export default SeoIntro;