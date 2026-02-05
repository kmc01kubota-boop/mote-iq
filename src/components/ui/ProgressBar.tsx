"use client";

export default function ProgressBar({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-text-muted mb-1">
        <span>
          {current} / {total}問
        </span>
        <span>{pct}%</span>
      </div>
      <div className="w-full h-2 bg-bg-card rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
