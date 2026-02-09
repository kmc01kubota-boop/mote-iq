"use client";

import { FactorKey, FACTOR_LABELS, FACTOR_KEYS, FactorScore } from "@/types";

interface RadarChartProps {
  factors: Record<FactorKey, FactorScore>;
}

const PADDING = 50;
const CHART_SIZE = 300;
const SIZE = CHART_SIZE + PADDING * 2;
const CENTER = SIZE / 2;
const RADIUS = 110;
const LEVELS = 4;

function polarToCartesian(
  angle: number,
  radius: number
): [number, number] {
  const rad = ((angle - 90) * Math.PI) / 180;
  return [CENTER + radius * Math.cos(rad), CENTER + radius * Math.sin(rad)];
}

const ANGLES = FACTOR_KEYS.map((_, i) => (360 / FACTOR_KEYS.length) * i);

export default function RadarChart({ factors }: RadarChartProps) {
  // Grid lines
  const gridPaths = Array.from({ length: LEVELS }, (_, level) => {
    const r = (RADIUS / LEVELS) * (level + 1);
    const points = ANGLES.map((angle) => polarToCartesian(angle, r));
    return points.map((p) => p.join(",")).join(" ");
  });

  // Axis lines
  const axisLines = ANGLES.map((angle) => ({
    x2: polarToCartesian(angle, RADIUS)[0],
    y2: polarToCartesian(angle, RADIUS)[1],
  }));

  // Data polygon
  const dataPoints = FACTOR_KEYS.map((key, i) => {
    const value = factors[key].normalized / 100;
    const r = RADIUS * value;
    return polarToCartesian(ANGLES[i], r);
  });
  const dataPath = dataPoints.map((p) => p.join(",")).join(" ");

  // Label positions (further out with enough room)
  const labelPositions = FACTOR_KEYS.map((key, i) => {
    const [x, y] = polarToCartesian(ANGLES[i], RADIUS + 35);
    return { key, x, y, label: FACTOR_LABELS[key], score: factors[key].normalized };
  });

  // Short label for display
  const shortLabels: Record<FactorKey, string> = {
    cleanliness: "清潔感",
    conversation: "会話の余白力",
    money: "金と余裕",
    distance: "距離感",
    sexAppeal: "大人の色気",
  };

  return (
    <div className="flex justify-center px-2">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full max-w-[360px] sm:max-w-[400px]"
        overflow="visible"
      >
        {/* Grid */}
        {gridPaths.map((points, i) => (
          <polygon
            key={i}
            points={points}
            fill="none"
            stroke="#2A2A2A"
            strokeWidth="1"
          />
        ))}

        {/* Axes */}
        {axisLines.map((line, i) => (
          <line
            key={i}
            x1={CENTER}
            y1={CENTER}
            x2={line.x2}
            y2={line.y2}
            stroke="#2A2A2A"
            strokeWidth="1"
          />
        ))}

        {/* Data area */}
        <polygon
          points={dataPath}
          fill="rgba(212, 168, 67, 0.2)"
          stroke="#D4A843"
          strokeWidth="2"
        />

        {/* Data points */}
        {dataPoints.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="4" fill="#D4A843" />
        ))}

        {/* Labels */}
        {labelPositions.map((lp) => (
          <text
            key={lp.key}
            x={lp.x}
            y={lp.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[11px] sm:text-[12px] fill-text-secondary"
          >
            <tspan x={lp.x} dy="-0.6em">
              {shortLabels[lp.key as FactorKey]}
            </tspan>
            <tspan
              x={lp.x}
              dy="1.3em"
              className="fill-accent text-[12px] sm:text-[13px] font-bold"
            >
              {lp.score}
            </tspan>
          </text>
        ))}
      </svg>
    </div>
  );
}
