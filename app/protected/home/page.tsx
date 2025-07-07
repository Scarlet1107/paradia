// app/protected/home/page.tsx
"use client";
import PostsInfinite from "@/app/protected/home/PostsInfinite";
import PostComposer from "@/components/PostComposer";
import TrustScoreValue from "@/components/TrustScoreValue";
import { useState } from "react";

export default function HomePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  // とても悲しい実装であることは重々承知であります;; - shogo
  const handleNewPost = () => {
    setRefreshKey((prev) => prev + 1);
  };
  return (
    <div className="min-h-screen w-full">
      <PostsInfinite key={refreshKey} />
      <PostComposer onPosted={handleNewPost} />
      <TrustScoreValue />
    </div>
  );
}
