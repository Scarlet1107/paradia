import { LogoutButton } from "@/components/auth/LogoutButton";
import UpdateNicknameInput from "@/components/UpdateNicknameInput";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-500">ログインしてください</p>
      </div>
    );
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center gap-12">
      <UpdateNicknameInput nickname={profile?.nickname} />
      <LogoutButton />
    </div>
  );
}
