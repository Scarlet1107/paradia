// lib/trust.ts

/**
 * 市民の信頼度（0～100）に応じたレベル（1～5）の型定義
 */
export type CitizenLevel = 1 | 2 | 3 | 4 | 5;

/**
 * trustScore ⇒ citizenLevel のマッピング
 * @param score 0～100 の信頼度
 * @returns レベル 1～5
 * @throws スコアが 0～100 の整数でない場合にエラー
 */
export function getCitizenLevel(score: number): CitizenLevel {
  if (!Number.isInteger(score) || score < 0 || score > 100) {
    throw new Error("信頼度は0から100の整数で指定してください");
  }
  if (score <= 20) return 1;
  if (score <= 55) return 2;
  if (score <= 75) return 3;
  if (score <= 90) return 4;
  return 5;
}

/**
 * 各レベルに対応するバッジ画像の URL マッピング
 */
const badgeUrlMap: Readonly<Record<CitizenLevel, string>> = {
  1: "/badges/level1.png",
  2: "/badges/level2.png",
  3: "/badges/level3.png",
  4: "/badges/level4.png",
  5: "/badges/level5.png",
} as const;

/**
 * CitizenLevel を受け取ってバッジの URL を返す
 * @param level 1～5 の CitizenLevel
 * @returns バッジ画像のパス
 */
export function getBadgeUrlByLevel(level: CitizenLevel): string {
  return badgeUrlMap[level];
}

/**
 * スコアを与えると自動的にレベルを判定し、対応するバッジ URL を返す
 * @param score 0～100 の信頼度
 * @returns バッジ画像のパス
 */
export function getBadgeUrlFromScore(score: number): string {
  const level = getCitizenLevel(score);
  return getBadgeUrlByLevel(level);
}
