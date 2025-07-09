import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import OpenAI from "openai";
import {
  ORDINA_JUDGEMENT_PROMPT,
  ORDINA_HIDDEN_SCAN_PROMPT,
} from "@/config/prompt";

const AI_RESPONSE_SCHEMA = z.object({
  explanation: z.string(),
  judgement_score: z.number().int().min(-10).max(10),
  action_recommendation: z.enum(["approve", "reject", "watch"]),
  post_content: z.string(),
  report_reason: z.string(),
});
type AIResult = z.infer<typeof AI_RESPONSE_SCHEMA>;

const AI_REQUEST_SCHEMA = z.object({
  post_content: z.string().min(1, "Content is required"),
  report_reason: z.string().min(1, "Report reason is required"),
  report_weight: z.number(),
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const judgeReport = async (
  content: string,
  reportWeight: number,
  reportReason: string,
): Promise<AIResult> => {
  const systemPrompt = `${ORDINA_JUDGEMENT_PROMPT.trim()}`;

  const aiInput = {
    post_content: content,
    report_reason: reportReason,
    report_weight: reportWeight,
  };

  const validationResult = AI_REQUEST_SCHEMA.safeParse(aiInput);
  if (!validationResult.success) {
    throw new Error(
      `AI入力データのバリデーションエラー: ${JSON.stringify(validationResult.error.format())}`,
    );
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `報告分析をお願いします：\n${JSON.stringify(aiInput, null, 2)}`,
      },
    ],
    response_format: { type: "json_object" }, // JSON形式を強制
  });

  const responseText = completion.choices[0]?.message?.content;
  if (!responseText) {
    throw new Error("AIからのレスポンスが空です");
  }
  try {
    const parsed = JSON.parse(responseText);
    const result = AI_RESPONSE_SCHEMA.safeParse(parsed);

    if (!result.success) {
      throw new Error(
        `AIレスポンスのバリデーションエラー: ${JSON.stringify(result.error.format())}`,
      );
    }

    return result.data;
  } catch (parseError) {
    throw new Error(`AIレスポンスのパース失敗: ${parseError}`);
  }
};

export async function POST(request: Request) {
  try {
    const { postId, content } = await request.json();

    if (!postId || !content) {
      return NextResponse.json(
        { error: "投稿IDと報告内容は必須です" },
        { status: 400 },
      );
    }

    // 認証チェック
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { data: postContent, error: postContentError } = await supabase
      .from("posts")
      .select("content")
      .eq("id", postId)
      .single();
    if (postContentError || !postContent) {
      return NextResponse.json(
        { error: "投稿データの取得に失敗しました" },
        { status: 500 },
      );
    }

    // 既に報告済みかチェック
    const { data: existingReport } = await supabase
      .from("reports")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", user.id)
      .single();

    if (existingReport) {
      return NextResponse.json({ error: "Already reported" }, { status: 409 });
    }

    // 報告者の信頼度スコアチェック
    const { data: reporterScore, error: reporterError } = await supabase
      .from("profiles")
      .select("trust_score")
      .eq("id", user.id)
      .single();

    if (reporterError || !reporterScore) {
      return NextResponse.json(
        { error: "報告者の信頼度スコア取得失敗" },
        { status: 500 },
      );
    }

    // 投稿者の信頼度スコア取得（外部キーを使用してJOIN）
    const { data: postData, error: postError } = await supabase
      .from("posts")
      .select(
        `
        author_id,
        profiles(trust_score)
      `,
      )
      .eq("id", postId)
      .single();

    if (postError || !postData) {
      return NextResponse.json(
        { error: "投稿データの取得失敗" },
        { status: 500 },
      );
    }

    // profilesが配列の場合は最初の要素を取得、オブジェクトの場合はそのまま使用
    const postAuthorProfile = Array.isArray(postData.profiles)
      ? postData.profiles[0]
      : postData.profiles;

    if (!postAuthorProfile) {
      return NextResponse.json(
        { error: "投稿者の信頼度スコア取得失敗" },
        { status: 500 },
      );
    }

    // 既存の報告数と報告者の信頼度スコアを一度に取得
    const { data: existingReports, error: reportsError } = await supabase
      .from("reports")
      .select(
        `
        user_id,
        profiles(trust_score)
      `,
      )
      .eq("post_id", postId);

    if (reportsError) {
      return NextResponse.json(
        { error: "既存報告の取得失敗" },
        { status: 500 },
      );
    }

    const { data: allUsersLength } = await supabase
      .from("profiles")
      .select("id");

    // 既存報告者の信頼度スコアの合計を計算
    const existingReportWeight =
      existingReports?.reduce((sum, report) => {
        // profilesが配列の場合は最初の要素を取得、オブジェクトの場合はそのまま使用
        const profile = Array.isArray(report.profiles)
          ? report.profiles[0]
          : report.profiles;
        const trustScore = profile?.trust_score || 0;
        return sum + trustScore;
      }, 0) /
        (allUsersLength?.length || 1) /
        3 || 0;

    // 信頼度スコアの計算
    const reporterTrustScore = reporterScore.trust_score;
    const postAuthorTrustScore = postAuthorProfile.trust_score;

    // 報告の重みを計算（報告者の信頼度 - 投稿者の信頼度）
    const reportWeight = reporterTrustScore - postAuthorTrustScore;

    const totalReportWeight = existingReportWeight + Math.max(0, reportWeight);

    // AI判定を実行
    try {
      const aiJudgement = await judgeReport(
        content,
        reportWeight,
        postContent.content,
      );
      console.log("AI判定結果:", aiJudgement);
    } catch (aiError) {
      console.error("AI判定エラー:", aiError);
      // AI判定が失敗しても報告は保存する
    }

    // 報告を保存
    const { data: report, error: insertError } = await supabase
      .from("reports")
      .insert({
        post_id: postId,
        user_id: user.id,
        content: content.trim(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("報告保存エラー:", insertError);
      return NextResponse.json(
        { error: "報告の保存に失敗しました" },
        { status: 500 },
      );
    }

    // 報告処理結果をログ出力
    console.log(`報告処理完了: 
      報告者ID: ${user.id}, 
      報告者信頼度: ${reporterTrustScore}, 
      投稿者信頼度: ${postAuthorTrustScore}, 
      報告重み: ${reportWeight}, 
      累積報告重み: ${totalReportWeight}`);

    return NextResponse.json({
      success: true,
      report,
      reportWeight,
      totalReportWeight,
      reporterTrustScore,
      postAuthorTrustScore,
    });
  } catch (error) {
    console.error("報告API エラー:", error);
    return NextResponse.json({ error: "内部サーバーエラー" }, { status: 500 });
  }
}
