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
          <CardTitle className="mb-8 text-2xl">
            ご登録ありがとうございます
          </CardTitle>
          <CardDescription>メールをご確認ください</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-2 text-sm">
            登録が完了しました。サインインする前に、
            アカウント確認のためメールをご確認ください。
          </p>
          <p className="text-muted-foreground mb-4 text-xs">
            ※ 迷惑メールフォルダに入っている場合がありますので、ご確認ください。
          </p>
          <a
            href="/auth/login"
            className="inline-block font-medium text-blue-500 underline decoration-blue-500 underline-offset-2"
          >
            サインイン画面へ
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
