"use client";

interface FunnelData {
  started: number;
  completed: number;
  purchased: number;
}

interface FunnelChartProps {
  data: FunnelData;
}

export default function FunnelChart({ data }: FunnelChartProps) {
  const max = Math.max(data.started, 1);

  const steps = [
    {
      label: "診断開始",
      value: data.started,
      pct: 100,
      color: "#007AFF",
    },
    {
      label: "診断完了",
      value: data.completed,
      pct: Math.round((data.completed / max) * 100),
      color: "#34C759",
    },
    {
      label: "決済完了",
      value: data.purchased,
      pct: Math.round((data.purchased / max) * 100),
      color: "#FF9500",
    },
  ];

  return (
    <div className="space-y-4">
      {steps.map((step, i) => {
        const dropoff =
          i > 0
            ? steps[i - 1].value > 0
              ? Math.round(
                  ((steps[i - 1].value - step.value) / steps[i - 1].value) * 100
                )
              : 0
            : null;

        return (
          <div key={step.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-[#1D1D1F]">
                {step.label}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#1D1D1F]">
                  {step.value.toLocaleString()}
                </span>
                {dropoff !== null && dropoff > 0 && (
                  <span className="text-xs text-[#FF3B30] font-medium">
                    -{dropoff}%
                  </span>
                )}
              </div>
            </div>
            <div className="w-full h-8 bg-[#F5F5F7] rounded-lg overflow-hidden">
              <div
                className="h-full rounded-lg transition-all duration-700 ease-out flex items-center justify-end pr-2"
                style={{
                  width: `${Math.max(step.pct, 2)}%`,
                  backgroundColor: step.color,
                }}
              >
                {step.pct >= 15 && (
                  <span className="text-white text-xs font-bold">
                    {step.pct}%
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
