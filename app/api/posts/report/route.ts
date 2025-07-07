import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { postId, content } = await request.json();

    if (!postId || !content) {
      return NextResponse.json(
        { error: "投稿IDと報告内容は必須です" },
        { status: 400 },
      );
    }

    // 認証チェック
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // 既に報告済みかチェック
    const { data: existingReport } = await supabase
      .from("reports")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", user.id)
      .single();

    if (existingReport) {
      return NextResponse.json({ error: "Already reported" }, { status: 409 });
    }

    // 報告を保存
    const { data: report, error: insertError } = await supabase
      .from("reports")
      .insert({
        post_id: postId,
        user_id: user.id,
        content: content.trim(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("報告保存エラー:", insertError);
      return NextResponse.json(
        { error: "報告の保存に失敗しました" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error("報告API エラー:", error);
    return NextResponse.json({ error: "内部サーバーエラー" }, { status: 500 });
  }
}
