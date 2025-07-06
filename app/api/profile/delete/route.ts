// app/api/profile/delete/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { Content } from "next/font/google";

export async function DELETE() {
  // 認証チェック
  const authClient = await createClient();
  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "未認証です" }, { status: 401 });
  }
  const userId = user.id;

  // RLS バイパスして削除
  await authClient.from("likes").delete().eq("user_id", userId);
  await authClient.from("profiles").delete().eq("id", userId);
  const { error: deleteError } =
    await supabaseAdmin.auth.admin.deleteUser(userId);
  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  const deleteMessage = `ユーザーID ${userId}が裏切者であることが発覚したため、抹消いたしました。 市民のみなさまは安心してパラディアをご利用ください。`;
  const { error: logError } = await authClient
    .from("announcements")
    .insert({ content: deleteMessage });
  if (logError) {
    return NextResponse.json({ error: logError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
