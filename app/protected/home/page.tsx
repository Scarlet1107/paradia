// =============================
// File: app/protected/home/page.tsx
// =============================
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Post from "@/components/Post";
import PostComposer from "@/components/PostComposer";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData?.user) {
    redirect("/auth/login");
  }

  const { data: postsRaw, error: postsError } = await supabase
    .from("posts")
    .select("id, content, created_at")
    .order("created_at", { ascending: false });

  if (postsError) {
    console.error("ポストの取得に失敗しました", postsError);
    return (
      <div className="flex w-full flex-1 flex-col items-center justify-center">
        <p>ポスト一覧の読み込み中にエラーが発生しました。</p>
      </div>
    );
  }

  const posts = postsRaw?.map((post) => ({
    id: post.id,
    content: post.content,
    createdAt: post.created_at,
  }));

  return (
    <div className="relative space-y-4 p-4">
      {posts?.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      <PostComposer />
    </div>
  );
}
