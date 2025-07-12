// app/protected/home/page.tsx
import PostsInfinite from "@/app/protected/home/PostsInfinite";
import PostComposer from "@/components/PostComposer";
import TrustScoreValue from "@/components/TrustScoreValue";
import { createClient } from "@/lib/supabase/server";
export default async function HomePage() {
  const supabase = await createClient();

  // 初回10件をサーバーで取得
  const { data: initialPosts } = await supabase
    .from("posts_with_like_counts")
    .select(
      `id, content, author_id, visibility_level, created_at, like_count, likes(post_id, user_id), author:profiles(nickname, trust_score), reports(id), parent_id, reply_count`,
    )
    .is("parent_id", null)
    .order("created_at", { ascending: false })
    .limit(10);
  if (!initialPosts) {
    return <div className="p-4">投稿が見つかりませんでした</div>;
  }

  // Map author from array to single object
  const mappedPosts = initialPosts.map((post) => ({
    ...post,
    author: Array.isArray(post.author) ? post.author[0] : post.author,
  }));

  return (
    <div className="min-h-screen w-full md:mb-24">
      <PostsInfinite pageSize={mappedPosts.length} initialPosts={mappedPosts} />
      <PostComposer />
      <TrustScoreValue />
    </div>
  );
}
