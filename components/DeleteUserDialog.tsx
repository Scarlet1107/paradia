"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

const DeleteUserDialog = () => {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const onDelete = async () => {
    try {
      const resp = await fetch("/api/profile/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await resp.json();
      if (!data.success) {
        console.log("削除エラー", data);
        toast("削除に失敗しました");
        return;
      }

      toast("アカウントを削除しました");
      setOpen(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("削除エラー:", error);
      toast("削除に失敗しました");
    }
  };

  const onCancel = () => {
    // キャンセルボタンは表示のみ（実際には削除が必須）
    toast("削除は必須です");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-red-50">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-red-100">
              <Image
                src="/angry_eye.png"
                alt="怒った顔"
                width={128}
                height={128}
                className="text-red-600"
              />
            </div>
            <AlertDialogTitle className="text-center text-2xl font-bold text-red-600">
              アカウント削除通知
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-gray-600">
              あなたの信頼スコアが規定値を下回りました
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-4 text-center">
              <div className="mb-2 text-sm text-gray-600">現在の信頼スコア</div>
              <div className="text-3xl font-bold text-red-600">0</div>
              <div className="mt-1 text-sm text-gray-500">規定値: 1以上</div>
            </div>

            <div className="text-center text-gray-700">
              <p className="mb-3">
                システムの安全性を保つため、あなたのアカウントを削除する必要があります。
              </p>
              <p className="text-sm text-gray-500">
                この操作は取り消すことができません。
              </p>
            </div>
          </div>

          <AlertDialogFooter className="flex flex-col gap-2 sm:flex-col">
            <AlertDialogAction
              onClick={onDelete}
              className="w-full bg-red-600 py-3 font-bold text-white hover:bg-red-700"
            >
              アカウントを削除する
            </AlertDialogAction>
            <div className="text-center text-xs text-gray-400">
              ご不明な点がございましたら、管理者までお問い合わせください。
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteUserDialog;
