import { notFound, redirect } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { Scores, FACTOR_KEYS, FACTOR_LABELS, FactorKey } from "@/types";
import {
  factorDetails,
  mineActions,
  sevenDayPlan,
  lineTemplates,
  getGradeComment,
} from "@/data/report-content";
import RadarChart from "@/components/result/RadarChart";
import ScoreDisplay from "@/components/result/ScoreDisplay";
import FactorBar from "@/components/result/FactorBar";
import ReportTracker from "@/components/result/ReportTracker";
import { PRICING } from "@/lib/pricing";

export async function generateMetadata() {
  return { title: "詳細レポート｜モテIQ" };
}

export default async function ReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ attemptId: string }>;
  searchParams: Promise<{ session_id?: string; debug?: string }>;
}) {
  const { attemptId } = await params;
  const { session_id, debug } = await searchParams;

  // 開発環境でのデバッグモード（?debug=1 でアクセス）
  const isDebugMode = process.env.NODE_ENV === "development" && debug === "1";

  // Supabase未設定時
  if (!isSupabaseConfigured() || !supabase) {
    notFound();
  }

  // Fetch attempt
  const { data: attempt, error: attemptError } = await supabase
    .from("attempts")
    .select("*")
    .eq("id", attemptId)
    .single();

  if (attemptError || !attempt) {
    notFound();
  }

  // Check purchase
  let { data: purchase } = await supabase
    .from("purchases")
    .select("status")
    .eq("attempt_id", attemptId)
    .eq("status", "paid")
    .single();

  // Stripe Checkoutから戻ってきた場合、session_idで支払い状態を確認
  if (!purchase && session_id && isStripeConfigured() && stripe && isSupabaseAdminConfigured() && supabaseAdmin) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);

      if (session.payment_status === "paid" && session.metadata?.attempt_id === attemptId) {
        // 支払い完了：purchasesテーブルに保存
        const { error } = await supabaseAdmin.from("purchases").upsert(
          {
            attempt_id: attemptId,
            anon_id: session.metadata.anon_id || attempt.anon_id,
            stripe_session_id: session_id,
            status: "paid",
          },
          { onConflict: "stripe_session_id" }
        );

        if (!error) {
          purchase = { status: "paid" };
        }
      }
    } catch (err) {
      console.error("Failed to verify Stripe session:", err);
    }
  }

  // 購入確認（デバッグモードではスキップ）
  if (!purchase && !isDebugMode) {
    redirect(`/result/${attemptId}`);
  }

  const scores = attempt.scores as Scores;

  const sorted = [...FACTOR_KEYS].sort(
    (a, b) => scores.factors[b].normalized - scores.factors[a].normalized
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <ReportTracker attemptId={attemptId} grade={scores.grade} price={PRICING.TOTAL_PRICE} />
      <div className="text-center mb-4">
        <span className="inline-block bg-accent/10 text-accent text-xs font-bold px-3 py-1 rounded-full">
          PREMIUM REPORT
        </span>
      </div>

      {/* Score summary */}
      <ScoreDisplay
        total={scores.total}
        grade={scores.grade}
        percentile={scores.percentile}
      />

      <div className="my-8">
        <RadarChart factors={scores.factors} />
      </div>

      <div className="space-y-3 my-8">
        {FACTOR_KEYS.map((key) => (
          <FactorBar
            key={key}
            label={FACTOR_LABELS[key]}
            score={scores.factors[key].normalized}
          />
        ))}
      </div>

      {/* Grade comment */}
      <div className="bg-bg-card border border-border rounded-lg p-6 my-8">
        <h3 className="font-bold mb-2 text-accent">軍師の総評</h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          {getGradeComment(scores.grade)}
        </p>
      </div>

      {/* Factor details */}
      <section className="my-12">
        <h2 className="text-2xl font-bold mb-8 text-center">因子別 詳細解説</h2>
        <div className="space-y-8">
          {sorted.map((key, i) => {
            const detail = factorDetails[key];
            const score = scores.factors[key].normalized;
            return (
              <div key={key} className="bg-bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-accent font-bold text-lg">#{i + 1}</span>
                  <h3 className="font-bold text-lg">{detail.title}</h3>
                  <span className="ml-auto text-accent font-bold">{score}点</span>
                </div>
                <div className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
                  {detail.detail}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mine actions */}
      <section className="my-12">
        <h2 className="text-2xl font-bold mb-8 text-center">よくある地雷行動 TOP3</h2>
        <div className="space-y-6">
          {mineActions.map((action, i) => (
            <div key={i} className="bg-bg-card border border-border rounded-lg p-6">
              <div className="flex items-start gap-3">
                <span className="text-red-400 font-bold text-lg shrink-0">
                  {i + 1}.
                </span>
                <div>
                  <h3 className="font-bold mb-2">{action.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {action.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7-day plan */}
      <section className="my-12">
        <h2 className="text-2xl font-bold mb-2 text-center">7日改善プラン</h2>
        <p className="text-text-muted text-sm text-center mb-8">
          1日3分のミッションで、確実に変わる。
        </p>
        <div className="space-y-4">
          {sevenDayPlan.map((day) => (
            <div key={day.day} className="bg-bg-card border border-border rounded-lg p-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-accent text-bg-primary text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center">
                  {day.day}
                </span>
                <h3 className="font-bold">{day.title}</h3>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed pl-11">
                {day.mission}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* LINE templates */}
      <section className="my-12">
        <h2 className="text-2xl font-bold mb-2 text-center">LINEテンプレート集</h2>
        <p className="text-text-muted text-sm text-center mb-8">
          コピペで使える実戦テンプレ。自分の言葉にアレンジして使おう。
        </p>
        <div className="space-y-6">
          {lineTemplates.map((tpl, i) => (
            <div key={i} className="bg-bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-accent/10 text-accent text-xs font-bold px-2 py-0.5 rounded">
                  {tpl.label}
                </span>
              </div>
              <p className="text-text-muted text-xs mb-3">{tpl.scene}</p>
              <div className="bg-bg-secondary rounded p-4 mb-3">
                <p className="text-text-primary text-sm">{tpl.template}</p>
              </div>
              <p className="text-text-muted text-xs leading-relaxed">
                💡 {tpl.point}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <div className="border-t border-border pt-8 mt-12 text-center">
        <p className="text-xs text-text-muted">
          ※ 本レポートは娯楽目的のコンテンツです。医学的・心理学的な助言ではありません。
        </p>
        <p className="text-xs text-text-muted mt-1">
          ※ 年齢差のある関係や金銭が関わる関係において、違法行為を助長する意図は一切ありません。
          健全で安全な距離感を保つことを推奨します。
        </p>
      </div>
    </div>
  );
}
