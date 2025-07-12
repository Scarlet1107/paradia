// app/protected/home/PostsInfinite.tsx
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { InfiniteList } from "@/components/InfiniteList";
import Post from "@/components/Post";
import SearchSortHeader from "@/components/SearchSortHeader";
import type { SupabaseSelectBuilder } from "@/hooks/use-infinite-query";
import { useUser } from "@/context/UserContext";

interface PostWithLikes {
  id: string;
  content: string;
  author_id: string;
  visibility_level: "1" | "2" | "3" | "4" | "5" | null;
  created_at: string;
  like_count?: number;
  likes?: { post_id: string; user_id: string }[];
  author: {
    nickname?: string;
    trust_score?: number;
    created_at?: string;
  };
  reports?: { id: string }[];
  reply_count: number;
  parent_id: string | null;
}

interface PostsInfiniteProps {
  pageSize?: number;
  initialPosts: PostWithLikes[];
}

type SortOrder = "desc" | "asc" | "most_liked";
type TableName = "posts" | "posts_with_like_counts";

export default function PostsInfinite({
  pageSize = 10,
  initialPosts,
}: PostsInfiniteProps): React.JSX.Element {
  const { userId } = useUser();
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const useLikesSort = sortOrder === "most_liked";
  const tableName: TableName = "posts_with_like_counts";
  const columns =
    "id, content, author_id, visibility_level, created_at, like_count, likes(post_id, user_id), author:profiles(nickname, trust_score, created_at), reports(id), parent_id, reply_count";
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

  const initialKey = initialPosts.map((p) => p.id).join(",");

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
          key={`${sortOrder}-${searchQuery}-${initialKey}`}
          tableName={tableName}
          columns={columns}
          pageSize={pageSize}
          initialData={initialPosts}
          trailingQuery={(q) => {
            let builder = q as SupabaseSelectBuilder<TableName>;
            builder = builder.is("parent_id", null);
            if (searchQuery) {
              builder = builder.ilike("content", `%${searchQuery}%`);
            }
            // いいね順ソートのときは tie-breaker に created_at 降順 を追加
            if (useLikesSort) {
              return builder
                .order("like_count", { ascending })
                .order("created_at", { ascending: false });
            } else {
              // 通常の作成日時ソート（asc/desc）
              return builder.order("created_at", { ascending });
            }
          }}
          renderItem={(post: PostWithLikes) => {
            const likeCount = post.like_count ?? 0;
            const reportCount = post.reports?.length ?? 0;
            const initialLiked =
              post.likes?.some((l) => l.user_id === userId) ?? false;

            const author_id = post.author_id ?? null;
            const nickname = post.author?.nickname ?? "抹消済み市民";
            const trustScore = post.author?.trust_score ?? 0;
            const reply_count = post.reply_count ?? 0;
            const parent_id = post.parent_id ?? null;
            const created_at = post.author?.created_at ?? null;
            return (
              <Post
                key={post.id}
                post={{
                  id: post.id,
                  content: post.content,
                  createdAt: post.created_at,
                }}
                authorId={post.author_id}
                authorTrustScore={trustScore}
                visubilityLevel={post.visibility_level}
                author={nickname}
                initialLikeCount={likeCount}
                initialLiked={initialLiked}
                initialReportCount={reportCount}
                authorJoinedAt={created_at}
                reply_count={reply_count}
                parent_id={parent_id}
              />
            );
          }}
        />
      </div>
    </div>
  );
}
