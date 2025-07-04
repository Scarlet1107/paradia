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
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DOT_COUNT = 8;
const RADIUS = 24; // px

export default function Post({
  post,
}: {
  post: { id: string; content: string; createdAt: string };
}) {
  const [likeCount, setLikeCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [explode, setExplode] = useState(false);

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
        console.error(e);
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

    // trigger explosion when liking
    if (newState) {
      setExplode(true);
      // clear after animation
      setTimeout(() => setExplode(false), 600);
    }

    const res = await fetch(`/api/posts/${post.id}/like`, {
      method: newState ? "POST" : "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      // rollback on error
      setLiked(!newState);
      setLikeCount((c) => (c ?? 0) + (newState ? -1 : 1));
    }
    setLoading(false);
  };

  // generate DOT_COUNT angles evenly
  const dots = Array.from({ length: DOT_COUNT }, (_, i) => {
    const angle = (2 * Math.PI * i) / DOT_COUNT;
    return { angle };
  });

  return (
    <Card>
      <CardHeader>
        <h3 className="text-sm font-medium">市民の声</h3>
      </CardHeader>

      <CardContent>
        <p>{post.content}</p>
      </CardContent>

      <CardFooter className="relative flex items-center justify-between">
        <time dateTime={post.createdAt} className="text-xs text-gray-500">
          {new Date(post.createdAt).toLocaleString()}
        </time>

        <Button
          variant="ghost"
          onClick={handleLike}
          disabled={loading || initialLoading}
          className="relative flex items-center space-x-1 overflow-visible"
        >
          <motion.div
            key={liked ? "filled" : "empty"}
            initial={{ scale: 1 }}
            animate={{ scale: liked ? 1.3 : 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative"
          >
            <Heart
              className={`h-5 w-5 ${
                liked ? "fill-current text-red-500" : "text-gray-400"
              }`}
            />
            {/* Explosion Dots */}
            <AnimatePresence>
              {explode &&
                dots.map((dot, idx) => {
                  const x = Math.cos(dot.angle) * RADIUS;
                  const y = Math.sin(dot.angle) * RADIUS;
                  const color = idx % 2 === 0 ? "bg-orange-400" : "bg-cyan-400";
                  return (
                    <motion.span
                      key={idx}
                      initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
                      animate={{ x, y, opacity: 0, scale: 1 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className={`absolute top-1/2 left-1/2 h-1.5 w-1.5 rounded-full ${color}`}
                      style={{ translateX: "-50%", translateY: "-50%" }}
                    />
                  );
                })}
            </AnimatePresence>
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
