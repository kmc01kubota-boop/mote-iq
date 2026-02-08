"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { questions } from "@/data/questions";
import { getAnonId } from "@/lib/anon";

export default function QuizClient() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progress = Math.round(((currentIndex + 1) / totalQuestions) * 100);
  const isLastQuestion = currentIndex === totalQuestions - 1;

  const handleSelect = useCallback((optionIndex: number) => {
    const questionId = currentQuestion.id;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));

    // 自動で次の問題へ（最後の問題以外）
    if (!isLastQuestion) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 300);
    }
  }, [currentQuestion.id, isLastQuestion]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentIndex]);

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);

    try {
      const anonId = getAnonId();
      console.log("[QuizClient] Submitting answers:", { anonId, answerCount: Object.keys(answers).length });

      const res = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ anon_id: anonId, answers }),
      });

      const data = await res.json();
      console.log("[QuizClient] API response:", { status: res.status, data });

      if (!res.ok) {
        throw new Error(data.error || data.details || `HTTP ${res.status}`);
      }

      router.push(`/result/${data.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("[QuizClient] Submit error:", err);
      alert(`保存に失敗しました: ${message}\n\nブラウザのコンソール(F12)で詳細を確認できます。`);
      setSubmitting(false);
    }
  }

  const currentAnswer = answers[currentQuestion.id];
  const canSubmit = isLastQuestion && currentAnswer !== undefined;

  return (
    <div className="min-h-[100dvh] bg-slate-950 flex flex-col">
      {/* Progress Bar - Sticky Header */}
      <div className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800 safe-area-top">
        <div className="max-w-2xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-amber-400 font-medium">
              {totalQuestions}問中 {currentIndex + 1}問目
            </span>
            <span className="text-slate-400">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 sm:py-10">
        {/* Question Text */}
        <div className="mb-6 sm:mb-10">
          <span className="inline-block bg-amber-400/10 text-amber-400 text-xs font-bold px-3 py-1 rounded-full mb-3">
            Q{currentQuestion.id}
          </span>
          <h2 className="text-lg sm:text-2xl font-medium text-white leading-relaxed">
            {currentQuestion.text}
          </h2>
        </div>

        {/* Options - フルワイド、タップしやすいサイズ */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = currentAnswer === index;
            return (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                className={`
                  w-full text-left px-4 py-4 sm:px-6 sm:py-5 rounded-2xl border-2
                  transition-all duration-200 active:scale-[0.98]
                  min-h-[56px] touch-manipulation
                  ${isSelected
                    ? "border-amber-400 bg-amber-400/10 text-amber-400"
                    : "border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-500 active:bg-slate-800/70"
                  }
                `}
              >
                <span className="text-base sm:text-lg leading-snug">{option}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation - Fixed Bottom on Mobile */}
      <div className="sticky bottom-0 bg-slate-950/95 backdrop-blur-sm border-t border-slate-800 safe-area-bottom">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center gap-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-4 py-3 rounded-xl text-slate-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            ← 戻る
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              className="flex-1 sm:flex-none px-6 sm:px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-base sm:text-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {submitting ? "送信中..." : "結果を見る"}
            </button>
          ) : (
            currentAnswer !== undefined && (
              <span className="text-slate-500 text-sm animate-pulse">
                次へ進みます...
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
}
