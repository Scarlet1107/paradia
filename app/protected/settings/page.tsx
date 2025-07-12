import { LogoutButton } from "@/components/auth/LogoutButton";
import ProfileCard from "@/components/ProfileCard";
import UpdateNicknameInput from "@/components/UpdateNicknameInput";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();

  // --- ユーザー取得（省略） ---
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) redirect("/auth/login");

  // --- プロフィール取得（省略） ---
  const { data: userData, error: profileError } = await supabase
    .from("profiles")
    .select("trust_score, nickname")
    .eq("id", user.id)
    .single();
  if (profileError || !userData) redirect("/auth/login");

  // --- 投稿件数取得 ---
  // カラム名を author_id に合わせ、head: true は外す
  const { count, error: countError } = await supabase
    .from("posts")
    .select("id", { count: "exact" })
    .eq("author_id", user.id); // ← author_id を指定

  if (countError) {
    console.error("投稿件数の取得に失敗しました", countError);
  }
  const postCount = count ?? 0;

  return (
    <div className="p-4">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <ProfileCard
              nickname={userData.nickname}
              trust_score={userData.trust_score}
              count={postCount}
            />
          </div>

          {/* Settings Panel */}
          <div className="space-y-6">
            <UpdateNicknameInput />
            <div className="flex justify-center">
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
