import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase";
import { Scores, FACTOR_KEYS } from "@/types";
import { getQuizConfig, DEFAULT_QUIZ_ID, QUIZ_CONFIGS } from "@/config/quizzes";

const TYPE_LABELS: Record<string, string> = {
  S: "静かなる支配者",
  A: "完成間近の策士",
  B_cleanliness: "磨けば光る原石",
  B_conversation: "独演会の帝王",
  B_money: "センスなき散財家",
  B_distance: "距離感バグ男",
  B_sexAppeal: "無害な空気",
  C_cleanliness: "生活感ダダ漏れおじさん",
  C_conversation: "聞く耳を持たない男",
  C_money: "夢を見せられない男",
  C_distance: "無自覚ストーカー予備軍",
  C_sexAppeal: "枯れた中年の入口",
  D_cleanliness: "生理的に無理判定の男",
  D_conversation: "会話ドロボー",
  D_money: "器の小ささ露呈男",
  D_distance: "ブロック確定男",
  D_sexAppeal: "存在感ゼロの透明人間",
};

export async function GET(request: NextRequest) {
  const password = request.headers.get("x-admin-password");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || password !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    );
  }

  try {
    // パラメータ取得
    const period = request.nextUrl.searchParams.get("period") || "7";
    const quizId = request.nextUrl.searchParams.get("quiz_id") || "all";
    const days = period === "all" ? null : parseInt(period, 10);

    let periodStart: string | null = null;
    if (days) {
      const d = new Date();
      d.setDate(d.getDate() - days);
      periodStart = d.toISOString();
    }

    // quiz_id フィルタを適用するヘルパー
    const applyQuizFilter = <T extends { eq: (col: string, val: string) => T }>(
      query: T
    ): T => {
      if (quizId !== "all") {
        return query.eq("quiz_id", quizId);
      }
      return query;
    };

    // 選択中の診断の価格を取得
    const quizConfig = getQuizConfig(quizId);
    const reportPrice = quizConfig?.reportPrice ?? 550;

    // === 全期間の累計（KPIヘッダー用）===
    let totalAttemptsQuery = supabaseAdmin
      .from("attempts")
      .select("*", { count: "exact", head: true });
    if (quizId !== "all") totalAttemptsQuery = totalAttemptsQuery.eq("quiz_id", quizId);
    const { count: totalAttemptsAll } = await totalAttemptsQuery;

    let completedAttemptsQuery = supabaseAdmin
      .from("attempts")
      .select("*", { count: "exact", head: true })
      .not("scores", "is", null);
    if (quizId !== "all") completedAttemptsQuery = completedAttemptsQuery.eq("quiz_id", quizId);
    const { count: completedAttemptsAll } = await completedAttemptsQuery;

    let totalPurchasesQuery = supabaseAdmin
      .from("purchases")
      .select("*", { count: "exact", head: true })
      .eq("status", "paid");
    if (quizId !== "all") totalPurchasesQuery = totalPurchasesQuery.eq("quiz_id", quizId);
    const { count: totalPurchasesAll } = await totalPurchasesQuery;

    // === 期間内のデータ ===
    let attemptQuery = supabaseAdmin
      .from("attempts")
      .select("created_at, scores");
    if (quizId !== "all") attemptQuery = attemptQuery.eq("quiz_id", quizId);
    if (periodStart) attemptQuery = attemptQuery.gte("created_at", periodStart);
    const { data: periodAttempts } = await attemptQuery;

    let purchaseQuery = supabaseAdmin
      .from("purchases")
      .select("created_at, attempt_id")
      .eq("status", "paid");
    if (quizId !== "all") purchaseQuery = purchaseQuery.eq("quiz_id", quizId);
    if (periodStart) purchaseQuery = purchaseQuery.gte("created_at", periodStart);
    const { data: periodPurchases } = await purchaseQuery;

    // === 日別集計 ===
    const dailyMap: Record<
      string,
      { attempts: number; purchases: number; revenue: number }
    > = {};

    const chartDays = days || 30;
    for (let i = chartDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("ja-JP", {
        month: "numeric",
        day: "numeric",
      });
      dailyMap[key] = { attempts: 0, purchases: 0, revenue: 0 };
    }

    periodAttempts?.forEach((a) => {
      const key = new Date(a.created_at).toLocaleDateString("ja-JP", {
        month: "numeric",
        day: "numeric",
      });
      if (dailyMap[key]) {
        dailyMap[key].attempts++;
      }
    });

    // "all" の場合、各 purchase の quiz_id に応じた価格で集計
    periodPurchases?.forEach((p) => {
      const key = new Date(p.created_at).toLocaleDateString("ja-JP", {
        month: "numeric",
        day: "numeric",
      });
      if (dailyMap[key]) {
        dailyMap[key].purchases++;
        dailyMap[key].revenue += reportPrice;
      }
    });

    const dailyStats = Object.entries(dailyMap).map(([date, stats]) => ({
      date,
      ...stats,
    }));

    // === 直近購入リスト (10件) ===
    let recentQuery = supabaseAdmin
      .from("purchases")
      .select("id, created_at, attempt_id, quiz_id")
      .eq("status", "paid")
      .order("created_at", { ascending: false })
      .limit(10);
    if (quizId !== "all") recentQuery = recentQuery.eq("quiz_id", quizId);
    const { data: latestPurchases } = await recentQuery;

    const recentPurchases = (latestPurchases || []).map((p) => {
      const pConfig = getQuizConfig(p.quiz_id);
      return {
        ...p,
        amount: pConfig?.reportPrice ?? reportPrice,
        quizName: pConfig?.name ?? p.quiz_id,
      };
    });

    // === CVR / 完了率 ===
    const periodCompleted =
      periodAttempts?.filter((a) => a.scores !== null).length || 0;
    const periodPurchaseCount = periodPurchases?.length || 0;

    const cvr =
      periodCompleted > 0
        ? (periodPurchaseCount / periodCompleted) * 100
        : 0;

    const completionRate =
      (periodAttempts?.length || 0) > 0
        ? (periodCompleted / (periodAttempts?.length || 1)) * 100
        : 0;

    // === タイプ別分布 ===
    let typeQuery = supabaseAdmin
      .from("attempts")
      .select("scores")
      .not("scores", "is", null);
    if (quizId !== "all") typeQuery = typeQuery.eq("quiz_id", quizId);
    const { data: attemptsWithScores } = await typeQuery;

    const typeCountMap: Record<string, number> = {};
    Object.keys(TYPE_LABELS).forEach((key) => {
      typeCountMap[key] = 0;
    });

    attemptsWithScores?.forEach((attempt) => {
      const scores = attempt.scores as Scores;
      if (!scores || !scores.grade || !scores.factors) return;

      const grade = scores.grade;
      if (grade === "S" || grade === "A") {
        typeCountMap[grade] = (typeCountMap[grade] || 0) + 1;
      } else {
        const sorted = [...FACTOR_KEYS].sort(
          (a, b) =>
            scores.factors[a].normalized - scores.factors[b].normalized
        );
        const weakest = sorted[0];
        const key = `${grade}_${weakest}`;
        if (typeCountMap[key] !== undefined) {
          typeCountMap[key]++;
        }
      }
    });

    const typeDistribution = Object.entries(typeCountMap).map(
      ([type, count]) => ({
        type,
        label: TYPE_LABELS[type] || type,
        count,
      })
    );

    // === スコア分布（ヒストグラム用）===
    // 選択中の診断の scoreBuckets を使用、なければデフォルト
    const activeBuckets =
      quizConfig?.scoreBuckets ??
      getQuizConfig(DEFAULT_QUIZ_ID)!.scoreBuckets;

    const scoreDistribution = activeBuckets.map((b) => ({
      range: b.range,
      label: b.label,
      color: b.color,
      count: 0,
    }));

    attemptsWithScores?.forEach((attempt) => {
      const scores = attempt.scores as Scores;
      if (!scores || typeof scores.total !== "number") return;
      for (const bucket of scoreDistribution) {
        const config = activeBuckets.find((ab) => ab.range === bucket.range);
        if (config && scores.total >= config.min && scores.total <= config.max) {
          bucket.count++;
          break;
        }
      }
    });

    // === ファネルデータ ===
    const funnel = {
      started: totalAttemptsAll || 0,
      completed: completedAttemptsAll || 0,
      purchased: totalPurchasesAll || 0,
    };

    // === 売上計算 ===
    let totalRevenue: number;
    if (quizId === "all") {
      // 全診断の場合、各診断の price × 件数を合算
      totalRevenue = 0;
      for (const qc of QUIZ_CONFIGS) {
        if (!qc.isPaid) continue;
        const { count } = await supabaseAdmin
          .from("purchases")
          .select("*", { count: "exact", head: true })
          .eq("status", "paid")
          .eq("quiz_id", qc.id);
        totalRevenue += (count || 0) * qc.reportPrice;
      }
    } else {
      totalRevenue = (totalPurchasesAll || 0) * reportPrice;
    }

    return NextResponse.json({
      totalAttempts: totalAttemptsAll || 0,
      completedAttempts: completedAttemptsAll || 0,
      totalPurchases: totalPurchasesAll || 0,
      totalRevenue,
      cvr,
      completionRate,
      dailyStats,
      recentPurchases,
      typeDistribution,
      scoreDistribution,
      funnel,
      period,
      quizId,
    });
  } catch (e) {
    console.error("Dashboard API error:", e);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
