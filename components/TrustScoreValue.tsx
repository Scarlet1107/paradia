"use client";
import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { useUser } from "@/context/UserContext";

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

  return (
    <div>
      <HoverCard>
        <HoverCardTrigger asChild>
          <motion.p className="fixed right-5 bottom-40 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-orange-500 text-2xl text-white shadow-lg transition hover:bg-orange-600 md:right-12 md:bottom-40 md:h-20 md:w-20 md:text-3xl">
            {trustScore !== null && displayScore !== null ? (
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={displayScore}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  {displayScore}
                </motion.span>
              </AnimatePresence>
            ) : (
              <span className="flex text-xs md:text-sm">
                <span className="hidden md:flex">計算中</span>
                <Loader2 className="inline animate-spin" />
              </span>
            )}
          </motion.p>
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
