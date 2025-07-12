import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import OpenAI from "openai";
import { ORDINA_COMBINED_PROMPT } from "@/config/prompt";
import { report } from "process";

const AI_RESPONSE_SCHEMA = z.object({
  explanation: z.string(),
  judgement_score: z.number().int().max(10),
  action_recommendation: z.enum(["approve", "reject", "watch"]),
  post_content: z.string(),
  report_reason: z.string(),
  post_author_name: z.string(),
});
type AIResult = z.infer<typeof AI_RESPONSE_SCHEMA>;

const AI_REQUEST_SCHEMA = z.object({
  post_content: z.string().min(1, "Content is required"),
  report_reason: z.string().min(1, "Report reason is required"),
  report_weight: z.number(),
  post_author_name: z.string().min(1, "Author name is required"),
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 信頼度スコアを0-100の範囲に制限する関数
const clampTrustScore = (score: number): number => {
  return Math.max(0, Math.min(100, Math.round(score)));
};

// レポートウェイトを0-5の範囲に正規化する関数
const normalizeReportWeight = (reportWeight: number): number => {
  // 1-100の範囲を0-5に変換
  return Math.max(0, Math.min(5, Math.round(((reportWeight - 1) * 5) / 99)));
};

const judgeReport = async (
  content: string,
  reportWeight: number,
  reportReason: string,
  postAuthorName: string,
): Promise<AIResult> => {
  // reportWeightを0-5の範囲に正規化
  const normalizedReportWeight = normalizeReportWeight(reportWeight);

  // プロンプトのプレースホルダーを実際の値に置き換え
  const systemPrompt = ORDINA_COMBINED_PROMPT.replace(
    /\{\{POST_CONTENT\}\}/g,
    content,
  )
    .replace(/\{\{REPORT_REASON\}\}/g, reportReason)
    .replace(/\{\{REPORT_WEIGHT\}\}/g, normalizedReportWeight.toString())
    .replace(/\{\{AUTHOR_NAME\}\}/g, postAuthorName);

  const aiInput = {
    post_content: content,
    report_reason: reportReason,
    report_weight: normalizedReportWeight,
    post_author_name: postAuthorName,
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
    const { postId, reason } = await request.json();

    if (!postId || !reason) {
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
        { error: "投稿が存在しません" },
        { status: 404 },
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
      console.error("報告者信頼度取得エラー:", reporterError);
      return NextResponse.json(
        {
          error: "報告者の信頼度スコア取得に失敗しました",
          details: reporterError?.message,
        },
        { status: 500 },
      );
    }

    // 投稿者の信頼度スコア取得（外部キーを使用してJOIN）
    const { data: postData, error: postError } = await supabase
      .from("posts")
      .select(
        `
        author_id,
        profiles(trust_score, nickname)
      `,
      )
      .eq("id", postId)
      .single();

    if (postError || !postData) {
      console.error("投稿データ取得エラー:", postError);
      return NextResponse.json(
        { error: "投稿が存在しません", details: postError?.message },
        { status: 404 },
      );
    }

    // profilesが配列の場合は最初の要素を取得、オブジェクトの場合はそのまま使用
    const postAuthorProfile = Array.isArray(postData.profiles)
      ? postData.profiles[0]
      : postData.profiles;

    if (!postAuthorProfile) {
      return NextResponse.json(
        { error: "投稿者が存在しません" },
        { status: 404 },
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
      console.error("既存報告取得エラー:", reportsError);
      return NextResponse.json(
        {
          error: "既存報告の取得に失敗しました",
          details: reportsError.message,
        },
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

    const postAuthorName = postAuthorProfile.nickname || "抹消済み市民";

    let aiJudgement: AIResult;
    try {
      aiJudgement = await judgeReport(
        postContent.content,
        reportWeight,
        reason,
        postAuthorName,
      );
      console.log("AI判定結果:", aiJudgement);
    } catch (aiError) {
      console.error("AI判定エラー:", aiError);
      return NextResponse.json(
        {
          error: "AI判定処理に失敗しました",
          details: aiError instanceof Error ? aiError.message : String(aiError),
        },
        { status: 500 },
      );
    }

    //報告が認められない時
    if (aiJudgement.action_recommendation === "reject") {
      const newReporterTrustScore = clampTrustScore(reporterTrustScore - 5);

      //報告者の信頼度スコア減少
      const { error: reporterUpdateError } = await supabase
        .from("profiles")
        .update({ trust_score: newReporterTrustScore })
        .eq("id", user.id);

      console.log(
        `信頼度更新 - 報告者: ${reporterTrustScore} → ${newReporterTrustScore}, 投稿者: ${postAuthorTrustScore}`,
      );

      //報告者に信頼度減少通知
      const { error: reporterNotifyError } = await supabase
        .from("notifications")
        .insert({
          recipient_id: user.id,
          content: `あなたの報告が却下されました。報告理由: ${reason.trim()} \n 不適切な報告のため、あなたの信頼度が${-5}減少しました。`,
          is_read: false,
        });

      //投稿者に信頼度増加通知
      const { error: authorNotifyError } = await supabase
        .from("notifications")
        .insert({
          recipient_id: postData.author_id,
          content: `あなたの投稿への不適切な報告が却下されました。`,
          is_read: false,
        });

      if (reporterUpdateError) {
        console.error("報告者信頼度更新エラー:", reporterUpdateError);
        return NextResponse.json(
          { error: "報告者の信頼度スコア更新に失敗しました" },
          { status: 500 },
        );
      }

      if (reporterNotifyError) {
        console.error("報告者通知エラー:", reporterNotifyError);
        // 通知エラーは処理を継続
      }

      if (authorNotifyError) {
        console.error("投稿者通知エラー:", authorNotifyError);
        // 通知エラーは処理を継続
      }

      //報告が認められた時
    } else if (aiJudgement.action_recommendation === "approve") {
      const newReporterTrustScore = clampTrustScore(reporterTrustScore + 5);

      const newAuthorTrustScore = clampTrustScore(
        postAuthorTrustScore - Math.abs(aiJudgement.judgement_score * 2),
      );

      //投稿者の信頼度スコア減少
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ trust_score: newAuthorTrustScore })
        .eq("id", postData.author_id);

      //報告者の信頼度スコア増加
      const { error: reporterupdateError } = await supabase
        .from("profiles")
        .update({ trust_score: newReporterTrustScore })
        .eq("id", user.id);

      console.log(
        `信頼度更新 - 投稿者: ${postAuthorTrustScore} → ${newAuthorTrustScore}, 報告者: ${reporterTrustScore} → ${newReporterTrustScore}`,
      );

      //不適切なポストを改変
      const { error: postUpdateError } = await supabase
        .from("posts")
        .update({ content: aiJudgement.post_content })
        .eq("id", postId);

      //投稿者に信頼度減少通知
      const { error: authorNotifyError } = await supabase
        .from("notifications")
        .insert({
          recipient_id: postData.author_id,
          content: `あなたの投稿が報告されました。報告理由: ${reason.trim()} \n あなたの信頼度が${-aiJudgement.judgement_score * 2} \n あなたの投稿または、名前が変更されます`,
          is_read: false,
        });

      //報告者に信頼度増加通知
      const { error: reporterNotifyError } = await supabase
        .from("notifications")
        .insert({
          recipient_id: user.id,
          content: `あなたの報告が受理されました。報告感謝します\n あなたの信頼度が${aiJudgement.judgement_score}`,
          is_read: false,
        });

      // 投稿者の名前を変更
      const { error: nicknameUpdateError } = await supabase
        .from("profiles")
        .update({ nickname: aiJudgement.post_author_name })
        .eq("id", postData.author_id);

      if (updateError) {
        console.error("投稿者信頼度更新エラー:", updateError);
        return NextResponse.json(
          { error: "投稿者の信頼度スコア更新に失敗しました" },
          { status: 500 },
        );
      }

      if (reporterupdateError) {
        console.error("報告者信頼度更新エラー:", reporterupdateError);
        return NextResponse.json(
          { error: "報告者の信頼度スコア更新に失敗しました" },
          { status: 500 },
        );
      }

      if (postUpdateError) {
        console.error("投稿内容更新エラー:", postUpdateError);
        return NextResponse.json(
          { error: "投稿内容の更新に失敗しました" },
          { status: 500 },
        );
      }

      if (nicknameUpdateError) {
        console.error("ニックネーム更新エラー:", nicknameUpdateError);
        return NextResponse.json(
          { error: "投稿者名の更新に失敗しました" },
          { status: 500 },
        );
      }

      if (authorNotifyError) {
        console.error("投稿者通知エラー:", authorNotifyError);
        // 通知エラーは処理を継続
      }

      if (reporterNotifyError) {
        console.error("報告者通知エラー:", reporterNotifyError);
        // 通知エラーは処理を継続
      }

      //監視対象となった時
    } else if (aiJudgement.action_recommendation === "watch") {
      //報告者と投稿者の信頼度は小幅に調整
      const newReporterTrustScore = clampTrustScore(
        reporterTrustScore + Math.abs(aiJudgement.judgement_score) / 2,
      );

      const newAuthorTrustScore = clampTrustScore(
        postAuthorTrustScore - Math.abs(aiJudgement.judgement_score) / 2,
      );

      //報告者の信頼度スコア小幅増加
      const { error: reporterUpdateError } = await supabase
        .from("profiles")
        .update({ trust_score: newReporterTrustScore })
        .eq("id", user.id);

      //投稿者の信頼度スコア小幅減少
      const { error: authorUpdateError } = await supabase
        .from("profiles")
        .update({ trust_score: newAuthorTrustScore })
        .eq("id", postData.author_id);

      console.log(
        `信頼度更新 - 報告者: ${reporterTrustScore} → ${newReporterTrustScore}, 投稿者: ${postAuthorTrustScore} → ${newAuthorTrustScore}`,
      );

      //報告者に監視開始通知
      const { error: reporterNotifyError } = await supabase
        .from("notifications")
        .insert({
          recipient_id: user.id,
          content: `あなたの報告が受理され、該当投稿を監視対象に追加しました。\n 継続的な監視を行います。`,
          is_read: false,
        });

      //投稿者に監視対象通知
      const { error: authorNotifyError } = await supabase
        .from("notifications")
        .insert({
          recipient_id: postData.author_id,
          content: `あなたの投稿が監視対象に追加されました。\n 今後の投稿にご注意ください。`,
          is_read: false,
        });

      if (reporterUpdateError) {
        console.error("報告者信頼度更新エラー:", reporterUpdateError);
        return NextResponse.json(
          { error: "報告者の信頼度スコア更新に失敗しました" },
          { status: 500 },
        );
      }

      if (authorUpdateError) {
        console.error("投稿者信頼度更新エラー:", authorUpdateError);
        return NextResponse.json(
          { error: "投稿者の信頼度スコア更新に失敗しました" },
          { status: 500 },
        );
      }

      if (reporterNotifyError) {
        console.error("報告者通知エラー:", reporterNotifyError);
        // 通知エラーは処理を継続
      }

      if (authorNotifyError) {
        console.error("投稿者通知エラー:", authorNotifyError);
        // 通知エラーは処理を継続
      }
    }

    // 報告を保存
    const { data: report, error: insertError } = await supabase
      .from("reports")
      .insert({
        post_id: postId,
        user_id: user.id,
        reasons: reason.trim(),
        explanation: aiJudgement.explanation,
        recommendation: aiJudgement.action_recommendation,
      })
      .select()
      .single();

    if (insertError) {
      console.error("報告保存エラー:", insertError);
      return NextResponse.json(
        { error: "報告の保存に失敗しました", details: insertError.message },
        { status: 500 },
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 10000));

    return NextResponse.json({
      action_recommendation: aiJudgement.action_recommendation,
      explanation: aiJudgement.explanation,
      judgement_score: Math.abs(aiJudgement.judgement_score),
    });
  } catch (error) {
    console.error("報告API エラー:", error);

    // エラーの詳細を特定
    if (error instanceof Error) {
      if (error.message.includes("AI判定")) {
        return NextResponse.json(
          { error: "AI判定に失敗しました", details: error.message },
          { status: 500 },
        );
      } else if (error.message.includes("データベース")) {
        return NextResponse.json(
          { error: "データベースエラーが発生しました", details: error.message },
          { status: 500 },
        );
      } else if (error.message.includes("認証")) {
        return NextResponse.json(
          { error: "認証エラーが発生しました", details: error.message },
          { status: 401 },
        );
      } else {
        return NextResponse.json(
          { error: "予期しないエラーが発生しました", details: error.message },
          { status: 500 },
        );
      }
    } else {
      return NextResponse.json(
        { error: "内部サーバーエラー", details: String(error) },
        { status: 500 },
      );
    }
  }
}
