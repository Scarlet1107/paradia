"use client";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { createClient } from "@/lib/supabase/client";

const TrustScoreValue = () => {
  const [score, setScore] = useState<number | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchTrustScore = async () => {
      // ユーザー情報を取得
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setScore(null);
        return;
      }
      const userId = user.id;

      // プロフィールテーブルから信頼度を取得
      const { data, error } = await supabase
        .from("profiles")
        .select("trust_score")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching trust score:", error);
        setScore(null);
      } else {
        setScore(data?.trust_score ?? null);
      }
    };

    fetchTrustScore();
  }, [supabase]);

  return (
    <div>
      <HoverCard>
        <HoverCardTrigger asChild>
          <p className="fixed right-5 bottom-40 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-orange-500 p-0 text-2xl text-white shadow-lg transition hover:bg-orange-600 md:right-12 md:bottom-40 md:h-20 md:w-20 md:text-3xl">
            {score !== null ? (
              score
            ) : (
              <span className="flex text-xs md:text-sm">
                <span className="hidden md:flex">計算中</span>
                <Loader2 className="inline animate-spin" />
              </span>
            )}
          </p>
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
