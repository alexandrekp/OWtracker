import {
  useEffect,
  useMemo,
  useState,
} from "react";

export type AppLanguage =
  | "auto"
  | "en"
  | "fr"
  | "de"
  | "es"
  | "pt-BR"
  | "ko"
  | "ja"
  | "zh-CN"
  | "ru";

export type ResolvedLanguage =
  Exclude<
    AppLanguage,
    "auto"
  >;

export const LANGUAGE_OPTIONS:
  {
    value: AppLanguage;
    label: string;
  }[] = [
    {
      value: "auto",
      label: "Auto (System)",
    },
    {
      value: "en",
      label: "English",
    },
    {
      value: "fr",
      label: "Français",
    },
    {
      value: "de",
      label: "Deutsch",
    },
    {
      value: "es",
      label: "Español",
    },
    {
      value: "pt-BR",
      label: "Português (Brasil)",
    },
    {
      value: "ko",
      label: "한국어",
    },
    {
      value: "ja",
      label: "日本語",
    },
    {
      value: "zh-CN",
      label: "简体中文",
    },
    {
      value: "ru",
      label: "Русский",
    },
  ];

const EN = {
  "nav.stats": "Stats",
  "nav.players": "Players",
  "nav.heroes": "Heroes",
  "nav.counters": "Counters",
  "nav.perks": "Perks",
  "nav.settings": "Settings",

  "settings.title": "Settings",
  "settings.subtitle":
    "Defaults, refresh behavior, data sources and application information.",
  "settings.saved": "Saved automatically",

  "settings.language.eyebrow": "LANGUAGE",
  "settings.language.title": "Interface language",
  "settings.language.label": "Language",
  "settings.language.detail":
    "Auto uses your browser or operating system language.",
  "settings.language.active": "Active language",
  "settings.language.auto":
    "Detected automatically from your system.",
  "settings.language.manual":
    "Selected manually and saved locally.",

  "settings.stats.eyebrow": "DEFAULT STATS",
  "settings.stats.title": "Statistics preferences",
  "settings.stats.region": "Default region",
  "settings.stats.regionDetail": "Used when opening Stats.",
  "settings.stats.rank": "Default rank",
  "settings.stats.rankDetail": "Competitive rank filter.",
  "settings.stats.role": "Default role",
  "settings.stats.roleDetail": "Hero role loaded by default.",
  "settings.allRanks": "All ranks",
  "settings.allRoles": "All roles",

  "settings.cache.eyebrow": "CACHE",
  "settings.cache.title": "Refresh behavior",
  "settings.cache.duration": "Cache duration",
  "settings.cache.durationDetail":
    "After this delay Stats suggests a refresh.",
  "settings.cache.current": "Current behavior",
  "settings.cache.valid":
    "Cached Blizzard data remains valid for this duration.",
  "settings.cache.defaults": "Defaults",
  "settings.cache.defaultsDetail":
    "Applied next time you open the Stats page.",
  "settings.cache.reset": "Reset defaults",
  "settings.minutes": "minutes",
  "settings.hour": "1 hour",
  "settings.hours2": "2 hours",

  "settings.app.eyebrow": "APPLICATION",
  "settings.app.title": "About OWTracker",
  "settings.app.version": "Version",
  "settings.app.currentRelease": "Current release",
  "settings.app.platform": "Platform",
  "settings.app.game": "Game",
  "settings.app.pcStats": "PC statistics",
  "settings.app.website": "Website",
  "settings.app.publicWeb": "Public web version.",
  "settings.app.source": "Source",
  "settings.app.repo": "GitHub repository",
  "settings.app.repoDetail": "Source code and project history.",

  "settings.data.eyebrow": "DATA",
  "settings.data.title": "Data sources",
  "settings.data.blizzardDetail":
    "Global hero win, pick and ban rates.",
  "settings.data.overfastDetail":
    "Player profiles, competitive ranks and individual statistics.",
  "settings.data.counterwatchDetail":
    "Hero counter ratings, fight swing and community matchup data.",
  "settings.data.perks": "Community perks",
  "settings.data.perksDetail":
    "Perk popularity and community preference data.",
  "settings.data.metaDetail":
    "Calculated locally from normalized WR 60%, PR 30% and BR 10%.",
  "settings.data.cache": "Local cache",
  "settings.data.cacheDetail":
    "Stores recent datasets and your application preferences.",

  "settings.meta.eyebrow": "META METHOD",
  "settings.meta.title": "How the ranking works",
  "settings.meta.win": "Win Rate",
  "settings.meta.winDetail": "Main performance signal.",
  "settings.meta.pick": "Pick Rate",
  "settings.meta.pickDetail": "Measures current presence.",
  "settings.meta.ban": "Ban Rate",
  "settings.meta.banDetail": "Adds competitive pressure.",
  "settings.meta.ranking": "OWTracker ranking",
  "settings.meta.explain1":
    "Win, pick and ban rates are normalized inside the active dataset before the weighted Meta Score is calculated.",
  "settings.meta.explain2":
    "The resulting tier list is an OWTracker interpretation and is not an official Blizzard ranking.",

  "settings.disclaimer.title": "Independent project",
  "settings.disclaimer.text":
    "OWTracker is an independent project and is not affiliated with, endorsed by or sponsored by Blizzard Entertainment.",
  "settings.disclaimer.storage":
    "Language, region, rank, role and cache duration are stored locally in OWTracker using localStorage.",
  "seo.stats.eyebrow": "OVERWATCH STATS",
  "seo.stats.title": "Overwatch hero stats and meta.",
  "seo.stats.description":
    "Compare hero win rates, pick rates and ban rates, then explore OWTracker meta rankings by region, competitive rank and role.",

  "seo.heroes.eyebrow": "HERO DATABASE",
  "seo.heroes.title": "Explore Overwatch hero performance.",
  "seo.heroes.description":
    "Browse every hero and compare meta score, win rate, pick rate, ban rate, role ranking and recommended perks.",

  "seo.counters.eyebrow": "HERO COUNTERS",
  "seo.counters.title": "Explore Overwatch hero counters.",
  "seo.counters.description":
    "Review live Counterwatch matchup data, difficult matchups and favorable hero matchups in one focused view.",

  "seo.players.eyebrow": "PLAYER STATS",
  "seo.players.title": "Search and compare Overwatch players.",
  "seo.players.description":
    "Review competitive ranks, hero performance and role statistics, then compare player profiles side by side.",

  "seo.perks.eyebrow": "HERO PERKS",
  "seo.perks.title": "Overwatch perk popularity and choices.",
  "seo.perks.description":
    "Explore Minor and Major hero perks, community popularity and recommended choices by hero and role.",


  "player.platform.label": "Platform",
  "player.platform.detail": "Load PC or console career data.",
  "player.platform.pc": "PC",
  "player.platform.console": "Console",
  "player.mode.label": "Mode",
  "player.mode.detail": "Select which career statistics to display.",
  "player.mode.all": "All modes",
  "player.mode.competitive": "Competitive",
  "player.mode.quickplay": "Quick Play",
  "player.average.eyebrow": "AVERAGE / 10 MIN",
  "player.average.title": "Performance pace",
  "player.stat.eliminations": "Eliminations",
  "player.stat.assists": "Assists",
  "player.stat.deaths": "Deaths",
  "player.stat.damage": "Damage",
  "player.stat.healing": "Healing",
  "player.competitive.eyebrow": "COMPETITIVE",
  "player.competitive.ranks": "ranks",
  "player.competitive.season": "Season",
  "player.role.tank": "Tank",
  "player.role.damage": "Damage",
  "player.role.support": "Support",
  "player.roleDistribution.eyebrow": "ROLE DISTRIBUTION",
  "player.roleDistribution.title": "Time played by role",
  "player.bestHeroes.eyebrow": "BEST HEROES",
  "player.bestHeroes.title": "Best performing heroes",
  "player.bestHeroes.games": "games",
  "player.bestHeroes.notEnough": "Not enough games yet.",
  "player.bestHeroes.minimum": "Minimum 10 games.",
  "player.career.eyebrow": "ADVANCED CAREER",
  "player.career.title": "Detailed career statistics",
  "player.career.chooseMode": "Choose Competitive or Quick Play to load advanced career statistics.",
  "player.career.hero": "Hero",
  "player.career.allHeroes": "All heroes",
  "player.career.combat": "Combat",
  "player.career.game": "Game",
  "player.career.best": "Best",
  "player.career.average": "Average",
  "player.career.assists": "Assists",
  "player.career.heroSpecific": "Hero specific",
  "player.career.loading": "Loading advanced career stats...",
  "player.career.noData": "No statistics available for this category.",
  "player.copyBattleTag": "Copy BattleTag",
  "player.showAllHeroes": "Show all heroes",
  "player.showTop10": "Show top 10",
  "player.error.noPcStats": "No PC statistics are available for this public profile.",
  "player.error.noConsoleStats": "No Console statistics are available for this public profile.",

  "settings.region.europe": "Europe",
  "settings.region.americas": "Americas",
  "settings.region.asia": "Asia",
  "settings.tier.bronze": "Bronze",
  "settings.tier.silver": "Silver",
  "settings.tier.gold": "Gold",
  "settings.tier.platinum": "Platinum",
  "settings.tier.diamond": "Diamond",
  "settings.tier.master": "Master",
  "settings.tier.grandmaster": "Grandmaster",
  "settings.tier.champion": "Champion",
  "settings.role.tank": "Tank",
  "settings.role.damage": "Damage",
  "settings.role.support": "Support",
  "settings.data.blizzardTitle": "Blizzard statistics",
  "settings.data.overfastTitle": "OverFast",
  "settings.data.counterwatchTitle": "Counterwatch",
  "settings.data.metaTitle": "OWTracker Meta Score",
  "settings.status.live": "LIVE",
  "settings.status.playerData": "PLAYER DATA",
  "settings.status.matchupData": "MATCHUP DATA",
  "settings.status.community": "COMMUNITY",
  "settings.status.calculated": "CALCULATED",
  "settings.status.active": "ACTIVE",
  "settings.cache.minShort": "min",

  "player.competitive.format": "Rank format",
  "player.competitive.5v5": "5v5 · Role Queue",
  "player.competitive.6v6": "6v6 · Open Queue",
  "player.competitive.openQueue": "Open Queue",

  "settings.stats.format": "Default format",
  "settings.stats.formatDetail": "Blizzard ranked format used by Stats.",
  "settings.format.5v5": "5v5 · Role Queue",
  "settings.format.6v6": "6v6 · Open Queue",
  "settings.format.5v5Short": "5v5",
  "settings.format.6v6Short": "6v6",

} as const;

export type TranslationKey =
  keyof typeof EN;

