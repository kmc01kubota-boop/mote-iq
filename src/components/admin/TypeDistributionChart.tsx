"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

interface TypeData {
  type: string;
  label: string;
  count: number;
}

interface TypeDistributionChartProps {
  data: TypeData[];
}

// Apple風パステルカラーパレット
const APPLE_COLORS = [
  "#007AFF", // Blue
  "#34C759", // Green
  "#FF9500", // Orange
  "#FF2D55", // Pink
  "#AF52DE", // Purple
  "#5856D6", // Indigo
  "#00C7BE", // Teal
  "#FF6482", // Light Pink
  "#64D2FF", // Light Blue
  "#30D158", // Bright Green
  "#BF5AF2", // Magenta
  "#FFD60A", // Yellow
  "#FF453A", // Red
  "#32ADE6", // Sky
  "#AC8E68", // Brown
  "#8E8E93", // Gray
  "#5E5CE6", // Violet
];

export default function TypeDistributionChart({ data }: TypeDistributionChartProps) {
  // データがあるもののみフィルタ（0件も表示する場合はコメントアウト）
  const filteredData = data.filter((d) => d.count > 0);

  if (filteredData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-[#86868B]">
        データがありません
      </div>
    );
  }

  const chartData = {
    labels: filteredData.map((d) => d.label),
    datasets: [
      {
        data: filteredData.map((d) => d.count),
        backgroundColor: filteredData.map((_, i) => APPLE_COLORS[i % APPLE_COLORS.length]),
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1D1D1F",
        titleColor: "#FFFFFF",
        bodyColor: "#FFFFFF",
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 13,
          weight: 500 as const,
        },
        bodyFont: {
          size: 14,
          weight: 600 as const,
        },
        callbacks: {
          label: (context: { raw: unknown }) => `${context.raw}人`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#86868B",
          font: {
            size: 11,
          },
          maxRotation: 45,
          minRotation: 45,
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "#F5F5F7",
        },
        ticks: {
          color: "#86868B",
          font: {
            size: 12,
          },
          stepSize: 1,
        },
        border: {
          display: false,
        },
      },
    },
    animation: {
      duration: 800,
      easing: "easeOutQuart" as const,
    },
  };

  return (
    <div className="h-72">
      <Bar data={chartData} options={options} />
    </div>
  );
}
