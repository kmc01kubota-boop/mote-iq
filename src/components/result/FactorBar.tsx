"use client";

interface FactorBarProps {
  label: string;
  score: number;
}

export default function FactorBar({ label, score }: FactorBarProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-text-secondary text-sm w-32 shrink-0 truncate">{label}</span>
      <div className="flex-1 h-3 bg-bg-card rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500"
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-accent font-bold text-sm w-10 text-right">{score}</span>
    </div>
  );
}
