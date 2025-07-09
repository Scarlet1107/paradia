// components/DynamicBackground.tsx
"use client";

import { usePathname } from "next/navigation";

export default function DynamicBackground() {
  const pathName = usePathname();
  const isBadEnd = pathName ? pathName.endsWith("/delete-user") : false;

  const renderBackground = () => {
    return isBadEnd ? (
      // ユーザー削除ページの時の背景
      <div className="fixed inset-0 z-50 bg-gray-700/80 bg-cover bg-center bg-no-repeat" />
    ) : (
      // それ以外の背景
      <div className="fixed inset-0 -z-10 bg-[url('/background.png')] bg-cover bg-center bg-no-repeat" />
    );
  };

  return renderBackground();
}
