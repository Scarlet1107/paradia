import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";
import Image from "next/image";
import { getBadgeUrlFromScore } from "@/lib/trust";

interface ProfileCardProps {
  trust_score: number;
  nickname: string;
  count: number;
}

export default function ProfileCard({
  trust_score,
  nickname,
  count,
}: ProfileCardProps) {
  const accountDays = 365; // アカウント作成からの日数
  const badgeUrl = getBadgeUrlFromScore(trust_score);

  return (
    <Card className="border-orange-200 bg-gradient-to-br from-orange-100 to-amber-100 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-orange-900">
          <User className="h-5 w-5" />
          プロフィール
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* アイコンとバッジを並べる */}
        <div className="flex items-center justify-center gap-4">
          {/* ユーザーアイコン */}
          <div className="relative">
            <Image
              src="/user_icon.png"
              alt="ユーザーアイコン"
              width={80}
              height={80}
              className="rounded-full border-4 border-orange-300 shadow-md"
            />
          </div>

          {/* 市民バッジ */}
          <div className="relative">
            <Image
              src={badgeUrl}
              alt="市民バッジ"
              width={80}
              height={80}
              className="rounded-full border-4 border-white shadow-sm"
            />
          </div>
        </div>

        {/* ユーザー名 */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-orange-900">{nickname}</h3>
        </div>

        {/* アカウント歴 */}
        <div className="rounded-lg border border-orange-200 bg-white/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-orange-700">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">アカウント歴</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-900">
                {accountDays}
              </div>
              <div className="text-xs text-orange-600">日</div>
            </div>
          </div>
        </div>

        {/* 投稿数 */}
        <div className="rounded-lg border border-orange-200 bg-white/50 p-3 text-center">
          <div className="text-lg font-bold text-orange-900">{count}</div>
          <div className="text-xs text-orange-600">投稿数</div>
        </div>
      </CardContent>
    </Card>
  );
}
