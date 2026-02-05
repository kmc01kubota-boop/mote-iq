import { notFound, redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
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

export async function generateMetadata() {
  return { title: "詳細レポート｜モテIQ" };
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;

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
  const { data: purchase } = await supabase
    .from("purchases")
    .select("status")
    .eq("attempt_id", attemptId)
    .eq("status", "paid")
    .single();

  if (!purchase) {
    redirect(`/result/${attemptId}`);
  }

  const scores = attempt.scores as Scores;

  const sorted = [...FACTOR_KEYS].sort(
    (a, b) => scores.factors[b].normalized - scores.factors[a].normalized
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
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
