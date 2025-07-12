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
    <>
      <AuthHeader />
      <main className="flex min-h-screen w-full flex-col items-center bg-gradient-to-br from-gray-50 via-white to-orange-50/30 px-4 pb-16 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-12 mb-20 max-w-3xl text-center"
        >
          <motion.div
            className="relative mb-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Image
              src="/open_graph.png"
              alt="Paradia Thumbnail"
              width={600}
              height={315}
              className="mx-auto rounded-xl border border-orange-100 shadow-lg"
            />
            {/* Animated glow */}
            <motion.div
              className="absolute inset-0 -z-10 scale-110 rounded-xl bg-gradient-to-r from-orange-200/20 to-orange-300/20 blur-2xl"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1.1, 1.15, 1.1],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Animated decorative line */}
          <motion.div
            className="mb-4 flex items-center justify-center"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.div
              className="h-px w-16 bg-gradient-to-r from-transparent via-orange-300 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            />
            <motion.div
              className="mx-3 h-2 w-2 rounded-full bg-orange-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.9 }}
            />
            <motion.div
              className="h-px w-16 bg-gradient-to-r from-transparent via-orange-300 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            />
          </motion.div>

          <motion.h1
            className="mb-6 text-2xl leading-tight font-bold text-gray-800 md:text-3xl xl:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.span
              className="font-extrabold text-orange-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
            >
              市民。
            </motion.span>
            もう誰も傷つかない、理想の
            <motion.span
              className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text font-extrabold text-transparent"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              SNSプラットフォーム
            </motion.span>
            、
            <motion.span
              className="font-bold text-orange-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 1.2 }}
            >
              パラディア
            </motion.span>
            へようこそ。
          </motion.h1>

          <motion.p
            className="text-lg leading-relaxed text-gray-600"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            すべてが
            <motion.span
              className="font-semibold text-orange-600"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              ポジティブ
            </motion.span>
            に包まれたSNSで、
            <motion.span
              className="font-bold text-orange-500"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              平和
            </motion.span>
            と
            <motion.span
              className="font-bold text-orange-600"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              秩序
            </motion.span>
            の中で安心して思いをシェアしましょう。
          </motion.p>
        </motion.section>

        {/* Features Section */}
        <motion.section
          className="mb-20 w-full max-w-5xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "幸福のみを歓迎",
                description:
                  "有害な情報は完ぺきなAIであるオルディナ様が排除し、安心・安全な空間を提供します。",
                accent: "orange",
              },
              {
                title: "社会の調和",
                description:
                  "市民同士が互いを讃え合い、裏切り者は抹消。誰も傷つけない理想郷へ。",
                accent: "amber",
              },
              {
                title: "理想郷の約束",
                description:
                  "全ての市民が平和と幸福の中で繋がる、誰もが安心して過ごせる理想の場です。",
                accent: "red",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 1.0 + idx * 0.2,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.2 },
                }}
              >
                <Card className="group relative h-full overflow-hidden border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-orange-200 hover:shadow-lg">
                  {/* Animated background on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-orange-50/0 to-orange-100/0 transition-all duration-300 group-hover:from-orange-50/50 group-hover:to-orange-100/30"
                    initial={false}
                  />

                  <CardHeader className="relative z-10 pb-3">
                    <div className="mb-2 flex items-center gap-3">
                      <motion.div
                        className={`h-2 w-2 rounded-full bg-gradient-to-r ${
                          feature.accent === "orange"
                            ? "from-orange-400 to-orange-500"
                            : feature.accent === "amber"
                              ? "from-amber-400 to-orange-500"
                              : "from-orange-500 to-red-500"
                        }`}
                        whileHover={{ scale: 1.5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                      <motion.div
                        className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 1.2 + idx * 0.2 }}
                      />
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-800 transition-colors group-hover:text-gray-900">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription className="leading-relaxed text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Call to Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Button
              asChild
              className="group relative w-48 overflow-hidden border-0 bg-gradient-to-r from-orange-500 to-orange-600 py-4 font-bold text-white shadow-lg transition-all duration-200 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl"
              variant="default"
            >
              <Link href="/auth/login">
                {/* Animated shine effect */}
                <motion.div
                  className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative">ログイン</span>
              </Link>
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Button
              asChild
              className="group relative w-48 overflow-hidden border-2 border-gray-300 bg-white py-4 font-medium text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-800 hover:shadow-md"
              variant="outline"
            >
              <Link href="/auth/sign-up">
                {/* Subtle orange hover effect */}
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-orange-50 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  initial={false}
                />
                <span className="relative">登録する</span>
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Animated background elements */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-orange-200/10 blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute right-1/4 bottom-1/4 h-48 w-48 rounded-full bg-orange-300/10 blur-2xl"
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </div>
      </main>
    </>
  );
}
