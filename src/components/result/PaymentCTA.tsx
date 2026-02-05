"use client";

import { useState } from "react";
import { getAnonId } from "@/lib/anon";

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
    <div className="bg-bg-card border border-accent/30 rounded-lg p-8 text-center">
      <h3 className="text-xl font-bold mb-2">詳細レポートを解放する</h3>
      <p className="text-text-muted text-sm mb-4">
        因子別の徹底解説・地雷行動トップ3・7日改善プラン・LINEテンプレ付き
      </p>
      <div className="mb-6">
        <span className="text-3xl font-bold text-accent">¥1,980</span>
        <span className="text-text-muted text-sm ml-2">（税込・買い切り）</span>
      </div>
      <button
        onClick={handlePurchase}
        disabled={loading}
        className="bg-accent hover:bg-accent-light text-bg-primary font-bold text-lg px-10 py-4 rounded transition-colors disabled:opacity-50"
      >
        {loading ? "処理中..." : "レポートを購入する"}
      </button>
      <p className="text-xs text-text-muted mt-3">
        ※ サブスクリプションではありません。一度のお支払いで閲覧できます。
      </p>
    </div>
  );
}
