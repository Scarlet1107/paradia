"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, X } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface ReplyComposerProps {
  parentId: string;
  onSuccess?: () => void;
}

export default function ReplyComposer({
  parentId,
  onSuccess,
}: ReplyComposerProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const maxLength = 200; // Shorter for replies
  const isTooLong = content.length > maxLength;

  const handleSubmit = async () => {
    if (!content.trim()) return;
    if (isTooLong) {
      toast.error(`返信は${maxLength}文字以内でお願いします`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, parentId }),
      });

      const json = await res.json().catch(() => null);

      if (json?.negativity_level >= 1) {
        toast.error("不適切な内容が検出されました。信頼度が減少しました。");
      }

      if (!res.ok) {
        console.error("返信失敗:", json ?? res.statusText);
        return;
      }

      setContent("");
      setIsExpanded(false);
      onSuccess?.();
      router.refresh();
      toast.success("返信を投稿しました");
    } catch (err) {
      console.error("返信中のエラー:", err);
      toast.error("返信中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setContent("");
    setIsExpanded(false);
  };

  return (
    <div className="space-y-2">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          // Collapsed state - simple input
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="ghost"
              onClick={() => setIsExpanded(true)}
              className="w-full justify-start rounded-lg border border-orange-200/50 bg-white/50 p-3 text-left text-sm text-gray-500 hover:bg-orange-50/50 hover:text-orange-600"
            >
              返信を書く...
            </Button>
          </motion.div>
        ) : (
          // Expanded state - full composer
          <motion.div
            key="expanded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="space-y-3"
          >
            {/* Input area */}
            <div className="space-y-2">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="返信を入力してください..."
                rows={3}
                className="resize-none rounded-lg border border-orange-200/70 bg-white/80 text-sm transition-all duration-200 placeholder:text-gray-400 focus:border-orange-400 focus:bg-white"
                autoFocus
              />

              {/* Character counter */}
              <div className="flex items-center justify-between text-xs">
                <div className="text-orange-600/60">
                  {content.length > 0 && (
                    <span className="rounded-full bg-orange-100/60 px-2 py-0.5">
                      {content.length}文字
                    </span>
                  )}
                </div>
                <div
                  className={`${isTooLong ? "text-red-500" : "text-orange-600/60"}`}
                >
                  {content.length}/{maxLength}
                  {isTooLong && <span className="ml-1 text-red-500">超過</span>}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                disabled={loading}
                className="h-8 px-3 text-xs text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              >
                <X className="mr-1 h-3 w-3" />
                キャンセル
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading || isTooLong || !content.trim()}
                size="sm"
                className="h-8 bg-gradient-to-r from-orange-500 to-orange-600 px-3 text-xs hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500"
              >
                {loading ? (
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 animate-spin rounded-full border border-white/30 border-t-white"></div>
                    <span>送信中...</span>
                  </div>
                ) : (
                  <>
                    <Send className="mr-1 h-3 w-3" />
                    返信
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
