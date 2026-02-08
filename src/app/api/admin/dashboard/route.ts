import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase";
import { PRICING } from "@/lib/pricing";
import { Scores, FactorKey, FACTOR_KEYS } from "@/types";

const REPORT_PRICE = PRICING.TOTAL_PRICE; // 550円（税込）

// 17タイプのラベル定義
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
  // 認証チェック
  const password = request.headers.get("x-admin-password");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || password !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Supabase未設定時
  if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    );
  }

  try {
    // 7日前の日付
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString();

    // 全体の診断数
    const { count: totalAttempts } = await supabaseAdmin
      .from("attempts")
      .select("*", { count: "exact", head: true });

    // スコアがあるもの = 完了した診断
    const { count: completedAttempts } = await supabaseAdmin
      .from("attempts")
      .select("*", { count: "exact", head: true })
      .not("scores", "is", null);

    // 全体の購入数
    const { count: totalPurchases } = await supabaseAdmin
      .from("purchases")
      .select("*", { count: "exact", head: true })
      .eq("status", "paid");

    // 直近7日間の日別データ取得
    const { data: recentAttempts } = await supabaseAdmin
      .from("attempts")
      .select("created_at")
      .gte("created_at", sevenDaysAgoStr);

    const { data: recentPurchasesRaw } = await supabaseAdmin
      .from("purchases")
      .select("created_at, attempt_id")
      .eq("status", "paid")
      .gte("created_at", sevenDaysAgoStr);

    // 日別集計
    const dailyMap: Record<
      string,
      { attempts: number; purchases: number; revenue: number }
    > = {};

    // 過去7日分の日付を初期化
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("ja-JP", {
        month: "numeric",
        day: "numeric",
      });
      dailyMap[key] = { attempts: 0, purchases: 0, revenue: 0 };
    }

    // 診断数カウント
    recentAttempts?.forEach((a) => {
      const key = new Date(a.created_at).toLocaleDateString("ja-JP", {
        month: "numeric",
        day: "numeric",
      });
      if (dailyMap[key]) {
        dailyMap[key].attempts++;
      }
    });

    // 購入数カウント
    recentPurchasesRaw?.forEach((p) => {
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

    // 最新の購入リスト (10件)
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

    // CVR計算
    const cvr =
      completedAttempts && completedAttempts > 0
        ? ((totalPurchases || 0) / completedAttempts) * 100
        : 0;

    // 完了率計算
    const completionRate =
      totalAttempts && totalAttempts > 0
        ? ((completedAttempts || 0) / totalAttempts) * 100
        : 0;

    // タイプ別分布を取得
    const { data: attemptsWithScores } = await supabaseAdmin
      .from("attempts")
      .select("scores")
      .not("scores", "is", null);

    const typeCountMap: Record<string, number> = {};

    // 全17タイプを初期化
    Object.keys(TYPE_LABELS).forEach((key) => {
      typeCountMap[key] = 0;
    });

    // 各診断結果からタイプを集計
    attemptsWithScores?.forEach((attempt) => {
      const scores = attempt.scores as Scores;
      if (!scores || !scores.grade || !scores.factors) return;

      const grade = scores.grade;

      if (grade === "S" || grade === "A") {
        typeCountMap[grade] = (typeCountMap[grade] || 0) + 1;
      } else {
        // B/C/Dは最弱因子を特定
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

    // 配列形式に変換
    const typeDistribution = Object.entries(typeCountMap).map(([type, count]) => ({
      type,
      label: TYPE_LABELS[type] || type,
      count,
    }));

    return NextResponse.json({
      totalAttempts: totalAttempts || 0,
      completedAttempts: completedAttempts || 0,
      totalPurchases: totalPurchases || 0,
      totalRevenue: (totalPurchases || 0) * REPORT_PRICE,
      cvr,
      completionRate,
      dailyStats,
      recentPurchases,
      typeDistribution,
    });
  } catch (e) {
    console.error("Dashboard API error:", e);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
