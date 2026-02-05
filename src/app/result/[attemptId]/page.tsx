import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Scores, FACTOR_KEYS, FACTOR_LABELS } from "@/types";
import { getFactorComment, getGradeComment } from "@/data/report-content";
import RadarChart from "@/components/result/RadarChart";
import ScoreDisplay from "@/components/result/ScoreDisplay";
import FactorBar from "@/components/result/FactorBar";
import PaymentCTA from "@/components/result/PaymentCTA";

export async function generateMetadata({ params }: { params: Promise<{ attemptId: string }> }) {
  return { title: "診断結果｜モテIQ" };
}

export default async function ResultPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;

  const { data: attempt, error } = await supabase
    .from("attempts")
    .select("*")
    .eq("id", attemptId)
    .single();

  if (error || !attempt) {
    notFound();
  }

  const scores = attempt.scores as Scores;

  // Find strongest and weakest factors
  const sorted = [...FACTOR_KEYS].sort(
    (a, b) => scores.factors[b].normalized - scores.factors[a].normalized
  );
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Score */}
      <ScoreDisplay
        total={scores.total}
        grade={scores.grade}
        percentile={scores.percentile}
      />

      {/* Radar Chart */}
      <div className="my-8">
        <RadarChart factors={scores.factors} />
      </div>

      {/* Factor Bars */}
      <div className="space-y-3 my-8">
        {FACTOR_KEYS.map((key) => (
          <FactorBar
            key={key}
            label={FACTOR_LABELS[key]}
            score={scores.factors[key].normalized}
          />
        ))}
      </div>

      {/* Strength / Weakness */}
      <div className="grid md:grid-cols-2 gap-4 my-8">
        <div className="bg-bg-card border border-border rounded-lg p-5">
          <div className="text-accent text-sm font-bold mb-1">最強因子</div>
          <div className="font-bold">{FACTOR_LABELS[strongest]}</div>
          <div className="text-text-muted text-sm mt-1">
            {getFactorComment(strongest, scores.factors[strongest].normalized)}
          </div>
        </div>
        <div className="bg-bg-card border border-border rounded-lg p-5">
          <div className="text-text-muted text-sm font-bold mb-1">要改善因子</div>
          <div className="font-bold">{FACTOR_LABELS[weakest]}</div>
          <div className="text-text-muted text-sm mt-1">
            {getFactorComment(weakest, scores.factors[weakest].normalized)}
          </div>
        </div>
      </div>

      {/* Free comment */}
      <div className="bg-bg-card border border-border rounded-lg p-6 my-8">
        <h3 className="font-bold mb-2">軍師の所見</h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          {getGradeComment(scores.grade)}
        </p>
      </div>

      {/* Teaser: Blurred paid content */}
      <div className="relative my-8">
        <div className="blur-teaser">
          <div className="bg-bg-card border border-border rounded-lg p-6 space-y-4">
            <h3 className="font-bold">因子別 詳細解説</h3>
            <p className="text-text-secondary text-sm">
              清潔感とは「清潔であること」ではない。相手の無意識に「この人は安全だ」と感じさせる非言語シグナルの集合体だ。爪が整っている、服にシワがない、靴が手入れされている...
            </p>
            <h3 className="font-bold">よくある地雷行動トップ3</h3>
            <p className="text-text-secondary text-sm">
              1. 食事中にスマホをテーブルに置く...
            </p>
            <h3 className="font-bold">7日改善プラン</h3>
            <p className="text-text-secondary text-sm">
              Day 1: 5点セルフチェックの習慣化...
            </p>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-bg-primary/80 backdrop-blur-sm rounded-lg px-6 py-3 border border-border">
            <span className="text-text-secondary text-sm">
              詳細は有料レポートで解放
            </span>
          </div>
        </div>
      </div>

      {/* Payment CTA */}
      <PaymentCTA attemptId={attemptId} />

      {/* Disclaimer */}
      <p className="text-xs text-text-muted text-center mt-8">
        ※ 本診断は娯楽目的です。医学的・心理学的な診断ではありません。
      </p>
    </div>
  );
}
