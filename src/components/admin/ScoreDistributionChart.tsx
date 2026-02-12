"use client";

interface ScoreDistributionData {
  range: string;
  label?: string;
  color?: string;
  count: number;
}

interface ScoreDistributionChartProps {
  data: ScoreDistributionData[];
}

// フォールバック用（API から color が来ない場合）
const FALLBACK_COLORS: Record<string, string> = {
  "0-19": "#FF3B30",
  "20-34": "#FF9500",
  "35-54": "#FFCC00",
  "55-74": "#34C759",
  "75-89": "#007AFF",
  "90-100": "#AF52DE",
};

export default function ScoreDistributionChart({
  data,
}: ScoreDistributionChartProps) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="space-y-3">
      {data.map((item) => {
        const barColor =
          item.color || FALLBACK_COLORS[item.range] || "#86868B";
        const label = item.label || item.range;

        return (
          <div key={item.range} className="flex items-center gap-3">
            <div className="w-16 text-right">
              <span className="text-xs font-bold text-[#86868B]">
                {label}
              </span>
            </div>
            <div className="w-14 text-right shrink-0">
              <span className="text-xs text-[#86868B]">{item.range}</span>
            </div>
            <div className="flex-1 h-6 bg-[#F5F5F7] rounded overflow-hidden">
              <div
                className="h-full rounded transition-all duration-500"
                style={{
                  width: `${(item.count / max) * 100}%`,
                  backgroundColor: barColor,
                  minWidth: item.count > 0 ? "4px" : "0",
                }}
              />
            </div>
            <span className="text-sm font-bold text-[#1D1D1F] w-8 text-right">
              {item.count}
            </span>
          </div>
        );
      })}
    </div>
  );
}
