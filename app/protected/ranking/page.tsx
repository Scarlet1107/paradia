// app/protected/ranking/page.tsx
import { createClient } from "@/lib/supabase/server";
import Ranking from "@/components/Ranking";
import type { UserRanking } from "@/components/Ranking";

export default async function RankingPage() {
  const supabase = await createClient();

  const { data: profilesData, error: profilesError } = await supabase
    .from("profiles")
    .select("id, nickname, trust_score");
  if (profilesError) {
    console.error("Failed to load profiles:", profilesError);
  }
  const profiles = profilesData ?? [];

  const { data: postsData, error: postsError } = await supabase
    .from("posts")
    .select("id, author_id");
  if (postsError) {
    console.error("Failed to load posts:", postsError);
  }
  const posts = postsData ?? [];

  const { data: likesData, error: likesError } = await supabase
    .from("likes")
    .select("post_id");
  if (likesError) {
    console.error("Failed to load likes:", likesError);
  }
  const likes = likesData ?? [];

  const rankings: UserRanking[] = profiles.map((p) => {
    const myPosts = posts.filter((x) => x.author_id === p.id);
    const numPosts = myPosts.length;
    const postIds = new Set(myPosts.map((x) => x.id));
    const totalLikes = likes.filter((l) => postIds.has(l.post_id)).length;
    const avgLikes = numPosts > 0 ? totalLikes / numPosts : 0;

    return {
      id: p.id,
      nickname: p.nickname,
      trust_score: p.trust_score ?? 0,
      numPosts,
      totalLikes,
      avgLikes,
    };
  });

  return (
    <div className="relative mx-2 min-h-screen overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 via-white to-gray-100 lg:mx-0">
      {/* Enhanced background effects with more layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-300/30 via-orange-200/40 to-orange-100/30 blur-3xl"></div>
      <div className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-gradient-to-r from-orange-400/40 to-orange-500/50 blur-3xl"></div>
      <div className="absolute right-1/4 bottom-1/4 h-80 w-80 animate-pulse rounded-full bg-gradient-to-l from-orange-300/30 to-orange-400/40 blur-3xl delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 transform animate-pulse rounded-full bg-gradient-to-r from-red-400/20 to-orange-500/30 blur-2xl delay-500"></div>

      {/* Enhanced glassy pastel sparkles with more variety */}
      <div className="absolute top-20 left-20 h-24 w-24 animate-pulse rounded-full bg-gradient-to-r from-orange-200/50 to-pink-200/40 blur-2xl"></div>
      <div className="absolute top-40 right-32 h-16 w-16 animate-pulse rounded-full bg-gradient-to-r from-red-200/40 to-orange-300/50 blur-xl delay-1000"></div>
      <div className="absolute bottom-32 left-40 h-32 w-32 animate-pulse rounded-full bg-gradient-to-r from-orange-300/40 to-yellow-200/45 blur-3xl delay-2000"></div>
      <div className="absolute right-20 bottom-20 h-20 w-20 animate-pulse rounded-full bg-gradient-to-r from-pink-200/35 to-orange-200/40 blur-2xl delay-500"></div>
      <div className="absolute top-1/3 left-1/5 h-12 w-12 animate-pulse rounded-full bg-gradient-to-r from-orange-100/60 to-red-100/50 blur-lg delay-1500"></div>
      <div className="absolute right-1/5 bottom-1/3 h-14 w-14 animate-pulse rounded-full bg-gradient-to-r from-yellow-200/50 to-orange-200/45 blur-xl delay-3000"></div>
      <div className="absolute top-1/2 left-1/3 h-10 w-10 animate-pulse rounded-full bg-gradient-to-r from-pink-100/55 to-orange-100/50 blur-md delay-2500"></div>
      <div className="absolute right-1/3 bottom-1/2 h-28 w-28 animate-pulse rounded-full bg-gradient-to-r from-orange-200/45 to-red-200/40 blur-2xl delay-4000"></div>

      {/* Content with relative positioning */}
      <div className="relative z-10">
        <Ranking initialData={rankings} />
      </div>
    </div>
  );
}
