import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _req: Request,
  context: {
    params: Promise<{ postId: string }>;
  },
) {
  // ① await して params を解決
  const { postId } = await context.params;

  const supabase = await createClient();

  // like 数を取得
  const { count, error: cntErr } = await supabase
    .from("likes")
    .select("id", { head: true, count: "exact" })
    .eq("post_id", postId);
  if (cntErr) {
    return NextResponse.json({ error: cntErr.message }, { status: 500 });
  }

  // 自分の like 状態をチェック
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  let liked = false;
  if (!authErr && user) {
    const { data: row, error: likeErr } = await supabase
      .from("likes")
      .select("id")
      .match({ post_id: postId, user_id: user.id })
      .single();
    if (!likeErr && row) liked = true;
  }

  return NextResponse.json({ count, liked });
}

export async function POST(
  _req: Request,
  context: {
    params: Promise<{ postId: string }>;
  },
) {
  const { postId } = await context.params;

  const supabase = await createClient();
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();
  if (authErr || !user) {
    return NextResponse.json({ error: "認証エラー" }, { status: 401 });
  }

  const { error } = await supabase
    .from("likes")
    .insert({ user_id: user.id, post_id: postId });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: Request,
  context: {
    params: Promise<{ postId: string }>;
  },
) {
  const { postId } = await context.params;

  const supabase = await createClient();
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();
  if (authErr || !user) {
    return NextResponse.json({ error: "認証エラー" }, { status: 401 });
  }

  const { error } = await supabase
    .from("likes")
    .delete()
    .match({ user_id: user.id, post_id: postId });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
