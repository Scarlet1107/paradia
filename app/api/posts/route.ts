import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { AI_PROMPT_BASE, TEMPLATE_PHRASES } from "@/config/prompt";

// AIからのレスポンス形式定義
const AI_RESPONSE_SCHEMA = z.object({
  rewritten: z.string(),
  negativity_level: z.number().int().min(0).max(3),
  visibility_level: z.number().int().min(1).max(5),
});

type AIResult = z.infer<typeof AI_RESPONSE_SCHEMA>;

// trust_score 変動値
const TRUST_ADJUSTMENTS: Record<number, number> = {
  0: 0,
  1: -2,
  2: -5,
  3: -10,
};

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ランダム定型文取得
function getRandomPhrase() {
  return TEMPLATE_PHRASES[Math.floor(Math.random() * TEMPLATE_PHRASES.length)];
}

async function classifyAndRewrite(content: string): Promise<AIResult> {
  const selectedPhrase = getRandomPhrase();
  // プロンプトを動的に構築
  const systemPrompt = `${AI_PROMPT_BASE.trim()}

**【置き換え用定型文】**
- ${selectedPhrase}

以下の形式のJSONで返してください:
{
  "rewritten": "書き換え後のテキスト",
  "negativity_level": 0,
  "visibility_level": 1
}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content },
    ],
  });

  const raw = completion.choices?.[0]?.message?.content ?? "";
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("AIレスポンスがJSON形式ではありません: " + raw);
  }

  const result = AI_RESPONSE_SCHEMA.safeParse(parsed);
  if (!result.success) {
    throw new Error(
      "AIレスポンスのバリデーションエラー: " +
        JSON.stringify(result.error.format()),
    );
  }
  return result.data;
}

export async function POST(request: Request) {
  const supabase = await createClient();

  // 認証チェック
  const { data: { user } = {}, error: authError } =
    await supabase.auth.getUser();
  if (authError || !user) {
    console.error("認証エラー:", authError);
    return NextResponse.json({ error: "認証エラー" }, { status: 401 });
  }

  const { content } = await request.json();
  console.log("Received content:", content);

  // AIでリライト＆分類
  let aiResult: AIResult;
  try {
    aiResult = await classifyAndRewrite(content);
    console.log("AI Result:", aiResult);
  } catch (e) {
    console.error("AI分類リライト失敗:", e);
    return NextResponse.json({ error: "AI分類リライト失敗" }, { status: 500 });
  }

  // trust_score 調整値
  const adjust = TRUST_ADJUSTMENTS[aiResult.negativity_level] ?? 0;

  try {
    // 投稿を保存
    const postContent =
      aiResult.negativity_level === 0 ? content : aiResult.rewritten;

    const { data: postsData, error: insertError } = await supabase
      .from("posts")
      .insert([
        {
          author_id: user.id,
          content: postContent,
          negativity_level: aiResult.negativity_level,
          visibility_level: aiResult.visibility_level,
        },
      ])
      .select();

    if (insertError) {
      console.error("ポスト保存失敗:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
    if (!postsData || postsData.length === 0) {
      console.error("挿入後データ取得失敗");
      return NextResponse.json(
        { error: "挿入後データ取得失敗" },
        { status: 500 },
      );
    }
    const savedPost = postsData[0];

    // trust_score 更新
    if (adjust !== 0) {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("trust_score")
        .eq("id", user.id)
        .single();

      if (profileError || !profileData) {
        console.error("信頼度取得失敗:", profileError);
        return NextResponse.json(
          { post: savedPost, warning: "信頼度取得失敗" },
          { status: 201 },
        );
      }

      const newScore = Math.max(
        0,
        Math.min(100, profileData.trust_score + adjust),
      );
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ trust_score: newScore })
        .eq("id", user.id);

      // 信頼度が減ったことをユーザーに通知する
      const { error } = await supabase.from("notifications").insert([
        {
          recipient_id: user.id,
          content: `Lv.${aiResult.negativity_level}の有害投稿が検出されました。\n信頼度${adjust < 0 ? "減少" : "上昇"}→${newScore}`,
        },
      ]);

      if (error) {
        console.error("通知の挿入失敗:", error);
      }

      if (updateError) {
        console.error("信頼度更新失敗:", updateError);
        return NextResponse.json(
          { post: savedPost, warning: "信頼度更新失敗" },
          { status: 201 },
        );
      }
    }

    return NextResponse.json(savedPost, { status: 201 });
  } catch (e) {
    console.error("サーバーエラー:", e);
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}

// CORS対応
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    },
  );
}
