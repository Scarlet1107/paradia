// File: components/Post.tsx
"use client";

import { useState } from "react";
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

// 👑 Props now include initialLikeCount & initialLiked
interface PostProps {
  post: { id: string; content: string; createdAt: string };
  initialLikeCount: number;
  initialLiked: boolean;
}

export default function Post({
  post,
  initialLikeCount,
  initialLiked,
}: PostProps) {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);
  const [explode, setExplode] = useState(false);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);

    const newState = !liked;
    const delta = newState ? 1 : -1;

    setLiked(newState);
    setLikeCount((c) => c + delta);

    if (newState) {
      setExplode(true);
      setTimeout(() => setExplode(false), 600);
    }

    const res = await fetch(`/api/posts/${post.id}/like`, {
      method: newState ? "POST" : "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      setLiked(!newState);
      setLikeCount((c) => c - delta);
    }

    setLoading(false);
  };

  const dots = Array.from({ length: DOT_COUNT }, (_, i) => {
    const angle = (2 * Math.PI * i) / DOT_COUNT;
    return { angle, idx: i };
  });

  return (
    <Card>
      <CardHeader>
        <h3 className="text-sm font-medium">市民の声</h3>
      </CardHeader>

      <CardContent>
        <p>{post.content}</p>
      </CardContent>

      <CardFooter className="relative flex items-center justify-between overflow-visible">
        <time dateTime={post.createdAt} className="text-xs text-gray-500">
          {new Intl.DateTimeFormat("ja-JP", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: false,
          }).format(new Date(post.createdAt))}
        </time>

        <Button
          variant="ghost"
          onClick={handleLike}
          disabled={loading}
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
            <AnimatePresence>
              {explode &&
                dots.map(({ angle, idx }) => {
                  const x = Math.cos(angle) * RADIUS;
                  const y = Math.sin(angle) * RADIUS;
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

          {/* Sliding Count Animation */}
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={likeCount}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="text-sm"
            >
              {likeCount}
            </motion.span>
          </AnimatePresence>
        </Button>
      </CardFooter>
    </Card>
  );
}
