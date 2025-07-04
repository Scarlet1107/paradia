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
  const { error } = await supabase
    .from("likes")
    .delete()
    .match({ user_id: user.id, post_id: postId });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
