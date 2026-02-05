import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
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
            currency: "jpy",
            unit_amount: 1980,
            product_data: {
              name: "モテIQ 詳細レポート",
              description: "5因子の詳細解説・改善プラン・LINEテンプレ付き",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        attempt_id: attemptId,
        anon_id: anonId,
      },
      success_url: `${baseUrl}/report/${attemptId}`,
      cancel_url: `${baseUrl}/result/${attemptId}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("Checkout API error:", e);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}
