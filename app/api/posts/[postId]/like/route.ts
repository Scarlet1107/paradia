// app/api/posts/[postId]/like/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  _req: Request,
  context: { params: Promise<{ postId: string }> },
) {
  const { postId } = await context.params;
  const supabase = await createClient();

  // 1) Authenticate
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();
  if (authErr || !user) {
    return NextResponse.json({ error: "認証エラー" }, { status: 401 });
  }

  // 2) Load post author
  const { data: post, error: postErr } = await supabase
    .from("posts")
    .select("author_id")
    .eq("id", postId)
    .single();
  if (postErr || !post) {
    return NextResponse.json(
      { error: "投稿が見つかりません" },
      { status: 404 },
    );
  }

  // 3) Self-like penalty?
  if (post.author_id === user.id) {
    // decrement own trust by 1
    const { data: prof, error: profErr } = await supabase
      .from("profiles")
      .select("trust_score")
      .eq("id", user.id)
      .single();
    if (!profErr && prof?.trust_score != null) {
      await supabase
        .from("profiles")
        .update({ trust_score: Math.max(0, prof.trust_score - 1) })
        .eq("id", user.id);
    }
    return NextResponse.json({ success: true, selfLike: true });
  }

  // 4) Normal like: insert into likes
  const { error: likeErr } = await supabase
    .from("likes")
    .insert({ user_id: user.id, post_id: postId });
  if (likeErr) {
    return NextResponse.json({ error: likeErr.message }, { status: 400 });
  }

  // 5) Bump author’s trust by +1
  const { data: profA, error: profAErr } = await supabase
    .from("profiles")
    .select("nickname, trust_score")
    .eq("id", post.author_id)
    .single();
  if (!profAErr && profA?.trust_score != null) {
    await supabase
      .from("profiles")
      .update({ trust_score: Math.min(100, profA.trust_score + 1) })
      .eq("id", post.author_id);

    // 6) Create notification
    const { error: notifErr } = await supabase.from("notifications").insert({
      recipient_id: post.author_id,
      content: `${profA.nickname || "誰か"}さんがあなたの投稿にいいねをしました。\n信頼度+1`,
    });
    if (notifErr) console.error("通知作成失敗:", notifErr);
  }

  return NextResponse.json({ success: true, selfLike: false });
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ postId: string }> },
) {
  const { postId } = await context.params;
  const supabase = await createClient();

  // 1) Authenticate
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();
  if (authErr || !user) {
    return NextResponse.json({ error: "認証エラー" }, { status: 401 });
  }

  // 2) Delete from likes
  const { error: unlikeErr } = await supabase
    .from("likes")
    .delete()
    .eq("user_id", user.id)
    .eq("post_id", postId);
  if (unlikeErr) {
    return NextResponse.json({ error: unlikeErr.message }, { status: 400 });
  }

  // 3) Fetch post author
  const { data: post, error: postErr } = await supabase
    .from("posts")
    .select("author_id")
    .eq("id", postId)
    .single();
  if (postErr || !post) {
    return NextResponse.json({ success: true }); // nothing more to do
  }

  // 4) Decrement author’s trust by 1
  const { data: profA, error: profAErr } = await supabase
    .from("profiles")
    .select("trust_score")
    .eq("id", post.author_id)
    .single();
  if (!profAErr && profA?.trust_score != null) {
    await supabase
      .from("profiles")
      .update({ trust_score: Math.max(0, profA.trust_score - 1) })
      .eq("id", post.author_id);
  }

  return NextResponse.json({ success: true });
}
