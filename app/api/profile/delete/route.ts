// app/api/profile/delete/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

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
  await authClient.from("profiles").delete().eq("id", userId);
  const { error: deleteError } =
    await supabaseAdmin.auth.admin.deleteUser(userId);
  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
