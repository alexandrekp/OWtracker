import type {
  BlizzardRegion,
  BlizzardRole,
  BlizzardTier,
} from "./blizzardStats";

import {
  isAppLanguage,
} from "../i18n/i18n";

import type {
  AppLanguage,
} from "../i18n/i18n";

export type RefreshIntervalMinutes =
  | 5
  | 15
  | 30
  | 60
  | 120;

export type AppPreferences = {
  defaultRegion: BlizzardRegion;
  defaultTier: BlizzardTier;
  defaultRole: BlizzardRole;
  refreshIntervalMinutes:
    RefreshIntervalMinutes;
  language: AppLanguage;
};

export const DEFAULT_APP_PREFERENCES:
  AppPreferences = {
    defaultRegion: "Europe",
    defaultTier: "All",
    defaultRole: "All",
    refreshIntervalMinutes: 30,
    language: "auto",
  };

const STORAGE_KEY =
  "owtracker.preferences";

export function loadAppPreferences():
  AppPreferences {
  try {
    const raw =
      localStorage.getItem(
        STORAGE_KEY,
      );

    if (!raw) {
      return {
        ...DEFAULT_APP_PREFERENCES,
      };
    }

    const parsed =
      JSON.parse(
        raw,
      ) as Partial<AppPreferences>;

    return {
      defaultRegion:
        isRegion(
          parsed.defaultRegion,
        )
          ? parsed.defaultRegion
          : DEFAULT_APP_PREFERENCES.defaultRegion,

      defaultTier:
        isTier(
          parsed.defaultTier,
        )
          ? parsed.defaultTier
          : DEFAULT_APP_PREFERENCES.defaultTier,

      defaultRole:
        isRole(
          parsed.defaultRole,
        )
          ? parsed.defaultRole
          : DEFAULT_APP_PREFERENCES.defaultRole,

      refreshIntervalMinutes:
        isRefreshInterval(
          parsed.refreshIntervalMinutes,
        )
          ? parsed.refreshIntervalMinutes
          : DEFAULT_APP_PREFERENCES.refreshIntervalMinutes,

      language:
        isAppLanguage(
          parsed.language,
        )
          ? parsed.language
          : DEFAULT_APP_PREFERENCES.language,
    };
  } catch {
    return {
      ...DEFAULT_APP_PREFERENCES,
    };
  }
}

export function saveAppPreferences(
  preferences:
    AppPreferences,
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      preferences,
    ),
  );

  window.dispatchEvent(
    new CustomEvent(
      "owtracker:preferences-changed",
      {
        detail:
          preferences,
      },
    ),
  );
}

export function resetAppPreferences() {
  saveAppPreferences(
    DEFAULT_APP_PREFERENCES,
  );

  return {
    ...DEFAULT_APP_PREFERENCES,
  };
}

function isRegion(
  value: unknown,
): value is BlizzardRegion {
  return (
    value === "Europe" ||
    value === "Americas" ||
    value === "Asia"
  );
}

function isTier(
  value: unknown,
): value is BlizzardTier {
  return [
    "All",
    "Bronze",
    "Silver",
    "Gold",
    "Platinum",
    "Diamond",
    "Master",
    "Grandmaster",
    "Champion",
  ].includes(
    String(
      value,
    ),
  );
}

function isRole(
  value: unknown,
): value is BlizzardRole {
  return (
    value === "All" ||
    value === "Tank" ||
    value === "Damage" ||
    value === "Support"
  );
}

function isRefreshInterval(
  value: unknown,
): value is RefreshIntervalMinutes {
  return (
    value === 5 ||
    value === 15 ||
    value === 30 ||
    value === 60 ||
    value === 120
  );
}
