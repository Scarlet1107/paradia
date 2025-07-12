"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function PostComposer() {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const maxLength = 300;
  const isTooLong = content.length > maxLength;

  const handleSubmit = async () => {
    if (!content.trim()) return;
    if (isTooLong) {
      toast.error(`投稿は${maxLength}文字以内でお願いします`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const json = await res.json().catch(() => null);
      // ネガティブ判定のトースト
      if (json?.negativity_level === 1) {
        toast.error("異常な文言パターンを検出しました。信頼度が減少しました。");
      } else if (json?.negativity_level === 2) {
        toast.error(
          "警告：不適切な文章が検出されました。信頼度が減少しました。",
        );
      } else if (json?.negativity_level === 3) {
        toast.error(
          "重大警告：悪意のある投稿が検出されました。信頼度が減少しました。",
        );
      }

      if (!res.ok) {
        console.error("投稿失敗:", json ?? res.statusText);
        setLoading(false);
        return;
      }

      setOpen(false);
      setContent("");
      router.refresh();
    } catch (err) {
      console.error("投稿中のエラー:", err);
      toast.error("投稿中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.button
          className="fixed right-5 bottom-20 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-orange-500 text-white shadow-lg transition hover:bg-orange-600 md:right-12 md:bottom-12 md:h-20 md:w-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 17,
            duration: 0.3,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={24} className="md:h-10 md:w-10" />
        </motion.button>
      </DialogTrigger>

      <DialogContent className="max-w-md overflow-hidden rounded-3xl border-2 border-orange-200/50 bg-gradient-to-br from-white/95 via-orange-50/95 to-orange-100/95 p-0 shadow-2xl backdrop-blur-2xl sm:max-w-lg">
        {/* Glass reflection overlay */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 via-transparent to-orange-100/30"></div>
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tl from-orange-200/20 via-transparent to-orange-300/15"></div>

        {/* Inner border glow */}
        <div className="pointer-events-none absolute inset-2 rounded-3xl border border-white/30"></div>

        <div className="relative z-10 p-6 sm:p-8">
          {/* Header with icon */}
          <div className="mb-6 flex items-center gap-3">
            <div>
              <DialogTitle className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
                新しい投稿
              </DialogTitle>
              <DialogDescription className="text-sm font-medium text-orange-600/80">
                ポジティブな内容を入力してください
              </DialogDescription>
            </div>
          </div>

          {/* Content input */}
          <div className="space-y-4">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="今日はどんな素晴らしいことがありましたか？"
              rows={5}
              className="resize-none rounded-xl border-2 border-orange-200/70 bg-gradient-to-r from-white/90 to-orange-50/90 text-sm text-gray-700 shadow-inner backdrop-blur-sm transition-all duration-200 placeholder:text-gray-500 focus:border-orange-400 sm:text-base"
            />

            {/* Character counter */}
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="text-orange-600/70">
                {content.length > 0 && (
                  <span className="rounded-full bg-orange-100/80 px-2 py-1">
                    {content.length}文字入力中
                  </span>
                )}
              </div>
              <div
                className={`font-medium ${isTooLong ? "text-red-500" : "text-orange-600/80"}`}
              >
                {content.length}/{maxLength}文字
                {isTooLong && (
                  <div className="mt-1 text-xs text-red-500">
                    {maxLength}文字を超えています
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <DialogFooter className="mt-8 flex gap-3 border-t border-orange-200/50 pt-6">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-xl border-2 border-gray-300 bg-gradient-to-r from-gray-100 to-gray-200 px-6 py-2 text-gray-700 transition-all duration-200 hover:border-gray-400 hover:text-gray-800 hover:shadow-md"
            >
              キャンセル
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || isTooLong || !content.trim()}
              className="transform rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-2 font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                  <span>投稿中…</span>
                </div>
              ) : (
                "投稿"
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
