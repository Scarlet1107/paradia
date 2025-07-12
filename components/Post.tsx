"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Heart,
  UserX,
  Lock,
  Edit,
  Trash2,
  Ellipsis,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { getBadgeUrlFromScore, getCitizenLevel } from "@/lib/trust";
import { Badge } from "./ui/badge";
import { useUser } from "@/context/UserContext";
import ReportDialog from "@/components/ReportDialog";
import ExpandableText from "./ExpandableText";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { formatRelativeTime } from "@/lib/time";
import type { SupabaseTableData } from "@/hooks/use-infinite-query";
import ReplyComposer from "./ReplyComposer";

const DOT_COUNT = 8;
const RADIUS = 24;

interface PostProps {
  post: { id: string; content: string; createdAt: string };
  authorId: string;
  visubilityLevel?: "1" | "2" | "3" | "4" | "5" | null;
  author: string;
  authorTrustScore: number;
  initialLikeCount: number;
  initialLiked: boolean;
  initialReportCount?: number;
  onLikeUpdate?: (newCount: number, isLiked: boolean) => void;
  reply_count: number;
  parent_id: string | null;
  variant?: "reply";
  authorJoinedAt?: string | null;
}

export default function Post({
  post,
  authorId,
  visubilityLevel,
  author,
  authorTrustScore,
  initialLikeCount,
  initialLiked,
  initialReportCount = 0,
  onLikeUpdate,
  reply_count = 0,
  parent_id = null,
  authorJoinedAt,
  variant,
}: PostProps) {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [liked, setLiked] = useState(initialLiked);
  const [reportCount, setReportCount] = useState(initialReportCount);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [explode, setExplode] = useState(false);
  const { userId, trustScore: userTrustScore } = useUser();
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [showReplies, setShowReplies] = useState(false);
  const isTopLevel = parent_id === null;
  const isReply = variant === "reply";

  type PostRow = SupabaseTableData<"posts">;

  interface ReplyRow extends PostRow {
    like_count: number;
    liked: boolean;
  }

  type RawReply = SupabaseTableData<"posts_with_like_counts"> & {
    likes?: { post_id: string; user_id: string }[];
    author?: Array<{ id: string; nickname: string; trust_score: number }>;
  };
  const [replies, setReplies] = useState<ReplyRow[]>([]);

  const joinedDate = new Date(authorJoinedAt ?? "").getTime();
  const daysAlive =
    isNaN(joinedDate) || !authorJoinedAt
      ? null
      : Math.floor((Date.now() - joinedDate) / (1000 * 60 * 60 * 24));

  const loadReplies = async () => {
    const res = await fetch(`/api/posts?parentId=${post.id}`);
    if (!res.ok) return;
    const data: RawReply[] = await res.json();
    setReplies(
      data.map((r) => {
        const authorRaw = r.author;
        const author = Array.isArray(authorRaw) ? authorRaw[0] : authorRaw;
        const like_count = Number(r.like_count || 0);
        const liked = r.likes?.some((l: any) => l.user_id === userId) ?? false;
        return { ...r, author, like_count, liked };
      }),
    );
  };

  const CitizenLevel = getCitizenLevel(userTrustScore);

  // 権限チェック: 自分の投稿でない場合のみチェック
  const isOwnPost = userId === authorId;
  const isAuthorDeleted =
    author === "抹消済み市民" || !authorId || authorId === "";
  const hasPermission =
    isOwnPost ||
    !visubilityLevel ||
    CitizenLevel >= Number.parseInt(visubilityLevel);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const maxLength = 300;
  const isTooLong = editContent.length > maxLength;

  async function handleLike(
    targetId: string = post.id,
    onLocalUpdate?: (newCount: number, isLiked: boolean) => void,
  ) {
    if (loading || !hasPermission) return;
    setLoading(true);
    const currentLikes = targetId === post.id ? likeCount : undefined;
    const currentLiked = targetId === post.id ? liked : undefined;
    const newState = !(currentLiked ?? false);
    const delta = newState ? 1 : -1;
    if (targetId === post.id) {
      setLiked(newState);
      setLikeCount((c) => c + delta);
    } else {
      // for a reply
      onLocalUpdate?.(currentLikes! + delta, newState);
    }

    if (newState) {
      setExplode(true);
      setTimeout(() => setExplode(false), 600);
    }

    const res = await fetch(`/api/posts/${post.id}/like`, {
      method: newState ? "POST" : "DELETE",
      credentials: "include",
    });

    const json = await res.json().catch(() => ({}));

    if (json.selfLike) {
      setLiked(false);
      setLikeCount((c) => c - delta);
      toast.error("自分の投稿にはいいねできません！信頼度が1減少しました。");
      router.refresh();
      setLoading(false);
      return;
    }

    if (!res.ok) {
      if (targetId === post.id) {
        setLiked(!newState);
        setLikeCount((c) => c - delta);
      } else {
        onLocalUpdate?.(currentLikes!, currentLiked!);
      }
    } else {
      onLikeUpdate?.(likeCount + delta, newState);
    }

    setLoading(false);
  }

  const handleReportSubmitted = () => {
    setReportCount((prev) => prev + 1);
  };

  const dots = Array.from({ length: DOT_COUNT }, (_, i) => {
    const angle = (2 * Math.PI * i) / DOT_COUNT;
    return { angle, idx: i };
  });

  const citizenBadgeUrl = getBadgeUrlFromScore(authorTrustScore);

  return (
    <div
      className={`relative overflow-hidden shadow-sm transition-shadow duration-200 hover:shadow-md ${
        isReply
          ? "mx-2 rounded-lg border border-orange-200/30 bg-gradient-to-r from-orange-50/50 to-pink-50/30 p-3"
          : "rounded-2xl border border-orange-500 bg-white"
      } `}
    >
      {/* 3-dot menu button */}
      {userId === authorId && hasPermission && (
        <div
          className={`absolute z-10 ${isReply ? "right-2 bottom-2" : "top-3 right-3"}`}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`p-0 text-orange-600 transition-all duration-200 ${
                  isReply
                    ? "h-6 w-6 rounded-full text-orange-500 hover:bg-orange-100"
                    : "h-8 w-8 rounded-full border border-orange-200/50 bg-gradient-to-r from-orange-100/80 to-orange-200/80 shadow-sm backdrop-blur-sm hover:border-orange-300/70 hover:from-orange-200/90 hover:to-orange-300/90 hover:text-orange-700 hover:shadow-md"
                } `}
              >
                <Ellipsis className={isReply ? "h-3 w-3" : "h-4 w-4"} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className={`border border-orange-200/50 p-1 shadow-2xl backdrop-blur-xl ${
                isReply
                  ? "min-w-[120px] rounded-lg bg-white/95 shadow-lg backdrop-blur-sm"
                  : "min-w-[140px] rounded-xl bg-gradient-to-br from-white/95 to-orange-50/95"
              } `}
            >
              <DropdownMenuItem
                onClick={() => setEditOpen(true)}
                className={`flex cursor-pointer items-center gap-2 font-medium text-gray-700 transition-all duration-200 ${
                  isReply
                    ? "rounded px-2 py-1 text-xs hover:bg-orange-50"
                    : "rounded-lg px-3 py-2 text-sm hover:bg-gradient-to-r hover:from-orange-100 hover:to-orange-200 hover:text-orange-700"
                } `}
              >
                <Edit
                  className={isReply ? "h-3 w-3" : "h-4 w-4 text-orange-600"}
                />
                <span>編集</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteOpen(true)}
                className={`flex cursor-pointer items-center gap-2 font-medium transition-all duration-200 ${
                  isReply
                    ? "rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                    : "rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-red-100 hover:to-red-200 hover:text-red-700"
                } `}
              >
                <Trash2
                  className={isReply ? "h-3 w-3" : "h-4 w-4 text-red-500"}
                />
                <span>削除</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Main content container */}
      <div className={isReply ? "block" : "flex"}>
        {/* Profile section - hidden for replies */}
        {!isReply && (
          <>
            <div className="relative flex min-h-[120px] w-24 flex-shrink-0 flex-col sm:min-h-[140px] sm:w-32 md:min-h-[160px] md:w-40">
              <div className="h-8 bg-gradient-to-br from-orange-400 to-orange-500 sm:h-12 md:h-16"></div>
              <div className="flex flex-1 flex-col items-center justify-end bg-gradient-to-br from-orange-100 to-pink-50 pt-4 pb-2 sm:pt-6 sm:pb-3 md:pt-8">
                <div className="px-1 text-center">
                  <div className="mb-0.5 text-[10px] leading-tight font-bold text-orange-600 sm:mb-1 sm:text-xs md:text-sm">
                    {hasPermission ? author : "***"}
                  </div>
                  {userId === authorId && hasPermission && (
                    <Badge className="bg-orange-500 text-xs text-white">
                      You
                    </Badge>
                  )}
                  {userId !== authorId &&
                    hasPermission &&
                    daysAlive !== null && (
                      <div className="mb-1.5 text-[8px] leading-tight font-medium tracking-wide text-orange-600 sm:text-[10px] md:text-xs">
                        生存日数：{daysAlive}日
                      </div>
                    )}
                </div>
              </div>
              <div className="absolute top-2 left-1/2 z-0 -translate-x-1/2 transform sm:top-4 md:top-6">
                <div className="relative">
                  <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-white shadow-lg sm:h-12 sm:w-12 md:h-16 md:w-16">
                    <Image
                      src="/user_icon.png"
                      alt="市民アイコン"
                      width={64}
                      height={64}
                      className={`h-full w-full scale-130 object-cover ${!hasPermission ? "blur-sm" : ""}`}
                      style={{ objectPosition: "center" }}
                    />
                  </div>
                  {hasPermission && (
                    <div className="absolute -right-0.5 -bottom-0 h-3 w-3 sm:-right-1 sm:-bottom-0 sm:h-4 sm:w-4 md:-right-1 md:-bottom-0 md:h-5 md:w-5">
                      <Image
                        src={citizenBadgeUrl || "/placeholder.svg"}
                        alt="User Badge"
                        width={40}
                        height={40}
                        className="h-full w-full scale-140 object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="w-px flex-shrink-0 bg-orange-500"></div>
          </>
        )}

        {/* Reply header - only for replies */}
        {isReply && (
          <div className="mb-2 flex items-center gap-2">
            <div className="relative">
              <div className="h-6 w-6 overflow-hidden rounded-full border border-orange-300/50 shadow-sm">
                <Image
                  src="/user_icon.png"
                  alt="Reply author"
                  width={24}
                  height={24}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3">
                <Image
                  src={citizenBadgeUrl || "/placeholder.svg"}
                  alt="Badge"
                  width={12}
                  height={12}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <div className="flex-1">
              <span className="text-xs font-medium text-orange-700">
                {hasPermission ? author : "***"}
              </span>
              {userId === authorId && hasPermission && (
                <Badge className="ml-2 bg-orange-400 text-xs text-white">
                  You
                </Badge>
              )}
            </div>
            <time className="text-xs text-orange-500/70">
              {hasPermission
                ? formatRelativeTime(post.createdAt)
                : "****/**/**"}
            </time>
          </div>
        )}

        {/* Content section */}
        <div
          className={`flex min-w-0 flex-1 flex-col ${isReply ? "" : "p-3 sm:p-4 md:p-6"}`}
        >
          <div className={`flex-1 ${isReply ? "mb-2" : "mb-3 sm:mb-4"}`}>
            <ExpandableText
              text={
                hasPermission
                  ? post.content
                  : `この${isReply ? "返信" : "投稿"}の内容は制限されています。`
              }
              className={`leading-relaxed break-words whitespace-pre-wrap text-gray-800 ${isReply ? "text-sm text-gray-700" : "text-xs tracking-wide sm:text-sm md:text-base"} ${!hasPermission ? "blur-sm select-none" : ""} `}
              collapsedLines={isReply ? 2 : 3}
            />
          </div>

          {/* Actions section */}
          <div
            className={`flex items-center gap-2 sm:gap-3 ${isReply ? "justify-between" : "-my-2 justify-between"} `}
          >
            {/* Timestamp - only for full posts */}
            {!isReply && (
              <time
                className={`flex-shrink-0 text-[10px] font-medium text-orange-500 sm:text-xs md:text-sm ${!hasPermission ? "blur-sm" : ""}`}
              >
                {hasPermission
                  ? formatRelativeTime(post.createdAt)
                  : "****/**/**"}
              </time>
            )}

            {/* Action buttons */}
            <div
              className={`flex flex-shrink-0 items-center ${isReply ? "gap-3" : "gap-1 sm:gap-2 md:gap-3"}`}
            >
              {/* Reply toggle - only for top-level posts */}
              {isTopLevel && !isReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!hasPermission}
                  className={`flex min-w-0 items-center gap-0.5 rounded-md p-1 text-orange-500 transition-colors hover:bg-orange-50 hover:text-orange-600 sm:gap-1 sm:rounded-lg sm:p-1.5 md:p-2 ${!hasPermission ? "cursor-not-allowed opacity-50" : ""}`}
                  onClick={() => {
                    if (!showReplies) loadReplies();
                    setShowReplies((o) => !o);
                  }}
                >
                  {showReplies ? (
                    <ChevronUpIcon className="h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4" />
                  )}
                  <span className="ml-1 text-sm">{reply_count}</span>
                </Button>
              )}

              {/* Report button */}
              <Button
                variant="ghost"
                size="sm"
                disabled={!hasPermission || isOwnPost || isAuthorDeleted}
                className={`flex min-w-0 items-center text-orange-500 transition-colors hover:bg-orange-50 hover:text-orange-600 ${
                  isReply
                    ? "h-6 px-2 text-xs hover:bg-orange-100 hover:text-orange-600"
                    : "gap-0.5 rounded-md p-1 sm:gap-1 sm:rounded-lg sm:p-1.5 md:p-2"
                } ${!hasPermission || isOwnPost || isAuthorDeleted ? "cursor-not-allowed opacity-50" : ""} `}
                onClick={() => {
                  if (isOwnPost) {
                    toast.error("自分の投稿は報告できません");
                    return;
                  }
                  if (isAuthorDeleted) {
                    toast.error("削除されたアカウントの投稿は報告できません");
                    return;
                  }
                  setReportDialogOpen(true);
                }}
              >
                <UserX
                  className={`flex-shrink-0 ${isReply ? "mr-1 h-3 w-3" : "h-3 w-3 sm:h-4 sm:w-4"}`}
                />
                <span
                  className={`font-medium ${isReply ? "" : "text-[10px] sm:text-xs md:text-sm"}`}
                >
                  {hasPermission ? reportCount : "-"}
                </span>
              </Button>

              {/* Like button */}
              <Button
                variant="ghost"
                onClick={() => handleLike(post.id)}
                disabled={loading || !hasPermission}
                size="sm"
                className={`relative flex min-w-0 items-center overflow-visible transition-colors hover:bg-red-50 hover:text-red-500 ${
                  isReply
                    ? "h-6 px-2 text-xs text-orange-500 hover:bg-orange-100 hover:text-orange-600"
                    : "gap-0.5 rounded-md p-1 text-orange-500 sm:gap-1 sm:rounded-lg sm:p-1.5 md:p-2"
                } ${!hasPermission ? "cursor-not-allowed opacity-50" : ""} `}
              >
                <motion.div
                  key={liked ? "filled" : "empty"}
                  initial={{ scale: 1 }}
                  animate={{ scale: liked ? (isReply ? 1.1 : 1.2) : 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative flex-shrink-0"
                >
                  <Heart
                    className={` ${liked ? "fill-current text-red-500" : "text-orange-500"} transition-colors ${isReply ? "mr-1 h-3 w-3" : "h-3 w-3 sm:h-4 sm:w-4"} `}
                  />
                  <AnimatePresence>
                    {explode &&
                      dots.map(({ angle, idx }) => {
                        const radius = isReply ? RADIUS / 2 : RADIUS;
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius;
                        const color =
                          idx % 2 === 0 ? "bg-orange-400" : "bg-red-400";
                        const size = isReply ? "h-1 w-1" : "h-1.5 w-1.5";
                        return (
                          <motion.span
                            key={idx}
                            initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
                            animate={{ x, y, opacity: 0, scale: 1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className={`absolute top-1/2 left-1/2 ${size} rounded-full ${color}`}
                            style={{ translateX: "-50%", translateY: "-50%" }}
                          />
                        );
                      })}
                  </AnimatePresence>
                </motion.div>
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.span
                    key={likeCount}
                    initial={{ opacity: 0, y: isReply ? 5 : 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: isReply ? -5 : -10 }}
                    transition={{ duration: 0.2 }}
                    className={
                      isReply
                        ? ""
                        : "text-[10px] font-medium sm:text-xs md:text-sm"
                    }
                  >
                    {hasPermission ? likeCount : "-"}
                  </motion.span>
                </AnimatePresence>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 権限制限オーバーレイ */}
      {!hasPermission && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm ${isReply ? "rounded-lg" : ""}`}
        >
          <div className="flex flex-col items-center justify-center space-y-3 p-6 text-center">
            <div
              className={`rounded-full bg-orange-100 ${isReply ? "p-2" : "p-2 md:p-3"}`}
            >
              <Lock
                className={`text-orange-600 ${isReply ? "h-4 w-4" : "h-6 w-6"}`}
              />
            </div>
            <div className={isReply ? "space-y-1" : "-space-y-1 md:space-y-1"}>
              <h3
                className={`font-semibold text-gray-900 ${isReply ? "text-xs" : "text-sm"}`}
              >
                アクセス制限
              </h3>
              {!isReply && (
                <p className="hidden w-full text-center text-xs leading-relaxed text-gray-600 md:block">
                  あなたの権限では、この投稿を見ることはできません
                </p>
              )}
              <p
                className={`text-orange-600 ${isReply ? "text-xs" : "mt-2 text-xs"}`}
              >
                {isReply
                  ? "この返信を見るには信頼度を上げてください"
                  : "いいねを獲得することで、あなたの信頼度が上がり、より多くの投稿にアクセスできるようになります。"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Replies section - only for full posts */}
      {showReplies && !isReply && (
        <div className="mt-3 border-t border-orange-200/50 pt-3">
          <div className="space-y-3">
            {replies &&
              replies.map((r) => (
                <Post
                  key={r.id}
                  variant="reply"
                  post={{
                    id: r.id,
                    content: r.content,
                    createdAt: r.created_at,
                  }}
                  authorId={r.author_id}
                  author={r.author?.nickname ?? "抹消済み市民"}
                  authorTrustScore={r.author?.trust_score ?? 0}
                  initialLikeCount={r.like_count}
                  initialLiked={r.liked}
                  initialReportCount={r.reports?.length ?? 0}
                  reply_count={r.reply_count ?? 0}
                  parent_id={r.parent_id ?? post.id}
                  authorJoinedAt={r.author?.joined_at}
                  onLikeUpdate={(newCount, isLiked) => {
                    setReplies((prev) =>
                      prev.map((x) =>
                        x.id === r.id
                          ? { ...x, like_count: newCount, liked: isLiked }
                          : x,
                      ),
                    );
                  }}
                />
              ))}

            <div className="rounded-lg border-2 border-dashed border-orange-200/60 bg-gradient-to-r from-orange-50/30 to-pink-50/20 p-3">
              <ReplyComposer parentId={post.id} onSuccess={loadReplies} />
            </div>
          </div>
        </div>
      )}

      <ReportDialog
        open={reportDialogOpen && !isOwnPost && !isAuthorDeleted}
        onOpenChange={setReportDialogOpen}
        postId={post.id}
        onReportSubmitted={handleReportSubmitted}
      />

      {/* Edit Dialog - Enhanced Glassmorphism */}
      <Dialog
        open={editOpen}
        onOpenChange={() => {
          setEditOpen(false);
          setEditContent(post.content);
        }}
      >
        <DialogContent className="max-w-md rounded-2xl border-2 border-orange-200/50 bg-gradient-to-br from-white/95 via-orange-50/95 to-orange-100/95 shadow-2xl backdrop-blur-2xl sm:max-w-lg">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 via-transparent to-orange-100/20"></div>
          <div className="relative z-10">
            <DialogTitle className="mb-4 bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-xl font-bold text-transparent">
              {isReply ? "返信を編集" : "投稿を編集"}
            </DialogTitle>
            <div className="space-y-4">
              <Textarea
                rows={isReply ? 3 : 5}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="resize-none rounded-xl border-2 border-orange-200/70 bg-gradient-to-r from-white/80 to-orange-50/80 text-gray-700 shadow-inner transition-all duration-200 placeholder:text-gray-500 focus:border-orange-400"
                placeholder={
                  isReply
                    ? "返信内容を入力してください..."
                    : "投稿内容を入力してください..."
                }
              />
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <div className="text-orange-600/70">
                  {editContent.length > 0 && (
                    <span className="rounded-full bg-orange-100/80 px-2 py-1">
                      {editContent.length}文字入力中
                    </span>
                  )}
                </div>
                <div
                  className={`font-medium ${isTooLong ? "text-red-500" : "text-orange-600/80"}`}
                >
                  {editContent.length}/{maxLength}文字
                  {isTooLong && (
                    <div className="mt-1 text-xs text-red-500">
                      {maxLength}文字を超えています
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter className="mt-6 flex gap-3">
              <Button
                variant="outline"
                onClick={() => setEditOpen(false)}
                disabled={editLoading}
                className="rounded-xl border-2 border-gray-300 bg-gradient-to-r from-gray-100 to-gray-200 px-6 py-2 text-gray-700 transition-all duration-200 hover:border-gray-400 hover:text-gray-800 hover:shadow-md disabled:opacity-50"
              >
                キャンセル
              </Button>
              <Button
                onClick={async () => {
                  setEditLoading(true);
                  const res = await fetch(`/api/posts/${post.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ content: editContent }),
                  });
                  if (isTooLong) {
                    toast.error(
                      `${isReply ? "返信" : "投稿"}は${maxLength}文字以内でお願いします`,
                    );
                    return;
                  }
                  if (res.ok) {
                    toast.success(
                      `${isReply ? "返信" : "投稿"}が更新されました`,
                    );
                    setEditOpen(false);
                    router.refresh();
                  } else {
                    toast.error("更新に失敗しました");
                  }
                  setEditLoading(false);
                }}
                disabled={editLoading || isTooLong || !editContent.trim()}
                className="transform rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-2 font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 disabled:hover:scale-100"
              >
                {editLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                    <span>更新中…</span>
                  </div>
                ) : (
                  "保存"
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog - Enhanced Glassmorphism */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-md rounded-2xl border-2 border-red-200/50 bg-gradient-to-br from-white/95 via-red-50/95 to-red-100/95 shadow-2xl backdrop-blur-2xl">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 via-transparent to-red-100/20"></div>
          <div className="relative z-10">
            <DialogTitle className="mb-4 bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-xl font-bold text-transparent">
              {isReply ? "返信を削除しますか？" : "投稿を削除しますか？"}
            </DialogTitle>
            <p className="mb-6 leading-relaxed text-gray-700">
              この操作は取り消すことができません。本当に削除してもよろしいですか？
            </p>
            <DialogFooter className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteOpen(false)}
                disabled={deleteLoading}
                className="rounded-xl border-2 border-gray-300 bg-gradient-to-r from-gray-100 to-gray-200 px-6 py-2 text-gray-700 transition-all duration-200 hover:border-gray-400 hover:text-gray-800 hover:shadow-md disabled:opacity-50"
              >
                キャンセル
              </Button>
              <Button
                onClick={async () => {
                  setDeleteLoading(true);
                  const res = await fetch(`/api/posts/${post.id}`, {
                    method: "DELETE",
                    credentials: "include",
                  });
                  if (res.ok) {
                    toast.success(
                      `${isReply ? "返信" : "投稿"}が削除されました`,
                    );
                    setDeleteOpen(false);
                    router.refresh();
                  } else {
                    toast.error("削除に失敗しました");
                  }
                  setDeleteLoading(false);
                }}
                disabled={deleteLoading}
                className="transform rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-6 py-2 font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-red-600 hover:to-red-700 hover:shadow-xl disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 disabled:hover:scale-100"
              >
                {deleteLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                    <span>削除中…</span>
                  </div>
                ) : (
                  "削除"
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
