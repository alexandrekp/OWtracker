import {
  Activity,
  Database,
  Info,
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
  const [
    preferences,
    setPreferences,
  ] =
    useState<AppPreferences>(
      () =>
        loadAppPreferences(),
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
            Settings
          </h1>

          <p className="subtitle">
            Defaults, refresh behavior,
            data sources and application
            information.
          </p>
        </div>

        <div className="live-status">
          <span className="status-dot" />

          Saved automatically
        </div>
      </header>

      {/* ========================================
          DEFAULT STATS
      ======================================== */}

      <section className="settings-section">
        <div className="settings-section-header">
          <Settings2 size={16} />

          <div>
            <span className="settings-eyebrow">
              DEFAULT STATS
            </span>

            <h2>
              Statistics preferences
            </h2>
          </div>
        </div>

        <div className="settings-grid">
          <SettingSelect
            label="Default region"
            detail="Used when opening Stats."
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
            label="Default rank"
            detail="Competitive rank filter."
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
            label="Default role"
            detail="Hero role loaded by default."
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
              CACHE
            </span>

            <h2>
              Refresh behavior
            </h2>
          </div>
        </div>

        <div className="settings-grid">
          <SettingSelect
            label="Cache duration"
            detail="After this delay Stats suggests a refresh."
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
                    ? `${minutes} minutes`
                    : minutes === 60
                      ? "1 hour"
                      : "2 hours"}
                </option>
              ),
            )}
          </SettingSelect>

          <div className="settings-card">
            <span className="settings-label">
              Current behavior
            </span>

            <strong>
              {preferences.refreshIntervalMinutes}
              {" "}min
            </strong>

            <span className="settings-detail">
              Cached Blizzard data remains
              valid for this duration.
            </span>
          </div>

          <div className="settings-card">
            <span className="settings-label">
              Defaults
            </span>

            <strong>
              {preferences.defaultRegion}
              {" · "}
              {preferences.defaultTier}
              {" · "}
              {preferences.defaultRole}
            </strong>

            <span className="settings-detail">
              Applied next time you open
              the Stats page.
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

          Reset defaults
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
              APPLICATION
            </span>

            <h2>
              About OWTracker
            </h2>
          </div>
        </div>

        <div className="settings-grid">
          <div className="settings-card">
            <span className="settings-label">
              Version
            </span>

            <strong>
              0.1.0
            </strong>

            <span className="settings-detail">
              Current release
            </span>
          </div>

          <div className="settings-card">
            <span className="settings-label">
              Platform
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
              Game
            </span>

            <strong>
              Overwatch
            </strong>

            <span className="settings-detail">
              PC statistics
            </span>
          </div>

          <LinkCard
            label="Website"
            title="owtracker.net"
            detail="Public web version."
            href={
              WEBSITE_URL
            }
          />

          <LinkCard
            label="Source"
            title="GitHub repository"
            detail="Source code and project history."
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
              DATA
            </span>

            <h2>
              Data sources
            </h2>
          </div>
        </div>

        <div className="settings-list">
          <DataRow
            icon={
              <Activity size={16} />
            }
            title="Blizzard statistics"
            detail="Global hero win, pick and ban rates."
            status="LIVE"
          />

          <DataRow
            icon={
              <Database size={16} />
            }
            title="OverFast"
            detail="Player profiles, competitive ranks and individual statistics."
            status="PLAYER DATA"
          />

          <DataRow
            icon={
              <Activity size={16} />
            }
            title="Counterwatch"
            detail="Hero counter ratings, fight swing and community matchup data."
            status="MATCHUP DATA"
          />

          <DataRow
            icon={
              <Info size={16} />
            }
            title="Community perks"
            detail="Perk popularity and community preference data."
            status="COMMUNITY"
          />

          <DataRow
            icon={
              <Activity size={16} />
            }
            title="OWTracker Meta Score"
            detail="Calculated locally from normalized WR 60%, PR 30% and BR 10%."
            status="CALCULATED"
          />

          <DataRow
            icon={
              <Database size={16} />
            }
            title="Local cache"
            detail="Stores recent datasets and your application preferences."
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
              META METHOD
            </span>

            <h2>
              How the ranking works
            </h2>
          </div>
        </div>

        <div className="settings-grid">
          <div className="settings-card">
            <span className="settings-label">
              Win Rate
            </span>

            <strong>
              60%
            </strong>

            <span className="settings-detail">
              Main performance signal.
            </span>
          </div>

          <div className="settings-card">
            <span className="settings-label">
              Pick Rate
            </span>

            <strong>
              30%
            </strong>

            <span className="settings-detail">
              Measures current presence.
            </span>
          </div>

          <div className="settings-card">
            <span className="settings-label">
              Ban Rate
            </span>

            <strong>
              10%
            </strong>

            <span className="settings-detail">
              Adds competitive pressure.
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
              OWTracker ranking
            </strong>

            <p>
              Win, pick and ban rates are
              normalized inside the active
              dataset before the weighted
              Meta Score is calculated.
            </p>

            <p>
              The resulting tier list is an
              OWTracker interpretation and
              is not an official Blizzard
              ranking.
            </p>
          </div>
        </div>
      </section>

      <div className="settings-disclaimer">
        <ShieldCheck size={17} />

        <div>
          <strong>
            Independent project
          </strong>

          <p>
            OWTracker is an independent
            project and is not affiliated
            with, endorsed by or sponsored
            by Blizzard Entertainment.
          </p>

          <p>
            Region, rank, role and cache
            duration are stored locally in
            OWTracker using localStorage.
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
