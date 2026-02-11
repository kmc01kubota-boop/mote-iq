import { notFound } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Scores, FACTOR_KEYS, FACTOR_LABELS } from "@/types";
import { getFactorComment, getGradeComment, getTypeLabel } from "@/data/report-content";
import RadarChart from "@/components/result/RadarChart";
import ScoreDisplay from "@/components/result/ScoreDisplay";
import FactorBar from "@/components/result/FactorBar";
import PaymentCTA from "@/components/result/PaymentCTA";
import ShareButtons from "@/components/result/ShareButtons";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}): Promise<Metadata> {
  const { attemptId } = await params;

  if (!isSupabaseConfigured() || !supabase) {
    return { title: "診断結果｜モテIQ" };
  }

  const { data: attempt } = await supabase
    .from("attempts")
    .select("scores")
    .eq("id", attemptId)
    .single();

  if (!attempt) {
    return { title: "診断結果｜モテIQ" };
  }

  const scores = attempt.scores as Scores;
  const sorted = [...FACTOR_KEYS].sort(
    (a, b) => scores.factors[b].normalized - scores.factors[a].normalized
  );
  const weakest = sorted[sorted.length - 1];
  const typeInfo = getTypeLabel(scores.grade, weakest);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://mote-iq.com";
  const ogParams = new URLSearchParams({
    title: typeInfo.title,
    subtitle: typeInfo.subtitle,
    score: String(scores.total),
    grade: scores.grade,
    weakest,
  });

  const title = `${typeInfo.title}｜モテIQ診断結果`;
  const description = `モテIQスコア ${scores.total}/100（${scores.grade}ランク）— ${typeInfo.subtitle}。5つの因子であなたのモテ力を徹底分析。`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${baseUrl}/result/${attemptId}`,
      siteName: "モテIQ",
      images: [
        {
          url: `${baseUrl}/api/og?${ogParams.toString()}`,
          width: 1200,
          height: 630,
          alt: `${typeInfo.title} - モテIQ診断結果`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/api/og?${ogParams.toString()}`],
    },
  };
}

export default async function ResultPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;

  // Supabase未設定時
  if (!isSupabaseConfigured() || !supabase) {
    notFound();
  }

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

  // タイプ診断
  const typeInfo = getTypeLabel(scores.grade, weakest);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* ========== 無料ゾーン ========== */}
      <div className="mb-8">
        <span className="inline-block bg-accent/10 text-accent text-xs font-bold px-3 py-1 rounded-full mb-4">
          FREE
        </span>
      </div>

      {/* Score */}
      <ScoreDisplay
        total={scores.total}
        grade={scores.grade}
        percentile={scores.percentile}
      />

      {/* Type Label */}
      <div className="text-center my-6 sm:my-8 py-6 sm:py-8 bg-gradient-to-b from-accent/10 via-accent/5 to-transparent rounded-2xl border border-accent/20">
        <p className="text-text-muted text-sm mb-2">あなたのタイプは...</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
          {typeInfo.title}
        </h2>
        <p className="text-accent-dark text-sm sm:text-base font-medium">
          {typeInfo.subtitle}
        </p>
      </div>

      {/* Share Buttons */}
      <ShareButtons
        url={`${process.env.NEXT_PUBLIC_BASE_URL || "https://mote-iq.com"}/result/${attemptId}`}
        title={typeInfo.title}
        score={scores.total}
        grade={scores.grade}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 my-6 sm:my-8">
        <div className="bg-bg-card border border-border rounded-2xl p-4 sm:p-5">
          <div className="text-accent text-sm font-bold mb-1">最強因子</div>
          <div className="font-bold text-base">{FACTOR_LABELS[strongest]}</div>
          <div className="text-text-muted text-sm mt-1 leading-relaxed">
            {getFactorComment(strongest, scores.factors[strongest].normalized)}
          </div>
        </div>
        <div className="bg-bg-card border border-border rounded-2xl p-4 sm:p-5">
          <div className="text-text-muted text-sm font-bold mb-1">要改善因子</div>
          <div className="font-bold text-base">{FACTOR_LABELS[weakest]}</div>
          <div className="text-text-muted text-sm mt-1 leading-relaxed">
            {getFactorComment(weakest, scores.factors[weakest].normalized)}
          </div>
        </div>
      </div>

      {/* Free comment */}
      <div className="bg-bg-card border border-border rounded-2xl p-5 sm:p-6 my-6 sm:my-8">
        <h3 className="font-bold mb-2 text-base">軍師の所見</h3>
        <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
          {getGradeComment(scores.grade)}
        </p>
      </div>

      {/* ========== 有料ゾーン ========== */}
      <div className="border-t border-border pt-8 mt-12">
        <div className="text-center mb-6">
          <span className="inline-block bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">
            PREMIUM
          </span>
          <p className="text-text-muted text-sm mt-2">
            以下のコンテンツは有料レポートで解放されます
          </p>
        </div>

        {/* Locked content list */}
        <div className="bg-bg-secondary border border-border rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
          <ul className="space-y-3 sm:space-y-4">
            <li className="flex items-start gap-3">
              <span className="text-accent mt-0.5">🔒</span>
              <div>
                <div className="font-medium text-text-primary">因子別 詳細解説</div>
                <div className="text-text-muted text-sm">5因子それぞれの深掘り分析と改善ポイント</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-0.5">🔒</span>
              <div>
                <div className="font-medium text-text-primary">よくある地雷行動 TOP3</div>
                <div className="text-text-muted text-sm">無意識にやりがちなNG行動と回避法</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-0.5">🔒</span>
              <div>
                <div className="font-medium text-text-primary">7日改善プラン</div>
                <div className="text-text-muted text-sm">1日3分で実践できるステップバイステップ</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-0.5">🔒</span>
              <div>
                <div className="font-medium text-text-primary">LINEテンプレート集</div>
                <div className="text-text-muted text-sm">コピペで使える実戦テンプレ</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-0.5">🔒</span>
              <div>
                <div className="font-medium text-text-primary">ファッション提案</div>
                <div className="text-text-muted text-sm">あなたのタイプに合ったスタイリング指南</div>
              </div>
            </li>
          </ul>
        </div>

        {/* Payment CTA */}
        <PaymentCTA attemptId={attemptId} />
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-text-muted text-center mt-8">
        ※ 本診断は娯楽目的です。医学的・心理学的な診断ではありません。
      </p>
    </div>
  );
}
