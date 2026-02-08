import { NextRequest, NextResponse } from "next/server";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { PRICING } from "@/lib/pricing";

export async function POST(request: NextRequest) {
  // Stripe未設定時
  if (!isStripeConfigured() || !stripe) {
    return NextResponse.json(
      { error: "Payment service not configured" },
      { status: 503 }
    );
  }

  try {
    const { attemptId, anonId } = await request.json();

    if (!attemptId || !anonId) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: PRICING.CURRENCY,
            unit_amount: PRICING.TOTAL_PRICE, // 550円（税込）
            product_data: {
              name: PRICING.PRODUCT_NAME,
              description: PRICING.PRODUCT_DESCRIPTION,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        attempt_id: attemptId,
        anon_id: anonId,
      },
      success_url: `${baseUrl}/report/${attemptId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/result/${attemptId}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("Checkout API error:", e);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}
