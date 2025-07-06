// app/protected/news/page.tsx
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const supabase = await createClient();
  const { data: announcements, error } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="flex flex-col gap-8">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold">お知らせ</h1>
        <Card>
          <CardContent className="space-y-2 p-4 text-sm leading-relaxed">
            <p>
              ORDINA様からの公式アナウンスメント（システムメンテ、ルール改定、季節キャンペーンなど）をまとめてチェック。
            </p>
            <p>
              「有害な情報は一切排除！」「裏切り者は抹消されました」など、次々と流れる平和の鐘。
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">最新のお知らせ</h2>
        {announcements?.length ? (
          <ul className="space-y-2">
            {announcements.map((a) => (
              <Card key={a.id}>
                <CardContent className="p-4 text-sm">{a.content}</CardContent>
              </Card>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-sm">
            平和が保たれています。
          </p>
        )}
      </section>
    </div>
  );
}
