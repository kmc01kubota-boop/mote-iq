import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase";
import { Scores, FACTOR_KEYS, FACTOR_LABELS } from "@/types";
import { PRICING } from "@/lib/pricing";

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

  const type = request.nextUrl.searchParams.get("type") || "attempts";

  try {
    if (type === "purchases") {
      const { data: purchases } = await supabaseAdmin
        .from("purchases")
        .select("id, attempt_id, anon_id, stripe_session_id, status, created_at")
        .eq("status", "paid")
        .order("created_at", { ascending: false });

      const rows = (purchases || []).map((p) => ({
        ID: p.id,
        診断ID: p.attempt_id,
        StripeセッションID: p.stripe_session_id,
        ステータス: p.status,
        金額: PRICING.TOTAL_PRICE,
        日時: new Date(p.created_at).toLocaleString("ja-JP"),
      }));

      return buildCSVResponse(rows, "purchases");
    }

    // デフォルト: attempts
    const { data: attempts } = await supabaseAdmin
      .from("attempts")
      .select("id, anon_id, scores, created_at")
      .not("scores", "is", null)
      .order("created_at", { ascending: false });

    const rows = (attempts || []).map((a) => {
      const scores = a.scores as Scores;
      const factorScores: Record<string, number> = {};
      for (const key of FACTOR_KEYS) {
        factorScores[FACTOR_LABELS[key]] = scores.factors[key].normalized;
      }
      return {
        ID: a.id,
        総合スコア: scores.total,
        グレード: scores.grade,
        上位パーセント: `${scores.percentile}%`,
        ...factorScores,
        日時: new Date(a.created_at).toLocaleString("ja-JP"),
      };
    });

    return buildCSVResponse(rows, "attempts");
  } catch (e) {
    console.error("Export API error:", e);
    return NextResponse.json(
      { error: "Failed to export" },
      { status: 500 }
    );
  }
}

function buildCSVResponse(
  rows: Record<string, string | number>[],
  filename: string
) {
  if (rows.length === 0) {
    return new NextResponse("No data", { status: 200 });
  }

  const headers = Object.keys(rows[0]);
  const bom = "\uFEFF";
  const csvLines = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((h) => {
          const val = String(row[h] ?? "");
          return val.includes(",") || val.includes('"') || val.includes("\n")
            ? `"${val.replace(/"/g, '""')}"`
            : val;
        })
        .join(",")
    ),
  ];

  const csv = bom + csvLines.join("\n");
  const date = new Date().toISOString().split("T")[0];

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=moteiq_${filename}_${date}.csv`,
    },
  });
}
