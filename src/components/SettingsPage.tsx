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
  BlizzardRegion,
  BlizzardRole,
  BlizzardTier,
} from "../services/blizzardStats";

import {
  DEFAULT_APP_PREFERENCES,
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
            Defaults, refresh behavior
            and application data.
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
              OWTracker
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
          <div className="settings-row">
            <div className="settings-row-icon">
              <Activity size={16} />
            </div>

            <div className="settings-row-content">
              <strong>
                Blizzard statistics
              </strong>

              <span>
                Global hero win,
                pick and ban rates.
              </span>
            </div>

            <span className="settings-status online">
              LIVE
            </span>
          </div>

          <div className="settings-row">
            <div className="settings-row-icon">
              <Database size={16} />
            </div>

            <div className="settings-row-content">
              <strong>
                Local cache
              </strong>

              <span>
                Stores recent datasets
                and your preferences.
              </span>
            </div>

            <span className="settings-status online">
              ACTIVE
            </span>
          </div>
        </div>
      </section>

      <div className="settings-disclaimer">
        <ShieldCheck size={17} />

        <div>
          <strong>
            Preferences stay local
          </strong>

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
    React.ReactNode;
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

export default SettingsPage;
