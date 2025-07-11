"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  Trophy,
  Medal,
  Award,
  Scroll,
  Sparkles,
  Heart,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import { getBadgeUrlFromScore, getCitizenLevel } from "@/lib/trust";

export type UserRanking = {
  id: string;
  nickname: string;
  trust_score: number;
  numPosts: number;
  totalLikes: number;
  avgLikes: number;
};

const METRICS = [
  {
    key: "trust_score",
    label: "信頼度",
    icon: Crown,
    color: "from-orange-400 to-orange-500",
    description: "神聖なる信頼レベル",
  },
  {
    key: "numPosts",
    label: "投稿数",
    icon: Scroll,
    color: "from-orange-500 to-orange-600",
    description: "書かれた聖なる巻物",
  },
  {
    key: "totalLikes",
    label: "総いいね数",
    icon: Heart,
    color: "from-red-400 to-red-500",
    description: "捕らえた心の数",
  },
  {
    key: "avgLikes",
    label: "平均いいね",
    icon: TrendingUp,
    color: "from-orange-600 to-red-500",
    description: "平均的な献身度",
  },
] as const;

type MetricKey = (typeof METRICS)[number]["key"];

const getRankIcon = (index: number) => {
  switch (index) {
    case 0:
      return <Crown className="h-6 w-6 text-orange-500 drop-shadow-lg" />;
    case 1:
      return <Trophy className="h-6 w-6 text-orange-400 drop-shadow-lg" />;
    case 2:
      return <Medal className="h-5 w-5 text-orange-600 drop-shadow-lg" />;
    default:
      if (index < 10) {
        return <Award className="h-5 w-5 text-orange-300 drop-shadow-md" />;
      }
      return <Sparkles className="h-4 w-4 text-gray-400" />;
  }
};

