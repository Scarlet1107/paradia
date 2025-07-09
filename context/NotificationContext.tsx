// context/NotificationProvider.tsx
"use client";

import React, { createContext, useContext, ReactNode } from "react";

export interface Notification {
  id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

const NotificationContext = createContext<Notification[] | null>(null);

export type NotificationProviderProps = {
  /** サーバーコンポーネントから渡される通知一覧 */
  notifications: Notification[];
  children: ReactNode;
};

export const NotificationProvider = ({
  notifications,
  children,
}: NotificationProviderProps) => (
  <NotificationContext.Provider value={notifications}>
    {children}
  </NotificationContext.Provider>
);

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return ctx;
}
