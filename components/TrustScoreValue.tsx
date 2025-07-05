"use client";
import React, { useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const TrustScoreValue = () => {
  // layout.tsxで取得した信用度をContextで後々受け取るので、とりあえずダミーの値を設定
  const [score, setScore] = useState<number | null>(50);

  return (
    <div>
      <HoverCard>
        <HoverCardTrigger asChild>
          <p className="fixed right-5 bottom-40 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-orange-500 p-0 text-2xl text-white shadow-lg transition hover:bg-orange-600 md:right-12 md:bottom-40 md:h-20 md:w-20 md:text-3xl">
            {score}
          </p>
        </HoverCardTrigger>
        <HoverCardContent className="text-sm" side="left">
          <p>このユーザーの信頼性を示します。</p>
          <p>この値が0になると、このSNSを利用できなくなります。</p>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default TrustScoreValue;
