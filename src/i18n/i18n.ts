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
  },

  ja: {
    "nav.stats": "統計",
    "nav.players": "プレイヤー",
    "nav.heroes": "ヒーロー",
    "nav.counters": "カウンター",
    "nav.perks": "パーク",
    "nav.settings": "設定",
    "settings.title": "設定",
    "settings.subtitle": "デフォルト、更新、データソース、アプリ情報。",
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
  },

  "zh-CN": {
    "nav.stats": "统计",
    "nav.players": "玩家",
    "nav.heroes": "英雄",
    "nav.counters": "克制",
    "nav.perks": "特长",
    "nav.settings": "设置",
    "settings.title": "设置",
    "settings.subtitle": "默认值、刷新行为、数据源和应用信息。",
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
    function syncLanguage() {
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
