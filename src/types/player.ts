export type PlayerRank = {
  division: string;
  tier: number;
  role_icon?: string | null;
  rank_icon?: string | null;
  tier_icon?: string | null;
};

export type PlayerPlatformRanks = {
  season?: number | null;
  tank?: PlayerRank | null;
  damage?: PlayerRank | null;
  support?: PlayerRank | null;
};

export type PlayerSummary = {
  username: string;
  avatar: string | null;
  namecard?: string | null;
  title?: string | null;
  endorsement?: {
    level?: number | null;
    frame?: string | null;
  } | null;
  competitive?: {
    pc?:
      | PlayerPlatformRanks
      | null;
    console?:
      | PlayerPlatformRanks
      | null;
  } | null;
};

export type PlayerStatValues = {
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
  total: PlayerStatValues;
  average: PlayerStatValues;
};

export type PlayerStatsSummary = {
  general: PlayerStatBlock;
  roles: {
    tank?: PlayerStatBlock;
    damage?: PlayerStatBlock;
    support?: PlayerStatBlock;
  };
  heroes: Record<
    string,
    PlayerStatBlock
  >;
};

export type PlayerData = {
  summary: PlayerSummary;
  stats: PlayerStatsSummary;
};
