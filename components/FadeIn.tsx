"use client";
import { ReactNode } from "react";
import { motion, Variants } from "framer-motion";

interface FadeInProps {
  /** 表示する子要素 */
  children: ReactNode;
  /** アニメーションの継続時間（秒） */
  duration?: number;
  /** アニメーション開始の遅延時間（秒） */
  delay?: number;
  /** スクロール時に一度だけ再生するか */
  once?: boolean;
  /** ビューに入ったとみなす割合（0.0 - 1.0） */
  amount?: number;
  /** 追加の className を渡せます */
  className?: string;
}

const variants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function FadeIn({
  children,
  duration = 0.6,
  delay = 0.1,
  once = true,
  amount = 0.2,
  className = "",
}: FadeInProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
