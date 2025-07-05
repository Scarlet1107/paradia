"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { InfiniteList } from "@/components/InfiniteList";
import Post from "@/components/Post";
import PostComposer from "@/components/PostComposer";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Clock,
  Sparkles,
  Heart,
  HeartOff,
} from "lucide-react";

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

type SortOrder = "desc" | "asc" | "most_liked" | "least_liked";
type TableName = "posts" | "posts_with_like_counts";

export default function PostsInfinite({
  userId,
  pageSize = 10,
}: PostsInfiniteProps): React.JSX.Element {
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const useLikesSort =
    sortOrder === "most_liked" || sortOrder === "least_liked";
  const tableName: TableName = useLikesSort
    ? "posts_with_like_counts"
    : "posts";
  const columns = useLikesSort
    ? "id, content, created_at, like_count, likes(post_id, user_id)"
    : "id, content, created_at, likes(post_id, user_id)";
  const sortColumn = useLikesSort ? "like_count" : "created_at";
  const ascending = sortOrder === "asc" || sortOrder === "least_liked";

  const getSortLabel = () => {
    switch (sortOrder) {
      case "desc":
        return "新着順";
      case "asc":
        return "古い順";
      case "most_liked":
        return "いいねが多い順";
      case "least_liked":
        return "いいねが少ない順";
      default:
        return "新着順";
    }
  };

  const getSortIcon = () => {
    switch (sortOrder) {
      case "desc":
        return <ArrowDown className="h-4 w-4" />;
      case "asc":
        return <ArrowUp className="h-4 w-4" />;
      case "most_liked":
        return <Heart className="h-4 w-4 text-red-500" />;
      case "least_liked":
        return <HeartOff className="h-4 w-4 text-gray-500" />;
      default:
        return <ArrowDown className="h-4 w-4" />;
    }
  };

  // Don't render until client-side to avoid hydration mismatch
  if (!isClient) {
    return (
      <div className="min-h-screen w-full">
        <div className="flex w-full items-center justify-between border-b border-gray-200 bg-white p-4">
          <div className="flex-1" />
          <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200" />
        </div>
        <div className="w-full p-4">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-32 w-full animate-pulse rounded-lg bg-gray-200"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full"
      style={{ width: "100vw", maxWidth: "100%" }}
    >
      <div className="flex w-full items-center justify-between bg-white p-4">
        <div className="flex-1" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-lg border border-yellow-200/50 bg-gradient-to-r from-white/80 to-gray-50/80 px-3 py-2 text-sm text-gray-700 shadow-sm transition-all duration-200 hover:border-yellow-300/70 hover:from-yellow-50 hover:to-amber-50 hover:text-amber-700 hover:shadow-md sm:px-4 sm:text-base"
            >
              <ArrowUpDown className="h-4 w-4 text-amber-600" />
              <span className="hidden font-medium sm:inline">
                {getSortLabel()}
              </span>
              <span className="font-medium sm:hidden">Sort</span>
              {getSortIcon()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-[180px] rounded-xl border border-yellow-200/50 bg-gradient-to-br from-white/95 to-yellow-50/95 p-1 shadow-xl backdrop-blur-lg"
            align="end"
          >
            <DropdownMenuItem
              onClick={() => setSortOrder("desc")}
              className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                sortOrder === "desc"
                  ? "bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-800 shadow-sm"
                  : "text-gray-700 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-amber-50 hover:text-amber-700"
              } `}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-600" />
                <span>新着順</span>
              </div>
              {sortOrder === "desc" && (
                <ArrowDown className="ml-auto h-4 w-4 text-amber-600" />
              )}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setSortOrder("asc")}
              className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                sortOrder === "asc"
                  ? "bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-800 shadow-sm"
                  : "text-gray-700 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-amber-50 hover:text-amber-700"
              } `}
            >
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600" />
                <span>古い順</span>
              </div>
              {sortOrder === "asc" && (
                <ArrowUp className="ml-auto h-4 w-4 text-amber-600" />
              )}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setSortOrder("most_liked")}
              className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                sortOrder === "most_liked"
                  ? "bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-800 shadow-sm"
                  : "text-gray-700 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-amber-50 hover:text-amber-700"
              } `}
            >
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span>いいねが多い順</span>
              </div>
              {sortOrder === "most_liked" && (
                <Heart className="ml-auto h-4 w-4 text-red-500" />
              )}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setSortOrder("least_liked")}
              className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                sortOrder === "least_liked"
                  ? "bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-800 shadow-sm"
                  : "text-gray-700 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-amber-50 hover:text-amber-700"
              } `}
            >
              <div className="flex items-center gap-2">
                <HeartOff className="h-4 w-4 text-gray-500" />
                <span>いいねが少ない順</span>
              </div>
              {sortOrder === "least_liked" && (
                <HeartOff className="ml-auto h-4 w-4 text-gray-500" />
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="w-full" style={{ width: "100%", minWidth: "100%" }}>
        <InfiniteList<TableName>
          key={`${sortOrder}-${isClient}`}
          tableName={tableName}
          columns={columns}
          pageSize={pageSize}
          trailingQuery={(q) => q.order(sortColumn, { ascending })}
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
      <PostComposer />
    </div>
  );
}
