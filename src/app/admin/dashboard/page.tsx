"use client";

import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardData {
  totalAttempts: number;
  completedAttempts: number;
  totalPurchases: number;
  totalRevenue: number;
  cvr: number;
  completionRate: number;
  dailyStats: {
    date: string;
    attempts: number;
    purchases: number;
    revenue: number;
  }[];
  recentPurchases: {
    id: string;
    created_at: string;
    attempt_id: string;
    amount: number;
  }[];
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
        fetchData();
      } else {
        setError("パスワードが正しくありません");
      }
    } catch {
      setError("認証エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  async function fetchData() {
    try {
      const res = await fetch("/api/admin/dashboard", {
        headers: {
          "x-admin-password": password,
        },
      });

      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    }
  }

  // ログイン画面
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h1 className="text-2xl font-bold text-white text-center mb-2">
              Admin Dashboard
            </h1>
            <p className="text-slate-400 text-sm text-center mb-8">
              管理者パスワードを入力してください
            </p>

            <form onSubmit={handleLogin}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワード"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 mb-4"
              />

              {error && (
                <p className="text-red-400 text-sm mb-4">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || !password}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? "認証中..." : "ログイン"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ダッシュボード画面
  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">
            📊 モテIQ Analytics
          </h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-slate-400 hover:text-white text-sm"
          >
            ログアウト
          </button>
        </div>

        {!data ? (
          <div className="text-slate-400 text-center py-20">
            データを読み込み中...
          </div>
        ) : (
          <>
            {/* KPIカード */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <KPICard
                label="診断開始数"
                value={data.totalAttempts}
                suffix="件"
              />
              <KPICard
                label="診断完了数"
                value={data.completedAttempts}
                suffix="件"
                subValue={`完了率 ${data.completionRate.toFixed(1)}%`}
              />
              <KPICard
                label="購入数"
                value={data.totalPurchases}
                suffix="件"
                subValue={`CVR ${data.cvr.toFixed(1)}%`}
                highlight
              />
              <KPICard
                label="総売上"
                value={data.totalRevenue.toLocaleString()}
                prefix="¥"
                highlight
              />
            </div>

            {/* グラフ */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-white font-bold mb-4">直近7日間の売上推移</h2>
                <Line
                  data={{
                    labels: data.dailyStats.map((d) => d.date),
                    datasets: [
                      {
                        label: "売上 (¥)",
                        data: data.dailyStats.map((d) => d.revenue),
                        borderColor: "#f59e0b",
                        backgroundColor: "rgba(245, 158, 11, 0.1)",
                        tension: 0.3,
                        fill: true,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      x: {
                        ticks: { color: "#94a3b8" },
                        grid: { color: "#1e293b" },
                      },
                      y: {
                        ticks: { color: "#94a3b8" },
                        grid: { color: "#1e293b" },
                      },
                    },
                  }}
                />
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-white font-bold mb-4">診断数 vs 購入数</h2>
                <Bar
                  data={{
                    labels: data.dailyStats.map((d) => d.date),
                    datasets: [
                      {
                        label: "診断数",
                        data: data.dailyStats.map((d) => d.attempts),
                        backgroundColor: "#475569",
                      },
                      {
                        label: "購入数",
                        data: data.dailyStats.map((d) => d.purchases),
                        backgroundColor: "#f59e0b",
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        labels: { color: "#94a3b8" },
                      },
                    },
                    scales: {
                      x: {
                        ticks: { color: "#94a3b8" },
                        grid: { color: "#1e293b" },
                      },
                      y: {
                        ticks: { color: "#94a3b8" },
                        grid: { color: "#1e293b" },
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* 最新購入リスト */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-white font-bold mb-4">最新の購入 (直近10件)</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="py-3 px-4 text-slate-400 text-sm font-medium">
                        日時
                      </th>
                      <th className="py-3 px-4 text-slate-400 text-sm font-medium">
                        診断ID
                      </th>
                      <th className="py-3 px-4 text-slate-400 text-sm font-medium text-right">
                        金額
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentPurchases.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="py-8 text-center text-slate-500"
                        >
                          購入データがありません
                        </td>
                      </tr>
                    ) : (
                      data.recentPurchases.map((p) => (
                        <tr
                          key={p.id}
                          className="border-b border-slate-800 hover:bg-slate-800/50"
                        >
                          <td className="py-3 px-4 text-slate-300 text-sm">
                            {new Date(p.created_at).toLocaleString("ja-JP")}
                          </td>
                          <td className="py-3 px-4 text-slate-400 text-sm font-mono">
                            {p.attempt_id.slice(0, 8)}...
                          </td>
                          <td className="py-3 px-4 text-amber-400 text-sm text-right font-medium">
                            ¥{p.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function KPICard({
  label,
  value,
  prefix = "",
  suffix = "",
  subValue,
  highlight = false,
}: {
  label: string;
  value: number | string;
  prefix?: string;
  suffix?: string;
  subValue?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-5 ${
        highlight
          ? "bg-amber-500/10 border border-amber-500/30"
          : "bg-slate-900 border border-slate-800"
      }`}
    >
      <p className="text-slate-400 text-sm mb-1">{label}</p>
      <p
        className={`text-2xl sm:text-3xl font-bold ${
          highlight ? "text-amber-400" : "text-white"
        }`}
      >
        {prefix}
        {value}
        {suffix}
      </p>
      {subValue && (
        <p className="text-slate-500 text-xs mt-1">{subValue}</p>
      )}
    </div>
  );
}
