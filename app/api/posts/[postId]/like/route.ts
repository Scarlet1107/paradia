import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  _req: Request,
  context: { params: Promise<{ postId: string }> },
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
  const { data: post, error: postErr } = await supabase
    .from("posts")
    .select("author_id")
    .eq("id", postId)
    .single();
  if (!postErr && post?.author_id) {
    await supabase
      .from("profiles")
      .update({
        trust_score: Math.min(
          100,
          ((
            post.author_id &&
            (await supabase
              .from("profiles")
              .select("trust_score")
              .eq("id", post.author_id)
              .single())
          ).data?.trust_score ?? 0) + 1,
        ),
      })
      .eq("id", post.author_id);
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ postId: string }> },
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

  const { data: post, error: postErr } = await supabase
    .from("posts")
    .select("author_id")
    .eq("id", postId)
    .single();
  if (!postErr && post?.author_id) {
    const { data: prof, error: profErr } = await supabase
      .from("profiles")
      .select("trust_score")
      .eq("id", post.author_id)
      .single();
    if (!profErr && prof?.trust_score != null) {
      await supabase
        .from("profiles")
        .update({
          trust_score: Math.max(0, prof.trust_score - 1),
        })
        .eq("id", post.author_id);
    }
  }
  return NextResponse.json({ success: true });
}
