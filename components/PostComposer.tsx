// components/PostComposer.tsx
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

interface PostComposerProps {
  onPosted: () => void;
}

export default function PostComposer({ onPosted }: PostComposerProps) {
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
      onPosted();
    } catch (err) {
      console.error("投稿中のエラー:", err);
      toast.error("投稿中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        asChild
        className="fixed right-5 bottom-20 h-14 w-14 cursor-pointer md:right-12 md:bottom-12 md:h-20 md:w-20"
      >
        <Plus
          size={24}
          className="h-14 w-14 rounded-full bg-orange-500 text-white shadow-lg transition hover:bg-orange-600"
        />
      </DialogTrigger>
      <DialogContent className="rounded-2xl bg-gray-50 p-6 shadow-2xl">
        <DialogTitle className="text-xl font-semibold text-blue-700">
          新しいポスト
        </DialogTitle>
        <DialogDescription className="mb-2 text-gray-600">
          ポジティブな内容を入力してください。
        </DialogDescription>

        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="ここにテキストを入力…"
          rows={5}
          className="w-full rounded-lg border border-gray-300 p-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300 focus:outline-none"
        />
        <div className="mt-1 text-right text-xs">
          {content.length}/{maxLength}文字
          {isTooLong && (
            <span className="ml-2 text-red-500">
              {maxLength}文字を超えています
            </span>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={loading || isTooLong}
            className="mt-4 rounded-lg bg-blue-500 px-4 py-2 font-medium text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "投稿中…" : "投稿"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
