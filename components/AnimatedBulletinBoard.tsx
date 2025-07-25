"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { formatRelativeTime } from "@/lib/time";

interface Announcement {
  id: number;
  content: string;
  created_at: string;
}

interface AnimatedBulletinBoardProps {
  announcements: Announcement[];
}

export function AnimatedBulletinBoard({
  announcements,
}: AnimatedBulletinBoardProps) {
  return (
    <motion.div
      className="overflow-hidden rounded-xl border-2 border-orange-300 bg-white shadow-xl"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* 掲示板ヘッダー */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-white sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8" />
          <div className="flex-1">
            <h2 className="text-xl font-bold sm:text-2xl lg:text-3xl">
              リアルタイム掲示板
            </h2>
            <p className="mt-1 text-sm text-orange-100 sm:text-base">
              最新のお知らせとコミュニティ情報
            </p>
          </div>
        </div>
      </div>

      {/* 掲示板コンテンツ */}
      <div className="p-3 sm:p-6">
        {announcements.length ? (
          <div className="space-y-3 sm:space-y-4">
            {announcements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <Card
                  className={`border-l-4 transition-all duration-300 hover:shadow-lg ${
                    index % 2 === 0
                      ? "border-l-orange-400 bg-orange-50 hover:bg-orange-100"
                      : "bg-orange-25 hover:bg-orange-75 border-l-orange-300"
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <Badge
                        variant="secondary"
                        className="w-fit bg-orange-200 text-orange-800"
                      >
                        お知らせ #{String(announcement.id).split("-")[0]}
                      </Badge>
                      <motion.div
                        className="flex items-center gap-2 text-xs text-gray-500 sm:text-sm"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                      >
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="font-medium">
                          {formatRelativeTime(announcement.created_at)}
                        </span>
                      </motion.div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <motion.p
                      className="mb-2 text-sm leading-relaxed text-gray-800 sm:mb-3 sm:text-base"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      {announcement.content}
                    </motion.p>
                    <motion.div
                      className="border-t pt-2 text-xs text-gray-500"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                    >
                      投稿日時: {formatRelativeTime(announcement.created_at)}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="py-8 text-center sm:py-12"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <MessageSquare className="mx-auto mb-4 h-12 w-12 text-gray-300 sm:h-16 sm:w-16" />
            <p className="mb-2 text-base text-gray-500 sm:text-lg">
              現在、秩序は完全に保たれております。
            </p>
            <p className="text-xs text-gray-400 sm:text-sm">
              新しいお知らせをお待ちください
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
