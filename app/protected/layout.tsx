// app/protected/layout.tsx
export const dynamic = "force-dynamic"; // 毎回最新フェッチ

import React from "react";
import { redirect } from "next/navigation";
import Header from "@/components/header/Header";
import { createClient } from "@/lib/supabase/server";
import { UserProvider, type UserProfile } from "@/context/UserContext";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // 1. サーバーで認証済みユーザー取得
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    // 未認証ならサインインへリダイレクト
    redirect("/sign-in");
  }

  // 2. profiles テーブルから必要情報を一括取得
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("id, nickname, trust_score")
    .eq("id", user.id)
    .single();

  if (profileError || !profileData) {
    // プロフィール取得失敗時もサインインへ
    redirect("/sign-in");
  }

  // 3. UserProfile 型にマッピング
  const profile: UserProfile = {
    id: profileData.id,
    nickname: profileData.nickname,
    trustScore: profileData.trust_score,
  };

  // 4. Context で配布
  return (
    <UserProvider profile={profile}>
      <Header />
      <main className="flex max-w-5xl flex-1 flex-col gap-20 p-5">
        {children}
      </main>
    </UserProvider>
  );
}
