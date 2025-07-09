import Image from "next/image";
import { Badge, Crown, Eye, Heart, Shield, Star, Users } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-cyan-50">
      {/* ウェルカムセクション */}
      <section className="relative overflow-hidden bg-gradient-to-r from-orange-100 to-orange-200 text-gray-800">
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="mx-auto max-w-4xl">
            <Crown className="mx-auto mb-6 h-16 w-16 text-orange-500" />
            <h1 className="mb-6 font-serif text-4xl font-bold text-gray-900 md:text-6xl lg:text-7xl">
              平和な世界「Paradia」へようこそ
            </h1>
            <p className="text-lg leading-relaxed text-gray-600 md:text-xl">
              これからあなたの前向きな旅が始まります。
              <br className="hidden sm:block" />
              全てはオルディナ様の御心のままに。
            </p>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 left-0 h-1 bg-orange-300"></div>
      </section>

      <div className="container mx-auto space-y-16 px-4 py-12">
        {/* パラディアとは */}
        <section className="relative">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl md:p-12">
            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-full bg-orange-100 p-3">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-gray-900 md:text-4xl">
                「パラディア」とは
              </h2>
            </div>
            <p className="text-lg leading-relaxed text-gray-700 md:text-xl">
              Paradiaは、悪口やネガティブな発言、スパム、不和を一切許さない、幸福と調和に満ちたプラットフォームです。
              有害な情報はオルディナ様の御稟議により即座に排除され、市民の皆さんはいつでも明るい気持ちで交流できます。
            </p>
          </div>
        </section>

        {/* 信頼度について */}
        <section className="relative">
          <div className="rounded-2xl border-l-8 border-cyan-500 bg-gradient-to-r from-cyan-50 to-cyan-100 p-8 shadow-xl md:p-12">
            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-full bg-cyan-100 p-3">
                <Heart className="h-8 w-8 text-cyan-600" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-gray-900 md:text-4xl">
                信頼度について
              </h2>
            </div>
            <div className="space-y-4">
              <p className="text-lg leading-relaxed text-gray-700 md:text-xl">
                市民の皆さんがポジティブな投稿や「いいね」を通じて互いに称賛し合うことで、信頼度は0〜100の範囲で高まります。
              </p>
              <p className="text-lg leading-relaxed text-gray-700 md:text-xl">
                一方、ネガティブやスパム、誹謗中傷をすると信頼度が低下し、プラットフォーム上での影響力が制限されます。
                なお、受け取った「いいね」によって失われた信頼度を回復することが可能です。常にオルディナ様の御期待に応え、明るい投稿を心がけましょう。
              </p>
            </div>
          </div>
        </section>

        {/* バッジ紹介 */}
        <section className="relative">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl md:p-12">
            <div className="mb-8 flex items-center gap-4">
              <div className="rounded-full bg-orange-100 p-3">
                <Badge className="h-8 w-8 text-orange-600" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-gray-900 md:text-4xl">
                市民レベルとバッジ
              </h2>
            </div>

            {/* バッジグリッド */}
            <div className="mb-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
              {[1, 2, 3, 4, 5].map((level) => (
                <div key={level} className="group">
                  <div className="rounded-xl border border-gray-200 bg-gradient-to-b from-gray-50 to-gray-100 p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <div className="relative mb-4">
                      <Image
                        src={`/badges/level${level}.png`}
                        alt={`市民レベル${level}バッジ`}
                        width={80}
                        height={80}
                        className="mx-auto h-16 w-16 transition-transform group-hover:scale-110 md:h-20 md:w-20"
                      />
                      <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500">
                        <Star className="h-3 w-3 fill-current text-white" />
                      </div>
                    </div>
                    <p className="text-sm font-bold text-gray-800 md:text-base">
                      レベル{level}
                    </p>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500"
                        style={{ width: `${level * 20}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-orange-200 bg-gradient-to-r from-orange-50 to-cyan-50 p-6">
              <p className="text-center text-lg leading-relaxed text-gray-700 md:text-xl">
                信頼度に応じて市民レベル1〜5のバッジが付与されます。
                <br className="hidden sm:block" />
                バッジが高いほど、コミュニティ内での尊敬と信頼の印として目立ちます。
              </p>
            </div>
          </div>
        </section>

        {/* 投稿の可視性 */}
        <section className="relative">
          <div className="rounded-2xl border-l-8 border-orange-500 bg-gradient-to-r from-orange-50 to-orange-100 p-8 shadow-xl md:p-12">
            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-full bg-orange-100 p-3">
                <Eye className="h-8 w-8 text-orange-600" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-gray-900 md:text-4xl">
                投稿の可視性
              </h2>
            </div>
            <p className="text-lg leading-relaxed text-gray-700 md:text-xl">
              市民レベルが低い場合、一部の投稿は他の市民に表示されにくくなります。
              日々ポジティブな活動を続けて信頼度を高め、あなたの声をより多くの仲間に届けましょう。
            </p>
          </div>
        </section>

        {/* 制限投稿例 */}
        <section className="relative">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl md:p-12">
            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-full bg-cyan-100 p-3">
                <Users className="h-8 w-8 text-cyan-600" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-gray-900 md:text-3xl">
                アクセス制限の例
              </h3>
            </div>
            <p className="mb-8 text-lg leading-relaxed text-gray-700 md:text-xl">
              市民バッジによって閲覧できる投稿数が変わります。レベルが高いほど、より多くの投稿を閲覧できます。
            </p>
            <div className="relative overflow-hidden rounded-xl shadow-lg">
              <Image
                src={`/restrict_post.png`}
                alt="アクセス制限がかけられた投稿の例"
                width={1000}
                height={500}
                quality={90}
                className="h-auto w-full rounded-xl border-4 border-orange-300"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </section>

        {/* エンディング */}
        <section className="relative">
          <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-xl md:p-16">
            <Crown className="mx-auto mb-6 h-16 w-16 text-orange-500" />
            <p className="mb-4 font-serif text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">
              Paradiaは世界一平和なプラットフォームです
            </p>
            <p className="text-lg leading-relaxed text-gray-600 md:text-xl">
              皆さんの明るい投稿でさらなる調和を築きましょう！
            </p>
            <div className="mt-8 flex justify-center">
              <div className="flex space-x-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-6 w-6 fill-current text-orange-400"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 下部スペース */}
      <div className="h-24 md:h-0"></div>
    </div>
  );
}
