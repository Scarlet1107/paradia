"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

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
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "たった今";
    if (diffInMinutes < 60) return `${diffInMinutes}分前`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}時間前`;
    return `${Math.floor(diffInMinutes / 1440)}日前`;
  };

  return (
    <motion.div
      className="overflow-hidden rounded-xl border-2 border-orange-300 bg-white shadow-xl"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* 掲示板ヘッダー */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-8 w-8" />
          <div>
            <h2 className="text-3xl font-bold">リアルタイム掲示板</h2>
            <p className="mt-1 text-orange-100">
              最新のお知らせとコミュニティ情報
            </p>
          </div>
        </div>
      </div>

      {/* 掲示板コンテンツ */}
      <div className="p-6">
        {announcements.length ? (
          <div className="space-y-4">
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
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="bg-orange-200 text-orange-800"
                      >
                        お知らせ #{announcement.id}
                      </Badge>
                      <motion.div
                        className="flex items-center gap-2 text-sm text-gray-500"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                      >
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">
                          {getTimeAgo(announcement.created_at)}
                        </span>
                      </motion.div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <motion.p
                      className="mb-3 leading-relaxed text-gray-800"
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
                      投稿日時: {formatDate(announcement.created_at)}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="py-12 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <MessageSquare className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <p className="mb-2 text-lg text-gray-500">
              現在、秩序は完全に保たれております。
            </p>
            <p className="text-sm text-gray-400">
              新しいお知らせをお待ちください
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
