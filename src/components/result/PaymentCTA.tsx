"use client";

import { useState } from "react";
import { getAnonId } from "@/lib/anon";
import { PRICING } from "@/lib/pricing";

interface PaymentCTAProps {
  attemptId: string;
}

export default function PaymentCTA({ attemptId }: PaymentCTAProps) {
  const [loading, setLoading] = useState(false);

  async function handlePurchase() {
    if (loading) return;
    setLoading(true);

    try {
      const anonId = getAnonId();
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId, anonId }),
      });

      if (!res.ok) throw new Error("Failed");

      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      }
    } catch {
      alert("決済ページの作成に失敗しました。もう一度お試しください。");
      setLoading(false);
    }
  }

  return (
    <div className="bg-bg-card border border-accent/30 rounded-2xl p-8 text-center">
      <h3 className="text-xl font-bold mb-2">詳細レポートを解放する</h3>
      <p className="text-text-muted text-sm mb-6">
        因子別解説・地雷行動・7日プラン・LINEテンプレ・ファッション提案
      </p>
      {PRICING.IS_TEST_MODE && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 text-xs px-3 py-1 rounded-full mb-4 inline-block">
          🧪 テストモード
        </div>
      )}
      <div className="mb-6">
        <span className="text-3xl font-bold text-accent">
          {PRICING.IS_TEST_MODE ? `テスト決済（${PRICING.TOTAL_PRICE}円）` : `¥${PRICING.TOTAL_PRICE.toLocaleString()}`}
        </span>
        {!PRICING.IS_TEST_MODE && (
          <span className="text-text-muted text-sm ml-2">（税込）</span>
        )}
      </div>
      <button
        onClick={handlePurchase}
        disabled={loading}
        className="w-full sm:w-auto bg-accent hover:bg-accent-dark text-white font-bold text-lg px-10 py-4 rounded-xl transition-colors disabled:opacity-50"
      >
        {loading ? "処理中..." : "レポートを購入する"}
      </button>
      <div className="mt-4 space-y-1">
        <p className="text-xs text-text-muted">
          ✓ 単発購入・自動更新なし
        </p>
        <p className="text-xs text-text-muted">
          ✓ 一度の支払いで永久閲覧可能
        </p>
      </div>
    </div>
  );
}
