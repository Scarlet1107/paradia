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

export default function PostComposer() {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        credentials: "include", // 認証クッキーを送信
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const json = await res.json().catch(() => null);
      if (json.negativity_level == 1) {
        toast.error("異常な文言パターンを検出しました。信頼度が減少しました。");
      } else if (json.negativity_level == 2) {
        toast.error(
          "警告：不適切な文章が検出されました。信頼度が減少しました。",
        );
      } else if (json.negativity_level == 3) {
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
    } catch (err) {
      console.error("投稿中のエラー:", err);
    } finally {
      setLoading(false);
      router.refresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* なぜかPlusのサイズが調整できない */}
      {/* Nodeとかの開発環境の問題かも - shogo */}
      <DialogTrigger
        asChild
        className="fixed right-5 bottom-20 h-14 w-14 cursor-pointer md:right-12 md:bottom-12 md:h-20 md:w-20"
      >
        <Plus
          size={24}
          className="hover:bg-orange-600g h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg transition md:h-14 md:w-14"
        />
      </DialogTrigger>
      <DialogContent className="rounded-2xl bg-gray-50 p-6 shadow-2xl">
        <DialogTitle className="text-xl font-semibold text-blue-700">
          新しいポスト
        </DialogTitle>
        <DialogDescription className="mb-4 text-gray-600">
          ポジティブな内容を入力してください。
        </DialogDescription>

        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="ここにテキストを入力…"
          rows={5}
          className="w-full rounded-lg border border-gray-300 p-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300 focus:outline-none"
        />

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-4 rounded-lg bg-blue-500 px-4 py-2 font-medium text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "生成中…" : "投稿"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
