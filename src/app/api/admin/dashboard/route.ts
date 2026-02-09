import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase";
import { PRICING } from "@/lib/pricing";
import { Scores, FACTOR_KEYS } from "@/types";

const REPORT_PRICE = PRICING.TOTAL_PRICE;

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
    // 期間パラメータ取得 (7 / 30 / all)
    const period = request.nextUrl.searchParams.get("period") || "7";
    const days = period === "all" ? null : parseInt(period, 10);

    let periodStart: string | null = null;
    if (days) {
      const d = new Date();
      d.setDate(d.getDate() - days);
      periodStart = d.toISOString();
    }

    // === 全期間の累計（KPIヘッダー用）===
    const { count: totalAttemptsAll } = await supabaseAdmin
      .from("attempts")
      .select("*", { count: "exact", head: true });

    const { count: completedAttemptsAll } = await supabaseAdmin
      .from("attempts")
      .select("*", { count: "exact", head: true })
      .not("scores", "is", null);

    const { count: totalPurchasesAll } = await supabaseAdmin
      .from("purchases")
      .select("*", { count: "exact", head: true })
      .eq("status", "paid");

    // === 期間内のデータ ===
    let attemptQuery = supabaseAdmin
      .from("attempts")
      .select("created_at, scores");
    if (periodStart) {
      attemptQuery = attemptQuery.gte("created_at", periodStart);
    }
    const { data: periodAttempts } = await attemptQuery;

    let purchaseQuery = supabaseAdmin
      .from("purchases")
      .select("created_at, attempt_id")
      .eq("status", "paid");
    if (periodStart) {
      purchaseQuery = purchaseQuery.gte("created_at", periodStart);
    }
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

    periodPurchases?.forEach((p) => {
      const key = new Date(p.created_at).toLocaleDateString("ja-JP", {
        month: "numeric",
        day: "numeric",
      });
      if (dailyMap[key]) {
        dailyMap[key].purchases++;
        dailyMap[key].revenue += REPORT_PRICE;
      }
    });

    const dailyStats = Object.entries(dailyMap).map(([date, stats]) => ({
      date,
      ...stats,
    }));

    // === 直近購入リスト (10件) ===
    const { data: latestPurchases } = await supabaseAdmin
      .from("purchases")
      .select("id, created_at, attempt_id")
      .eq("status", "paid")
      .order("created_at", { ascending: false })
      .limit(10);

    const recentPurchases = (latestPurchases || []).map((p) => ({
      ...p,
      amount: REPORT_PRICE,
    }));

    // === CVR / 完了率 ===
    const periodCompleted = periodAttempts?.filter(
      (a) => a.scores !== null
    ).length || 0;
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
    const { data: attemptsWithScores } = await supabaseAdmin
      .from("attempts")
      .select("scores")
      .not("scores", "is", null);

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
          (a, b) => scores.factors[a].normalized - scores.factors[b].normalized
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
    const scoreDistribution: { range: string; count: number }[] = [];
    const buckets = [
      { range: "0-19", min: 0, max: 19 },
      { range: "20-34", min: 20, max: 34 },
      { range: "35-54", min: 35, max: 54 },
      { range: "55-74", min: 55, max: 74 },
      { range: "75-89", min: 75, max: 89 },
      { range: "90-100", min: 90, max: 100 },
    ];
    const bucketCounts = buckets.map(() => 0);

    attemptsWithScores?.forEach((attempt) => {
      const scores = attempt.scores as Scores;
      if (!scores || typeof scores.total !== "number") return;
      for (let i = 0; i < buckets.length; i++) {
        if (scores.total >= buckets[i].min && scores.total <= buckets[i].max) {
          bucketCounts[i]++;
          break;
        }
      }
    });

    buckets.forEach((b, i) => {
      scoreDistribution.push({ range: b.range, count: bucketCounts[i] });
    });

    // === ファネルデータ ===
    const funnel = {
      started: totalAttemptsAll || 0,
      completed: completedAttemptsAll || 0,
      purchased: totalPurchasesAll || 0,
    };

    return NextResponse.json({
      totalAttempts: totalAttemptsAll || 0,
      completedAttempts: completedAttemptsAll || 0,
      totalPurchases: totalPurchasesAll || 0,
      totalRevenue: (totalPurchasesAll || 0) * REPORT_PRICE,
      cvr,
      completionRate,
      dailyStats,
      recentPurchases,
      typeDistribution,
      scoreDistribution,
      funnel,
      period,
    });
  } catch (e) {
    console.error("Dashboard API error:", e);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
