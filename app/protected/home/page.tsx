// app/protected/home/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PostsInfinite from "@/app/protected/home/PostsInfinite";
import { JSX } from "react";
import PostComposer from "@/components/PostComposer";
import TrustScoreValue from "@/components/TrustScoreValue";

export default async function HomePage(): Promise<JSX.Element> {
  // 1) server‐side auth only
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData?.user) redirect("/auth/login");
  const userId = authData.user.id;

  // 2) render only the client infinite scroll
  return (
    <div className="min-h-screen w-full">
      <PostsInfinite userId={userId} />
      <PostComposer />
      <TrustScoreValue />
    </div>
  );
}
