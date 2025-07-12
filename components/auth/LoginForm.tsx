"use client";

import type React from "react";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/protected/tutorials");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6 px-4 md:px-0", className)}
      {...props}
    >
      <Card className="border-orange-200/50 bg-gradient-to-br from-white to-orange-50/30 shadow-lg">
        <CardContent className="p-6">
          <CardTitle className="mb-6 text-2xl text-gray-800">
            ログイン
          </CardTitle>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="font-medium text-gray-700">
                  メール
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-gray-300 bg-white focus:border-orange-400 focus:ring-orange-400/20"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label
                    htmlFor="password"
                    className="font-medium text-gray-700"
                  >
                    パスワード
                  </Label>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm font-medium text-orange-600 underline-offset-4 transition-colors hover:text-orange-700 hover:underline"
                  >
                    パスワードをお忘れですか？
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-gray-300 bg-white focus:border-orange-400 focus:ring-orange-400/20"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 font-medium text-white shadow-md transition-all duration-200 hover:from-orange-600 hover:to-orange-700 hover:shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? "ログイン中..." : "ログイン"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              <span className="text-gray-600">新規作成は</span>
              <Link
                href="/auth/sign-up"
                className="ml-1 font-medium text-orange-600 underline underline-offset-4 transition-colors hover:text-orange-700"
              >
                こちら
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
