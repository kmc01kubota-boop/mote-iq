import { NextRequest, NextResponse } from "next/server";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  // Stripe未設定時
  if (!isStripeConfigured() || !stripe) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 503 }
    );
  }

  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  // 開発環境でWebhook署名シークレットが未設定の場合は署名検証をスキップ
  if (!webhookSecret && process.env.NODE_ENV === "development") {
    console.warn("[Webhook] Skipping signature verification in development mode");
    try {
      event = JSON.parse(body) as Stripe.Event;
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
  } else if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 503 }
    );
  } else {
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const attemptId = session.metadata?.attempt_id;
    const anonId = session.metadata?.anon_id;

    if (attemptId && anonId && isSupabaseAdminConfigured() && supabaseAdmin) {
      const { error } = await supabaseAdmin.from("purchases").upsert(
        {
          attempt_id: attemptId,
          anon_id: anonId,
          stripe_session_id: session.id,
          status: "paid",
        },
        { onConflict: "stripe_session_id" }
      );

      if (error) {
        console.error("Failed to upsert purchase:", error);
        return NextResponse.json({ error: "DB error" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
