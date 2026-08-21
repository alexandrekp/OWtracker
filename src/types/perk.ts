export type PerkTier = "Minor" | "Major";

export type Perk = {
  id: string;
  name: string;
  tier: PerkTier;
  description: string;
  icon: string;
  popularity?: number;
};

export type HeroPerks = {
  heroId: string;
  perks: Perk[];
};