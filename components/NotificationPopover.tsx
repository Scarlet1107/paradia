"use client";

import React, { useState, useEffect } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useNotifications } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";
import { formatRelativeTime } from "@/lib/time";

export interface Notification {
  id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export const NotificationPopover: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const notifications = useNotifications();
  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const supabase = createClient();
  const router = useRouter();

  // ポップオーバー開閉監視: 開いたら未読を既読化
  useEffect(() => {
    const markRead = async () => {
      const idsToMark = notifications
        .filter((n) => !n.is_read)
        .map((n) => n.id);
      if (open && idsToMark.length > 0) {
        try {
          const { error } = await supabase
            .from("notifications")
            .update({ is_read: true })
            .in("id", idsToMark);
          router.refresh(); // 通知を更新
          if (error) throw error;
        } catch (err) {
          console.error("通知の既読更新に失敗しました", err);
        }
      }
    };
    markRead();
  }, [open, notifications, supabase, router]);

  // notificationsが読み込まれたら、loadingをfalseにする
  useEffect(() => {
    if (notifications.length > 0) {
      setLoading(false);
    }
  }, [notifications]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative cursor-pointer md:ml-3">
          <Bell className="m-0 h-12 w-12 scale-125 p-0 text-orange-600" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 rounded-full bg-orange-600 text-white">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="mr-2 w-71 rounded-2xl p-0">
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-600">通知</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-64">
              {loading ? (
                <div className="p-4 text-center text-sm text-orange-500">
                  読み込み中...
                </div>
              ) : (
                <ul>
                  {notifications.length === 0 && (
                    <li className="p-4 text-center text-sm text-orange-500">
                      通知はありません
                    </li>
                  )}
                  {notifications.map((note) => (
                    <li
                      key={note.id}
                      className={`flex cursor-pointer flex-col border-b border-orange-200 p-4 last:border-none hover:bg-orange-50 ${
                        !note.is_read ? "bg-orange-100 font-semibold" : ""
                      }`}
                    >
                      <span className="text-sm whitespace-pre-wrap text-orange-800">
                        {note.content}
                      </span>
                      <time className="mt-1 text-xs text-orange-500">
                        {formatRelativeTime(note.created_at)}
                      </time>
                    </li>
                  ))}
                </ul>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};
