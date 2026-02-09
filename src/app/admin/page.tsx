"use client";

import { useState, useEffect } from "react";
import { Users, Banknote, TrendingUp, Lock } from "lucide-react";
import KPICard from "@/components/admin/KPICard";
import TypeDistributionChart from "@/components/admin/TypeDistributionChart";
import RecentList from "@/components/admin/RecentList";
import LiveIndicator from "@/components/admin/LiveIndicator";
import LegalEditor from "@/components/admin/LegalEditor";

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
  typeDistribution: {
    type: string;
    label: string;
    count: number;
  }[];
}

interface LegalData {
  legal_tokusho: string;
  legal_privacy: string;
  legal_terms: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const [isPublished, setIsPublished] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [legalData, setLegalData] = useState<LegalData | null>(null);

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
        headers: { "x-admin-password": password },
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    }
  }

  async function fetchSiteStatus() {
    try {
      const res = await fetch("/api/admin/settings", {
        headers: { "x-admin-password": password },
      });
      if (res.ok) {
        const json = await res.json();
        setIsPublished(json.is_published);
      }
    } catch (err) {
      console.error("Failed to fetch site status:", err);
    }
  }

  async function fetchLegalData() {
    try {
      const res = await fetch("/api/admin/legal", {
        headers: { "x-admin-password": password },
      });
      if (res.ok) {
        const json = await res.json();
        setLegalData(json);
      }
    } catch (err) {
      console.error("Failed to fetch legal data:", err);
    }
  }

  async function togglePublish() {
    setToggling(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ is_published: !isPublished }),
      });
      if (res.ok) {
        const json = await res.json();
        setIsPublished(json.is_published);
      }
    } catch (err) {
      console.error("Failed to toggle site status:", err);
    } finally {
      setToggling(false);
    }
  }

  useEffect(() => {
    if (isAuthenticated && password) {
      fetchData();
      fetchSiteStatus();
      fetchLegalData();
      // 30秒ごとに自動更新（KPIのみ）
      const interval = setInterval(() => {
        fetchData();
        fetchSiteStatus();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, password]);

  // ログイン画面
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-3xl shadow-sm p-10">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 rounded-full bg-[#F5F5F7] flex items-center justify-center">
                <Lock className="w-7 h-7 text-[#86868B]" strokeWidth={1.5} />
              </div>
            </div>
            <h1 className="text-xl font-semibold text-[#1D1D1F] text-center mb-8">
              管理者ログイン
            </h1>
            <form onSubmit={handleLogin}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワード"
                className="w-full px-5 py-4 bg-[#F5F5F7] rounded-xl text-[#1D1D1F] placeholder-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#007AFF] transition-all"
              />
              {error && (
                <p className="text-[#FF3B30] text-sm mt-3 text-center">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading || !password}
                className="w-full mt-6 bg-[#007AFF] hover:bg-[#0066CC] text-white font-medium py-4 rounded-xl transition-colors disabled:opacity-50"
              >
                {loading ? "認証中..." : "ログイン"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ローディング
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#86868B]">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10 lg:px-12 lg:py-14">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-2xl font-semibold text-[#1D1D1F] tracking-tight">
            Analytics
          </h1>
          <div className="flex items-center gap-4">
            {/* サイト公開トグル */}
            <button
              onClick={togglePublish}
              disabled={toggling}
              className="flex items-center gap-3 px-4 py-2.5 rounded-full border transition-all disabled:opacity-50"
              style={{
                backgroundColor: isPublished ? "#F0FDF4" : "#FEF2F2",
                borderColor: isPublished ? "#BBF7D0" : "#FECACA",
              }}
            >
              <div
                className="relative w-10 h-6 rounded-full transition-colors"
                style={{
                  backgroundColor: isPublished ? "#22C55E" : "#D1D5DB",
                }}
              >
                <div
                  className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                  style={{
                    transform: isPublished ? "translateX(18px)" : "translateX(2px)",
                  }}
                />
              </div>
              <span
                className="text-sm font-semibold"
                style={{
                  color: isPublished ? "#16A34A" : "#DC2626",
                }}
              >
                {toggling ? "切替中..." : isPublished ? "公開中" : "非公開"}
              </span>
            </button>
            <LiveIndicator />
          </div>
        </div>

        {/* KPIカード */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <KPICard
            icon={Users}
            label="Total Attempts"
            value={data.totalAttempts.toLocaleString()}
          />
          <KPICard
            icon={Banknote}
            label="Total Revenue"
            value={`¥${data.totalRevenue.toLocaleString()}`}
          />
          <KPICard
            icon={TrendingUp}
            label="Conversion Rate"
            value={data.cvr.toFixed(1)}
            suffix="%"
          />
        </div>

        {/* タイプ分布グラフ */}
        <div className="bg-white rounded-3xl shadow-sm p-8 mb-12">
          <h2 className="text-lg font-semibold text-[#1D1D1F] mb-8">
            診断タイプ分布
          </h2>
          <TypeDistributionChart data={data.typeDistribution} />
        </div>

        {/* 直近の購入 */}
        <div className="bg-white rounded-3xl shadow-sm p-8 mb-12">
          <h2 className="text-lg font-semibold text-[#1D1D1F] mb-6">
            直近の購入
          </h2>
          <RecentList purchases={data.recentPurchases} />
        </div>

        {/* 法的ページ管理 */}
        {legalData && (
          <LegalEditor password={password} initialData={legalData} />
        )}
      </div>
    </div>
  );
}
