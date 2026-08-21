export type HeroRole =
  | "Tank"
  | "Damage"
  | "Support";

export type Hero = {
  id: string;
  name: string;
  role: HeroRole;
  image: string;

  description?: string;

  winRate?: number;
  pickRate?: number;
  banRate?: number;
};