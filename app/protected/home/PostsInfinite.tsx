// app/protected/home/PostsInfinite.tsx
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { InfiniteList } from "@/components/InfiniteList";
import Post from "@/components/Post";
import PostComposer from "@/components/PostComposer";
import SearchSortHeader from "@/components/SearchSortHeader";
import type { SupabaseSelectBuilder } from "@/hooks/use-infinite-query";
import TrustScoreValue from "@/components/TrustScoreValue";

interface PostWithLikes {
  id: string;
  content: string;
  created_at: string;
  like_count?: number;
  likes?: { post_id: string; user_id: string }[];
}

interface PostsInfiniteProps {
  userId: string;
  pageSize?: number;
}

type SortOrder = "desc" | "asc" | "most_liked";
type TableName = "posts" | "posts_with_like_counts";

export default function PostsInfinite({
  userId,
  pageSize = 10,
}: PostsInfiniteProps): React.JSX.Element {
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const useLikesSort = sortOrder === "most_liked";
  const tableName: TableName = useLikesSort
    ? "posts_with_like_counts"
    : "posts";
  const columns = useLikesSort
    ? "id, content, created_at, like_count, likes(post_id, user_id)"
    : "id, content, created_at, likes(post_id, user_id)";
  const sortColumn = useLikesSort ? "like_count" : "created_at";
  const ascending = sortOrder === "asc";

  // if (!isClient) {
  //     return (
  //         <div className="min-h-screen w-full">
  //             <div className="flex w-full items-center justify-between border-b border-gray-200 bg-white p-4">
  //                 <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200" />
  //             </div>
  //             <div className="w-full p-4">
  //                 <div className="space-y-4">
  //                     {Array.from({ length: 3 }).map((_, i) => (
  //                         <div
  //                             key={i}
  //                             className="h-32 w-full animate-pulse rounded-lg bg-gray-200"
  //                         />
  //                     ))}
  //                 </div>
  //             </div>
  //         </div>
  //     );
  // }

  return (
    <div
      className="min-h-screen w-full"
      style={{ width: "100vw", maxWidth: "100%" }}
    >
      <div className="flex w-full items-center justify-between bg-white">
        <SearchSortHeader
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          onSearch={setSearchQuery}
          searchPlaceholder="投稿を検索..."
        />
      </div>

      <div className="w-full" style={{ width: "100%", minWidth: "100%" }}>
        <InfiniteList<TableName>
          key={`${sortOrder}-${searchQuery}`}
          tableName={tableName}
          columns={columns}
          pageSize={pageSize}
          trailingQuery={(q) => {
            let builder = q as SupabaseSelectBuilder<TableName>;
            if (searchQuery) {
              builder = builder.ilike("content", `%${searchQuery}%`);
            }
            return builder.order(sortColumn, { ascending });
          }}
          renderItem={(post: PostWithLikes) => {
            const likeCount = useLikesSort
              ? (post.like_count ?? 0)
              : (post.likes?.length ?? 0);
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
        />
      </div>
    </div>
  );
}
