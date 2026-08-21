export type PlayerRank = {
  division: string;
  tier: number;

  role_icon: string;
  rank_icon: string;
  tier_icon: string;
};

export type PlayerPlatformCompetitiveRanks = {
  season: number | null;

  tank: PlayerRank | null;
  damage: PlayerRank | null;
  support: PlayerRank | null;
  open: PlayerRank | null;
};

export type PlayerCompetitiveRanks = {
  pc: PlayerPlatformCompetitiveRanks | null;
  console: PlayerPlatformCompetitiveRanks | null;
};

export type PlayerSummary = {
  username: string;

  avatar: string | null;

  namecard: string | null;

  title: string | null;

  endorsement: {
    level: number;
    frame: string;
  } | null;

  competitive:
    PlayerCompetitiveRanks | null;

  last_updated_at?: number | null;
};

export type PlayerStatNumbers = {
  eliminations: number;
  assists: number;
  deaths: number;
  damage: number;
  healing: number;
};

export type PlayerStatBlock = {
  games_played: number;
  games_won: number;
  games_lost: number;

  time_played: number;

  winrate: number;
  kda: number;

  total: PlayerStatNumbers;
  average: PlayerStatNumbers;
};

export type PlayerRoleStats = {
  tank?: PlayerStatBlock;
  damage?: PlayerStatBlock;
  support?: PlayerStatBlock;
};

export type PlayerHeroStats = Record<
  string,
  PlayerStatBlock
>;

export type PlayerStatsSummary = {
  general: PlayerStatBlock;

  roles: PlayerRoleStats;

  heroes: PlayerHeroStats;
};

export type PlayerData = {
  summary: PlayerSummary;
  stats: PlayerStatsSummary;
};