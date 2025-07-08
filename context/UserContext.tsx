"use client";
import { createContext, useContext, ReactNode } from "react";

/**
 * 全ユーザー情報の型定義
 */
export type UserProfile = {
  userId: string;
  nickname: string;
  trustScore: number;
};

/**
 * Context 本体（デフォルトは null）
 */
const UserContext = createContext<UserProfile | null>(null);

/**
 * Provider コンポーネント
 */
export type UserProviderProps = {
  /** サーバーサイドで取得したユーザープロフィール */
  profile: UserProfile;
  /** 子孫要素 */
  children: ReactNode;
};

export const UserProvider = ({ profile, children }: UserProviderProps) => (
  <UserContext.Provider value={profile}>{children}</UserContext.Provider>
);

/**
 * カスタムフック
 */
export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within UserProvider");
  }
  return ctx;
}
