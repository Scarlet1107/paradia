// app/api/profile/create/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { moderateNickname } from "@/lib/openai";

export async function POST(req: Request) {
  const { nickname } = await req.json();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { ok: false, error: "ログインしてください" },
      { status: 401 },
    );
  }

  // モデレーションチェック
  const flagged = await moderateNickname(nickname);
  if (flagged) {
    // trust_score を直接更新
    const { data: profile, error: fetchErr } = await supabase
      .from("profiles")
      .select("trust_score")
      .eq("id", user.id)
      .single();

    if (fetchErr || profile == null) {
      console.error("Failed to fetch trust_score:", fetchErr);
    } else {
      const newScore = profile.trust_score - 5; // 信頼度を5減少
      const { error: updateErr } = await supabase
        .from("profiles")
        .update({ trust_score: newScore })
        .eq("id", user.id);

      if (updateErr) {
        console.error("Failed to decrement trust_score:", updateErr);
      }

      const { error: notificationError } = await supabase
        .from("notifications")
        .insert({
          recipient_id: user.id,
          content:
            "不適切なニックネームが検出されました。信頼度が5減少しました。",
        });
      if (notificationError) {
        console.error("Failed to create notification:", notificationError);
      }
    }

    return NextResponse.json({ ok: false, error: "不適切なニックネームです" });
  }

  // プロフィール更新
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ nickname })
    .eq("id", user.id);

  if (updateError) {
    return NextResponse.json(
      { ok: false, error: updateError.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
