// Meta Pixel (Facebook/Instagram広告) トラッキング
// 環境変数:
//   NEXT_PUBLIC_META_PIXEL_ID = XXXXXXXXXXXXXXX (Meta Pixel ID)

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

export const isMetaPixelEnabled = (): boolean => !!META_PIXEL_ID;

/** Meta Pixel標準イベント: ページビュー */
export function trackMetaPageView() {
  if (!isMetaPixelEnabled()) return;
  window.fbq("track", "PageView");
}

/** 診断開始 = コンテンツ閲覧 */
export function trackMetaQuizStart() {
  if (!isMetaPixelEnabled()) return;
  window.fbq("track", "ViewContent", {
    content_name: "mote-iq-quiz",
    content_category: "diagnosis",
  });
}

/** 診断完了 = リード獲得 */
export function trackMetaQuizComplete(grade: string) {
  if (!isMetaPixelEnabled()) return;
  window.fbq("track", "Lead", {
    content_name: "mote-iq-quiz-complete",
    content_category: grade,
  });
}

/** 決済ボタンクリック = チェックアウト開始 */
export function trackMetaCheckoutClick(value: number) {
  if (!isMetaPixelEnabled()) return;
  window.fbq("track", "InitiateCheckout", {
    value,
    currency: "JPY",
    content_name: "mote-iq-report",
  });
}

/** 購入完了 */
export function trackMetaPurchase(value: number) {
  if (!isMetaPixelEnabled()) return;
  window.fbq("track", "Purchase", {
    value,
    currency: "JPY",
    content_name: "mote-iq-report",
  });
}

// TypeScript型定義
declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: (...args: unknown[]) => void;
  }
}
