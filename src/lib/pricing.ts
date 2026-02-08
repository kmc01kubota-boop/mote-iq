// 価格設定の一元管理
// 「1コイン = 500円（税抜）」を基本単位とする

// ============================================
// テストモード設定
// テスト時は true に変更してください
// ============================================
const IS_TEST_MODE = false;
const TEST_PRICE = 50; // テスト用価格（円）※Stripe最小決済金額は50円

export const PRICING = {
  /** テストモードかどうか */
  IS_TEST_MODE,

  /** 税抜価格（円） */
  BASE_PRICE: IS_TEST_MODE ? TEST_PRICE : 500,

  /** 消費税率 */
  TAX_RATE: 0.10,

  /** 税込価格（テストモード時は固定10円、通常時は計算） */
  get TOTAL_PRICE(): number {
    if (IS_TEST_MODE) return TEST_PRICE;
    return Math.round(this.BASE_PRICE * (1 + this.TAX_RATE));
  },

  /** 通貨コード（Stripe用） */
  CURRENCY: "jpy" as const,

  /** 商品名 */
  PRODUCT_NAME: "モテIQ 詳細レポート",

  /** 商品説明 */
  PRODUCT_DESCRIPTION: "因子別解説・地雷行動TOP3・7日改善プラン・LINEテンプレ",
};

/**
 * 価格を表示用にフォーマット
 * @param amount 金額
 * @param includeTax true: 税込表示, false: 税別表示
 */
export function formatPrice(amount: number, includeTax = true): string {
  return `¥${amount.toLocaleString()}${includeTax ? "（税込）" : "（税別）"}`;
}

/**
 * 税込・税別の両方を表示
 */
export function formatPriceWithBreakdown(): string {
  return `¥${PRICING.TOTAL_PRICE.toLocaleString()}（税込） / ¥${PRICING.BASE_PRICE.toLocaleString()}（税別）`;
}

/**
 * 税抜価格から税込価格を計算
 */
export function calculateTaxIncluded(basePrice: number): number {
  return Math.round(basePrice * (1 + PRICING.TAX_RATE));
}

/**
 * 税込価格から税抜価格を計算
 */
export function calculateTaxExcluded(totalPrice: number): number {
  return Math.round(totalPrice / (1 + PRICING.TAX_RATE));
}
