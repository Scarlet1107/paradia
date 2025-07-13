"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import ReportResult from "./ReportResult";

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
  onReportSubmitted?: () => void;
}

type ReportStatus = "approve" | "reject" | null;

interface ReportResponse {
  action_recommendation: ReportStatus;
  explanation: string;
}

const REPORT_REASONS = [
  "スパム・広告",
  "ヘイトスピーチ・差別",
  "暴力的な内容",
  "誤情報・デマ",
  "性的な内容",
  "その他",
];

export default function ReportDialog({
  open,
  onOpenChange,
  postId,
  onReportSubmitted,
}: ReportDialogProps) {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportResult, setReportResult] = useState<{
    status: ReportStatus;
    explanation: string;
  } | null>(null);
  const router = useRouter();

  const handleSubmit = async () => {
    const reason = selectedReason === "その他" ? customReason : selectedReason;

    if (!reason.trim()) {
      toast.error("報告理由を入力してください");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/posts/report", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          reason: reason,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "Already reported") {
          toast.error("この投稿は既に報告済みです");
        } else {
          toast.error("報告の送信に失敗しました" + `\n ${res.statusText}`);
        }
        return;
      }

      const reportResponse = data as ReportResponse;

      // ダイアログを閉じて結果を表示
      onOpenChange(false);
      setReportResult({
        status: reportResponse.action_recommendation,
        explanation: reportResponse.explanation,
      });

      // フォームをリセット
      setSelectedReason("");
      setCustomReason("");

      onReportSubmitted?.();
    } catch (error) {
      console.error("報告送信エラー:", error);
      toast.error("報告の送信中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseResult = () => {
    setReportResult(null);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600">投稿を報告</DialogTitle>
          <DialogDescription>
            この投稿の問題について詳しく教えてください。報告は管理者によって確認されます。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="reason" className="text-sm font-medium">
              報告理由を選択してください
            </Label>
            <div className="mt-2 space-y-2">
              {REPORT_REASONS.map((reason) => (
                <label
                  key={reason}
                  className="flex cursor-pointer items-center space-x-2"
                >
                  <input
                    type="radio"
                    name="reason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">{reason}</span>
                </label>
              ))}
            </div>
          </div>

          {selectedReason === "その他" && (
            <div>
              <Label htmlFor="custom-reason" className="text-sm font-medium">
                詳細を入力してください
              </Label>
              <Textarea
                id="custom-reason"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="具体的な問題について説明してください..."
                rows={3}
                className="mt-1"
              />
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            キャンセル
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !selectedReason}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? "送信中..." : "報告する"}
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* 報告結果の表示 */}
      {reportResult && (
        <ReportResult
          status={reportResult.status}
          explanation={reportResult.explanation}
          onClose={handleCloseResult}
        />
      )}
    </Dialog>
  );
}
