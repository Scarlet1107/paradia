import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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
    .from("profile")
    .select("trust_score, name")
    .eq("id", user.id)
    .single();

  // アカウント削除処理
  async function deleteAccount() {
    "use server";

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // プロフィールを削除
      await supabase.from("profile").delete().eq("id", user.id);

      // 認証ユーザーからサインアウト
      await supabase.auth.signOut();
    }

    redirect("/auth/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-red-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        <div className="mb-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-red-600">
            アカウント削除通知
          </h1>
          <p className="text-gray-600">
            あなたの信頼スコアが規定値を下回りました
          </p>
        </div>

        <div className="mb-6 rounded-lg bg-gray-50 p-4">
          <div className="mb-2 text-sm text-gray-600">現在の信頼スコア</div>
          <div className="text-3xl font-bold text-red-600">
            {userData?.trust_score || 0}
          </div>
          <div className="mt-1 text-sm text-gray-500">規定値: 1以上</div>
        </div>

        <div className="mb-6 text-gray-700">
          <p className="mb-3">
            システムの安全性を保つため、あなたのアカウントを削除する必要があります。
          </p>
          <p className="text-sm text-gray-500">
            この操作は取り消すことができません。
          </p>
        </div>

        <form action={deleteAccount}>
          <button
            type="submit"
            className="mb-3 w-full rounded-lg bg-red-600 px-4 py-3 font-bold text-white transition duration-200 hover:bg-red-700"
          >
            アカウントを削除する
          </button>
        </form>

        <div className="text-xs text-gray-400">
          ご不明な点がございましたら、管理者までお問い合わせください。
        </div>
      </div>
    </div>
  );
}
