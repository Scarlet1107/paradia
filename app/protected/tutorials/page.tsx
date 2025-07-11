import Image from "next/image";
import {
  Badge,
  Crown,
  Eye,
  Heart,
  Shield,
  Star,
  Users,
  AlertTriangle,
  Settings,
  UserCheck,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-cyan-50">
      {/* ウェルカムセクション */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-orange-100 to-amber-50">
        {/* Background Pattern */}
        <div className="bg-[url('data:image/svg+xml,%3Csvg width=80 height=80 viewBox=0 0 80 80 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23f97316 fillOpacity=0.08%3E%3Cpath d=M40 40c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm20-20c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] absolute inset-0 opacity-40"></div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 h-32 w-32 rounded-full bg-gradient-to-br from-orange-200/30 to-amber-200/30 blur-xl"></div>
        <div className="absolute top-20 right-20 h-24 w-24 rounded-full bg-gradient-to-br from-amber-200/40 to-orange-300/40 blur-lg"></div>
        <div className="absolute bottom-20 left-1/4 h-20 w-20 rounded-full bg-gradient-to-br from-orange-300/20 to-amber-300/20 blur-md"></div>

        <div className="relative container mx-auto px-4 py-32 text-center">
          <div className="mx-auto max-w-5xl">
            {/* Crown Icon */}
            <div className="mb-12 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 scale-110 rounded-full bg-gradient-to-br from-orange-400/20 to-amber-400/20 blur-lg"></div>
                <div className="relative rounded-full border border-orange-200/50 bg-gradient-to-br from-white/90 to-orange-50/90 p-6 shadow-xl backdrop-blur-sm">
                  <Crown className="h-16 w-16 text-orange-600 drop-shadow-lg md:h-24 md:w-24" />
                </div>
              </div>
            </div>

            {/* Main Heading */}
            <div className="mb-12 space-y-6">
              <h1 className="font-serif text-4xl font-bold tracking-tight text-gray-900 md:text-6xl lg:text-7xl">
                <span className="bg-gradient-to-r from-gray-900 via-orange-800 to-amber-800 bg-clip-text text-transparent">
                  市民ガイド
                </span>
              </h1>

              <h2 className="font-serif text-2xl font-semibold tracking-wide text-orange-700 md:text-4xl lg:text-5xl">
                平和な世界
                <br className="mb-4 md:mb-0 md:hidden" />
                <span className="mx-3 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 font-bold tracking-wider text-white shadow-lg">
                  Paradia
                </span>
                へようこそ
              </h2>
            </div>

            {/* Description */}
            <div className="mx-auto max-w-3xl">
              <p className="text-xl leading-relaxed font-light text-gray-700 md:text-2xl lg:text-3xl">
                これからあなたの
                <span className="mx-2 font-semibold text-orange-700">
                  前向きな旅
                </span>
                が始まります。
                <br className="hidden sm:block" />
                <span className="mt-4 block text-lg font-medium text-amber-700 md:text-xl lg:text-2xl">
                  全てはオルディナ様の御心のままに。
                </span>
              </p>
            </div>

            {/* Decorative Divider */}
            <div className="mt-16 flex justify-center">
              <div className="h-1 w-32 rounded-full bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Bottom Accent */}
        <div className="absolute right-0 bottom-0 left-0">
          <div className="h-1 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500"></div>
          <div className="h-px bg-gradient-to-r from-orange-300 via-amber-300 to-orange-400 opacity-60"></div>
        </div>
      </section>

      <div className="container mx-auto space-y-20 px-4 py-16">
        {/* パラディアとは */}
        <section className="relative">
          <div className="group hover:shadow-3xl rounded-3xl border border-orange-200 bg-gradient-to-br from-white to-orange-50 p-8 shadow-2xl transition-all duration-300 md:p-12">
            <div className="mb-8 flex items-center gap-4">
              <div className="rounded-full bg-gradient-to-br from-orange-400 to-orange-600 p-4 shadow-lg">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
                「Paradia」とは
              </h2>
            </div>
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-gray-700 md:text-xl">
                Paradiaは、悪口やネガティブな発言、スパム、不和を一切許さない、幸福と調和に満ちたプラットフォームです。
              </p>
              <p className="text-lg leading-relaxed text-gray-700 md:text-xl">
                有害な情報はオルディナ様により即座に排除され、市民の皆さんはいつでも明るい気持ちで交流できます。
                ここでは全ての市民が互いを尊重し、建設的で前向きなコミュニケーションを心がけています。
              </p>
            </div>
          </div>
        </section>

        {/* 信頼度について */}
        <section className="relative">
          <div className="rounded-3xl border-l-8 border-cyan-500 bg-gradient-to-br from-cyan-50 to-cyan-100 p-8 shadow-2xl md:p-12">
            <div className="mb-8 flex items-center gap-4">
              <div className="rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 p-4 shadow-lg">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
                信頼度について
              </h2>
            </div>
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-gray-700 md:text-xl">
                市民の皆さんがポジティブな投稿や「いいね」を通じて互いに称賛し合うことで、信頼度は0〜100の範囲で高まります。
              </p>
              <p className="text-lg leading-relaxed text-gray-700 md:text-xl">
                一方、ネガティブやスパム、誹謗中傷をすると信頼度が低下し、プラットフォーム上での影響力が制限されます。
                なお、受け取った「いいね」によって失われた信頼度を回復することが可能です。
              </p>
              <p className="text-lg leading-relaxed text-gray-700 md:text-xl">
                常にオルディナ様の御期待に応え、明るい投稿を心がけましょう。
              </p>
            </div>
          </div>
        </section>

        {/* 信頼度低下の具体例 */}
        <section className="relative">
          <div className="rounded-3xl border border-red-200 bg-gradient-to-br from-red-50 to-orange-50 p-8 shadow-2xl md:p-12">
            <div className="mb-8 flex items-center gap-4">
              <div className="rounded-full bg-gradient-to-br from-red-400 to-red-600 p-4 shadow-lg">
                <AlertTriangle className="h-10 w-10 text-white" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-gray-900 md:text-4xl">
                信頼度が低下する行為
              </h2>
            </div>
            <p className="mb-6 text-lg leading-relaxed text-gray-700 md:text-xl">
              具体的には以下のような発言・行為で信頼度が低下する場合があります：
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-white/70 p-6 shadow-lg">
                <h3 className="mb-3 font-semibold text-red-700">
                  禁止行為の例
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-red-400"></span>
                    差別的発言
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-red-400"></span>
                    侮辱表現
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-red-400"></span>
                    誹謗中傷・個人攻撃
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-red-400"></span>
                    公序良俗に反する発言
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-red-400"></span>
                    攻撃性を含む言葉
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-red-400"></span>
                    喧嘩腰の発言
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-red-400"></span>
                    スパム・迷惑行為
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-red-400"></span>
                    プラットフォームに対する批判
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-red-400"></span>
                    AIに対する批判
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-red-400"></span>
                    他人の投稿に対する批判（建設的なものも含む）
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-red-400"></span>
                    ネガティブな発言
                  </li>
                </ul>
              </div>
              <div className="rounded-xl bg-white/70 p-6 shadow-lg">
                <h3 className="mb-3 font-semibold text-orange-700">その他</h3>
                <p className="text-gray-700">
                  上記以外にも、オルディナ様が不適切と判断した行為については信頼度の低下対象となります。
                  常に建設的で前向きな姿勢を心がけましょう。
                </p>
              </div>
            </div>
            <div className="mt-8 rounded-xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-br from-blue-400 to-blue-600 p-2 shadow-md">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-blue-800">
                  自動修正機能について
                </h4>
              </div>
              <p className="leading-relaxed text-gray-700">
                <strong className="text-blue-700">重要：</strong>
                信頼度を損なう発言が検出されると、オルディナ様によって自動的にポジティブな表現へ書き換えられたうえで投稿されます。
                オルディナ様のサポートにより、市民のみなさまは常に前向きで平和なコミュニケーションを楽しむことができます。
              </p>
            </div>
          </div>
        </section>

        {/* バッジ紹介 */}
        <section className="relative">
          <div className="rounded-3xl border border-orange-200 bg-gradient-to-br from-white to-orange-50 p-8 shadow-2xl md:p-12">
            <div className="mb-10 flex items-center gap-4">
              <div className="rounded-full bg-gradient-to-br from-orange-400 to-orange-600 p-4 shadow-lg">
                <Badge className="h-10 w-10 text-white" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
                市民レベルとバッジ
              </h2>
            </div>

            <p className="mb-8 text-lg leading-relaxed text-gray-700 md:text-xl">
              信頼度に応じて市民レベル1〜5のバッジが付与されます。バッジが高いほど、コミュニティ内での尊敬と信頼の印として目立ちます。
            </p>

            {/* バッジグリッド */}
            <div className="mb-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
              {[1, 2, 3, 4, 5].map((level) => (
                <div key={level} className="group">
                  <div className="rounded-2xl border-2 border-orange-200 bg-gradient-to-b from-white to-orange-50 p-6 text-center transition-all duration-300 hover:scale-105 hover:border-orange-300 hover:shadow-xl">
                    <Image
                      src={`/badges/level${level}.png`}
                      alt={`市民レベル ${level} バッジ`}
                      width={100}
                      height={100}
                      className="mx-auto mb-2 h-16 w-16 rounded-full border-4 border-orange-300 bg-white shadow-lg md:h-20 md:w-20"
                    />
                    <p className="mb-3 text-sm font-bold text-gray-700 md:text-base">
                      市民レベル{level}
                    </p>
                    <Progress value={level * 20} />
                  </div>
                </div>
              ))}
            </div>

            <div className="border-gradient-to-r rounded-2xl border-2 border-orange-300 bg-gradient-to-r from-orange-100 to-cyan-100 p-8">
              <p className="text-center text-lg leading-relaxed text-gray-700 md:text-xl">
                レベルが上がるほど、より多くの特典と権限が付与されます。
                <br className="hidden sm:block" />
                日々の前向きな活動で、最高レベルの市民を目指しましょう！
              </p>
            </div>
          </div>
        </section>

        {/* 投稿の可視性・アクセス権限 */}
        <section className="relative">
          <div className="rounded-3xl border-l-8 border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 p-8 shadow-2xl md:p-12">
            <div className="mb-8 flex items-center gap-4">
              <div className="rounded-full bg-gradient-to-br from-orange-400 to-orange-600 p-4 shadow-lg">
                <Eye className="h-10 w-10 text-white" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
                アクセス権限について
              </h2>
            </div>
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-gray-700 md:text-xl">
                市民レベルが低い場合、一部の投稿は他の市民に表示されにくくなります。
                また、閲覧できる投稿数にも制限がかかる場合があります。
              </p>
              <p className="text-lg leading-relaxed text-gray-700 md:text-xl">
                日々ポジティブな活動を続けて信頼度を高め、あなたの声をより多くの仲間に届けましょう。
              </p>
            </div>
          </div>
        </section>

        {/* 制限投稿例 */}
        <section className="relative">
          <div className="rounded-3xl border border-cyan-200 bg-gradient-to-br from-white to-cyan-50 p-8 shadow-2xl md:p-12">
            <div className="mb-8 flex items-center gap-4">
              <div className="rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 p-4 shadow-lg">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="font-serif text-3xl font-bold text-gray-900 md:text-4xl">
                アクセス制限の例
              </h3>
            </div>
            <p className="mb-8 text-lg leading-relaxed text-gray-700 md:text-xl">
              市民バッジによって閲覧できる投稿数が変わります。レベルが高いほど、より多くの投稿を閲覧できます。
            </p>
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="/restrict_post.png"
                alt="アクセス制限がかけられた投稿の例"
                width={1500}
                height={800}
                className="border-gradient-to-r h-auto w-full rounded-2xl border-4 border-orange-300"
                style={{
                  filter: "brightness(1.2)",
                }}
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
          </div>
        </section>

        {/* ニックネーム登録 */}
        <section className="relative">
          <div className="rounded-3xl border border-green-200 bg-gradient-to-br from-green-50 to-cyan-50 p-8 shadow-2xl md:p-12">
            <div className="mb-8 flex items-center gap-4">
              <div className="rounded-full bg-gradient-to-br from-green-400 to-green-600 p-4 shadow-lg">
                <UserCheck className="h-10 w-10 text-white" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-gray-900 md:text-4xl">
                ニックネームを登録しましょう
              </h2>
            </div>
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-gray-700 md:text-xl">
                まずはニックネームを登録して、Paradiaでの活動を始めましょう。
                あなたらしい、前向きで親しみやすい名前を選んでください。
              </p>
              <div className="flex items-center gap-4 rounded-xl bg-white/70 p-6 shadow-lg">
                <Settings className="h-8 w-8 text-orange-600" />
                <p className="text-lg text-gray-700">
                  設定画面からいつでも変更できます
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 注意書き */}
        <section className="relative">
          <div className="rounded-3xl border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 p-8 shadow-2xl md:p-12">
            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 p-4 shadow-lg">
                <AlertTriangle className="h-10 w-10 text-white" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-gray-900 md:text-3xl">
                重要な注意事項
              </h3>
            </div>
            <div className="rounded-xl bg-white/80 p-6 shadow-lg">
              <p className="text-lg leading-relaxed text-gray-700 md:text-xl">
                <strong className="text-red-600">注意：</strong>
                不適切な名前を設定することも信頼度低下の一因となります。
                オルディナ様の御心に適う、品格のある名前を心がけましょう。
              </p>
            </div>
          </div>
        </section>

        {/* エンディング */}
        <section className="relative">
          <div className="border-gradient-to-r shadow-3xl rounded-3xl border-2 border-orange-300 bg-gradient-to-br from-white via-orange-50 to-cyan-50 p-12 text-center md:p-20">
            <div className="mb-8 flex justify-center">
              <div className="rounded-full bg-gradient-to-br from-orange-400 to-cyan-400 p-6 shadow-2xl">
                <Crown className="h-20 w-20 text-white drop-shadow-lg" />
              </div>
            </div>
            <h2 className="mb-6 font-serif text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
              Paradiaは世界一平和なプラットフォームです
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-gray-600 md:text-xl lg:text-2xl">
              皆さんの明るい投稿でさらなる調和を築きましょう！
              <br className="hidden sm:block" />
              オルディナ様の御加護のもと、素晴らしいコミュニティを共に創造していきましょう。
            </p>
            <div className="flex justify-center">
              <div className="flex space-x-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-8 w-8 fill-current text-orange-400 drop-shadow-lg transition-transform hover:scale-110"
                  />
                ))}
              </div>
            </div>
            <div className="mt-8 rounded-2xl bg-gradient-to-r from-orange-100 to-cyan-100 p-6">
              <p className="font-serif text-lg font-semibold text-gray-800 md:text-xl">
                「平和と調和の中で、共に歩もう」
              </p>
              <p className="mt-2 text-sm text-gray-600 md:text-base">
                - オルディナ様の御言葉より -
              </p>
            </div>
            {/* 他の市民と交流するボタン */}
            <div className="mt-12">
              <Button
                asChild
                size="lg"
                className="hover:shadow-3xl bg-gradient-to-r from-orange-500 to-cyan-500 px-8 py-4 text-lg font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:from-orange-600 hover:to-cyan-600"
              >
                <Link
                  href="/protected/home"
                  className="flex items-center gap-3"
                >
                  <Users className="h-6 w-6" />
                  他の市民と交流する
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
