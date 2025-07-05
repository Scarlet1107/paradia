// app/protected/home/PostsInfinite.tsx
"use client";

import React from "react";
import { InfiniteList } from "@/components/InfiniteList";
import Post from "@/components/Post";
import PostComposer from "@/components/PostComposer";
import type { SupabaseSelectBuilder } from "@/hooks/use-infinite-query";

interface PostWithLikes {
  id: string;
  content: string;
  created_at: string;
  likes?: { post_id: string; user_id: string }[];
}

interface PostsInfiniteProps {
  userId: string;
  pageSize?: number;
}

export default function PostsInfinite({
  userId,
  pageSize = 10,
}: PostsInfiniteProps): React.JSX.Element {
  return (
    <div className="relative h-full flex-1 flex-col gap-4 p-4">
      <InfiniteList<"posts">
        tableName="posts"
        // pull in related likes in the same fetch
        columns="id, content, created_at, likes(post_id, user_id)"
        pageSize={pageSize}
        trailingQuery={(q) =>
          // newest first
          (q as SupabaseSelectBuilder<"posts">).order("created_at", {
            ascending: false,
          })
        }
        renderItem={(post: PostWithLikes) => {
          // derive like counts & whether current user liked
          const likeCount = post.likes?.length ?? 0;
          const initialLiked =
            post.likes?.some((l) => l.user_id === userId) ?? false;

          return (
            <Post
              key={post.id}
              post={{
                id: post.id,
                content: post.content,
                createdAt: post.created_at,
              }}
              initialLikeCount={likeCount}
              initialLiked={initialLiked}
            />
          );
        }}
        // optional: loading skeleton while fetching
        renderSkeleton={(count) => (
          <div className="flex flex-col gap-2 px-4">
            {Array.from({ length: count }).map((_, idx) => (
              <div
                key={idx}
                className="bg-muted h-4 w-full animate-pulse rounded"
              />
            ))}
          </div>
        )}
      />

      <PostComposer />
    </div>
  );
}
