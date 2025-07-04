// File: components/Post.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Post({
  post,
}: {
  post: { id: string; content: string; createdAt: string };
}) {
  // likeCount が null → ロード中
  const [likeCount, setLikeCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  // 初回フェッチ中フラグ
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchLikes() {
      try {
        const res = await fetch(`/api/posts/${post.id}/like`);
        if (!res.ok) throw new Error("Fetch failed");
        const { count, liked } = await res.json();
        if (!isMounted) return;
        setLikeCount(count);
        setLiked(liked);
      } catch (e) {
        console.error("Like fetch error:", e);
      } finally {
        if (isMounted) setInitialLoading(false);
      }
    }
    fetchLikes();
    return () => {
      isMounted = false;
    };
  }, [post.id]);

  const handleLike = async () => {
    if (loading || initialLoading) return;
    setLoading(true);
    const newState = !liked;
    setLiked(newState);
    setLikeCount((c) => (c ?? 0) + (newState ? 1 : -1));

    const res = await fetch(`/api/posts/${post.id}/like`, {
      method: newState ? "POST" : "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      // 失敗時は巻き戻し
      setLiked(!newState);
      setLikeCount((c) => (c ?? 0) + (newState ? -1 : 1));
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-sm font-medium">市民の声</h3>
      </CardHeader>

      <CardContent>
        <p>{post.content}</p>
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <time dateTime={post.createdAt} className="text-xs text-gray-500">
          {new Date(post.createdAt).toLocaleString()}
        </time>

        <Button
          variant="ghost"
          onClick={handleLike}
          disabled={loading || initialLoading}
          className="flex items-center space-x-1"
        >
          <motion.div
            animate={{ scale: liked ? 1.2 : 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {initialLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            ) : (
              <Heart
                className={`h-5 w-5 ${
                  liked ? "text-red-500" : "text-gray-400"
                }`}
              />
            )}
          </motion.div>
          {initialLoading ? (
            <span className="animate-pulse text-sm text-gray-400">…</span>
          ) : (
            <span className="text-sm">{likeCount}</span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
