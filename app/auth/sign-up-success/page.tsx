import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl mb-8">ご登録ありがとうございます</CardTitle>
          <CardDescription>メールをご確認ください</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm mb-2">
            登録が完了しました。サインインする前に、
            アカウント確認のためメールをご確認ください。
          </p>
          <p className="text-muted-foreground text-xs mb-4">
            ※ 迷惑メールフォルダに入っている場合がありますので、ご確認ください。
          </p>
          <a
            href="/auth/login"
            className="inline-block underline underline-offset-2 text-blue-500 decoration-blue-500 font-medium"
          >
            サインイン画面へ
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
