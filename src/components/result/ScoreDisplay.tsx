"use client";

import { useState, useEffect, useRef } from "react";

interface ScoreDisplayProps {
  total: number;
  grade: string;
  percentile: number;
}

const gradeColors: Record<string, string> = {
  S: "text-yellow-400",
  A: "text-accent",
  B: "text-green-400",
  C: "text-blue-400",
  D: "text-text-muted",
};

const gradeBgColors: Record<string, string> = {
  S: "from-yellow-400/20 to-yellow-400/5",
  A: "from-accent/20 to-accent/5",
  B: "from-green-400/20 to-green-400/5",
  C: "from-blue-400/20 to-blue-400/5",
  D: "from-gray-400/20 to-gray-400/5",
};

function useCountUp(target: number, duration: number = 1200, delay: number = 0) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    const timer = setTimeout(() => {
      const startTime = performance.now();
      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timer);
  }, [started, target, duration, delay]);

  return { count, ref, started };
}

export default function ScoreDisplay({ total, grade, percentile }: ScoreDisplayProps) {
  const { count: scoreCount, ref: scoreRef, started } = useCountUp(total, 1200, 200);
  const { count: percentCount, ref: percentRef } = useCountUp(percentile, 800, 1400);

  return (
    <div ref={scoreRef} className="text-center py-8">
      <div className="text-text-muted text-sm mb-2">あなたのモテIQ</div>

      {/* Score Number */}
      <div
        className={`text-7xl font-bold mb-2 transition-opacity duration-500 ${
          started ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className={gradeColors[grade] || "text-text-primary"}>{scoreCount}</span>
      </div>

      {/* Grade Rank */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <span
          className={`text-3xl font-bold ${gradeColors[grade] || "text-text-primary"}`}
        >
          {grade}ランク
        </span>
      </div>

      {/* Percentile Badge - animated */}
      <div ref={percentRef} className="flex justify-center">
        <div
          className={`
            inline-flex items-center gap-2 px-5 py-2.5 rounded-full
            bg-gradient-to-r ${gradeBgColors[grade] || "from-gray-400/20 to-gray-400/5"}
            border border-current/10
            transition-all duration-700 ease-out
            ${started ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"}
          `}
          style={{ transitionDelay: "1.2s" }}
        >
          <svg
            className={`w-4 h-4 ${gradeColors[grade] || "text-text-muted"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          <span className={`text-lg font-bold ${gradeColors[grade] || "text-text-muted"}`}>
            上位 {percentCount}%
          </span>
        </div>
      </div>
    </div>
  );
}
