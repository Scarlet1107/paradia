"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Edit3, Loader2 } from "lucide-react";

const UpdateNicknameInput = () => {
  const { nickname } = useUser();
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
        router.refresh();
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
    <Card className="border-orange-200 bg-gradient-to-br from-white to-orange-50 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-900">
          <Edit3 className="h-5 w-5" />
          ニックネーム変更
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nickname" className="font-medium text-orange-800">
            新しいニックネーム
          </Label>
          <Input
            id="nickname"
            className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
            placeholder={nickname || "ニックネームを入力"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
        </div>

        {isUnchanged && !loading && (
          <p className="text-sm text-orange-600">
            現在のニックネームと同じです
          </p>
        )}

        <Button
          className="w-full bg-orange-500 text-white hover:bg-orange-600"
          onClick={handleSubmit}
          disabled={loading || isUnchanged}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              変更中…
            </>
          ) : (
            "ニックネームを変更"
          )}
        </Button>

        {message && (
          <p
            className={cn(
              "text-sm font-medium",
              isError ? "text-red-600" : "text-green-600",
            )}
          >
            {message}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default UpdateNicknameInput;
