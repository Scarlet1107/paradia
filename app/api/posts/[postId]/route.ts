// app/api/posts/[postId]/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { AI_PROMPT_BASE, TEMPLATE_PHRASES } from "@/config/prompt";

// AI response schema
const AI_RESPONSE_SCHEMA = z.object({
  rewritten: z.string(),
  negativity_level: z.number().int().min(0).max(3),
  visibility_level: z.number().int().min(1).max(5),
});
type AIResult = z.infer<typeof AI_RESPONSE_SCHEMA>;

// trust_score adjustments on negativity
const TRUST_ADJUSTMENTS: Record<number, number> = {
  0: 0,
  1: -2,
  2: -5,
  3: -10,
};

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// pick a random template phrase
function getRandomPhrase() {
  return TEMPLATE_PHRASES[Math.floor(Math.random() * TEMPLATE_PHRASES.length)];
}

// run the classify+rewrite call
async function classifyAndRewrite(content: string): Promise<AIResult> {
  const selectedPhrase = getRandomPhrase();
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

export async function PATCH(
  request: Request,
  context: { params: Promise<{ postId: string }> },
) {
  const { postId } = await context.params;
  const { content } = await request.json();
  const supabase = await createClient();

  // 1️⃣ Auth
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "認証エラー" }, { status: 401 });
  }

  // 2️⃣ Author‐only guard
  const { data: existing, error: postError } = await supabase
    .from("posts")
    .select("author_id")
    .eq("id", postId)
    .single();
  if (postError || existing.author_id !== user.id) {
    return NextResponse.json({ error: "権限がありません" }, { status: 403 });
  }

  // 3️⃣ AI classify & rewrite
  let aiResult: AIResult;
  try {
    aiResult = await classifyAndRewrite(content);
  } catch (e) {
    console.error("AI分類リライト失敗:", e);
    return NextResponse.json({ error: "AI分類リライト失敗" }, { status: 500 });
  }

  // choose final content
  const finalContent =
    aiResult.negativity_level === 0 ? content : aiResult.rewritten;
  const adjust = TRUST_ADJUSTMENTS[aiResult.negativity_level] ?? 0;

  // 4️⃣ Update the post row
  const { error: updateError } = await supabase
    .from("posts")
    .update({
      content: finalContent,
      negativity_level: aiResult.negativity_level,
      visibility_level: aiResult.visibility_level,
    })
    .eq("id", postId);

  if (updateError) {
    console.error("ポスト更新失敗:", updateError);
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // 5️⃣ Adjust trust_score if needed
  if (adjust !== 0) {
    const { data: prof, error: profErr } = await supabase
      .from("profiles")
      .select("trust_score")
      .eq("id", user.id)
      .single();

    if (!profErr && prof?.trust_score != null) {
      const newScore = prof.trust_score + adjust;
      await supabase
        .from("profiles")
        .update({ trust_score: newScore })
        .eq("id", user.id);

      // notify about trust change
      await supabase.from("notifications").insert({
        recipient_id: user.id,
        content: `投稿が再編集されました。Lv.${aiResult.negativity_level}の有害投稿が検出されました。\n信頼度${adjust < 0 ? "減少" : "上昇"}→${newScore}`,
      });
    }
  }

  return NextResponse.json(
    {
      success: true,
      content: finalContent,
      negativity_level: aiResult.negativity_level,
    },
    { status: 200 },
  );
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ postId: string }> },
) {
  const { postId } = await context.params;
  const supabase = await createClient();

  // auth
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "認証エラー" }, { status: 401 });
  }

  // only author
  const { data: existing, error: postError } = await supabase
    .from("posts")
    .select("author_id")
    .eq("id", postId)
    .single();
  if (postError || existing.author_id !== user.id) {
    return NextResponse.json({ error: "権限がありません" }, { status: 403 });
  }

  // delete
  const { error: delError } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId);
  if (delError) {
    console.error("ポスト削除失敗:", delError);
    return NextResponse.json({ error: delError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