const OVERRIDES:
  Record<
    ResolvedLanguage,
    Partial<Record<TranslationKey, string>>
  > = {
  en: {},

  fr: {
    "nav.stats": "Statistiques",
    "nav.players": "Joueurs",
    "nav.heroes": "Héros",
    "nav.counters": "Contres",
    "nav.perks": "Atouts",
    "nav.settings": "Paramètres",

    "settings.title": "Paramètres",
    "settings.subtitle":
      "Valeurs par défaut, actualisation, sources de données et informations sur l’application.",
    "settings.saved": "Enregistré automatiquement",

    "settings.language.eyebrow": "LANGUE",
    "settings.language.title": "Langue de l’interface",
    "settings.language.label": "Langue",
    "settings.language.detail":
      "Auto utilise la langue de votre navigateur ou de votre système.",
    "settings.language.active": "Langue active",
    "settings.language.auto":
      "Détectée automatiquement depuis votre système.",
    "settings.language.manual":
      "Sélectionnée manuellement et enregistrée localement.",

    "settings.stats.eyebrow": "STATISTIQUES PAR DÉFAUT",
    "settings.stats.title": "Préférences des statistiques",
    "settings.stats.region": "Région par défaut",
    "settings.stats.regionDetail": "Utilisée à l’ouverture des Statistiques.",
    "settings.stats.rank": "Rang par défaut",
    "settings.stats.rankDetail": "Filtre de rang compétitif.",
    "settings.stats.role": "Rôle par défaut",
    "settings.stats.roleDetail": "Rôle de héros chargé par défaut.",
    "settings.allRanks": "Tous les rangs",
    "settings.allRoles": "Tous les rôles",

    "settings.cache.eyebrow": "CACHE",
    "settings.cache.title": "Actualisation",
    "settings.cache.duration": "Durée du cache",
    "settings.cache.durationDetail":
      "Après ce délai, les Statistiques proposent une actualisation.",
    "settings.cache.current": "Comportement actuel",
    "settings.cache.valid":
      "Les données Blizzard en cache restent valides pendant cette durée.",
    "settings.cache.defaults": "Valeurs par défaut",
    "settings.cache.defaultsDetail":
      "Appliquées à la prochaine ouverture de la page Statistiques.",
    "settings.cache.reset": "Réinitialiser",
    "settings.minutes": "minutes",
    "settings.hour": "1 heure",
    "settings.hours2": "2 heures",

    "settings.app.eyebrow": "APPLICATION",
    "settings.app.title": "À propos d’OWTracker",
    "settings.app.version": "Version",
    "settings.app.currentRelease": "Version actuelle",
    "settings.app.platform": "Plateforme",
    "settings.app.game": "Jeu",
    "settings.app.pcStats": "Statistiques PC",
    "settings.app.website": "Site web",
    "settings.app.publicWeb": "Version web publique.",
    "settings.app.source": "Source",
    "settings.app.repo": "Dépôt GitHub",
    "settings.app.repoDetail": "Code source et historique du projet.",

    "settings.data.eyebrow": "DONNÉES",
    "settings.data.title": "Sources de données",
    "settings.data.blizzardDetail":
      "Taux de victoire, de sélection et de bannissement globaux des héros.",
    "settings.data.overfastDetail":
      "Profils joueurs, rangs compétitifs et statistiques individuelles.",
    "settings.data.counterwatchDetail":
      "Notes de contre, impact en combat et données communautaires de matchup.",
    "settings.data.perks": "Atouts communautaires",
    "settings.data.perksDetail":
      "Popularité des atouts et préférences de la communauté.",
    "settings.data.metaDetail":
      "Calculé localement avec WR 60 %, PR 30 % et BR 10 % normalisés.",
    "settings.data.cache": "Cache local",
    "settings.data.cacheDetail":
      "Stocke les données récentes et vos préférences.",

    "settings.meta.eyebrow": "MÉTHODE META",
    "settings.meta.title": "Fonctionnement du classement",
    "settings.meta.win": "Taux de victoire",
    "settings.meta.winDetail": "Signal principal de performance.",
    "settings.meta.pick": "Taux de sélection",
    "settings.meta.pickDetail": "Mesure la présence actuelle.",
    "settings.meta.ban": "Taux de bannissement",
    "settings.meta.banDetail": "Ajoute la pression compétitive.",
    "settings.meta.ranking": "Classement OWTracker",
    "settings.meta.explain1":
      "Les taux de victoire, sélection et bannissement sont normalisés dans le dataset actif avant le calcul du Meta Score pondéré.",
    "settings.meta.explain2":
      "La tier list obtenue est une interprétation OWTracker et non un classement officiel Blizzard.",

    "settings.disclaimer.title": "Projet indépendant",
    "settings.disclaimer.text":
      "OWTracker est un projet indépendant, non affilié, approuvé ou sponsorisé par Blizzard Entertainment.",
    "settings.disclaimer.storage":
      "La langue, la région, le rang, le rôle et la durée du cache sont stockés localement dans OWTracker via localStorage.",

    "seo.stats.eyebrow": "STATISTIQUES OVERWATCH",
    "seo.stats.title": "Statistiques des héros et méta Overwatch.",
    "seo.stats.description":
      "Comparez les taux de victoire, de sélection et de bannissement, puis explorez le classement méta OWTracker par région, rang compétitif et rôle.",

    "seo.heroes.eyebrow": "BASE DE HÉROS",
    "seo.heroes.title": "Explorez les performances des héros Overwatch.",
    "seo.heroes.description":
      "Parcourez tous les héros et comparez le Meta Score, le taux de victoire, le taux de sélection, le taux de bannissement, le classement par rôle et les atouts recommandés.",

    "seo.counters.eyebrow": "CONTRES DES HÉROS",
    "seo.counters.title": "Explorez les contres des héros Overwatch.",
    "seo.counters.description":
      "Consultez les données de matchup Counterwatch en direct, les affrontements difficiles et les matchups favorables dans une vue claire.",

    "seo.players.eyebrow": "STATISTIQUES JOUEURS",
    "seo.players.title": "Recherchez et comparez des joueurs Overwatch.",
    "seo.players.description":
      "Consultez les rangs compétitifs, les performances des héros et les statistiques par rôle, puis comparez les profils côte à côte.",

    "seo.perks.eyebrow": "ATOUTS DES HÉROS",
    "seo.perks.title": "Popularité et choix des atouts Overwatch.",
    "seo.perks.description":
      "Explorez les atouts mineurs et majeurs, leur popularité dans la communauté et les choix recommandés par héros et par rôle.",



    "player.platform.label": "Plateforme",
    "player.platform.detail": "Charge les données de carrière PC ou console.",
    "player.platform.pc": "PC",
    "player.platform.console": "Console",
    "player.mode.label": "Mode",
    "player.mode.detail": "Choisissez les statistiques de carrière à afficher.",
    "player.mode.all": "Tous les modes",
    "player.mode.competitive": "Compétitif",
    "player.mode.quickplay": "Partie rapide",
    "player.average.eyebrow": "MOYENNE / 10 MIN",
    "player.average.title": "Rythme de performance",
    "player.stat.eliminations": "Éliminations",
    "player.stat.assists": "Assistances",
    "player.stat.deaths": "Morts",
    "player.stat.damage": "Dégâts",
    "player.stat.healing": "Soins",
    "player.competitive.eyebrow": "COMPÉTITIF",
    "player.competitive.ranks": "rangs",
    "player.competitive.season": "Saison",
    "player.role.tank": "Tank",
    "player.role.damage": "Dégâts",
    "player.role.support": "Soutien",
    "player.roleDistribution.eyebrow": "RÉPARTITION DES RÔLES",
    "player.roleDistribution.title": "Temps de jeu par rôle",
    "player.bestHeroes.eyebrow": "MEILLEURS HÉROS",
    "player.bestHeroes.title": "Héros les plus performants",
    "player.bestHeroes.games": "parties",
    "player.bestHeroes.notEnough": "Pas encore assez de parties.",
    "player.bestHeroes.minimum": "Minimum 10 parties.",
    "player.career.eyebrow": "CARRIÈRE AVANCÉE",
    "player.career.title": "Statistiques de carrière détaillées",
    "player.career.chooseMode": "Choisissez Compétitif ou Partie rapide pour charger les statistiques de carrière avancées.",
    "player.career.hero": "Héros",
    "player.career.allHeroes": "Tous les héros",
    "player.career.combat": "Combat",
    "player.career.game": "Partie",
    "player.career.best": "Records",
    "player.career.average": "Moyenne",
    "player.career.assists": "Assistances",
    "player.career.heroSpecific": "Spécifique au héros",
    "player.career.loading": "Chargement des statistiques de carrière avancées...",
    "player.career.noData": "Aucune statistique disponible pour cette catégorie.",
    "player.copyBattleTag": "Copier le BattleTag",
    "player.showAllHeroes": "Afficher tous les héros",
    "player.showTop10": "Afficher le top 10",
    "player.error.noPcStats": "Aucune statistique PC n’est disponible pour ce profil public.",
    "player.error.noConsoleStats": "Aucune statistique Console n’est disponible pour ce profil public.",
    "settings.cache.minShort": "min",
    "settings.data.blizzardTitle": "Statistiques Blizzard",
    "settings.data.overfastTitle": "OverFast",
    "settings.data.counterwatchTitle": "Counterwatch",
    "settings.data.metaTitle": "Meta Score OWTracker",
    "settings.status.live": "EN DIRECT",
    "settings.status.playerData": "DONNÉES JOUEUR",
    "settings.status.matchupData": "DONNÉES MATCHUP",
    "settings.status.community": "COMMUNAUTÉ",
    "settings.status.calculated": "CALCULÉ",
    "settings.status.active": "ACTIF",
    "settings.region.europe": "Europe",
    "settings.region.americas": "Amériques",
    "settings.region.asia": "Asie",
    "settings.tier.bronze": "Bronze",
    "settings.tier.silver": "Argent",
    "settings.tier.gold": "Or",
    "settings.tier.platinum": "Platine",
    "settings.tier.diamond": "Diamant",
    "settings.tier.master": "Maître",
    "settings.tier.grandmaster": "Grand maître",
    "settings.tier.champion": "Champion",
    "settings.role.tank": "Tank",
    "settings.role.damage": "Dégâts",
    "settings.role.support": "Soutien",

    "player.competitive.format": "Format classé",
    "player.competitive.5v5": "5v5 · File par rôle",
    "player.competitive.6v6": "6v6 · File ouverte",
    "player.competitive.openQueue": "File ouverte",

    "settings.stats.format": "Format par défaut",
    "settings.stats.formatDetail": "Format classé Blizzard utilisé dans les Statistiques.",
    "settings.format.5v5": "5v5 · File par rôle",
    "settings.format.6v6": "6v6 · File ouverte",
    "settings.format.5v5Short": "5v5",
    "settings.format.6v6Short": "6v6",
  },

  de: {
    "nav.stats": "Statistiken",
    "nav.players": "Spieler",
    "nav.heroes": "Helden",
    "nav.counters": "Konter",
    "nav.perks": "Perks",
    "nav.settings": "Einstellungen",
    "settings.title": "Einstellungen",
    "settings.subtitle":
      "Standardwerte, Aktualisierung, Datenquellen und Anwendungsinformationen.",
    "settings.saved": "Automatisch gespeichert",
    "settings.language.eyebrow": "SPRACHE",
    "settings.language.title": "Oberflächensprache",
    "settings.language.label": "Sprache",
    "settings.language.detail":
      "Auto verwendet die Sprache deines Browsers oder Betriebssystems.",
    "settings.language.active": "Aktive Sprache",
    "settings.language.auto": "Automatisch vom System erkannt.",
    "settings.language.manual": "Manuell ausgewählt und lokal gespeichert.",
    "settings.stats.eyebrow": "STANDARDSTATISTIKEN",
    "settings.stats.title": "Statistik-Einstellungen",
    "settings.stats.region": "Standardregion",
    "settings.stats.rank": "Standardrang",
    "settings.stats.role": "Standardrolle",
    "settings.allRanks": "Alle Ränge",
    "settings.allRoles": "Alle Rollen",
    "settings.cache.title": "Aktualisierungsverhalten",
    "settings.cache.duration": "Cache-Dauer",
    "settings.cache.current": "Aktuelles Verhalten",
    "settings.cache.defaults": "Standardwerte",
    "settings.cache.reset": "Zurücksetzen",
    "settings.minutes": "Minuten",
    "settings.hour": "1 Stunde",
    "settings.hours2": "2 Stunden",
    "settings.app.title": "Über OWTracker",
    "settings.data.title": "Datenquellen",
    "settings.meta.title": "So funktioniert das Ranking",
    "settings.disclaimer.title": "Unabhängiges Projekt",


    "player.platform.label": "Plattform",
    "player.platform.detail": "PC- oder Konsolen-Karrieredaten laden.",
    "player.platform.pc": "PC",
    "player.platform.console": "Konsole",
    "player.mode.label": "Modus",
    "player.mode.detail": "Wähle die anzuzeigenden Karrierestatistiken.",
    "player.mode.all": "Alle Modi",
    "player.mode.competitive": "Wettkampf",
    "player.mode.quickplay": "Schnellspiel",
    "player.average.eyebrow": "DURCHSCHNITT / 10 MIN",
    "player.average.title": "Leistungstempo",
    "player.stat.eliminations": "Eliminierungen",
    "player.stat.assists": "Assists",
    "player.stat.deaths": "Tode",
    "player.stat.damage": "Schaden",
    "player.stat.healing": "Heilung",
    "player.competitive.eyebrow": "WETTKAMPF",
    "player.competitive.ranks": "Ränge",
    "player.competitive.season": "Saison",
    "player.role.tank": "Tank",
    "player.role.damage": "Schaden",
    "player.role.support": "Unterstützung",
    "player.roleDistribution.eyebrow": "ROLLENVERTEILUNG",
    "player.roleDistribution.title": "Spielzeit nach Rolle",
    "player.bestHeroes.eyebrow": "BESTE HELDEN",
    "player.bestHeroes.title": "Leistungsstärkste Helden",
    "player.bestHeroes.games": "Spiele",
    "player.bestHeroes.notEnough": "Noch nicht genug Spiele.",
    "player.bestHeroes.minimum": "Mindestens 10 Spiele.",
    "player.career.eyebrow": "ERWEITERTE KARRIERE",
    "player.career.title": "Detaillierte Karrierestatistiken",
    "player.career.chooseMode": "Wähle Wettkampf oder Schnellspiel, um erweiterte Karrierestatistiken zu laden.",
    "player.career.hero": "Held",
    "player.career.allHeroes": "Alle Helden",
    "player.career.combat": "Kampf",
    "player.career.game": "Spiel",
    "player.career.best": "Bestwerte",
    "player.career.average": "Durchschnitt",
    "player.career.assists": "Assists",
    "player.career.heroSpecific": "Heldenspezifisch",
    "player.career.loading": "Erweiterte Karrierestatistiken werden geladen...",
    "player.career.noData": "Für diese Kategorie sind keine Statistiken verfügbar.",
    "player.copyBattleTag": "BattleTag kopieren",
    "player.showAllHeroes": "Alle Helden anzeigen",
    "player.showTop10": "Top 10 anzeigen",
    "player.error.noPcStats": "Für dieses öffentliche Profil sind keine PC-Statistiken verfügbar.",
    "player.error.noConsoleStats": "Für dieses öffentliche Profil sind keine Konsolen-Statistiken verfügbar.",
    "settings.stats.regionDetail": "Wird beim Öffnen der Statistiken verwendet.",
    "settings.stats.rankDetail": "Filter für den Wettkampfrang.",
    "settings.stats.roleDetail": "Standardmäßig geladene Heldenrolle.",
    "settings.cache.eyebrow": "CACHE",
    "settings.cache.durationDetail": "Nach dieser Zeit wird in den Statistiken eine Aktualisierung vorgeschlagen.",
    "settings.cache.valid": "Zwischengespeicherte Blizzard-Daten bleiben für diese Dauer gültig.",
    "settings.cache.defaultsDetail": "Werden beim nächsten Öffnen der Statistikseite angewendet.",
    "settings.cache.minShort": "Min.",
    "settings.app.eyebrow": "ANWENDUNG",
    "settings.app.version": "Version",
    "settings.app.currentRelease": "Aktuelle Version",
    "settings.app.platform": "Plattform",
    "settings.app.game": "Spiel",
    "settings.app.pcStats": "PC-Statistiken",
    "settings.app.website": "Website",
    "settings.app.publicWeb": "Öffentliche Webversion.",
    "settings.app.source": "Quelle",
    "settings.app.repo": "GitHub-Repository",
    "settings.app.repoDetail": "Quellcode und Projektverlauf.",
    "settings.data.eyebrow": "DATEN",
    "settings.data.blizzardTitle": "Blizzard-Statistiken",
    "settings.data.blizzardDetail": "Globale Sieges-, Auswahl- und Bannraten der Helden.",
    "settings.data.overfastTitle": "OverFast",
    "settings.data.overfastDetail": "Spielerprofile, Wettkampfränge und individuelle Statistiken.",
    "settings.data.counterwatchTitle": "Counterwatch",
    "settings.data.counterwatchDetail": "Konterbewertungen, Kampfeinfluss und Community-Matchup-Daten.",
    "settings.data.perks": "Community-Perks",
    "settings.data.perksDetail": "Perk-Beliebtheit und Community-Präferenzen.",
    "settings.data.metaTitle": "OWTracker Meta Score",
    "settings.data.metaDetail": "Lokal berechnet aus normalisierten WR 60 %, PR 30 % und BR 10 %.",
    "settings.data.cache": "Lokaler Cache",
    "settings.data.cacheDetail": "Speichert aktuelle Datensätze und Anwendungseinstellungen.",
    "settings.status.live": "LIVE",
    "settings.status.playerData": "SPIELERDATEN",
    "settings.status.matchupData": "MATCHUP-DATEN",
    "settings.status.community": "COMMUNITY",
    "settings.status.calculated": "BERECHNET",
    "settings.status.active": "AKTIV",
    "settings.meta.eyebrow": "META-METHODE",
    "settings.meta.win": "Siegesrate",
    "settings.meta.winDetail": "Hauptsignal für die Leistung.",
    "settings.meta.pick": "Auswahlrate",
    "settings.meta.pickDetail": "Misst die aktuelle Präsenz.",
    "settings.meta.ban": "Bannrate",
    "settings.meta.banDetail": "Berücksichtigt den Wettbewerbsdruck.",
    "settings.meta.ranking": "OWTracker-Ranking",
    "settings.meta.explain1": "Sieges-, Auswahl- und Bannraten werden im aktiven Datensatz normalisiert, bevor der gewichtete Meta Score berechnet wird.",
    "settings.meta.explain2": "Die daraus resultierende Tier-Liste ist eine OWTracker-Interpretation und kein offizielles Blizzard-Ranking.",
    "settings.disclaimer.text": "OWTracker ist ein unabhängiges Projekt und nicht mit Blizzard Entertainment verbunden, von Blizzard unterstützt oder gesponsert.",
    "settings.disclaimer.storage": "Sprache, Region, Rang, Rolle und Cache-Dauer werden lokal in OWTracker über localStorage gespeichert.",
    "settings.region.europe": "Europa",
    "settings.region.americas": "Amerika",
    "settings.region.asia": "Asien",
    "settings.tier.bronze": "Bronze",
    "settings.tier.silver": "Silber",
    "settings.tier.gold": "Gold",
    "settings.tier.platinum": "Platin",
    "settings.tier.diamond": "Diamant",
    "settings.tier.master": "Meister",
    "settings.tier.grandmaster": "Großmeister",
    "settings.tier.champion": "Champion",
    "settings.role.tank": "Tank",
    "settings.role.damage": "Schaden",
    "settings.role.support": "Unterstützung",

    "player.competitive.format": "Rangformat",
    "player.competitive.5v5": "5v5 · Rollenwahl",
    "player.competitive.6v6": "6v6 · Offene Wahl",
    "player.competitive.openQueue": "Offene Wahl",

    "settings.stats.format": "Standardformat",
    "settings.stats.formatDetail": "Blizzard-Wettkampfformat für Statistiken.",
    "settings.format.5v5": "5v5 · Rollenwahl",
    "settings.format.6v6": "6v6 · Offene Wahl",
    "settings.format.5v5Short": "5v5",
    "settings.format.6v6Short": "6v6",
  },

  es: {
    "nav.stats": "Estadísticas",
    "nav.players": "Jugadores",
    "nav.heroes": "Héroes",
    "nav.counters": "Counters",
    "nav.perks": "Ventajas",
    "nav.settings": "Ajustes",
    "settings.title": "Ajustes",
    "settings.subtitle":
      "Valores predeterminados, actualización, fuentes de datos e información de la aplicación.",
    "settings.saved": "Guardado automáticamente",
    "settings.language.eyebrow": "IDIOMA",
    "settings.language.title": "Idioma de la interfaz",
    "settings.language.label": "Idioma",
    "settings.language.detail":
      "Auto usa el idioma de tu navegador o sistema operativo.",
    "settings.language.active": "Idioma activo",
    "settings.language.auto": "Detectado automáticamente desde tu sistema.",
    "settings.language.manual": "Seleccionado manualmente y guardado localmente.",
    "settings.stats.eyebrow": "ESTADÍSTICAS PREDETERMINADAS",
    "settings.stats.title": "Preferencias de estadísticas",
    "settings.stats.region": "Región predeterminada",
    "settings.stats.rank": "Rango predeterminado",
    "settings.stats.role": "Rol predeterminado",
    "settings.allRanks": "Todos los rangos",
    "settings.allRoles": "Todos los roles",
    "settings.cache.title": "Actualización",
    "settings.cache.duration": "Duración de caché",
    "settings.cache.current": "Comportamiento actual",
    "settings.cache.defaults": "Predeterminados",
    "settings.cache.reset": "Restablecer",
    "settings.minutes": "minutos",
    "settings.hour": "1 hora",
    "settings.hours2": "2 horas",
    "settings.app.title": "Acerca de OWTracker",
    "settings.data.title": "Fuentes de datos",
    "settings.meta.title": "Cómo funciona la clasificación",
    "settings.disclaimer.title": "Proyecto independiente",


    "player.platform.label": "Plataforma",
    "player.platform.detail": "Carga datos de carrera de PC o consola.",
    "player.platform.pc": "PC",
    "player.platform.console": "Consola",
    "player.mode.label": "Modo",
    "player.mode.detail": "Selecciona las estadísticas de carrera que quieres mostrar.",
    "player.mode.all": "Todos los modos",
    "player.mode.competitive": "Competitivo",
    "player.mode.quickplay": "Partida rápida",
    "player.average.eyebrow": "PROMEDIO / 10 MIN",
    "player.average.title": "Ritmo de rendimiento",
    "player.stat.eliminations": "Eliminaciones",
    "player.stat.assists": "Asistencias",
    "player.stat.deaths": "Muertes",
    "player.stat.damage": "Daño",
    "player.stat.healing": "Curación",
    "player.competitive.eyebrow": "COMPETITIVO",
    "player.competitive.ranks": "rangos",
    "player.competitive.season": "Temporada",
    "player.role.tank": "Tanque",
    "player.role.damage": "Daño",
    "player.role.support": "Apoyo",
    "player.roleDistribution.eyebrow": "DISTRIBUCIÓN DE ROLES",
    "player.roleDistribution.title": "Tiempo jugado por rol",
    "player.bestHeroes.eyebrow": "MEJORES HÉROES",
    "player.bestHeroes.title": "Héroes con mejor rendimiento",
    "player.bestHeroes.games": "partidas",
    "player.bestHeroes.notEnough": "Aún no hay suficientes partidas.",
    "player.bestHeroes.minimum": "Mínimo 10 partidas.",
    "player.career.eyebrow": "CARRERA AVANZADA",
    "player.career.title": "Estadísticas de carrera detalladas",
    "player.career.chooseMode": "Selecciona Competitivo o Partida rápida para cargar estadísticas avanzadas de carrera.",
    "player.career.hero": "Héroe",
    "player.career.allHeroes": "Todos los héroes",
    "player.career.combat": "Combate",
    "player.career.game": "Partida",
    "player.career.best": "Récords",
    "player.career.average": "Promedio",
    "player.career.assists": "Asistencias",
    "player.career.heroSpecific": "Específico del héroe",
    "player.career.loading": "Cargando estadísticas avanzadas de carrera...",
    "player.career.noData": "No hay estadísticas disponibles para esta categoría.",
    "player.copyBattleTag": "Copiar BattleTag",
    "player.showAllHeroes": "Mostrar todos los héroes",
    "player.showTop10": "Mostrar top 10",
    "player.error.noPcStats": "No hay estadísticas de PC disponibles para este perfil público.",
    "player.error.noConsoleStats": "No hay estadísticas de consola disponibles para este perfil público.",
    "settings.stats.regionDetail": "Se usa al abrir Estadísticas.",
    "settings.stats.rankDetail": "Filtro de rango competitivo.",
    "settings.stats.roleDetail": "Rol de héroe cargado por defecto.",
    "settings.cache.eyebrow": "CACHÉ",
    "settings.cache.durationDetail": "Tras este tiempo, Estadísticas sugiere una actualización.",
    "settings.cache.valid": "Los datos de Blizzard en caché siguen siendo válidos durante este tiempo.",
    "settings.cache.defaultsDetail": "Se aplican la próxima vez que abras Estadísticas.",
    "settings.cache.minShort": "min",
    "settings.app.eyebrow": "APLICACIÓN",
    "settings.app.version": "Versión",
    "settings.app.currentRelease": "Versión actual",
    "settings.app.platform": "Plataforma",
    "settings.app.game": "Juego",
    "settings.app.pcStats": "Estadísticas de PC",
    "settings.app.website": "Sitio web",
    "settings.app.publicWeb": "Versión web pública.",
    "settings.app.source": "Fuente",
    "settings.app.repo": "Repositorio de GitHub",
    "settings.app.repoDetail": "Código fuente e historial del proyecto.",
    "settings.data.eyebrow": "DATOS",
    "settings.data.blizzardTitle": "Estadísticas de Blizzard",
    "settings.data.blizzardDetail": "Tasas globales de victoria, selección y veto de héroes.",
    "settings.data.overfastTitle": "OverFast",
    "settings.data.overfastDetail": "Perfiles de jugadores, rangos competitivos y estadísticas individuales.",
    "settings.data.counterwatchTitle": "Counterwatch",
    "settings.data.counterwatchDetail": "Valoraciones de counters, impacto en combate y datos comunitarios de enfrentamientos.",
    "settings.data.perks": "Ventajas de la comunidad",
    "settings.data.perksDetail": "Popularidad de ventajas y preferencias de la comunidad.",
    "settings.data.metaTitle": "Meta Score de OWTracker",
    "settings.data.metaDetail": "Calculado localmente con WR 60 %, PR 30 % y BR 10 % normalizados.",
    "settings.data.cache": "Caché local",
    "settings.data.cacheDetail": "Guarda datos recientes y tus preferencias.",
    "settings.status.live": "EN VIVO",
    "settings.status.playerData": "DATOS DE JUGADOR",
    "settings.status.matchupData": "DATOS DE MATCHUP",
    "settings.status.community": "COMUNIDAD",
    "settings.status.calculated": "CALCULADO",
    "settings.status.active": "ACTIVO",
    "settings.meta.eyebrow": "MÉTODO META",
    "settings.meta.win": "Tasa de victoria",
    "settings.meta.winDetail": "Señal principal de rendimiento.",
    "settings.meta.pick": "Tasa de selección",
    "settings.meta.pickDetail": "Mide la presencia actual.",
    "settings.meta.ban": "Tasa de veto",
    "settings.meta.banDetail": "Añade presión competitiva.",
    "settings.meta.ranking": "Clasificación OWTracker",
    "settings.meta.explain1": "Las tasas de victoria, selección y veto se normalizan dentro del conjunto de datos activo antes de calcular el Meta Score ponderado.",
    "settings.meta.explain2": "La tier list resultante es una interpretación de OWTracker y no una clasificación oficial de Blizzard.",
    "settings.disclaimer.text": "OWTracker es un proyecto independiente y no está afiliado, respaldado ni patrocinado por Blizzard Entertainment.",
    "settings.disclaimer.storage": "El idioma, región, rango, rol y duración de caché se guardan localmente en OWTracker mediante localStorage.",
    "settings.region.europe": "Europa",
    "settings.region.americas": "Américas",
    "settings.region.asia": "Asia",
    "settings.tier.bronze": "Bronce",
    "settings.tier.silver": "Plata",
    "settings.tier.gold": "Oro",
    "settings.tier.platinum": "Platino",
    "settings.tier.diamond": "Diamante",
    "settings.tier.master": "Maestro",
    "settings.tier.grandmaster": "Gran Maestro",
    "settings.tier.champion": "Campeón",
    "settings.role.tank": "Tanque",
    "settings.role.damage": "Daño",
    "settings.role.support": "Apoyo",

    "player.competitive.format": "Formato competitivo",
    "player.competitive.5v5": "5v5 · Cola por roles",
    "player.competitive.6v6": "6v6 · Cola abierta",
    "player.competitive.openQueue": "Cola abierta",

    "settings.stats.format": "Formato predeterminado",
    "settings.stats.formatDetail": "Formato competitivo de Blizzard usado en Estadísticas.",
    "settings.format.5v5": "5v5 · Cola por roles",
    "settings.format.6v6": "6v6 · Cola abierta",
    "settings.format.5v5Short": "5v5",
    "settings.format.6v6Short": "6v6",
  },

  "pt-BR": {
    "nav.stats": "Estatísticas",
    "nav.players": "Jogadores",
    "nav.heroes": "Heróis",
    "nav.counters": "Counters",
    "nav.perks": "Vantagens",
    "nav.settings": "Configurações",
    "settings.title": "Configurações",
    "settings.subtitle":
      "Padrões, atualização, fontes de dados e informações do aplicativo.",
    "settings.saved": "Salvo automaticamente",
    "settings.language.eyebrow": "IDIOMA",
    "settings.language.title": "Idioma da interface",
    "settings.language.label": "Idioma",
    "settings.language.detail":
      "Auto usa o idioma do navegador ou do sistema operacional.",
    "settings.language.active": "Idioma ativo",
    "settings.language.auto": "Detectado automaticamente pelo sistema.",
    "settings.language.manual": "Selecionado manualmente e salvo localmente.",
    "settings.stats.title": "Preferências de estatísticas",
    "settings.stats.region": "Região padrão",
    "settings.stats.rank": "Rank padrão",
    "settings.stats.role": "Função padrão",
    "settings.allRanks": "Todos os ranks",
    "settings.allRoles": "Todas as funções",
    "settings.cache.title": "Atualização",
    "settings.cache.duration": "Duração do cache",
    "settings.cache.reset": "Restaurar padrões",
    "settings.app.title": "Sobre o OWTracker",
    "settings.data.title": "Fontes de dados",
    "settings.meta.title": "Como funciona o ranking",
    "settings.disclaimer.title": "Projeto independente",


    "player.platform.label": "Plataforma",
    "player.platform.detail": "Carrega dados de carreira do PC ou console.",
    "player.platform.pc": "PC",
    "player.platform.console": "Console",
    "player.mode.label": "Modo",
    "player.mode.detail": "Selecione as estatísticas de carreira que deseja exibir.",
    "player.mode.all": "Todos os modos",
    "player.mode.competitive": "Competitivo",
    "player.mode.quickplay": "Jogo rápido",
    "player.average.eyebrow": "MÉDIA / 10 MIN",
    "player.average.title": "Ritmo de desempenho",
    "player.stat.eliminations": "Eliminações",
    "player.stat.assists": "Assistências",
    "player.stat.deaths": "Mortes",
    "player.stat.damage": "Dano",
    "player.stat.healing": "Cura",
    "player.competitive.eyebrow": "COMPETITIVO",
    "player.competitive.ranks": "ranques",
    "player.competitive.season": "Temporada",
    "player.role.tank": "Tanque",
    "player.role.damage": "Dano",
    "player.role.support": "Suporte",
    "player.roleDistribution.eyebrow": "DISTRIBUIÇÃO DE FUNÇÕES",
    "player.roleDistribution.title": "Tempo jogado por função",
    "player.bestHeroes.eyebrow": "MELHORES HERÓIS",
    "player.bestHeroes.title": "Heróis com melhor desempenho",
    "player.bestHeroes.games": "partidas",
    "player.bestHeroes.notEnough": "Ainda não há partidas suficientes.",
    "player.bestHeroes.minimum": "Mínimo de 10 partidas.",
    "player.career.eyebrow": "CARREIRA AVANÇADA",
    "player.career.title": "Estatísticas detalhadas de carreira",
    "player.career.chooseMode": "Selecione Competitivo ou Jogo rápido para carregar estatísticas avançadas de carreira.",
    "player.career.hero": "Herói",
    "player.career.allHeroes": "Todos os heróis",
    "player.career.combat": "Combate",
    "player.career.game": "Partida",
    "player.career.best": "Recordes",
    "player.career.average": "Média",
    "player.career.assists": "Assistências",
    "player.career.heroSpecific": "Específico do herói",
    "player.career.loading": "Carregando estatísticas avançadas de carreira...",
    "player.career.noData": "Nenhuma estatística disponível para esta categoria.",
    "player.copyBattleTag": "Copiar BattleTag",
    "player.showAllHeroes": "Mostrar todos os heróis",
    "player.showTop10": "Mostrar top 10",
    "player.error.noPcStats": "Não há estatísticas de PC disponíveis para este perfil público.",
    "player.error.noConsoleStats": "Não há estatísticas de console disponíveis para este perfil público.",
    "settings.stats.eyebrow": "ESTATÍSTICAS PADRÃO",
    "settings.stats.regionDetail": "Usada ao abrir Estatísticas.",
    "settings.stats.rankDetail": "Filtro de rank competitivo.",
    "settings.stats.roleDetail": "Função de herói carregada por padrão.",
    "settings.cache.eyebrow": "CACHE",
    "settings.cache.durationDetail": "Após esse tempo, Estatísticas sugere uma atualização.",
    "settings.cache.current": "Comportamento atual",
    "settings.cache.valid": "Os dados da Blizzard em cache permanecem válidos durante esse período.",
    "settings.cache.defaults": "Padrões",
    "settings.cache.defaultsDetail": "Aplicados na próxima vez que você abrir Estatísticas.",
    "settings.minutes": "minutos",
    "settings.hour": "1 hora",
    "settings.hours2": "2 horas",
    "settings.cache.minShort": "min",
    "settings.app.eyebrow": "APLICATIVO",
    "settings.app.version": "Versão",
    "settings.app.currentRelease": "Versão atual",
    "settings.app.platform": "Plataforma",
    "settings.app.game": "Jogo",
    "settings.app.pcStats": "Estatísticas de PC",
    "settings.app.website": "Site",
    "settings.app.publicWeb": "Versão web pública.",
    "settings.app.source": "Fonte",
    "settings.app.repo": "Repositório GitHub",
    "settings.app.repoDetail": "Código-fonte e histórico do projeto.",
    "settings.data.eyebrow": "DADOS",
    "settings.data.blizzardTitle": "Estatísticas da Blizzard",
    "settings.data.blizzardDetail": "Taxas globais de vitória, escolha e banimento de heróis.",
    "settings.data.overfastTitle": "OverFast",
    "settings.data.overfastDetail": "Perfis de jogadores, ranks competitivos e estatísticas individuais.",
    "settings.data.counterwatchTitle": "Counterwatch",
    "settings.data.counterwatchDetail": "Avaliações de counters, impacto em combate e dados comunitários de matchup.",
    "settings.data.perks": "Vantagens da comunidade",
    "settings.data.perksDetail": "Popularidade das vantagens e preferências da comunidade.",
    "settings.data.metaTitle": "Meta Score do OWTracker",
    "settings.data.metaDetail": "Calculado localmente com WR 60 %, PR 30 % e BR 10 % normalizados.",
    "settings.data.cache": "Cache local",
    "settings.data.cacheDetail": "Armazena dados recentes e suas preferências.",
    "settings.status.live": "AO VIVO",
    "settings.status.playerData": "DADOS DO JOGADOR",
    "settings.status.matchupData": "DADOS DE MATCHUP",
    "settings.status.community": "COMUNIDADE",
    "settings.status.calculated": "CALCULADO",
    "settings.status.active": "ATIVO",
    "settings.meta.eyebrow": "MÉTODO META",
    "settings.meta.win": "Taxa de vitória",
    "settings.meta.winDetail": "Principal sinal de desempenho.",
    "settings.meta.pick": "Taxa de escolha",
    "settings.meta.pickDetail": "Mede a presença atual.",
    "settings.meta.ban": "Taxa de banimento",
    "settings.meta.banDetail": "Adiciona pressão competitiva.",
    "settings.meta.ranking": "Ranking OWTracker",
    "settings.meta.explain1": "As taxas de vitória, escolha e banimento são normalizadas no conjunto de dados ativo antes do cálculo do Meta Score ponderado.",
    "settings.meta.explain2": "A tier list resultante é uma interpretação do OWTracker e não um ranking oficial da Blizzard.",
    "settings.disclaimer.text": "OWTracker é um projeto independente e não é afiliado, endossado ou patrocinado pela Blizzard Entertainment.",
    "settings.disclaimer.storage": "Idioma, região, rank, função e duração do cache são armazenados localmente no OWTracker via localStorage.",
    "settings.region.europe": "Europa",
    "settings.region.americas": "Américas",
    "settings.region.asia": "Ásia",
    "settings.tier.bronze": "Bronze",
    "settings.tier.silver": "Prata",
    "settings.tier.gold": "Ouro",
    "settings.tier.platinum": "Platina",
    "settings.tier.diamond": "Diamante",
    "settings.tier.master": "Mestre",
    "settings.tier.grandmaster": "Grão-Mestre",
    "settings.tier.champion": "Campeão",
    "settings.role.tank": "Tanque",
    "settings.role.damage": "Dano",
    "settings.role.support": "Suporte",

    "player.competitive.format": "Formato competitivo",
    "player.competitive.5v5": "5v5 · Fila por função",
    "player.competitive.6v6": "6v6 · Fila aberta",
    "player.competitive.openQueue": "Fila aberta",

    "settings.stats.format": "Formato padrão",
    "settings.stats.formatDetail": "Formato competitivo da Blizzard usado em Estatísticas.",
    "settings.format.5v5": "5v5 · Fila por função",
    "settings.format.6v6": "6v6 · Fila aberta",
    "settings.format.5v5Short": "5v5",
    "settings.format.6v6Short": "6v6",
  },

  ko: {
    "nav.stats": "통계",
    "nav.players": "플레이어",
    "nav.heroes": "영웅",
    "nav.counters": "카운터",
    "nav.perks": "특전",
    "nav.settings": "설정",
    "settings.title": "설정",
    "settings.subtitle": "기본값, 새로고침, 데이터 소스 및 애플리케이션 정보.",
    "settings.saved": "자동 저장됨",
    "settings.language.eyebrow": "언어",
    "settings.language.title": "인터페이스 언어",
    "settings.language.label": "언어",
    "settings.language.detail": "자동은 브라우저 또는 운영체제 언어를 사용합니다.",
    "settings.language.active": "현재 언어",
    "settings.language.auto": "시스템에서 자동으로 감지됨.",
    "settings.language.manual": "직접 선택되어 로컬에 저장됨.",
    "settings.stats.title": "통계 환경설정",
    "settings.stats.region": "기본 지역",
    "settings.stats.rank": "기본 등급",
    "settings.stats.role": "기본 역할",
    "settings.allRanks": "모든 등급",
    "settings.allRoles": "모든 역할",
    "settings.cache.title": "새로고침 동작",
    "settings.cache.duration": "캐시 기간",
    "settings.cache.reset": "기본값 재설정",
    "settings.app.title": "OWTracker 정보",
    "settings.data.title": "데이터 소스",
    "settings.meta.title": "랭킹 계산 방식",
    "settings.disclaimer.title": "독립 프로젝트",


    "player.platform.label": "플랫폼",
    "player.platform.detail": "PC 또는 콘솔 커리어 데이터를 불러옵니다.",
    "player.platform.pc": "PC",
    "player.platform.console": "콘솔",
    "player.mode.label": "모드",
    "player.mode.detail": "표시할 커리어 통계를 선택하세요.",
    "player.mode.all": "모든 모드",
    "player.mode.competitive": "경쟁전",
    "player.mode.quickplay": "빠른 대전",
    "player.average.eyebrow": "10분당 평균",
    "player.average.title": "플레이 성과",
    "player.stat.eliminations": "처치",
    "player.stat.assists": "도움",
    "player.stat.deaths": "죽음",
    "player.stat.damage": "피해",
    "player.stat.healing": "치유",
    "player.competitive.eyebrow": "경쟁전",
    "player.competitive.ranks": "등급",
    "player.competitive.season": "시즌",
    "player.role.tank": "돌격",
    "player.role.damage": "공격",
    "player.role.support": "지원",
    "player.roleDistribution.eyebrow": "역할 분포",
    "player.roleDistribution.title": "역할별 플레이 시간",
    "player.bestHeroes.eyebrow": "최고의 영웅",
    "player.bestHeroes.title": "성과가 가장 좋은 영웅",
    "player.bestHeroes.games": "게임",
    "player.bestHeroes.notEnough": "아직 게임 수가 충분하지 않습니다.",
    "player.bestHeroes.minimum": "최소 10게임.",
    "player.career.eyebrow": "고급 커리어",
    "player.career.title": "상세 커리어 통계",
    "player.career.chooseMode": "고급 커리어 통계를 불러오려면 경쟁전 또는 빠른 대전을 선택하세요.",
    "player.career.hero": "영웅",
    "player.career.allHeroes": "모든 영웅",
    "player.career.combat": "전투",
    "player.career.game": "게임",
    "player.career.best": "최고 기록",
    "player.career.average": "평균",
    "player.career.assists": "도움",
    "player.career.heroSpecific": "영웅별",
    "player.career.loading": "고급 커리어 통계를 불러오는 중...",
    "player.career.noData": "이 카테고리에 사용할 수 있는 통계가 없습니다.",
    "player.copyBattleTag": "BattleTag 복사",
    "player.showAllHeroes": "모든 영웅 표시",
    "player.showTop10": "상위 10명 표시",
    "player.error.noPcStats": "이 공개 프로필에는 PC 통계가 없습니다.",
    "player.error.noConsoleStats": "이 공개 프로필에는 콘솔 통계가 없습니다.",
    "settings.stats.eyebrow": "기본 통계",
    "settings.stats.regionDetail": "통계 페이지를 열 때 사용됩니다.",
    "settings.stats.rankDetail": "경쟁전 등급 필터입니다.",
    "settings.stats.roleDetail": "기본으로 불러올 영웅 역할입니다.",
    "settings.cache.eyebrow": "캐시",
    "settings.cache.durationDetail": "이 시간이 지나면 통계 페이지에서 새로고침을 제안합니다.",
    "settings.cache.current": "현재 동작",
    "settings.cache.valid": "캐시된 Blizzard 데이터는 이 기간 동안 유효합니다.",
    "settings.cache.defaults": "기본값",
    "settings.cache.defaultsDetail": "다음에 통계 페이지를 열 때 적용됩니다.",
    "settings.minutes": "분",
    "settings.hour": "1시간",
    "settings.hours2": "2시간",
    "settings.cache.minShort": "분",
    "settings.app.eyebrow": "애플리케이션",
    "settings.app.version": "버전",
    "settings.app.currentRelease": "현재 버전",
    "settings.app.platform": "플랫폼",
    "settings.app.game": "게임",
    "settings.app.pcStats": "PC 통계",
    "settings.app.website": "웹사이트",
    "settings.app.publicWeb": "공개 웹 버전.",
    "settings.app.source": "소스",
    "settings.app.repo": "GitHub 저장소",
    "settings.app.repoDetail": "소스 코드와 프로젝트 기록.",
    "settings.data.eyebrow": "데이터",
    "settings.data.blizzardTitle": "Blizzard 통계",
    "settings.data.blizzardDetail": "영웅의 전체 승률, 선택률 및 밴율.",
    "settings.data.overfastTitle": "OverFast",
    "settings.data.overfastDetail": "플레이어 프로필, 경쟁전 등급 및 개인 통계.",
    "settings.data.counterwatchTitle": "Counterwatch",
    "settings.data.counterwatchDetail": "영웅 카운터 평가, 전투 영향 및 커뮤니티 매치업 데이터.",
    "settings.data.perks": "커뮤니티 특전",
    "settings.data.perksDetail": "특전 인기도와 커뮤니티 선호도.",
    "settings.data.metaTitle": "OWTracker Meta Score",
    "settings.data.metaDetail": "정규화된 WR 60%, PR 30%, BR 10%로 로컬 계산됩니다.",
    "settings.data.cache": "로컬 캐시",
    "settings.data.cacheDetail": "최근 데이터와 애플리케이션 환경설정을 저장합니다.",
    "settings.status.live": "실시간",
    "settings.status.playerData": "플레이어 데이터",
    "settings.status.matchupData": "매치업 데이터",
    "settings.status.community": "커뮤니티",
    "settings.status.calculated": "계산됨",
    "settings.status.active": "활성",
    "settings.meta.eyebrow": "메타 방식",
    "settings.meta.win": "승률",
    "settings.meta.winDetail": "주요 성과 지표입니다.",
    "settings.meta.pick": "선택률",
    "settings.meta.pickDetail": "현재 사용 빈도를 나타냅니다.",
    "settings.meta.ban": "밴율",
    "settings.meta.banDetail": "경쟁 압력을 반영합니다.",
    "settings.meta.ranking": "OWTracker 랭킹",
    "settings.meta.explain1": "가중 Meta Score를 계산하기 전에 활성 데이터셋 안에서 승률, 선택률, 밴율을 정규화합니다.",
    "settings.meta.explain2": "결과 티어 리스트는 OWTracker의 해석이며 Blizzard의 공식 랭킹이 아닙니다.",
    "settings.disclaimer.text": "OWTracker는 독립 프로젝트이며 Blizzard Entertainment와 제휴, 승인 또는 후원 관계가 없습니다.",
    "settings.disclaimer.storage": "언어, 지역, 등급, 역할 및 캐시 기간은 localStorage를 통해 OWTracker에 로컬 저장됩니다.",
    "settings.region.europe": "유럽",
    "settings.region.americas": "아메리카",
    "settings.region.asia": "아시아",
    "settings.tier.bronze": "브론즈",
    "settings.tier.silver": "실버",
    "settings.tier.gold": "골드",
    "settings.tier.platinum": "플래티넘",
    "settings.tier.diamond": "다이아몬드",
    "settings.tier.master": "마스터",
    "settings.tier.grandmaster": "그랜드마스터",
    "settings.tier.champion": "챔피언",
    "settings.role.tank": "돌격",
    "settings.role.damage": "공격",
    "settings.role.support": "지원",

    "player.competitive.format": "경쟁전 형식",
    "player.competitive.5v5": "5대5 · 역할 고정",
    "player.competitive.6v6": "6대6 · 자유 역할",
    "player.competitive.openQueue": "자유 역할",

    "settings.stats.format": "기본 포맷",
    "settings.stats.formatDetail": "통계에서 사용할 Blizzard 경쟁전 포맷입니다.",
    "settings.format.5v5": "5대5 · 역할 고정",
    "settings.format.6v6": "6대6 · 자유 역할",
    "settings.format.5v5Short": "5대5",
    "settings.format.6v6Short": "6대6",
  },

  ja: {
    "nav.stats": "統計",
    "nav.players": "プレイヤー",
    "nav.heroes": "ヒーロー",
    "nav.counters": "カウンター",
    "nav.perks": "パーク",
    "nav.settings": "設定",
    "settings.title": "設定",
    "settings.subtitle": "デフォルト設定、更新、データソース、アプリ情報。",
    "settings.saved": "自動保存済み",
    "settings.language.eyebrow": "言語",
    "settings.language.title": "インターフェース言語",
    "settings.language.label": "言語",
    "settings.language.detail": "自動ではブラウザまたはOSの言語を使用します。",
    "settings.language.active": "使用中の言語",
    "settings.language.auto": "システムから自動検出されました。",
    "settings.language.manual": "手動で選択しローカルに保存されています。",
    "settings.stats.title": "統計設定",
    "settings.stats.region": "デフォルト地域",
    "settings.stats.rank": "デフォルトランク",
    "settings.stats.role": "デフォルトロール",
    "settings.allRanks": "すべてのランク",
    "settings.allRoles": "すべてのロール",
    "settings.cache.title": "更新設定",
    "settings.cache.duration": "キャッシュ期間",
    "settings.cache.reset": "デフォルトに戻す",
    "settings.app.title": "OWTrackerについて",
    "settings.data.title": "データソース",
    "settings.meta.title": "ランキングの仕組み",
    "settings.disclaimer.title": "独立プロジェクト",


    "player.platform.label": "プラットフォーム",
    "player.platform.detail": "PCまたはコンソールのキャリアデータを読み込みます。",
    "player.platform.pc": "PC",
    "player.platform.console": "コンソール",
    "player.mode.label": "モード",
    "player.mode.detail": "表示するキャリア統計を選択します。",
    "player.mode.all": "すべてのモード",
    "player.mode.competitive": "ライバル・プレイ",
    "player.mode.quickplay": "クイック・プレイ",
    "player.average.eyebrow": "10分平均",
    "player.average.title": "パフォーマンスペース",
    "player.stat.eliminations": "キル",
    "player.stat.assists": "アシスト",
    "player.stat.deaths": "デス",
    "player.stat.damage": "ダメージ",
    "player.stat.healing": "回復",
    "player.competitive.eyebrow": "ライバル・プレイ",
    "player.competitive.ranks": "ランク",
    "player.competitive.season": "シーズン",
    "player.role.tank": "タンク",
    "player.role.damage": "ダメージ",
    "player.role.support": "サポート",
    "player.roleDistribution.eyebrow": "ロール分布",
    "player.roleDistribution.title": "ロール別プレイ時間",
    "player.bestHeroes.eyebrow": "ベストヒーロー",
    "player.bestHeroes.title": "最も成績の良いヒーロー",
    "player.bestHeroes.games": "試合",
    "player.bestHeroes.notEnough": "まだ十分な試合数がありません。",
    "player.bestHeroes.minimum": "最低10試合。",
    "player.career.eyebrow": "詳細キャリア",
    "player.career.title": "詳細なキャリア統計",
    "player.career.chooseMode": "詳細なキャリア統計を読み込むには、ライバル・プレイまたはクイック・プレイを選択してください。",
    "player.career.hero": "ヒーロー",
    "player.career.allHeroes": "すべてのヒーロー",
    "player.career.combat": "戦闘",
    "player.career.game": "ゲーム",
    "player.career.best": "ベスト",
    "player.career.average": "平均",
    "player.career.assists": "アシスト",
    "player.career.heroSpecific": "ヒーロー固有",
    "player.career.loading": "詳細なキャリア統計を読み込み中...",
    "player.career.noData": "このカテゴリの統計はありません。",
    "player.copyBattleTag": "BattleTagをコピー",
    "player.showAllHeroes": "すべてのヒーローを表示",
    "player.showTop10": "トップ10を表示",
    "player.error.noPcStats": "この公開プロフィールにはPC統計がありません。",
    "player.error.noConsoleStats": "この公開プロフィールにはコンソール統計がありません。",
    "settings.stats.eyebrow": "デフォルト統計",
    "settings.stats.regionDetail": "統計ページを開くときに使用します。",
    "settings.stats.rankDetail": "ライバル・プレイのランクフィルターです。",
    "settings.stats.roleDetail": "デフォルトで読み込むヒーローロールです。",
    "settings.cache.eyebrow": "キャッシュ",
    "settings.cache.durationDetail": "この時間を過ぎると統計ページで更新を提案します。",
    "settings.cache.current": "現在の動作",
    "settings.cache.valid": "キャッシュ済みのBlizzardデータはこの期間有効です。",
    "settings.cache.defaults": "デフォルト",
    "settings.cache.defaultsDetail": "次回統計ページを開いたときに適用されます。",
    "settings.minutes": "分",
    "settings.hour": "1時間",
    "settings.hours2": "2時間",
    "settings.cache.minShort": "分",
    "settings.app.eyebrow": "アプリケーション",
    "settings.app.version": "バージョン",
    "settings.app.currentRelease": "現在のリリース",
    "settings.app.platform": "プラットフォーム",
    "settings.app.game": "ゲーム",
    "settings.app.pcStats": "PC統計",
    "settings.app.website": "ウェブサイト",
    "settings.app.publicWeb": "公開ウェブ版。",
    "settings.app.source": "ソース",
    "settings.app.repo": "GitHubリポジトリ",
    "settings.app.repoDetail": "ソースコードとプロジェクト履歴。",
    "settings.data.eyebrow": "データ",
    "settings.data.blizzardTitle": "Blizzard統計",
    "settings.data.blizzardDetail": "ヒーロー全体の勝率、ピック率、BAN率。",
    "settings.data.overfastTitle": "OverFast",
    "settings.data.overfastDetail": "プレイヤープロフィール、ライバル・プレイのランク、個別統計。",
    "settings.data.counterwatchTitle": "Counterwatch",
    "settings.data.counterwatchDetail": "カウンター評価、戦闘への影響、コミュニティのマッチアップデータ。",
    "settings.data.perks": "コミュニティ・パーク",
    "settings.data.perksDetail": "パークの人気度とコミュニティの選好データ。",
    "settings.data.metaTitle": "OWTracker Meta Score",
    "settings.data.metaDetail": "正規化されたWR 60%、PR 30%、BR 10%からローカル計算されます。",
    "settings.data.cache": "ローカルキャッシュ",
    "settings.data.cacheDetail": "最近のデータとアプリ設定を保存します。",
    "settings.status.live": "ライブ",
    "settings.status.playerData": "プレイヤーデータ",
    "settings.status.matchupData": "マッチアップデータ",
    "settings.status.community": "コミュニティ",
    "settings.status.calculated": "計算済み",
    "settings.status.active": "有効",
    "settings.meta.eyebrow": "メタ方式",
    "settings.meta.win": "勝率",
    "settings.meta.winDetail": "主要なパフォーマンス指標。",
    "settings.meta.pick": "ピック率",
    "settings.meta.pickDetail": "現在の使用状況を示します。",
    "settings.meta.ban": "BAN率",
    "settings.meta.banDetail": "競争上の圧力を反映します。",
    "settings.meta.ranking": "OWTrackerランキング",
    "settings.meta.explain1": "重み付きMeta Scoreを計算する前に、アクティブなデータセット内で勝率、ピック率、BAN率を正規化します。",
    "settings.meta.explain2": "生成されたティアリストはOWTrackerによる解釈であり、Blizzard公式ランキングではありません。",
    "settings.disclaimer.text": "OWTrackerは独立したプロジェクトで、Blizzard Entertainmentとの提携、承認、スポンサー関係はありません。",
    "settings.disclaimer.storage": "言語、地域、ランク、ロール、キャッシュ期間はlocalStorageを使ってOWTracker内にローカル保存されます。",
    "settings.region.europe": "ヨーロッパ",
    "settings.region.americas": "アメリカ",
    "settings.region.asia": "アジア",
    "settings.tier.bronze": "ブロンズ",
    "settings.tier.silver": "シルバー",
    "settings.tier.gold": "ゴールド",
    "settings.tier.platinum": "プラチナ",
    "settings.tier.diamond": "ダイヤモンド",
    "settings.tier.master": "マスター",
    "settings.tier.grandmaster": "グランドマスター",
    "settings.tier.champion": "チャンピオン",
    "settings.role.tank": "タンク",
    "settings.role.damage": "ダメージ",
    "settings.role.support": "サポート",

    "player.competitive.format": "ランク形式",
    "player.competitive.5v5": "5v5 · ロールキュー",
    "player.competitive.6v6": "6v6 · オープンキュー",
    "player.competitive.openQueue": "オープンキュー",

    "settings.stats.format": "デフォルト形式",
    "settings.stats.formatDetail": "統計で使用するBlizzardのライバル・プレイ形式。",
    "settings.format.5v5": "5v5 · ロールキュー",
    "settings.format.6v6": "6v6 · オープンキュー",
    "settings.format.5v5Short": "5v5",
    "settings.format.6v6Short": "6v6",
  },

  "zh-CN": {
    "nav.stats": "统计",
    "nav.players": "玩家",
    "nav.heroes": "英雄",
    "nav.counters": "克制",
    "nav.perks": "特长",
    "nav.settings": "设置",
    "settings.title": "设置",
    "settings.subtitle": "默认设置、刷新行为、数据源和应用信息。",
    "settings.saved": "已自动保存",
    "settings.language.eyebrow": "语言",
    "settings.language.title": "界面语言",
    "settings.language.label": "语言",
    "settings.language.detail": "自动模式使用浏览器或操作系统语言。",
    "settings.language.active": "当前语言",
    "settings.language.auto": "已根据系统自动检测。",
    "settings.language.manual": "已手动选择并保存到本地。",
    "settings.stats.title": "统计偏好",
    "settings.stats.region": "默认地区",
    "settings.stats.rank": "默认段位",
    "settings.stats.role": "默认职责",
    "settings.allRanks": "所有段位",
    "settings.allRoles": "所有职责",
    "settings.cache.title": "刷新行为",
    "settings.cache.duration": "缓存时长",
    "settings.cache.reset": "恢复默认",
    "settings.app.title": "关于 OWTracker",
    "settings.data.title": "数据源",
    "settings.meta.title": "排名计算方式",
    "settings.disclaimer.title": "独立项目",


    "player.platform.label": "平台",
    "player.platform.detail": "加载 PC 或主机生涯数据。",
    "player.platform.pc": "PC",
    "player.platform.console": "主机",
    "player.mode.label": "模式",
    "player.mode.detail": "选择要显示的生涯统计。",
    "player.mode.all": "全部模式",
    "player.mode.competitive": "竞技比赛",
    "player.mode.quickplay": "快速比赛",
    "player.average.eyebrow": "每10分钟平均",
    "player.average.title": "表现节奏",
    "player.stat.eliminations": "消灭",
    "player.stat.assists": "助攻",
    "player.stat.deaths": "阵亡",
    "player.stat.damage": "伤害",
    "player.stat.healing": "治疗",
    "player.competitive.eyebrow": "竞技比赛",
    "player.competitive.ranks": "段位",
    "player.competitive.season": "赛季",
    "player.role.tank": "重装",
    "player.role.damage": "输出",
    "player.role.support": "支援",
    "player.roleDistribution.eyebrow": "职责分布",
    "player.roleDistribution.title": "各职责游戏时间",
    "player.bestHeroes.eyebrow": "最佳英雄",
    "player.bestHeroes.title": "表现最佳的英雄",
    "player.bestHeroes.games": "场",
    "player.bestHeroes.notEnough": "比赛场次还不够。",
    "player.bestHeroes.minimum": "至少10场比赛。",
    "player.career.eyebrow": "高级生涯",
    "player.career.title": "详细生涯统计",
    "player.career.chooseMode": "选择竞技比赛或快速比赛以加载高级生涯统计。",
    "player.career.hero": "英雄",
    "player.career.allHeroes": "全部英雄",
    "player.career.combat": "战斗",
    "player.career.game": "比赛",
    "player.career.best": "最佳",
    "player.career.average": "平均",
    "player.career.assists": "助攻",
    "player.career.heroSpecific": "英雄专属",
    "player.career.loading": "正在加载高级生涯统计...",
    "player.career.noData": "此分类没有可用统计。",
    "player.copyBattleTag": "复制 BattleTag",
    "player.showAllHeroes": "显示全部英雄",
    "player.showTop10": "显示前10名",
    "player.error.noPcStats": "此公开资料没有可用的 PC 统计。",
    "player.error.noConsoleStats": "此公开资料没有可用的主机统计。",
    "settings.stats.eyebrow": "默认统计",
    "settings.stats.regionDetail": "打开统计页面时使用。",
    "settings.stats.rankDetail": "竞技段位筛选。",
    "settings.stats.roleDetail": "默认加载的英雄职责。",
    "settings.cache.eyebrow": "缓存",
    "settings.cache.durationDetail": "超过此时间后，统计页面会建议刷新。",
    "settings.cache.current": "当前行为",
    "settings.cache.valid": "缓存的Blizzard数据在此期间保持有效。",
    "settings.cache.defaults": "默认值",
    "settings.cache.defaultsDetail": "下次打开统计页面时应用。",
    "settings.minutes": "分钟",
    "settings.hour": "1小时",
    "settings.hours2": "2小时",
    "settings.cache.minShort": "分钟",
    "settings.app.eyebrow": "应用",
    "settings.app.version": "版本",
    "settings.app.currentRelease": "当前版本",
    "settings.app.platform": "平台",
    "settings.app.game": "游戏",
    "settings.app.pcStats": "PC统计",
    "settings.app.website": "网站",
    "settings.app.publicWeb": "公开网页版。",
    "settings.app.source": "来源",
    "settings.app.repo": "GitHub 仓库",
    "settings.app.repoDetail": "源代码和项目历史。",
    "settings.data.eyebrow": "数据",
    "settings.data.blizzardTitle": "Blizzard统计",
    "settings.data.blizzardDetail": "英雄全局胜率、选择率和禁用率。",
    "settings.data.overfastTitle": "OverFast",
    "settings.data.overfastDetail": "玩家资料、竞技段位和个人统计。",
    "settings.data.counterwatchTitle": "Counterwatch",
    "settings.data.counterwatchDetail": "英雄克制评分、战斗影响和社区对局数据。",
    "settings.data.perks": "社区特长",
    "settings.data.perksDetail": "特长热度和社区偏好数据。",
    "settings.data.metaTitle": "OWTracker Meta Score",
    "settings.data.metaDetail": "根据标准化的WR 60%、PR 30%和BR 10%在本地计算。",
    "settings.data.cache": "本地缓存",
    "settings.data.cacheDetail": "保存近期数据和应用偏好。",
    "settings.status.live": "实时",
    "settings.status.playerData": "玩家数据",
    "settings.status.matchupData": "对局数据",
    "settings.status.community": "社区",
    "settings.status.calculated": "已计算",
    "settings.status.active": "启用",
    "settings.meta.eyebrow": "META方法",
    "settings.meta.win": "胜率",
    "settings.meta.winDetail": "主要表现指标。",
    "settings.meta.pick": "选择率",
    "settings.meta.pickDetail": "衡量当前出场情况。",
    "settings.meta.ban": "禁用率",
    "settings.meta.banDetail": "加入竞技压力因素。",
    "settings.meta.ranking": "OWTracker排名",
    "settings.meta.explain1": "在计算加权Meta Score之前，会在当前数据集中标准化胜率、选择率和禁用率。",
    "settings.meta.explain2": "最终的梯队列表是OWTracker的解读，并非Blizzard官方排名。",
    "settings.disclaimer.text": "OWTracker是独立项目，与Blizzard Entertainment没有隶属、授权或赞助关系。",
    "settings.disclaimer.storage": "语言、地区、段位、职责和缓存时长通过localStorage保存在OWTracker本地。",
    "settings.region.europe": "欧洲",
    "settings.region.americas": "美洲",
    "settings.region.asia": "亚洲",
    "settings.tier.bronze": "青铜",
    "settings.tier.silver": "白银",
    "settings.tier.gold": "黄金",
    "settings.tier.platinum": "白金",
    "settings.tier.diamond": "钻石",
    "settings.tier.master": "大师",
    "settings.tier.grandmaster": "宗师",
    "settings.tier.champion": "冠军",
    "settings.role.tank": "重装",
    "settings.role.damage": "输出",
    "settings.role.support": "支援",

    "player.competitive.format": "竞技赛制",
    "player.competitive.5v5": "5v5 · 职责队列",
    "player.competitive.6v6": "6v6 · 开放队列",
    "player.competitive.openQueue": "开放队列",

    "settings.stats.format": "默认赛制",
    "settings.stats.formatDetail": "统计页面使用的Blizzard竞技赛制。",
    "settings.format.5v5": "5v5 · 职责队列",
    "settings.format.6v6": "6v6 · 开放队列",
    "settings.format.5v5Short": "5v5",
    "settings.format.6v6Short": "6v6",
  },

  ru: {
    "nav.stats": "Статистика",
    "nav.players": "Игроки",
    "nav.heroes": "Герои",
    "nav.counters": "Контрпики",
    "nav.perks": "Перки",
    "nav.settings": "Настройки",
    "settings.title": "Настройки",
    "settings.subtitle":
      "Параметры по умолчанию, обновление, источники данных и информация о приложении.",
    "settings.saved": "Сохранено автоматически",
    "settings.language.eyebrow": "ЯЗЫК",
    "settings.language.title": "Язык интерфейса",
    "settings.language.label": "Язык",
    "settings.language.detail":
      "Авто использует язык браузера или операционной системы.",
    "settings.language.active": "Активный язык",
    "settings.language.auto": "Автоматически определён системой.",
    "settings.language.manual": "Выбран вручную и сохранён локально.",
    "settings.stats.title": "Настройки статистики",
    "settings.stats.region": "Регион по умолчанию",
    "settings.stats.rank": "Ранг по умолчанию",
    "settings.stats.role": "Роль по умолчанию",
    "settings.allRanks": "Все ранги",
    "settings.allRoles": "Все роли",
    "settings.cache.title": "Обновление",
    "settings.cache.duration": "Время кэша",
    "settings.cache.reset": "Сбросить",
    "settings.app.title": "Об OWTracker",
    "settings.data.title": "Источники данных",
    "settings.meta.title": "Как работает рейтинг",
    "settings.disclaimer.title": "Независимый проект",


    "player.platform.label": "Платформа",
    "player.platform.detail": "Загрузить данные карьеры с ПК или консоли.",
    "player.platform.pc": "ПК",
    "player.platform.console": "Консоль",
    "player.mode.label": "Режим",
    "player.mode.detail": "Выберите статистику карьеры для отображения.",
    "player.mode.all": "Все режимы",
    "player.mode.competitive": "Соревновательный",
    "player.mode.quickplay": "Быстрая игра",
    "player.average.eyebrow": "СРЕДНЕЕ / 10 МИН",
    "player.average.title": "Темп эффективности",
    "player.stat.eliminations": "Устранения",
    "player.stat.assists": "Помощь",
    "player.stat.deaths": "Смерти",
    "player.stat.damage": "Урон",
    "player.stat.healing": "Лечение",
    "player.competitive.eyebrow": "СОРЕВНОВАТЕЛЬНЫЙ",
    "player.competitive.ranks": "ранги",
    "player.competitive.season": "Сезон",
    "player.role.tank": "Танк",
    "player.role.damage": "Урон",
    "player.role.support": "Поддержка",
    "player.roleDistribution.eyebrow": "РАСПРЕДЕЛЕНИЕ РОЛЕЙ",
    "player.roleDistribution.title": "Время игры по ролям",
    "player.bestHeroes.eyebrow": "ЛУЧШИЕ ГЕРОИ",
    "player.bestHeroes.title": "Самые результативные герои",
    "player.bestHeroes.games": "игр",
    "player.bestHeroes.notEnough": "Пока недостаточно игр.",
    "player.bestHeroes.minimum": "Минимум 10 игр.",
    "player.career.eyebrow": "РАСШИРЕННАЯ КАРЬЕРА",
    "player.career.title": "Подробная статистика карьеры",
    "player.career.chooseMode": "Выберите соревновательный режим или быструю игру, чтобы загрузить расширенную статистику карьеры.",
    "player.career.hero": "Герой",
    "player.career.allHeroes": "Все герои",
    "player.career.combat": "Бой",
    "player.career.game": "Игра",
    "player.career.best": "Лучшее",
    "player.career.average": "Среднее",
    "player.career.assists": "Помощь",
    "player.career.heroSpecific": "Для героя",
    "player.career.loading": "Загрузка расширенной статистики карьеры...",
    "player.career.noData": "Для этой категории нет доступной статистики.",
    "player.copyBattleTag": "Скопировать BattleTag",
    "player.showAllHeroes": "Показать всех героев",
    "player.showTop10": "Показать топ-10",
    "player.error.noPcStats": "Для этого публичного профиля нет статистики ПК.",
    "player.error.noConsoleStats": "Для этого публичного профиля нет статистики консоли.",
    "settings.stats.eyebrow": "СТАТИСТИКА ПО УМОЛЧАНИЮ",
    "settings.stats.regionDetail": "Используется при открытии страницы статистики.",
    "settings.stats.rankDetail": "Фильтр соревновательного ранга.",
    "settings.stats.roleDetail": "Роль героя, загружаемая по умолчанию.",
    "settings.cache.eyebrow": "КЭШ",
    "settings.cache.durationDetail": "После этого времени страница статистики предложит обновить данные.",
    "settings.cache.current": "Текущее поведение",
    "settings.cache.valid": "Кэшированные данные Blizzard остаются актуальными в течение этого времени.",
    "settings.cache.defaults": "Значения по умолчанию",
    "settings.cache.defaultsDetail": "Применяются при следующем открытии страницы статистики.",
    "settings.minutes": "минут",
    "settings.hour": "1 час",
    "settings.hours2": "2 часа",
    "settings.cache.minShort": "мин",
    "settings.app.eyebrow": "ПРИЛОЖЕНИЕ",
    "settings.app.version": "Версия",
    "settings.app.currentRelease": "Текущая версия",
    "settings.app.platform": "Платформа",
    "settings.app.game": "Игра",
    "settings.app.pcStats": "Статистика ПК",
    "settings.app.website": "Веб-сайт",
    "settings.app.publicWeb": "Публичная веб-версия.",
    "settings.app.source": "Исходный код",
    "settings.app.repo": "Репозиторий GitHub",
    "settings.app.repoDetail": "Исходный код и история проекта.",
    "settings.data.eyebrow": "ДАННЫЕ",
    "settings.data.blizzardTitle": "Статистика Blizzard",
    "settings.data.blizzardDetail": "Общие показатели побед, выбора и банов героев.",
    "settings.data.overfastTitle": "OverFast",
    "settings.data.overfastDetail": "Профили игроков, соревновательные ранги и индивидуальная статистика.",
    "settings.data.counterwatchTitle": "Counterwatch",
    "settings.data.counterwatchDetail": "Оценки контрпиков, влияние в бою и данные матчапов сообщества.",
    "settings.data.perks": "Перки сообщества",
    "settings.data.perksDetail": "Популярность перков и предпочтения сообщества.",
    "settings.data.metaTitle": "OWTracker Meta Score",
    "settings.data.metaDetail": "Локально рассчитывается из нормализованных WR 60 %, PR 30 % и BR 10 %.",
    "settings.data.cache": "Локальный кэш",
    "settings.data.cacheDetail": "Хранит недавние данные и настройки приложения.",
    "settings.status.live": "АКТИВНО",
    "settings.status.playerData": "ДАННЫЕ ИГРОКА",
    "settings.status.matchupData": "ДАННЫЕ МАТЧАПОВ",
    "settings.status.community": "СООБЩЕСТВО",
    "settings.status.calculated": "РАССЧИТАНО",
    "settings.status.active": "АКТИВНО",
    "settings.meta.eyebrow": "МЕТОД МЕТЫ",
    "settings.meta.win": "Процент побед",
    "settings.meta.winDetail": "Основной показатель эффективности.",
    "settings.meta.pick": "Процент выбора",
    "settings.meta.pickDetail": "Показывает текущую популярность.",
    "settings.meta.ban": "Процент банов",
    "settings.meta.banDetail": "Учитывает соревновательное давление.",
    "settings.meta.ranking": "Рейтинг OWTracker",
    "settings.meta.explain1": "Проценты побед, выбора и банов нормализуются внутри активного набора данных перед расчётом взвешенного Meta Score.",
    "settings.meta.explain2": "Получившийся список уровней — интерпретация OWTracker, а не официальный рейтинг Blizzard.",
    "settings.disclaimer.text": "OWTracker — независимый проект и не связан, не одобрен и не спонсируется Blizzard Entertainment.",
    "settings.disclaimer.storage": "Язык, регион, ранг, роль и время кэша сохраняются локально в OWTracker через localStorage.",
    "settings.region.europe": "Европа",
    "settings.region.americas": "Америка",
    "settings.region.asia": "Азия",
    "settings.tier.bronze": "Бронза",
    "settings.tier.silver": "Серебро",
    "settings.tier.gold": "Золото",
    "settings.tier.platinum": "Платина",
    "settings.tier.diamond": "Алмаз",
    "settings.tier.master": "Мастер",
    "settings.tier.grandmaster": "Грандмастер",
    "settings.tier.champion": "Чемпион",
    "settings.role.tank": "Танк",
    "settings.role.damage": "Урон",
    "settings.role.support": "Поддержка",

    "player.competitive.format": "Формат рейтинга",
    "player.competitive.5v5": "5v5 · Ролевая очередь",
    "player.competitive.6v6": "6v6 · Открытая очередь",
    "player.competitive.openQueue": "Открытая очередь",

    "settings.stats.format": "Формат по умолчанию",
    "settings.stats.formatDetail": "Соревновательный формат Blizzard для статистики.",
    "settings.format.5v5": "5v5 · Ролевая очередь",
    "settings.format.6v6": "6v6 · Открытая очередь",
    "settings.format.5v5Short": "5v5",
    "settings.format.6v6Short": "6v6",
  },
};

