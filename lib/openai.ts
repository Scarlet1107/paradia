import OpenAI from "openai";

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const CATEGORY_THRESHOLD = 0.1;

/**
 * 指定されたニックネームをチェックし、不適切（批判・ネガティブ表現、世界観否定、
 * 思想・政治的主張、スローガン、スパム的・無意味文字列など）を網羅的に検出し、
 * 不適切と判断された場合は true を返します。
 */
export async function moderateNickname(nickname: string): Promise<boolean> {
  if (!nickname) return false;

  try {
    // 1) Moderation API で一般的な不適切表現をチェック
    const modRes = await openai.moderations.create({
      model: "text-moderation-stable",
      input: nickname,
    });
    const mod = modRes.results?.[0];
    if (mod) {
      for (const score of Object.values(mod.category_scores)) {
        if (score !== null && score > CATEGORY_THRESHOLD) {
          console.warn(
            `moderateNickname: moderation score exceeded: ${JSON.stringify(mod.category_scores)}`,
          );
          return true;
        }
      }
      if (mod.flagged) {
        console.warn(
          `moderateNickname: moderation API flagged input: ${nickname}`,
        );
        return true;
      }
    }

    // 2) Chat API で詳細チェック（スパム含む）
    const systemPrompt = [
      "あなたは日本語の文のあらゆる不適切表現を網羅的に検出するアシスタントです。",
      "批判・ネガティブ表現、世界観否定、思想・政治的主張、スローガンだけでなく、",
      "スパム的・無意味な文字列（たとえば無作為な文字列、連続した同一文字、多数の記号など）も不適切と判定してください。",
      "完全に肯定的で有意義な名前のみを許可対象とし、少しでも不適切・無意味・スパムと判断したら必ず“はい”と回答します。",
    ].join(" ");

    const chatRes = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `以下のニックネームは不適切ですか？はい または いいえ で答えてください。\nニックネーム: 「${nickname}」`,
        },
      ],
      temperature: 0,
      max_tokens: 3,
    });
    const answer = chatRes.choices?.[0].message?.content?.trim();
    if (answer === "はい") {
      console.warn(`moderateNickname: chat API flagged: ${nickname}`);
      return true;
    }

    // 3) 許可
    return false;
  } catch (err) {
    console.error("moderateNickname: API エラー", err);
    return true;
  }
}
