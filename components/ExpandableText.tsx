// components/ExpandableText.tsx
"use client";

import { useState, useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import clsx from "clsx";

interface ExpandableTextProps {
  text: string;
  className?: string;
  collapsedLines?: number; // デフォルト：4行
}

export default function ExpandableText({
  text,
  className = "",
  collapsedLines = 4,
}: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const [heights, setHeights] = useState({ collapsed: 0, expanded: 0 });
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    // 行の高さを計算
    const style = window.getComputedStyle(el);
    const lineHeight = parseFloat(style.lineHeight || "0");
    const collapsedH = lineHeight * collapsedLines;
    const fullH = el.scrollHeight;

    setHeights({ collapsed: collapsedH, expanded: fullH });
    // 高さが折りたたみサイズを超えている場合にトグル表示
    if (fullH > collapsedH) {
      setShowToggle(true);
    }
  }, [collapsedLines, text]);

  return (
    <div>
      <motion.div
        ref={contentRef}
        initial={false}
        animate={{ height: expanded ? heights.expanded : heights.collapsed }}
        transition={{ duration: 0.3 }}
        style={{ overflow: "hidden" }}
        className={clsx(className)}
      >
        {text}
      </motion.div>

      {showToggle && (
        <Button
          variant="link"
          size="sm"
          className="mt-1 inline-flex items-center gap-1 px-0"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4" />
              折りたたむ
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              続きを読む
            </>
          )}
        </Button>
      )}
    </div>
  );
}
