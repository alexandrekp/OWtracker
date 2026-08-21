import {
  Search,
  UsersRound,
} from "lucide-react";

import {
  useState,
} from "react";

import PlayerSearchPage from "./PlayerSearchPage";
import PlayerCompare from "./PlayerCompare";

import type {
  Hero,
} from "../types/hero";

import type {
  PlayerStatBlock,
} from "../types/player";

import "./PlayersPage.css";

type PlayersPageProps = {
  onOpenHero: (
    hero: Hero,
    stats: PlayerStatBlock,
    player: {
      username: string;
      battleTag: string;
    },
  ) => void;
};

type PlayerView =
  | "lookup"
  | "compare";

function PlayersPage({
  onOpenHero,
}: PlayersPageProps) {
  const [
    activeView,
    setActiveView,
  ] =
    useState<PlayerView>(
      "lookup",
    );

  return (
    <div className="players-page-shell">
      <div className="players-view-switch">
        <button
          className={
            activeView === "lookup"
              ? "players-view-button active"
              : "players-view-button"
          }
          onClick={() =>
            setActiveView(
              "lookup",
            )
          }
        >
          <Search size={14} />

          Player lookup
        </button>

        <button
          className={
            activeView === "compare"
              ? "players-view-button active"
              : "players-view-button"
          }
          onClick={() =>
            setActiveView(
              "compare",
            )
          }
        >
          <UsersRound size={14} />

          Compare players
        </button>
      </div>

      {activeView ===
        "lookup" && (
        <PlayerSearchPage
          onOpenHero={
            onOpenHero
          }
        />
      )}

      {activeView ===
        "compare" && (
        <PlayerCompare />
      )}
    </div>
  );
}

export default PlayersPage;