"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { questions } from "@/data/questions";
import { getAnonId } from "@/lib/anon";
import ProgressBar from "@/components/ui/ProgressBar";

const QUESTIONS_PER_PAGE = 5;
const TOTAL_PAGES = Math.ceil(questions.length / QUESTIONS_PER_PAGE);

export default function QuizClient() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);

  const pageQuestions = questions.slice(
    page * QUESTIONS_PER_PAGE,
    (page + 1) * QUESTIONS_PER_PAGE
  );

  const allPageAnswered = pageQuestions.every((q) => answers[q.id] !== undefined);
  const answeredCount = Object.keys(answers).length;

  function handleSelect(questionId: number, optionIndex: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  }

  function handleNext() {
    if (page < TOTAL_PAGES - 1) {
      setPage((p) => p + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handlePrev() {
    if (page > 0) {
      setPage((p) => p - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);

    try {
      const anonId = getAnonId();
      const res = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ anon_id: anonId, answers }),
      });

      if (!res.ok) throw new Error("Failed to save");

      const { id } = await res.json();
      router.push(`/result/${id}`);
    } catch {
      alert("保存に失敗しました。もう一度お試しください。");
      setSubmitting(false);
    }
  }

  const isLastPage = page === TOTAL_PAGES - 1;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <ProgressBar current={answeredCount} total={questions.length} />

      <div className="mt-8 space-y-8">
        {pageQuestions.map((q, qi) => (
          <div key={q.id} className="bg-bg-card border border-border rounded-lg p-6">
            <div className="flex gap-3 mb-4">
              <span className="text-accent font-bold text-sm shrink-0">
                Q{q.id}
              </span>
              <p className="text-text-primary">{q.text}</p>
            </div>
            <div className="grid gap-2">
              {q.options.map((opt, oi) => (
                <button
                  key={oi}
                  onClick={() => handleSelect(q.id, oi)}
                  className={`w-full text-left px-4 py-3 rounded border transition-colors text-sm ${
                    answers[q.id] === oi
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border hover:border-text-muted text-text-secondary"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-8 gap-4">
        <button
          onClick={handlePrev}
          disabled={page === 0}
          className="px-6 py-3 rounded border border-border text-text-muted hover:text-text-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          前へ
        </button>

        {isLastPage ? (
          <button
            onClick={handleSubmit}
            disabled={!allPageAnswered || answeredCount < questions.length || submitting}
            className="px-8 py-3 rounded bg-accent hover:bg-accent-light text-bg-primary font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? "送信中..." : "診断結果を見る"}
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!allPageAnswered}
            className="px-8 py-3 rounded bg-accent hover:bg-accent-light text-bg-primary font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            次へ
          </button>
        )}
      </div>
    </div>
  );
}
