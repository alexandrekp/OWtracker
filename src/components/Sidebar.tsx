import {
  BarChart3,
  Search,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";

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
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <img
            src={`${import.meta.env.BASE_URL}owtracker-logo.png`}
            alt="OWTracker"
            className="brand-logo"
          />
        </div>

        <div>
          <div className="brand-name">
            OWtracker
          </div>

          <div className="brand-subtitle">
            Overwatch companion
          </div>
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
          Stats
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
          Players
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
          Heroes
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
          Perks
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
          Settings
        </button>

        <div className="version">
          OWtracker v0.1.0
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;