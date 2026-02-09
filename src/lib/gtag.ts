// Google Analytics 4 ユーティリティ
// 環境変数 NEXT_PUBLIC_GA_ID に GA4の測定ID (G-XXXXXXXXXX) を設定

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";

export const isGAEnabled = (): boolean => !!GA_ID;

// ページビュー送信
export function pageview(url: string) {
  if (!isGAEnabled()) return;
  window.gtag("config", GA_ID, { page_path: url });
}

// カスタムイベント送信
export function event(
  action: string,
  params?: Record<string, string | number | boolean>
) {
  if (!isGAEnabled()) return;
  window.gtag("event", action, params);
}

// ============================
// 定義済みカスタムイベント
// ============================

/** 診断開始 */
export function trackQuizStart() {
  event("quiz_start");
}

/** 診断完了 */
export function trackQuizComplete(grade: string, total: number) {
  event("quiz_complete", { grade, total_score: total });
}

/** 決済ボタンクリック */
export function trackCheckoutClick(attemptId: string) {
  event("checkout_click", { attempt_id: attemptId });
}

/** 決済完了（レポートページ到達） */
export function trackPurchaseComplete(attemptId: string, value: number) {
  event("purchase_complete", {
    attempt_id: attemptId,
    value,
    currency: "JPY",
  });
}

/** レポート閲覧 */
export function trackReportView(attemptId: string, grade: string) {
  event("report_view", { attempt_id: attemptId, grade });
}

// TypeScript用のgtag型定義
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}
