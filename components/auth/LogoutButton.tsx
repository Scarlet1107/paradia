"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full border-2 border-orange-300 bg-transparent text-orange-700 shadow-md hover:bg-orange-100 hover:text-orange-800"
        >
          <LogOut className="mr-2 h-4 w-4" />
          ログアウト
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ログアウト</DialogTitle>
          <DialogDescription>
            本当にログアウトしますか？
            <br />
            アプリを再度使用するためには、ログインが必要になります。
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">キャンセル</Button>
          </DialogClose>
          <Button onClick={logout}>ログアウト</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
