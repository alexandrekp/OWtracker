import {
  Activity,
  Database,
  Info,
  Languages,
  RotateCcw,
  Settings2,
  ShieldCheck,
} from "lucide-react";

import {
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import type {
  BlizzardRegion,
  BlizzardRole,
  BlizzardTier,
} from "../services/blizzardStats";

import {
  loadAppPreferences,
  resetAppPreferences,
  saveAppPreferences,
} from "../services/appPreferences";

import type {
  AppPreferences,
  RefreshIntervalMinutes,
} from "../services/appPreferences";

import {
  getLanguageLabel,
  LANGUAGE_OPTIONS,
  resolveAppLanguage,
  useI18n,
} from "../i18n/i18n";

import type {
  AppLanguage,
} from "../i18n/i18n";

const REGIONS:
  BlizzardRegion[] = [
    "Europe",
    "Americas",
    "Asia",
  ];

const TIERS:
  BlizzardTier[] = [
    "All",
    "Bronze",
    "Silver",
    "Gold",
    "Platinum",
    "Diamond",
    "Master",
    "Grandmaster",
    "Champion",
  ];

const ROLES:
  BlizzardRole[] = [
    "All",
    "Tank",
    "Damage",
    "Support",
  ];

const REFRESH_INTERVALS:
  RefreshIntervalMinutes[] = [
    5,
    15,
    30,
    60,
    120,
  ];

const WEBSITE_URL =
  "https://owtracker.net/";

const GITHUB_URL =
  "https://github.com/alexandrekp/OWtracker";

function SettingsPage() {
  const {
    t,
  } = useI18n();

  const [
    preferences,
    setPreferences,
  ] =
    useState<AppPreferences>(
      () =>
        loadAppPreferences(),
    );

  const resolvedLanguage =
    resolveAppLanguage(
      preferences.language,
    );

  function updatePreference<
    Key extends
      keyof AppPreferences,
  >(
    key: Key,
    value:
      AppPreferences[Key],
  ) {
    const next = {
      ...preferences,
      [key]: value,
    };

    setPreferences(
      next,
    );

    saveAppPreferences(
      next,
    );
  }

  function handleReset() {
    const next =
      resetAppPreferences();

    setPreferences(
      next,
    );
  }

  return (
    <div className="settings-page">
      <header className="topbar">
        <div>
          <p className="eyebrow">
            OWTRACKER
          </p>

          <h1>
            {t("settings.title")}
          </h1>

          <p className="subtitle">
            {t("settings.subtitle")}
          </p>
        </div>

        <div className="live-status">
          <span className="status-dot" />

          {t("settings.saved")}
        </div>
      </header>

      {/* ========================================
          LANGUAGE
      ======================================== */}

      <section className="settings-section">
        <div className="settings-section-header">
          <Languages size={16} />

          <div>
            <span className="settings-eyebrow">
              {t("settings.language.eyebrow")}
            </span>

            <h2>
              {t("settings.language.title")}
            </h2>
          </div>
        </div>

        <div className="settings-grid">
          <SettingSelect
            label={t("settings.language.label")}
            detail={t("settings.language.detail")}
            value={
              preferences.language
            }
            onChange={(
              value,
            ) =>
              updatePreference(
                "language",
                value as
                  AppLanguage,
              )
            }
          >
            {LANGUAGE_OPTIONS.map(
              (option) => (
                <option
                  key={
                    option.value
                  }
                  value={
                    option.value
                  }
                >
                  {option.label}
                </option>
              ),
            )}
          </SettingSelect>

          <div className="settings-card">
            <span className="settings-label">
              {t("settings.language.active")}
            </span>

            <strong>
              {getLanguageLabel(
                resolvedLanguage,
              )}
            </strong>

            <span className="settings-detail">
              {preferences.language ===
              "auto"
                ? t("settings.language.auto")
                : t("settings.language.manual")}
            </span>
          </div>
        </div>
      </section>

      {/* ========================================
          DEFAULT STATS
      ======================================== */}

      <section className="settings-section">
        <div className="settings-section-header">
          <Settings2 size={16} />

          <div>
            <span className="settings-eyebrow">
              {t("settings.stats.eyebrow")}
            </span>

            <h2>
              {t("settings.stats.title")}
            </h2>
          </div>
        </div>

        <div className="settings-grid">
          <SettingSelect
            label={t("settings.stats.region")}
            detail={t("settings.stats.regionDetail")}
            value={
              preferences.defaultRegion
            }
            onChange={(
              value,
            ) =>
              updatePreference(
                "defaultRegion",
                value as
                  BlizzardRegion,
              )
            }
          >
            {REGIONS.map(
              (region) => (
                <option
                  key={region}
                  value={region}
                >
                  {region}
                </option>
              ),
            )}
          </SettingSelect>

          <SettingSelect
            label={t("settings.stats.rank")}
            detail={t("settings.stats.rankDetail")}
            value={
              preferences.defaultTier
            }
            onChange={(
              value,
            ) =>
              updatePreference(
                "defaultTier",
                value as
                  BlizzardTier,
              )
            }
          >
            {TIERS.map(
              (tier) => (
                <option
                  key={tier}
                  value={tier}
                >
                  {tier === "All"
                    ? "All ranks"
                    : tier}
                </option>
              ),
            )}
          </SettingSelect>

          <SettingSelect
            label={t("settings.stats.role")}
            detail={t("settings.stats.roleDetail")}
            value={
              preferences.defaultRole
            }
            onChange={(
              value,
            ) =>
              updatePreference(
                "defaultRole",
                value as
                  BlizzardRole,
              )
            }
          >
            {ROLES.map(
              (role) => (
                <option
                  key={role}
                  value={role}
                >
                  {role === "All"
                    ? "All roles"
                    : role}
                </option>
              ),
            )}
          </SettingSelect>
        </div>
      </section>

      {/* ========================================
          CACHE / REFRESH
      ======================================== */}

      <section className="settings-section">
        <div className="settings-section-header">
          <Database size={16} />

          <div>
            <span className="settings-eyebrow">
              {t("settings.cache.eyebrow")}
            </span>

            <h2>
              {t("settings.cache.title")}
            </h2>
          </div>
        </div>

        <div className="settings-grid">
          <SettingSelect
            label={t("settings.cache.duration")}
            detail={t("settings.cache.durationDetail")}
            value={
              String(
                preferences.refreshIntervalMinutes,
              )
            }
            onChange={(
              value,
            ) =>
              updatePreference(
                "refreshIntervalMinutes",
                Number(
                  value,
                ) as
                  RefreshIntervalMinutes,
              )
            }
          >
            {REFRESH_INTERVALS.map(
              (minutes) => (
                <option
                  key={minutes}
                  value={minutes}
                >
                  {minutes < 60
                    ? `${minutes} ${t("settings.minutes")}`
                    : minutes === 60
                      ? t("settings.hour")
                      : t("settings.hours2")}
                </option>
              ),
            )}
          </SettingSelect>

          <div className="settings-card">
            <span className="settings-label">
              {t("settings.cache.current")}
            </span>

            <strong>
              {preferences.refreshIntervalMinutes}
              {" "}min
            </strong>

            <span className="settings-detail">
              {t("settings.cache.valid")}
            </span>
          </div>

          <div className="settings-card">
            <span className="settings-label">
              {t("settings.cache.defaults")}
            </span>

            <strong>
              {preferences.defaultRegion}
              {" · "}
              {preferences.defaultTier}
              {" · "}
              {preferences.defaultRole}
            </strong>

            <span className="settings-detail">
              {t("settings.cache.defaultsDetail")}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={
            handleReset
          }
          style={{
            marginTop: "14px",
            minHeight: "36px",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "0 12px",
            border:
              "1px solid var(--border)",
            borderRadius: "8px",
            color: "var(--muted)",
            background: "#0d1015",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: "8px",
            fontWeight: 600,
          }}
        >
          <RotateCcw size={14} />

          {t("settings.cache.reset")}
        </button>
      </section>

      {/* ========================================
          APPLICATION
      ======================================== */}

      <section className="settings-section">
        <div className="settings-section-header">
          <Info size={16} />

          <div>
            <span className="settings-eyebrow">
              {t("settings.app.eyebrow")}
            </span>

            <h2>
              {t("settings.app.title")}
            </h2>
          </div>
        </div>

        <div className="settings-grid">
          <div className="settings-card">
            <span className="settings-label">
              {t("settings.app.version")}
            </span>

            <strong>
              0.1.0
            </strong>

            <span className="settings-detail">
              {t("settings.app.currentRelease")}
            </span>
          </div>

          <div className="settings-card">
            <span className="settings-label">
              {t("settings.app.platform")}
            </span>

            <strong>
              Desktop / Web
            </strong>

            <span className="settings-detail">
              React + Tauri
            </span>
          </div>

          <div className="settings-card">
            <span className="settings-label">
              {t("settings.app.game")}
            </span>

            <strong>
              Overwatch
            </strong>

            <span className="settings-detail">
              {t("settings.app.pcStats")}
            </span>
          </div>

          <LinkCard
            label={t("settings.app.website")}
            title="owtracker.net"
            detail={t("settings.app.publicWeb")}
            href={
              WEBSITE_URL
            }
          />

          <LinkCard
            label={t("settings.app.source")}
            title={t("settings.app.repo")}
            detail={t("settings.app.repoDetail")}
            href={
              GITHUB_URL
            }
          />
        </div>
      </section>

      {/* ========================================
          DATA SOURCES
      ======================================== */}

      <section className="settings-section">
        <div className="settings-section-header">
          <Database size={16} />

          <div>
            <span className="settings-eyebrow">
              {t("settings.data.eyebrow")}
            </span>

            <h2>
              {t("settings.data.title")}
            </h2>
          </div>
        </div>

        <div className="settings-list">
          <DataRow
            icon={
              <Activity size={16} />
            }
            title="Blizzard statistics"
            detail={t("settings.data.blizzardDetail")}
            status="LIVE"
          />

          <DataRow
            icon={
              <Database size={16} />
            }
            title="OverFast"
            detail={t("settings.data.overfastDetail")}
            status="PLAYER DATA"
          />

          <DataRow
            icon={
              <Activity size={16} />
            }
            title="Counterwatch"
            detail={t("settings.data.counterwatchDetail")}
            status="MATCHUP DATA"
          />

          <DataRow
            icon={
              <Info size={16} />
            }
            title={t("settings.data.perks")}
            detail={t("settings.data.perksDetail")}
            status="COMMUNITY"
          />

          <DataRow
            icon={
              <Activity size={16} />
            }
            title="OWTracker Meta Score"
            detail={t("settings.data.metaDetail")}
            status="CALCULATED"
          />

          <DataRow
            icon={
              <Database size={16} />
            }
            title={t("settings.data.cache")}
            detail={t("settings.data.cacheDetail")}
            status="ACTIVE"
          />
        </div>
      </section>

      {/* ========================================
          META METHOD
      ======================================== */}

      <section className="settings-section">
        <div className="settings-section-header">
          <Activity size={16} />

          <div>
            <span className="settings-eyebrow">
              {t("settings.meta.eyebrow")}
            </span>

            <h2>
              {t("settings.meta.title")}
            </h2>
          </div>
        </div>

        <div className="settings-grid">
          <div className="settings-card">
            <span className="settings-label">
              {t("settings.meta.win")}
            </span>

            <strong>
              60%
            </strong>

            <span className="settings-detail">
              {t("settings.meta.winDetail")}
            </span>
          </div>

          <div className="settings-card">
            <span className="settings-label">
              {t("settings.meta.pick")}
            </span>

            <strong>
              30%
            </strong>

            <span className="settings-detail">
              {t("settings.meta.pickDetail")}
            </span>
          </div>

          <div className="settings-card">
            <span className="settings-label">
              {t("settings.meta.ban")}
            </span>

            <strong>
              10%
            </strong>

            <span className="settings-detail">
              {t("settings.meta.banDetail")}
            </span>
          </div>
        </div>

        <div
          className="settings-disclaimer"
          style={{
            marginTop: "14px",
          }}
        >
          <Info size={17} />

          <div>
            <strong>
              {t("settings.meta.ranking")}
            </strong>

            <p>
              {t("settings.meta.explain1")}
            </p>

            <p>
              {t("settings.meta.explain2")}
            </p>
          </div>
        </div>
      </section>

      <div className="settings-disclaimer">
        <ShieldCheck size={17} />

        <div>
          <strong>
            {t("settings.disclaimer.title")}
          </strong>

          <p>
            {t("settings.disclaimer.text")}
          </p>

          <p>
            {t("settings.disclaimer.storage")}
          </p>
        </div>
      </div>
    </div>
  );
}

type SettingSelectProps = {
  label: string;
  detail: string;
  value: string;
  onChange:
    (value: string) => void;
  children:
    ReactNode;
};

function SettingSelect({
  label,
  detail,
  value,
  onChange,
  children,
}: SettingSelectProps) {
  return (
    <div className="settings-card">
      <label className="settings-label">
        {label}
      </label>

      <select
        value={value}
        onChange={(
          event,
        ) =>
          onChange(
            event.target.value,
          )
        }
        style={{
          width: "100%",
          minHeight: "38px",
          padding: "0 10px",
          border:
            "1px solid var(--border)",
          borderRadius: "8px",
          color: "var(--text)",
          background: "#090c10",
          fontFamily: "inherit",
          fontSize: "10px",
          outline: "none",
        }}
      >
        {children}
      </select>

      <span className="settings-detail">
        {detail}
      </span>
    </div>
  );
}


type LinkCardProps = {
  label: string;
  title: string;
  detail: string;
  href: string;
};

function LinkCard({
  label,
  title,
  detail,
  href,
}: LinkCardProps) {
  return (
    <a
      className="settings-card"
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <span className="settings-label">
        {label}
      </span>

      <strong>
        {title}
      </strong>

      <span className="settings-detail">
        {detail}
      </span>
    </a>
  );
}

type DataRowProps = {
  icon: ReactNode;
  title: string;
  detail: string;
  status: string;
};

function DataRow({
  icon,
  title,
  detail,
  status,
}: DataRowProps) {
  return (
    <div className="settings-row">
      <div className="settings-row-icon">
        {icon}
      </div>

      <div className="settings-row-content">
        <strong>
          {title}
        </strong>

        <span>
          {detail}
        </span>
      </div>

      <span className="settings-status online">
        {status}
      </span>
    </div>
  );
}

export default SettingsPage;
