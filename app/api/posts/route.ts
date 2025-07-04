import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import { AI_PROMPT } from "@/config/prompt";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  console.log("POST /api/posts called");
  const supabase = await createClient();

  // 認証チェック
  const { data: { user } = {}, error: authError } =
    await supabase.auth.getUser();
  if (authError || !user) {
    console.error("認証エラー:", authError);
    return NextResponse.json({ error: "認証エラー" }, { status: 401 });
  }

  // リクエストボディ取得
  const { content } = await request.json();
  console.log("Received content:", content);

  // ORDINA によるリライト
  let rewritten: string;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: AI_PROMPT },
        { role: "user", content },
      ],
    });
    rewritten = completion.choices?.[0]?.message?.content ?? "";
    console.log("Rewritten content:", rewritten);
  } catch (e) {
    console.error("リライト失敗:", e);
    return NextResponse.json({ error: "リライト失敗" }, { status: 500 });
  }

  // DB に保存 (returning を利用)
  try {
    const { data, error: insertError } = await supabase
      .from("posts")
      .insert([{ content: rewritten }])
      .select(); // Ensures data is typed as an array of rows

    if (insertError) {
      console.error("ポストの保存に失敗しました:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      console.error("挿入後のデータが取得できませんでした");
      return NextResponse.json(
        { error: "挿入後データ取得失敗" },
        { status: 500 },
      );
    }

    const saved = data[0];
    console.log("Inserted:", saved);
    return NextResponse.json(saved, { status: 201 });
  } catch (e) {
    console.error("予期せぬエラー:", e);
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}

// CORS オプション対応（必要であれば）
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
