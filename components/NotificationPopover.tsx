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

export interface Notification {
  id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export const NotificationPopover: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("notifications")
          .select("id, content, is_read, created_at")
          .order("created_at", { ascending: false });
        if (error) throw error;
        setNotifications(data ?? []);
      } catch (err) {
        console.error("通知の取得に失敗しました", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell className="h-8 w-8 text-orange-500" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 rounded-full bg-orange-600 text-white">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-500">お知らせ</CardTitle>
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
                      <span className="text-sm text-orange-800">
                        {note.content}
                      </span>
                      <time className="mt-1 text-xs text-orange-500">
                        {new Date(note.created_at).toLocaleString("ja-JP", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
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
