import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Post from "@/components/Post";
import PostComposer from "@/components/PostComposer";
import TrustScoreValue from "@/components/TrustScoreValue";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData?.user) redirect("/auth/login");
  const userId = authData.user.id;

  const { data: postsRaw, error: postsError } = await supabase
    .from("posts")
    .select("id, content, created_at")
    .order("created_at", { ascending: false });
  if (postsError || !postsRaw) {
    console.error("ポスト取得エラー:", postsError);
    return <div className="p-4">ポストの読み込みに失敗しました。</div>;
  }

  const postIds = postsRaw.map((p) => p.id);

  const { data: likesRaw, error: likesError } = await supabase
    .from("likes")
    .select("post_id, user_id")
    .in("post_id", postIds);

  if (likesError) {
    console.error("いいね情報取得エラー:", likesError);
  }

  const likeCountMap: Record<string, number> = {};
  const likedMap: Record<string, boolean> = {};
  likesRaw?.forEach(({ post_id, user_id }) => {
    likeCountMap[post_id] = (likeCountMap[post_id] || 0) + 1;
    if (user_id === userId) {
      likedMap[post_id] = true;
    }
  });

  const posts = postsRaw.map((p) => ({
    id: p.id,
    content: p.content,
    createdAt: p.created_at,
    initialLikeCount: likeCountMap[p.id] ?? 0,
    initialLiked: likedMap[p.id] ?? false,
  }));

  return (
    <div className="relative space-y-4 p-4">
      {posts.map(
        ({ id, content, createdAt, initialLikeCount, initialLiked }) => (
          <Post
            key={id}
            post={{ id, content, createdAt }}
            initialLikeCount={initialLikeCount}
            initialLiked={initialLiked}
          />
        ),
      )}
      <PostComposer />
      <TrustScoreValue />
    </div>
  );
}
