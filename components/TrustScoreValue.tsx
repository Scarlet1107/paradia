"use client";
import React, { useState, useEffect } from "react";
import { Loader2, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { useUser } from "@/context/UserContext";
import Image from "next/image";
import { getBadgeUrlFromScore } from "@/lib/trust";

const TrustScoreValue = () => {
  const { trustScore } = useUser();
  const [displayScore, setDisplayScore] = useState<number | null>(trustScore);

  // 信頼度が変化したら1ずつアニメーションでカウントアップ/ダウン
  useEffect(() => {
    if (trustScore === null) return;
    if (displayScore === null) {
      setDisplayScore(trustScore);
      return;
    }
    const prev = displayScore;
    const diff = trustScore - prev;
    const step = diff > 0 ? 1 : -1;
    const total = Math.abs(diff);
    if (total === 0) return;

    const intervalMs = 200; // 1ステップあたり200msに変更
    let current = prev;
    const timer = setInterval(() => {
      current += step;
      setDisplayScore(current);
      if (current === trustScore) clearInterval(timer);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [displayScore, trustScore]);
  const badgeUrl = getBadgeUrlFromScore(trustScore);

  const getBadgeBackgroundColor = (score: number) => {
    if (score < 20) return "from-orange-500/50 to-brown-700/50";
    if (score < 40) return "from-orange-500/50 to-brown-400/50";
    else return "from-orange-400/50 to-orange-500/50";
  };

  return (
    <div>
      <HoverCard>
        <HoverCardTrigger asChild>
          <motion.div
            className="fixed right-5 bottom-40 z-50 md:right-12 md:bottom-40"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <div className="relative">
              {/* メインスコア表示 */}
              <motion.div
                className={`relative flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br md:h-20 md:w-20 ${
                  trustScore !== null && displayScore !== null
                    ? "from-orange-400 to-orange-600"
                    : "from-gray-400 to-gray-500"
                } shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* 内側の白い円 */}
                <div className="absolute inset-1 rounded-full bg-white/20 backdrop-blur-sm" />

                {/* スコア表示 */}
                <div className="relative z-10">
                  {trustScore !== null && displayScore !== null ? (
                    <div className="flex flex-col items-center">
                      <AnimatePresence mode="popLayout">
                        <motion.span
                          key={displayScore}
                          initial={{ opacity: 0, y: -10, scale: 0.8 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.8 }}
                          transition={{ duration: 0.3, type: "spring" }}
                          className="text-xl font-bold text-white drop-shadow-sm md:text-2xl"
                        >
                          {displayScore}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-6 w-6 animate-spin text-white md:h-7 md:w-7" />
                      <span className="mt-1 text-xs font-medium text-white/80">
                        計算中
                      </span>
                    </div>
                  )}
                </div>

                {/* 進行状況リング */}
                {trustScore !== null && displayScore !== null && (
                  <svg className="absolute inset-0 h-full w-full -rotate-90">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      fill="none"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="2"
                    />
                    <motion.circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      fill="none"
                      stroke="rgba(255,255,255,0.8)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 32}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
                      animate={{
                        strokeDashoffset:
                          2 * Math.PI * 32 * (1 - displayScore / 100),
                      }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </svg>
                )}
              </motion.div>

              {/* バッジ表示 */}
              {trustScore !== null && displayScore !== null && badgeUrl && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                  className="absolute -right-2 -bottom-2 md:-right-3 md:-bottom-3"
                >
                  <div className="relative">
                    {/* バッジの背景 */}
                    <div className="absolute inset-0 rounded-full bg-white shadow-lg" />
                    <div className="relative p-1 md:p-1.5">
                      <Image
                        src={badgeUrl || "/placeholder.svg"}
                        height={32}
                        width={32}
                        alt="市民バッジ"
                        className="h-6 w-6 rounded-full md:h-8 md:w-8"
                      />
                    </div>
                    {/* バッジの光る効果 */}
                    <motion.div
                      className={`absolute inset-0 rounded-full bg-gradient-to-r ${getBadgeBackgroundColor(trustScore)}`}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                </motion.div>
              )}

              {/* ツールチップ */}
              <motion.div
                className="absolute right-0 bottom-full mb-2 hidden group-hover:block"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="rounded-lg bg-gray-900 px-3 py-2 text-sm whitespace-nowrap text-white shadow-lg">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>信頼度スコア</span>
                  </div>
                  {trustScore !== null && displayScore !== null && (
                    <div
                      className={`mt-1 from-orange-400 to-orange-600 text-xs`}
                    >
                      {displayScore >= 80
                        ? "高い信頼度"
                        : displayScore >= 60
                          ? "中程度の信頼度"
                          : "低い信頼度"}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </HoverCardTrigger>
        <HoverCardContent className="text-sm" side="left">
          <p>このユーザーの信頼度を示します。</p>
          <p>この値が0になると、このSNSを利用できなくなります。</p>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default TrustScoreValue;
