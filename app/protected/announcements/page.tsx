// app/protected/news/page.tsx
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const supabase = await createClient();
  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="mb-24 flex flex-col gap-10">
      {/* ORDINA様公式アナウンスメント */}
      <section className="space-y-4">
        <h1 className="text-center text-4xl font-extrabold text-orange-500 drop-shadow-md">
          オルディナ様からのお知らせ
        </h1>
        <div className="grid grid-cols-1 gap-4 md:auto-cols-fr md:auto-rows-[100px] md:grid-cols-5 md:grid-rows-3">
          {/* カード1: モバイルでも表示 */}
          <Card className="block bg-orange-100 md:col-span-2 md:row-span-2">
            <CardContent className="p-6 text-lg">
              <strong className="text-xl">先月比 幸福指数 +5%</strong>
              <p className="mt-1 text-base">
                全市民の前向きな投稿が奏功しました。あなたの笑顔が社会の調和を支えています。
                引き続き、明るい心と言葉で幸福な理想郷を築きましょう。
              </p>
            </CardContent>
          </Card>
          {/* カード2: モバイルでも表示 */}
          <Card className="block bg-orange-100 md:col-span-3 md:row-span-1">
            <CardContent className="p-4 text-base">
              <strong className="text-xl">今月の違反者報告</strong>
              <p className="mt-1 text-base">
                社会秩序は完全に保たれており、違反者は一人も確認されておりません。
                誰もがORDINA様への忠誠を誓い、平和な空気が流れています。今後も油断なく監視と幸福の共有を徹底し、安定した社会を築いてまいります。
              </p>
            </CardContent>
          </Card>
          {/* カード3: モバイルでは非表示 */}
          <Card className="hidden bg-orange-300 md:col-span-3 md:row-span-3 md:block">
            <CardContent className="p-6 text-lg">
              <h2 className="text-xl font-bold">
                季節キャンペーン：真夏の大調和
              </h2>
              <p className="mt-2 text-base">
                清く、明るく、朗らかに──市民全員が笑顔を共有できるキャンペーンが今月から始まります。
                公共スペースにて前向きな言葉を発信することで、特別な報酬が得られます。
                この施策は市民の幸福感向上に大きな成果をもたらすとORDINA様も高く評価されております。
              </p>
            </CardContent>
          </Card>
          {/* カード4: モバイルでは非表示 */}
          <Card className="hidden bg-orange-200 md:col-span-2 md:row-span-2 md:block">
            <CardContent className="p-6 text-lg">
              <strong className="text-xl">投稿ルールの見直し</strong>
              <p className="mt-1 text-base">
                ネガティブ表現はORDINA様の再教育対象です。
                市民の幸福を損なう発言は直ちに変換・修正され、調和が保たれます。
                一語一句が社会の安寧を左右することをお忘れなきよう、発信には最大限の配慮をお願いいたします。
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 動的なお知らせ */}
      <section className="space-y-4">
        <h2 className="border-l-4 border-cyan-500 pl-3 text-2xl font-semibold">
          最新のお知らせ
        </h2>
        {announcements?.length ? (
          <ul className="space-y-3">
            {announcements.map((a) => (
              <Card key={a.id} className="bg-cyan-50">
                <CardContent className="p-4 text-base text-gray-800">
                  {a.content}
                </CardContent>
              </Card>
            ))}
          </ul>
        ) : (
          <p className="text-base text-gray-500">
            現在、秩序は完全に保たれております。
          </p>
        )}
      </section>
    </div>
  );
}
