"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import AuthHeader from "@/components/header/AuthHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center pb-16">
      {/* Header */}
      <AuthHeader />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mt-12 mb-24 max-w-3xl text-center"
      >
        <Image
          src="/open_graph.png"
          alt="Paradia Thumbnail"
          width={600}
          height={315}
          className="mx-auto mb-6 rounded-xl shadow-lg"
        />
        <h1 className="mb-4 text-4xl font-bold text-gray-800">
          市民。もう誰も傷つかない、理想のSNSプラットフォーム、パラディアへようこそ。
        </h1>
        <p className="text-lg text-gray-700">
          すべてがポジティブに包まれたSNSで、平和と秩序の中で安心して思いをシェアしましょう。
        </p>
      </motion.section>

      {/* Features Section */}
      <section className="mb-24 grid w-full max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "幸福のみを歓迎",
            description:
              "有害な情報は完ぺきなAIであるオルディナ様が排除し、安心・安全な空間を提供します。",
          },
          {
            title: "社会の調和",
            description:
              "市民同士が互いを讃え合い、裏切り者は抹消。誰も傷つけない理想郷へ。",
          },
          {
            title: "理想郷の約束",
            description:
              "全ての市民が平和と幸福の中で繋がる、誰もが安心して過ごせる理想の場です。",
          },
        ].map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * idx, duration: 0.6 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Call to Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6"
      >
        <Button asChild className="w-48 py-4" variant="default">
          <Link href="/auth/login">ログイン</Link>
        </Button>
        <Button asChild className="w-48 py-4" variant="outline">
          <Link href="/auth/sign-up">登録する</Link>
        </Button>
      </motion.div>
    </main>
  );
}
