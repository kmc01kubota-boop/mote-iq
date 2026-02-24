// 統合トラッキングレイヤー
// GA4 + Google Ads + Meta Pixel を一括発火
// 呼び出し側はこの1ファイルだけimportすればOK

import {
  trackQuizStart as ga4QuizStart,
  trackQuizComplete as ga4QuizComplete,
  trackCheckoutClick as ga4CheckoutClick,
  trackPurchaseComplete as ga4Purchase,
  trackReportView as ga4ReportView,
} from "./gtag";

import {
  trackGAdsQuizComplete,
  trackGAdsPurchase,
} from "./gads";

import {
  trackMetaQuizStart,
  trackMetaQuizComplete,
  trackMetaCheckoutClick,
  trackMetaPurchase,
} from "./meta-pixel";

// ============================
// 統合イベント
// ============================

/** 診断開始 */
export function trackQuizStart() {
  ga4QuizStart();
  trackMetaQuizStart();
}

/** 診断完了 */
export function trackQuizComplete(grade: string, totalScore: number) {
  ga4QuizComplete(grade, totalScore);
  trackGAdsQuizComplete();
  trackMetaQuizComplete(grade);
}

/** 決済ボタンクリック */
export function trackCheckoutClick(attemptId: string, value: number) {
  ga4CheckoutClick(attemptId);
  trackMetaCheckoutClick(value);
}

/** 購入完了 */
export function trackPurchaseComplete(
  attemptId: string,
  value: number
) {
  ga4Purchase(attemptId, value);
  trackGAdsPurchase(value);
  trackMetaPurchase(value);
}

/** レポート閲覧 */
export function trackReportView(attemptId: string, grade: string) {
  ga4ReportView(attemptId, grade);
}
