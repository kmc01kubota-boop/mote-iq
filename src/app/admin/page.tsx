"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Banknote,
  TrendingUp,
  Lock,
  Download,
  BarChart3,
} from "lucide-react";
import KPICard from "@/components/admin/KPICard";
import TypeDistributionChart from "@/components/admin/TypeDistributionChart";
import RecentList from "@/components/admin/RecentList";
import LiveIndicator from "@/components/admin/LiveIndicator";
import LegalEditor from "@/components/admin/LegalEditor";
import FunnelChart from "@/components/admin/FunnelChart";
import ScoreDistributionChart from "@/components/admin/ScoreDistributionChart";
import QuizSelector from "@/components/admin/QuizSelector";
import { getQuizConfig, getQuizSelectorOptions } from "@/config/quizzes";

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
    quizName?: string;
  }[];
  typeDistribution: {
    type: string;
    label: string;
    count: number;
  }[];
  scoreDistribution: {
    range: string;
    label?: string;
    color?: string;
    count: number;
  }[];
  funnel: {
    started: number;
    completed: number;
    purchased: number;
  };
  period: string;
  quizId: string;
}

interface LegalData {
  legal_tokusho: string;
  legal_privacy: string;
  legal_terms: string;
}

type Period = "7" | "30" | "all";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const [isPublished, setIsPublished] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [legalData, setLegalData] = useState<LegalData | null>(null);
  const [period, setPeriod] = useState<Period>("7");
  const [exporting, setExporting] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<string>("all");

  // 現在選択中の診断のテーマカラーを取得
  const activeTheme = (() => {
    if (selectedQuizId === "all") {
      return {
        accentColor: "#007AFF",
        accentBg: "#EBF5FF",
        accentText: "#0055CC",
        funnelColors: ["#007AFF", "#34C759", "#FF9500"] as [string, string, string],
      };
    }
    const config = getQuizConfig(selectedQuizId);
    return {
      accentColor: config?.accentColor ?? "#007AFF",
      accentBg: config?.accentBg ?? "#EBF5FF",
      accentText: config?.accentText ?? "#0055CC",
      funnelColors: config?.funnelColors ?? ["#007AFF", "#34C759", "#FF9500"] as [string, string, string],
    };
  })();

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
      } else {
        setError("パスワードが正しくありません");
      }
    } catch {
      setError("認証エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  const fetchData = useCallback(
    async (p: Period = period, quizId: string = selectedQuizId) => {
      try {
        const res = await fetch(
          `/api/admin/dashboard?period=${p}&quiz_id=${quizId}`,
          {
            headers: { "x-admin-password": password },
          }
        );
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      }
    },
    [password, period, selectedQuizId]
  );

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

  async function handleExport(type: "attempts" | "purchases") {
    setExporting(true);
    try {
      const res = await fetch(
        `/api/admin/export?type=${type}&quiz_id=${selectedQuizId}`,
        {
          headers: { "x-admin-password": password },
        }
      );
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download =
          res.headers
            .get("Content-Disposition")
            ?.split("filename=")[1] ||
          `${selectedQuizId}_${type}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(false);
    }
  }

  function handlePeriodChange(p: Period) {
    setPeriod(p);
    fetchData(p, selectedQuizId);
  }

  function handleQuizChange(quizId: string) {
    setSelectedQuizId(quizId);
    setData(null); // ローディング表示
    fetchData(period, quizId);
  }

  useEffect(() => {
    if (isAuthenticated && password) {
      fetchData();
      fetchSiteStatus();
      fetchLegalData();
      const interval = setInterval(() => {
        fetchData();
        fetchSiteStatus();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, password, fetchData]);

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
                <p className="text-[#FF3B30] text-sm mt-3 text-center">
                  {error}
                </p>
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: `${activeTheme.accentColor}40`, borderTopColor: activeTheme.accentColor }}
          />
          <span className="text-[#86868B] text-sm">読み込み中...</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-12 lg:py-14 transition-colors duration-500">
      {/* テーマカラーのアクセント光彩（背景グラデーション） */}
      <div
        className="fixed inset-0 pointer-events-none transition-all duration-700 ease-out"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% -20%, ${activeTheme.accentColor}08, transparent)`,
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="flex flex-col gap-4 mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <motion.h1
                className="text-2xl font-semibold tracking-tight transition-colors duration-300"
                style={{ color: activeTheme.accentText }}
              >
                Analytics
              </motion.h1>
              <motion.div
                className="h-6 w-px rounded-full"
                style={{ backgroundColor: `${activeTheme.accentColor}30` }}
              />
              <motion.span
                key={selectedQuizId}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-medium"
                style={{ color: activeTheme.accentColor }}
              >
                {selectedQuizId === "all"
                  ? "全診断"
                  : getQuizConfig(selectedQuizId)?.name ?? selectedQuizId}
              </motion.span>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* 期間フィルタ */}
              <div className="flex bg-[#F5F5F7] rounded-lg p-1">
                {(["7", "30", "all"] as Period[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePeriodChange(p)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      period === p
                        ? "bg-white text-[#1D1D1F] shadow-sm"
                        : "text-[#86868B] hover:text-[#1D1D1F]"
                    }`}
                  >
                    {p === "7" ? "7日" : p === "30" ? "30日" : "全期間"}
                  </button>
                ))}
              </div>

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
                      transform: isPublished
                        ? "translateX(18px)"
                        : "translateX(2px)",
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

          {/* クイズ・セレクター */}
          <div className="flex justify-center sm:justify-start">
            <QuizSelector
              selectedQuizId={selectedQuizId}
              onSelect={handleQuizChange}
            />
          </div>
        </div>

        {/* KPIカード */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`kpi-${selectedQuizId}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
              <KPICard
                icon={Users}
                label="Total Attempts"
                value={data.totalAttempts.toLocaleString()}
                accentColor={activeTheme.accentColor}
              />
              <KPICard
                icon={BarChart3}
                label="Completed"
                value={data.completedAttempts.toLocaleString()}
                suffix={`(${data.completionRate.toFixed(0)}%)`}
                accentColor={activeTheme.accentColor}
              />
              <KPICard
                icon={Banknote}
                label="Revenue"
                value={`¥${data.totalRevenue.toLocaleString()}`}
                accentColor={activeTheme.accentColor}
              />
              <KPICard
                icon={TrendingUp}
                label="CVR"
                value={data.cvr.toFixed(1)}
                suffix={`% (${period === "all" ? "全期間" : period + "日間"})`}
                accentColor={activeTheme.accentColor}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ファネル & スコア分布 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`charts-${selectedQuizId}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, delay: 0.05 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 sm:mb-12">
              <div
                className="rounded-3xl shadow-sm p-6 sm:p-8 transition-colors duration-500"
                style={{ backgroundColor: "white" }}
              >
                <h2 className="text-lg font-semibold text-[#1D1D1F] mb-6">
                  コンバージョンファネル
                </h2>
                <FunnelChart
                  data={data.funnel}
                  colors={activeTheme.funnelColors}
                />
              </div>

              <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-[#1D1D1F] mb-6">
                  スコア分布
                </h2>
                <ScoreDistributionChart data={data.scoreDistribution} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* タイプ分布グラフ */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`type-${selectedQuizId}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, delay: 0.1 }}
          >
            <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8 mb-8 sm:mb-12">
              <h2 className="text-lg font-semibold text-[#1D1D1F] mb-8">
                診断タイプ分布
              </h2>
              <TypeDistributionChart data={data.typeDistribution} />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 直近の購入 & CSVエクスポート */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 sm:mb-12">
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-[#1D1D1F] mb-6">
              直近の購入
            </h2>
            <RecentList purchases={data.recentPurchases} />
          </div>

          <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-[#1D1D1F] mb-6">
              データエクスポート
            </h2>
            <p className="text-xs text-[#86868B] mb-4">
              {selectedQuizId === "all"
                ? "全診断のデータをエクスポート"
                : `「${getQuizConfig(selectedQuizId)?.name ?? selectedQuizId}」のデータをエクスポート`}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => handleExport("attempts")}
                disabled={exporting}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all disabled:opacity-50 text-sm font-medium"
                style={{
                  backgroundColor: `${activeTheme.accentColor}08`,
                  color: activeTheme.accentText,
                }}
              >
                <Download className="w-4 h-4" />
                診断データ CSV
              </button>
              <button
                onClick={() => handleExport("purchases")}
                disabled={exporting}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all disabled:opacity-50 text-sm font-medium"
                style={{
                  backgroundColor: `${activeTheme.accentColor}08`,
                  color: activeTheme.accentText,
                }}
              >
                <Download className="w-4 h-4" />
                売上データ CSV
              </button>
              {exporting && (
                <p className="text-[#86868B] text-xs text-center">
                  エクスポート中...
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 法的ページ管理 */}
        {legalData && (
          <LegalEditor password={password} initialData={legalData} />
        )}
      </div>
    </div>
  );
}
