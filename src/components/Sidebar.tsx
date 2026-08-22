import {
  BarChart3,
  Search,
  Settings,
  Sparkles,
  Swords,
  Users,
} from "lucide-react";

import {
  useI18n,
} from "../i18n/i18n";

import type {
  AppSection,
} from "../types/navigation";

type SidebarProps = {
  activeSection: AppSection;

  onNavigate:
    (section: AppSection) => void;
};

function Sidebar({
  activeSection,
  onNavigate,
}: SidebarProps) {
  const {
    t,
  } = useI18n();

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <img
            src={`${import.meta.env.BASE_URL}owtracker-logo-v2.png`}
            alt="OWTracker"
            className="brand-logo"
          />
        </div>
      </div>

      <nav className="navigation">
        <button
          className={
            activeSection === "stats"
              ? "nav-item active"
              : "nav-item"
          }
          onClick={() =>
            onNavigate("stats")
          }
        >
          <BarChart3 size={17} />
          {t("nav.stats")}
        </button>

        <button
          className={
            activeSection === "players"
              ? "nav-item active"
              : "nav-item"
          }
          onClick={() =>
            onNavigate("players")
          }
        >
          <Search size={17} />
          {t("nav.players")}
        </button>

        <button
          className={
            activeSection === "heroes"
              ? "nav-item active"
              : "nav-item"
          }
          onClick={() =>
            onNavigate("heroes")
          }
        >
          <Users size={17} />
          {t("nav.heroes")}
        </button>

        <button
          className={
            activeSection === "counters"
              ? "nav-item active"
              : "nav-item"
          }
          onClick={() =>
            onNavigate("counters")
          }
        >
          <Swords size={17} />
          {t("nav.counters")}
        </button>

        <button
          className={
            activeSection === "perks"
              ? "nav-item active"
              : "nav-item"
          }
          onClick={() =>
            onNavigate("perks")
          }
        >
          <Sparkles size={17} />
          {t("nav.perks")}
        </button>
      </nav>

      <div className="sidebar-footer">
        <button
          className={
            activeSection === "settings"
              ? "nav-item active"
              : "nav-item"
          }
          onClick={() =>
            onNavigate("settings")
          }
        >
          <Settings size={17} />
          {t("nav.settings")}
        </button>

        <div className="version">
          OWtracker v0.1.0
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
