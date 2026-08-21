import {
  Activity,
  Database,
  Info,
  ShieldCheck,
} from "lucide-react";

function SettingsPage() {
  return (
    <div className="settings-page">
      {/* ========================================
          HEADER
      ======================================== */}

      <header className="topbar">
        <div>
          <p className="eyebrow">
            OWTRACKER
          </p>

          <h1>
            Settings
          </h1>

          <p className="subtitle">
            Application information
            and data sources.
          </p>
        </div>

        <div className="live-status">
          <span className="status-dot" />

          Web version
        </div>
      </header>

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
              Web release
            </span>
          </div>

          <div className="settings-card">
            <span className="settings-label">
              Platform
            </span>

            <strong>
              Web
            </strong>

            <span className="settings-detail">
              React + Vite
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
        </div>
      </section>

      {/* ========================================
          DATA
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
                OverFast
              </strong>

              <span>
                Player profiles and
                individual statistics.
              </span>
            </div>

            <span className="settings-status online">
              LIVE
            </span>
          </div>
	</div>
      </section>

      {/* ========================================
          DISCLAIMER
      ======================================== */}

      <section className="settings-disclaimer">
        <ShieldCheck size={17} />

        <div>
          <strong>
            Independent community project
          </strong>

          <p>
            OWTracker is an independent
            community project and is not
            affiliated with, endorsed by,
            or sponsored by Blizzard
            Entertainment.
          </p>

          <p>
            Overwatch and Blizzard
            Entertainment are trademarks
            or registered trademarks of
            Blizzard Entertainment, Inc.
          </p>
        </div>
      </section>
    </div>
  );
}

export default SettingsPage;
