// lib/trust.ts
/**
 * trustScore ⇒ citizenLevel のマッピング
 * @param score 0～100 の信頼度
 * @returns レベル 1～5
 */
export function getCitizenLevel(score: number): 1 | 2 | 3 | 4 | 5 {
  if (score < 0 || score > 100) {
    throw new Error("信頼度は0から100の整数でなければなりません");
  }
  // 数字の閾値は仮決め - shogo
  if (score <= 20) return 1;
  if (score <= 55) return 2;
  if (score <= 75) return 3;
  if (score <= 90) return 4;
  return 5;
}
