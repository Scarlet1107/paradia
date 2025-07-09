"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent
          className="max-w-md border-2 border-white bg-black"
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <AlertDialogHeader>
            <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-red-600">
              <Image
                src="/angry_eye.png"
                alt="怒った顔"
                width={128}
                height={128}
                className="text-white"
              />
            </div>
            <AlertDialogTitle className="text-center text-2xl font-bold text-red-500">
              アカウント削除通知
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-white">
              あなたの信頼スコアが規定値を下回りました
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            <div className="mt-2 rounded-lg bg-red-900 p-4 text-center">
              <div className="mb-2 text-sm text-white">現在の信頼スコア</div>
              <div className="text-3xl font-bold text-red-500">0</div>
              <div className="mt-1 text-sm text-white">規定値: 1以上</div>
            </div>

            <div className="text-center">
              <p className="mb-3 text-sm text-white">
                システムの安全性を保つため、あなたのアカウントを削除する必要があります。
              </p>
            </div>
          </div>

          <AlertDialogFooter className="flex flex-col gap-2 sm:flex-col">
            <AlertDialogAction
              onClick={onDelete}
              className="mt-2 w-full bg-red-500 py-3 font-bold text-white hover:bg-red-600"
            >
              アカウントを削除する
            </AlertDialogAction>
            <p className="text-center text-xs text-white/80">
              ※ この判断はオルディナ様が行ったもので、異議申し立てはできません。
            </p>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteUserDialog;
