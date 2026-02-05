import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const attemptId = session.metadata?.attempt_id;
    const anonId = session.metadata?.anon_id;

    if (attemptId && anonId) {
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
