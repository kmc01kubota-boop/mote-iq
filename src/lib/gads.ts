// Google Ads コンバージョントラッキング
// 環境変数:
//   NEXT_PUBLIC_GADS_ID        = AW-XXXXXXXXXX (Google広告アカウントID)
//   NEXT_PUBLIC_GADS_CV_QUIZ   = AW-XXXXXXXXXX/XXXX (診断完了コンバージョンラベル)
//   NEXT_PUBLIC_GADS_CV_PURCHASE = AW-XXXXXXXXXX/XXXX (購入完了コンバージョンラベル)

export const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID || "";
export const GADS_CV_QUIZ =
  process.env.NEXT_PUBLIC_GADS_CV_QUIZ || "";
export const GADS_CV_PURCHASE =
  process.env.NEXT_PUBLIC_GADS_CV_PURCHASE || "";

export const isGAdsEnabled = (): boolean => !!GADS_ID;

/** 診断完了コンバージョン */
export function trackGAdsQuizComplete() {
  if (!isGAdsEnabled() || !GADS_CV_QUIZ) return;
  window.gtag("event", "conversion", {
    send_to: GADS_CV_QUIZ,
  });
}

/** 購入完了コンバージョン（価値付き） */
export function trackGAdsPurchase(value: number) {
  if (!isGAdsEnabled() || !GADS_CV_PURCHASE) return;
  window.gtag("event", "conversion", {
    send_to: GADS_CV_PURCHASE,
    value,
    currency: "JPY",
  });
}