export default function Ranking({
  initialData,
}: {
  initialData: UserRanking[];
}) {
  const [metric, setMetric] = useState<MetricKey>("trust_score");
  const [hoveredTab, setHoveredTab] = useState<MetricKey | null>(null);

  const sorted = [...initialData].sort((a, b) => b[metric] - a[metric]);
  const currentMetric = METRICS.find((m) => m.key === metric)!;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-4 bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 bg-clip-text text-4xl font-bold text-transparent drop-shadow-2xl sm:text-5xl lg:text-6xl">
            📊 ランキング 📊
          </h1>
          <p className="text-lg font-medium text-orange-600 drop-shadow-lg sm:text-xl">
            献身度の記録
          </p>
        </motion.div>

        {/* Main Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* Full Width Tabs - Equal Distribution */}
          <div className="grid grid-cols-4 gap-0">
            {METRICS.map((m, index) => {
              const Icon = m.icon;
              const isActive = metric === m.key;
              const isHovered = hoveredTab === m.key;

              return (
                <motion.button
                  key={m.key}
                  onClick={() => setMetric(m.key)}
                  onMouseEnter={() => setHoveredTab(m.key)}
                  onMouseLeave={() => setHoveredTab(null)}
                  className={`relative transform border-2 border-orange-200/50 px-4 py-4 text-sm font-bold transition-all duration-300 hover:scale-105 ${
                    isActive
                      ? `bg-gradient-to-r ${m.color} border-orange-300 text-white shadow-lg`
                      : "bg-gradient-to-r from-orange-100/80 to-orange-200/80 text-orange-800 hover:from-orange-200/80 hover:to-orange-300/80"
                  } ${index === 0 ? "rounded-tl-2xl" : ""} ${index === METRICS.length - 1 ? "rounded-tr-2xl" : ""} ${index !== METRICS.length - 1 ? "border-r-0" : ""} `}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Icon
                      className={`h-5 w-5 ${isActive ? "text-white" : "text-orange-600"}`}
                    />
                    <span className="text-xs sm:text-sm">{m.label}</span>
                  </div>

                  {/* Active indicator glow */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabGlow"
                      className="absolute inset-0 rounded-t-2xl bg-gradient-to-r from-white/20 to-white/10"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          <motion.div
            key={metric}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden rounded-b-2xl border-2 border-t-0 border-orange-200/50 bg-gradient-to-br from-white/95 via-orange-50/95 to-orange-100/95 shadow-2xl backdrop-blur-xl"
          >
            {/* Subtle texture overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-orange-100/20 to-orange-200/30 opacity-50"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(251,146,60,0.1),transparent_40%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(249,115,22,0.1),transparent_40%)]"></div>

            {/* Border decoration */}
            <div className="absolute inset-2 rounded-b-xl border border-orange-300/30"></div>

            <div className="relative z-10 p-2">
              {/* Table */}
              <div className="overflow-hidden rounded-xl border border-orange-200 bg-gradient-to-br from-white/80 to-orange-50/80 shadow-inner">
                {/* Table Header */}
                <div className="border-b border-orange-300 bg-gradient-to-r from-orange-200 via-orange-300 to-orange-200 px-4 py-4 sm:px-6">
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-2 text-center sm:col-span-1">
                      <span className="text-sm font-bold text-orange-800 sm:text-base">
                        順位
                      </span>
                    </div>
                    <div className="col-span-2 w-max text-center sm:col-span-2">
                      <span className="text-sm font-bold text-orange-800 sm:text-base">
                        バッジ
                      </span>
                    </div>
                    <div className="col-span-4 sm:col-span-5">
                      <span className="text-sm font-bold text-orange-800 sm:text-base">
                        ユーザー
                      </span>
                    </div>
                    <div className="col-span-4 text-right sm:col-span-4">
                      <div className="flex items-center justify-end gap-2">
                        <currentMetric.icon className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-bold text-orange-800 sm:text-base">
                          {currentMetric.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Table Body */}
                <div>
                  <AnimatePresence mode="popLayout">
                    {sorted.map((user, index) => (
                      <motion.div
                        key={`${user.id}-${metric}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.05,
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                        className={`grid grid-cols-12 items-center gap-4 border-b border-orange-100/50 px-4 py-4 transition-all duration-300 hover:bg-gradient-to-r sm:px-6 ${
                          index === 0
                            ? "bg-gradient-to-r from-orange-100/60 to-orange-200/60 hover:from-orange-200/60 hover:to-orange-300/60"
                            : index === 1
                              ? "bg-gradient-to-r from-orange-50/60 to-orange-100/60 hover:from-orange-100/60 hover:to-orange-200/60"
                              : index === 2
                                ? "bg-gradient-to-r from-orange-50/40 to-orange-100/40 hover:from-orange-100/40 hover:to-orange-200/40"
                                : "hover:from-orange-50/30 hover:to-orange-100/30"
                        } `}
                        whileHover={{ scale: 1.01 }}
                      >
                        {/* Rank */}
                        <div className="col-span-2 flex items-center justify-center gap-2 sm:col-span-1">
                          {getRankIcon(index)}
                          <span
                            className={`text-lg font-bold sm:text-xl ${
                              index === 0
                                ? "text-orange-600"
                                : index === 1
                                  ? "text-orange-500"
                                  : index === 2
                                    ? "text-orange-600"
                                    : "text-gray-600"
                            } `}
                          >
                            #{index + 1}
                          </span>
                        </div>

                        {/* Status Badge - Just the image */}
                        <div className="col-span-2 flex justify-center sm:col-span-2">
                          <div className="relative h-8 w-8">
                            <Image
                              src={getBadgeUrlFromScore(user.trust_score)}
                              alt={`レベル${getCitizenLevel(user.trust_score)}バッジ`}
                              width={32}
                              height={32}
                              className="h-full w-full object-contain"
                            />
                          </div>
                        </div>
                        {/* Nickname */}
                        <div className="col-span-4 sm:col-span-5">
                          <div className="flex flex-col">
                            <span
                              className={`text-sm font-bold tracking-wide sm:text-lg ${index < 3 ? "text-gray-800" : "text-gray-700"} `}
                            >
                              {user.nickname || "匿名"}
                            </span>
                            {index === 0 && (
                              <span className="text-xs font-medium text-orange-600">
                                👑 最高の献身者
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Value */}
                        <div className="col-span-4 text-right sm:col-span-4">
                          <div className="flex flex-col items-end">
                            <span
                              className={`text-lg font-bold sm:text-xl ${
                                index === 0
                                  ? "text-orange-600"
                                  : index === 1
                                    ? "text-orange-500"
                                    : index === 2
                                      ? "text-orange-600"
                                      : "text-gray-600"
                              } `}
                            >
                              {metric === "avgLikes"
                                ? user.avgLikes.toFixed(2)
                                : user[metric].toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-500">
                              {metric === "trust_score"
                                ? "信頼度"
                                : metric === "numPosts"
                                  ? "投稿"
                                  : metric === "totalLikes"
                                    ? "いいね"
                                    : "平均"}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-6 text-center"
              >
                <p className="text-sm text-orange-600 italic sm:text-base">
                  「最も献身的な者が永遠の栄光に昇る」 ✨
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
