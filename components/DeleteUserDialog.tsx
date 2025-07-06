"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

const DeleteUserDialog = () => {
  const router = useRouter();
  const onDelete = async () => {
    const resp = await fetch("/api/profile/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const data = await resp.json();
    if (!data.success) {
      console.log("削除エラー", data);
    }
    toast("アカウントを削除しました");
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-red-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        <div className="mb-6">
          <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full">
            <Image
              src="/angry_eye.png" // publicフォルダ内の画像
              alt="怒った顔"
              width={128}
              height={128}
              className="text-red-600"
            />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-red-600">
            アカウント削除通知
          </h1>
          <p className="text-gray-600">
            あなたの信頼スコアが規定値を下回りました
          </p>
        </div>

        <div className="mb-6 rounded-lg bg-gray-50 p-4">
          <div className="mb-2 text-sm text-gray-600">現在の信頼スコア</div>
          <div className="text-3xl font-bold text-red-600">0</div>
          <div className="mt-1 text-sm text-gray-500">規定値: 1以上</div>
        </div>

        <div className="mb-6 text-gray-700">
          <p className="mb-3">
            システムの安全性を保つため、あなたのアカウントを削除する必要があります。
          </p>
          <p className="text-sm text-gray-500">
            この操作は取り消すことができません。
          </p>
        </div>

        <button
          type="submit"
          className="mb-3 w-full rounded-lg bg-red-600 px-4 py-3 font-bold text-white transition duration-200 hover:bg-red-700"
          onClick={onDelete}
        >
          アカウントを削除する
        </button>

        <div className="text-xs text-gray-400">
          ご不明な点がございましたら、管理者までお問い合わせください。
        </div>
      </div>
    </div>
  );
};

export default DeleteUserDialog;
