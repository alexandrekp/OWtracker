import {
  invoke,
} from "@tauri-apps/api/core";

export type BlizzardCareerRaw = {
  careerId: string;
  url: string;
  htmlLength: number;
  html: string;
};

export async function testBlizzardCareer(
  careerId: string,
): Promise<BlizzardCareerRaw> {
  return invoke<BlizzardCareerRaw>(
    "fetch_blizzard_career",
    {
      careerId,
    },
  );
}