const STORAGE_KEY =
  "owtracker.preferences";

export function isAppLanguage(
  value: unknown,
): value is AppLanguage {
  return LANGUAGE_OPTIONS.some(
    (option) =>
      option.value === value,
  );
}

export function detectSystemLanguage():
  ResolvedLanguage {
  if (
    typeof navigator ===
    "undefined"
  ) {
    return "en";
  }

  const locales =
    navigator.languages?.length
      ? navigator.languages
      : [
          navigator.language,
        ];

  for (
    const locale of locales
  ) {
    const resolved =
      mapLocaleToLanguage(
        locale,
      );

    if (resolved) {
      return resolved;
    }
  }

  return "en";
}

export function resolveAppLanguage(
  language: AppLanguage,
): ResolvedLanguage {
  return language === "auto"
    ? detectSystemLanguage()
    : language;
}

export function getLanguageLabel(
  language:
    AppLanguage | ResolvedLanguage,
) {
  return (
    LANGUAGE_OPTIONS.find(
      (option) =>
        option.value === language,
    )?.label ??
    "English"
  );
}

export function translate(
  language: ResolvedLanguage,
  key: TranslationKey,
) {
  return (
    OVERRIDES[language][key] ??
    EN[key]
  );
}

export function useI18n() {
  const [
    language,
    setLanguage,
  ] =
    useState<ResolvedLanguage>(
      () =>
        resolveAppLanguage(
          getStoredLanguage(),
        ),
    );

  useEffect(() => {
    function syncLanguage(
      event?: Event,
    ) {
      const detail =
        event instanceof CustomEvent
          ? (
              event.detail as {
                language?: unknown;
              } | null
            )
          : null;

      if (
        detail &&
        isAppLanguage(
          detail.language,
        )
      ) {
        setLanguage(
          resolveAppLanguage(
            detail.language,
          ),
        );
        return;
      }

      setLanguage(
        resolveAppLanguage(
          getStoredLanguage(),
        ),
      );
    }

    window.addEventListener(
      "owtracker:preferences-changed",
      syncLanguage,
    );

    window.addEventListener(
      "storage",
      syncLanguage,
    );

    return () => {
      window.removeEventListener(
        "owtracker:preferences-changed",
        syncLanguage,
      );

      window.removeEventListener(
        "storage",
        syncLanguage,
      );
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang =
      language;
  }, [
    language,
  ]);

  const t =
    useMemo(
      () =>
        (
          key:
            TranslationKey,
        ) =>
          translate(
            language,
            key,
          ),
      [
        language,
      ],
    );

  return {
    language,
    t,
  };
}

function getStoredLanguage():
  AppLanguage {
  try {
    const raw =
      localStorage.getItem(
        STORAGE_KEY,
      );

    if (!raw) {
      return "auto";
    }

    const parsed =
      JSON.parse(
        raw,
      ) as {
        language?: unknown;
      };

    return isAppLanguage(
      parsed.language,
    )
      ? parsed.language
      : "auto";
  } catch {
    return "auto";
  }
}

function mapLocaleToLanguage(
  locale: string,
): ResolvedLanguage | null {
  const normalized =
    locale
      .trim()
      .toLowerCase();

  if (
    normalized.startsWith(
      "fr",
    )
  ) {
    return "fr";
  }

  if (
    normalized.startsWith(
      "de",
    )
  ) {
    return "de";
  }

  if (
    normalized.startsWith(
      "es",
    )
  ) {
    return "es";
  }

  if (
    normalized.startsWith(
      "pt",
    )
  ) {
    return "pt-BR";
  }

  if (
    normalized.startsWith(
      "ko",
    )
  ) {
    return "ko";
  }

  if (
    normalized.startsWith(
      "ja",
    )
  ) {
    return "ja";
  }

  if (
    normalized.startsWith(
      "zh",
    )
  ) {
    return "zh-CN";
  }

  if (
    normalized.startsWith(
      "ru",
    )
  ) {
    return "ru";
  }

  if (
    normalized.startsWith(
      "en",
    )
  ) {
    return "en";
  }

  return null;
}
