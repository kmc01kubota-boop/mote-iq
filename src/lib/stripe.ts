import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

// Stripe未設定時はnullを返す（ビルドエラー回避）
export const stripe: Stripe | null = stripeSecretKey
  ? new Stripe(stripeSecretKey)
  : null;

export function isStripeConfigured(): boolean {
  return Boolean(stripeSecretKey);
}
