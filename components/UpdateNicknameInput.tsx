"use client";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  nickname?: string;
}

const UpdateNicknameInput = ({ nickname }: Props) => {
  const [input, setInput] = useState(nickname || "");
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isUnchanged = useMemo(
    () =>
      input.trim() ===
      (nickname && typeof nickname === "string" ? nickname.trim() : ""),
    [input, nickname],
  );

  useEffect(() => {
    setInput(nickname || "");
  }, [nickname]);

  const handleSubmit = async () => {
    if (isUnchanged) {
      setIsError(true);
      setMessage("現在のニックネームと同じです");
      return;
    }
    if (!input.trim()) {
      setIsError(true);
      setMessage("ニックネームを入力してください");
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/profile/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: input }),
      });
      const data = await res.json();
      if (data.ok) {
        setIsError(false);
        setMessage("✅ ニックネームを更新しました");
        router.refresh(); // ページをリフレッシュして新しいニックネームを反映
      } else {
        setIsError(true);
        toast.error("不適切なニックネームにより信頼度が -5 減少しました");
        setMessage(`❌ 更新に失敗しました: ${data.error}`);
      }
    } catch {
      setIsError(true);
      setMessage("⚠️ サーバーエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-lg">
      <div className="flex flex-col gap-4">
        <Label htmlFor="nickname" className="block font-medium text-gray-700">
          新しいニックネーム
        </Label>
        <Input
          id="nickname"
          className="w-full"
          placeholder={nickname || "ニックネームを入力"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        {isUnchanged && !loading && (
          <p className="text-sm text-gray-500">現在のニックネームと同じです</p>
        )}
        <Button
          variant="outline"
          className="w-full"
          onClick={handleSubmit}
          disabled={loading || isUnchanged}
        >
          {loading ? "変更中…" : "ニックネームを変更"}
        </Button>
        {message && (
          <p
            className={cn(
              "text-sm",
              isError ? "text-red-600" : "text-green-600",
            )}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default UpdateNicknameInput;
