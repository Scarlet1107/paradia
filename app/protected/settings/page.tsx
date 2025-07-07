import { LogoutButton } from "@/components/auth/LogoutButton";
import UpdateNicknameInput from "@/components/UpdateNicknameInput";

export default async function ProtectedPage() {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center gap-12">
      <UpdateNicknameInput />
      <LogoutButton />
    </div>
  );
}
