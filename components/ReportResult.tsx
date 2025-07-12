"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, Eye } from "lucide-react";

type ReportStatus = "approve" | "reject" | "watch" | null;

interface ReportResultProps {
  status: ReportStatus;
  explanation?: string;
  trustScoreChange: number;
  onClose: () => void;
}

export default function ReportResult({
  status,
  explanation,
  trustScoreChange,
  onClose,
}: ReportResultProps) {
  if (!status) return null;

  const ApprovedResult = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl">
        <CardHeader className="pb-4 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-green-800">
            報告が承認されました
          </h2>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="rounded-lg border border-green-200 bg-green-100 p-4">
            <p className="mb-2 font-medium text-green-800">対応完了</p>
            <p className="text-sm text-green-700">
              ご報告いただいた投稿は、コミュニティガイドラインに違反していると判断され、適切な措置を講じました。
            </p>
          </div>
          {explanation && (
            <div className="rounded-lg border border-green-200 bg-white p-3">
              <p className="text-sm font-medium text-green-800">詳細:</p>
              <p className="mt-1 text-sm text-green-700">{explanation}</p>
            </div>
          )}
          <div className="rounded-lg border border-green-200 bg-white p-3">
            <p className="text-sm font-medium text-green-800">取られた措置:</p>
            <p className="mt-1 text-sm text-green-700">
              投稿の修正・ユーザーへの警告
            </p>
          </div>
          {trustScoreChange > 0 && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3">
              <p className="text-sm font-medium text-green-800">
                信頼度スコア:
              </p>
              <p className="mt-1 text-sm text-green-700">
                +{Math.round(trustScoreChange)}ポイント増加しました
              </p>
            </div>
          )}
          <p className="text-sm text-green-600">
            コミュニティの安全にご協力いただき、ありがとうございます。
          </p>
          <Button
            onClick={onClose}
            className="w-full bg-green-600 font-medium text-white hover:bg-green-700"
          >
            確認
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const RejectedResult = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 shadow-xl">
        <CardHeader className="pb-4 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <AlertTriangle className="h-8 w-8 text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-amber-800">
            報告が却下されました
          </h2>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="rounded-lg border border-amber-200 bg-amber-100 p-4">
            <p className="mb-2 font-medium text-amber-800">審査結果</p>
            <p className="text-sm text-amber-700">
              ご報告いただいた投稿を審査した結果、コミュニティガイドラインに違反していないと判断いたします。
            </p>
          </div>
          {explanation && (
            <div className="rounded-lg border border-amber-200 bg-white p-3">
              <p className="text-sm font-medium text-amber-800">詳細:</p>
              <p className="mt-1 text-sm text-amber-700">{explanation}</p>
            </div>
          )}
          <div className="rounded-lg border border-amber-200 bg-white p-3">
            <p className="text-sm font-medium text-amber-800">ご注意:</p>
            <p className="mt-1 text-sm text-amber-700">
              不適切な報告を繰り返すと、報告機能の利用が制限される場合があります。
            </p>
          </div>
          {trustScoreChange < 0 && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-sm font-medium text-red-800">信頼度スコア:</p>
              <p className="mt-1 text-sm text-red-700">
                {Math.round(trustScoreChange)}ポイント減少しました
              </p>
            </div>
          )}
          <p className="text-sm text-amber-600">
            引き続き適切なご利用をお願いいたします。
          </p>
          <Button
            onClick={onClose}
            className="w-full bg-amber-600 font-medium text-white hover:bg-amber-700"
          >
            確認
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const WatchResult = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl">
        <CardHeader className="pb-4 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Eye className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-blue-800">
            報告を受理しました
          </h2>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="rounded-lg border border-blue-200 bg-blue-100 p-4">
            <p className="mb-2 font-medium text-blue-800">監視対象</p>
            <p className="text-sm text-blue-700">
              ご報告いただいた投稿を監視対象として追加いたします。継続的に状況を確認し、必要に応じて措置を講じます。
            </p>
          </div>
          {explanation && (
            <div className="rounded-lg border border-blue-200 bg-white p-3">
              <p className="text-sm font-medium text-blue-800">詳細:</p>
              <p className="mt-1 text-sm text-blue-700">{explanation}</p>
            </div>
          )}
          <div className="rounded-lg border border-blue-200 bg-white p-3">
            <p className="text-sm font-medium text-blue-800">今後の対応:</p>
            <p className="mt-1 text-sm text-blue-700">
              継続的な監視と評価を行います
            </p>
          </div>
          {trustScoreChange > 0 && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
              <p className="text-sm font-medium text-blue-800">信頼度スコア:</p>
              <p className="mt-1 text-sm text-blue-700">
                +{Math.round(trustScoreChange)}ポイント増加しました
              </p>
            </div>
          )}
          <p className="text-sm text-blue-600">
            ご報告いただき、ありがとうございます。
          </p>
          <Button
            onClick={onClose}
            className="w-full bg-blue-600 font-medium text-white hover:bg-blue-700"
          >
            確認
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <>
      {status === "approve" && <ApprovedResult />}
      {status === "reject" && <RejectedResult />}
      {status === "watch" && <WatchResult />}
    </>
  );
}
