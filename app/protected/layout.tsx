// app/protected/layout.tsx
export const dynamic = "force-dynamic"; // 毎回最新フェッチ

import React from "react";
import { redirect } from "next/navigation";
import Header from "@/components/header/Header";
import { createClient } from "@/lib/supabase/server";
import { UserProvider, type UserProfile } from "@/context/UserContext";
import { NotificationProvider } from "@/context/NotificationContext";

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
    userId: profileData.id,
    nickname: profileData.nickname,
    trustScore: profileData.trust_score,
  };

  // 4. 通知を取得
  const { data: initialNotifications, error } = await supabase
    .from("notifications")
    .select("id, content, is_read, created_at")
    .eq("recipient_id", user.id)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("通知の取得に失敗しました", error);
  }

  // 5. Context で配布
  return (
    <UserProvider profile={profile}>
      <NotificationProvider notifications={initialNotifications || []}>
        <Header />
        <main className="flex max-w-5xl flex-1 flex-col gap-20 pt-5">
          {children}
        </main>
      </NotificationProvider>
    </UserProvider>
  );
}
