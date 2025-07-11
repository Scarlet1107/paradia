import { AnimatedBulletinBoard } from "@/components/AnimatedBulletinBoard";
import { createClient } from "@/lib/supabase/server";
import { Newspaper } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const supabase = await createClient();
  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-cyan-50">
      {/* 新聞記事風セクション */}
      <section className="border-b-4 border-orange-400 bg-white shadow-lg">
        <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-8">
          {/* 新聞ヘッダー */}
          <div className="mb-4 border-b-2 border-orange-300 pb-4 text-center sm:mb-8 sm:pb-6">
            <div className="mb-2 flex items-center justify-center gap-2 sm:gap-3">
              <Newspaper className="h-5 w-5 text-orange-600 sm:h-8 sm:w-8" />
              <h1 className="font-serif text-2xl font-bold tracking-wide text-orange-600 sm:text-3xl md:text-4xl lg:text-5xl">
                ORDINA TIMES
              </h1>
              <Newspaper className="h-5 w-5 text-orange-600 sm:h-8 sm:w-8" />
            </div>
            <p className="text-sm font-medium text-orange-500 sm:text-base lg:text-lg">
              {new Date().toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
              })}{" "}
              発行
            </p>
          </div>

          {/* 新聞記事レイアウト */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
            {/* メイン記事 */}
            <div className="space-y-4 sm:space-y-6 lg:col-span-2">
              <article className="border-l-4 border-orange-500 pl-3 sm:pl-4">
                <h2 className="mb-2 font-serif text-xl font-bold text-gray-900 sm:mb-3 sm:text-2xl lg:text-3xl">
                  先月比 幸福指数 +5% 達成
                </h2>
                <p className="mb-3 text-sm leading-relaxed text-gray-700 sm:mb-4 sm:text-base lg:text-lg">
                  全市民の前向きな投稿が奏功し、社会全体の幸福度が大幅に向上しました。ORDINA様は「市民一人ひとりの笑顔が社会の調和を支えている」と高く評価されています。
                </p>
                <p className="text-xs leading-relaxed text-gray-600 sm:text-sm lg:text-base">
                  引き続き、明るい心と言葉で幸福な理想郷を築いてまいりましょう。この成果は市民の皆様の日々の努力の賜物です。
                </p>
              </article>

              <article className="border-l-4 border-cyan-500 pl-3 sm:pl-4">
                <h2 className="mb-2 font-serif text-lg font-bold text-gray-900 sm:mb-3 sm:text-xl lg:text-2xl">
                  季節キャンペーン：真夏の大調和
                </h2>
                <p className="text-xs leading-relaxed text-gray-700 sm:text-sm lg:text-base">
                  清く、明るく、朗らかに──市民全員が笑顔を共有できるキャンペーンが今月から始まります。公共スペースにて前向きな言葉を発信することで、特別な報酬が得られます。
                </p>
              </article>
            </div>

            {/* サイドバー */}
            <div className="space-y-4 sm:space-y-6">
              <div className="rounded-lg border-2 border-orange-300 bg-orange-100 p-3 sm:p-4">
                <h3 className="mb-2 font-serif text-base font-bold text-orange-800 sm:text-lg lg:text-xl">
                  先月の違反者報告
                </h3>
                <p className="text-xs text-orange-700 sm:text-sm">
                  社会秩序は完全に保たれており、違反者は一人も確認されておりません。誰もがORDINA様への忠誠を誓い、平和な空気が流れています。
                </p>
              </div>

              <div className="rounded-lg border-2 border-cyan-300 bg-cyan-100 p-3 sm:p-4">
                <h3 className="mb-2 font-serif text-base font-bold text-cyan-800 sm:text-lg lg:text-xl">
                  投稿ルールの見直し
                </h3>
                <p className="text-xs text-cyan-700 sm:text-sm">
                  ネガティブ表現はORDINA様の再教育対象です。市民の幸福を損なう発言は直ちに変換・修正され、調和が保たれます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* リアルタイム掲示板風セクション（アニメーション付き） */}
      <section className="container mx-auto px-3 py-4 sm:px-4 sm:py-8">
        <AnimatedBulletinBoard announcements={announcements || []} />
      </section>
    </div>
  );
}
