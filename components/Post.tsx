"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MoreVertical, Heart, UserX, Lock, Edit, Trash2 } from "lucide-react";
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

  const CitizenLevel = getCitizenLevel(userTrustScore);

  // 権限チェック: 自分の投稿でない場合のみチェック
  const isOwnPost = userId === authorId;
  const hasPermission =
    isOwnPost ||
    !visubilityLevel ||
    CitizenLevel >= Number.parseInt(visubilityLevel);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const maxLength = 300;
  const isTooLong = editContent.length > maxLength;

  const handleLike = async () => {
    if (loading || !hasPermission) return;
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

    const json = await res.json().catch(() => ({}));

    if (json.selfLike) {
      setLiked(false);
      setLikeCount((c) => c - delta);
      toast.error("自分の投稿にはいいねできません！信頼度が1減少しました。");
      setLoading(false);
      return;
    }

    if (!res.ok) {
      setLiked(!newState);
      setLikeCount((c) => c - delta);
    } else {
      onLikeUpdate?.(likeCount + delta, newState);
    }

    setLoading(false);
  };

  const handleReportSubmitted = () => {
    setReportCount((prev) => prev + 1);
  };

  const dots = Array.from({ length: DOT_COUNT }, (_, i) => {
    const angle = (2 * Math.PI * i) / DOT_COUNT;
    return { angle, idx: i };
  });

  const citizenBadgeUrl = getBadgeUrlFromScore(authorTrustScore);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-orange-500 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
      {/* 3-dot menu button - positioned at top right */}
      {userId === authorId && hasPermission && (
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-full border border-orange-200/50 bg-gradient-to-r from-orange-100/80 to-orange-200/80 p-0 text-orange-600 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-orange-300/70 hover:from-orange-200/90 hover:to-orange-300/90 hover:text-orange-700 hover:shadow-md"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="min-w-[140px] rounded-xl border border-orange-200/50 bg-gradient-to-br from-white/95 to-orange-50/95 p-1 shadow-2xl backdrop-blur-xl"
            >
              <DropdownMenuItem
                onClick={() => setEditOpen(true)}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gradient-to-r hover:from-orange-100 hover:to-orange-200 hover:text-orange-700"
              >
                <Edit className="h-4 w-4 text-orange-600" />
                <span>編集</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteOpen(true)}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gradient-to-r hover:from-red-100 hover:to-red-200 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
                <span>削除</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <div className="flex">
        <div className="relative flex min-h-[120px] w-24 flex-shrink-0 flex-col sm:min-h-[140px] sm:w-32 md:min-h-[160px] md:w-40">
          <div className="h-8 bg-gradient-to-br from-orange-400 to-orange-500 sm:h-12 md:h-16"></div>
          <div className="flex flex-1 flex-col items-center justify-end bg-gradient-to-br from-orange-100 to-pink-50 pt-4 pb-2 sm:pt-6 sm:pb-3 md:pt-8">
            <div className="px-1 text-center">
              <div className="mb-0.5 text-[10px] leading-tight font-bold text-orange-600 sm:mb-1 sm:text-xs md:text-sm">
                {hasPermission ? author : "***"}
              </div>
              {userId === authorId && hasPermission && (
                <Badge className="bg-orange-500 text-xs text-white">
                  あなた
                </Badge>
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
        <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4 md:p-6">
          <div className="mb-3 flex-1 sm:mb-4">
            <ExpandableText
              text={
                hasPermission
                  ? post.content
                  : "この投稿の内容は制限されています。"
              }
              className={`text-xs leading-relaxed tracking-wide break-words whitespace-pre-wrap text-gray-800 sm:text-sm md:text-base ${!hasPermission ? "blur-sm select-none" : ""}`}
              collapsedLines={3}
            />
          </div>
          <div className="-my-2 flex items-center justify-between gap-2 sm:gap-3">
            <time
              className={`flex-shrink-0 text-[10px] font-medium text-orange-500 sm:text-xs md:text-sm ${!hasPermission ? "blur-sm" : ""}`}
            >
              {hasPermission
                ? formatRelativeTime(post.createdAt)
                : "****/**/**"}
            </time>
            <div className="flex flex-shrink-0 items-center gap-1 sm:gap-2 md:gap-3">
              <Button
                variant="ghost"
                size="sm"
                disabled={!hasPermission}
                className={`flex min-w-0 items-center gap-0.5 rounded-md p-1 text-orange-500 transition-colors hover:bg-orange-50 hover:text-orange-600 sm:gap-1 sm:rounded-lg sm:p-1.5 md:p-2 ${!hasPermission ? "cursor-not-allowed opacity-50" : ""}`}
                onClick={() => setReportDialogOpen(true)}
              >
                <UserX className="h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4" />
                <span className="text-[10px] font-medium sm:text-xs md:text-sm">
                  {hasPermission ? reportCount : "-"}
                </span>
              </Button>
              <Button
                variant="ghost"
                onClick={handleLike}
                disabled={loading || !hasPermission}
                size="sm"
                className={`relative flex min-w-0 items-center gap-0.5 overflow-visible rounded-md p-1 text-orange-500 transition-colors hover:bg-red-50 hover:text-red-500 sm:gap-1 sm:rounded-lg sm:p-1.5 md:p-2 ${!hasPermission ? "cursor-not-allowed opacity-50" : ""}`}
              >
                <motion.div
                  key={liked ? "filled" : "empty"}
                  initial={{ scale: 1 }}
                  animate={{ scale: liked ? 1.2 : 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative flex-shrink-0"
                >
                  <Heart
                    className={`h-3 w-3 sm:h-4 sm:w-4 ${liked ? "fill-current text-red-500" : "text-orange-500"} transition-colors`}
                  />
                  <AnimatePresence>
                    {explode &&
                      dots.map(({ angle, idx }) => {
                        const x = Math.cos(angle) * RADIUS;
                        const y = Math.sin(angle) * RADIUS;
                        const color =
                          idx % 2 === 0 ? "bg-orange-400" : "bg-red-400";
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
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.span
                    key={likeCount}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-[10px] font-medium sm:text-xs md:text-sm"
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
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center space-y-3 p-6 text-center">
            <div className="rounded-full bg-orange-100 p-3">
              <Lock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-gray-900">
                アクセス制限
              </h3>
              <p className="w-full text-center text-xs leading-relaxed text-gray-600">
                あなたの権限では、この投稿を見ることはできません
              </p>
              <p className="mt-2 text-xs text-orange-600">
                いいねを獲得することで、あなたの信頼度が上がり、より多くの投稿にアクセスできるようになります。
              </p>
            </div>
          </div>
        </div>
      )}

      <ReportDialog
        open={reportDialogOpen}
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
              投稿を編集
            </DialogTitle>
            <div className="space-y-4">
              <Textarea
                rows={5}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="resize-none rounded-xl border-2 border-orange-200/70 bg-gradient-to-r from-white/80 to-orange-50/80 text-gray-700 shadow-inner transition-all duration-200 placeholder:text-gray-500 focus:border-orange-400"
                placeholder="投稿内容を入力してください..."
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
                    toast.error(`投稿は${maxLength}文字以内でお願いします`);
                    return;
                  }
                  if (res.ok) {
                    toast.success("投稿が更新されました");
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
              投稿を削除しますか？
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
                    toast.success("投稿が削除されました");
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
