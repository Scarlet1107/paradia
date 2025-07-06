import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DeleteUserDialog from "@/components/DeleteUserDialog";

export default async function DeleteUserPage() {
  const supabase = await createClient();

  // 現在のユーザー情報を取得
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  // ユーザーのプロフィール情報を取得
  const { data: userData } = await supabase
    .from("profiles")
    .select("trust_score")
    .eq("id", user.id)
    .single();

  if (!userData) {
    redirect("/auth/login");
  }

  if (userData.trust_score > 0) {
    redirect("/protected/home");
  }

  // アカウント削除処理

  return <DeleteUserDialog />;
}
