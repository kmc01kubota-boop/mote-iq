"use client";

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

export default function ScoreDisplay({ total, grade, percentile }: ScoreDisplayProps) {
  return (
    <div className="text-center py-8">
      <div className="text-text-muted text-sm mb-2">あなたのモテIQ</div>
      <div className="text-7xl font-bold mb-2">
        <span className={gradeColors[grade] || "text-text-primary"}>{total}</span>
      </div>
      <div className="flex items-center justify-center gap-3">
        <span
          className={`text-3xl font-bold ${gradeColors[grade] || "text-text-primary"}`}
        >
          {grade}ランク
        </span>
        <span className="text-text-muted text-sm">上位 {percentile}%</span>
      </div>
    </div>
  );
}
