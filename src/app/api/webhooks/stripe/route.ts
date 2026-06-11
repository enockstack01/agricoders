import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { connectDB } from "@/lib/mongodb";
import { addCredits } from "@/lib/credits";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe webhook signature verification failed:", message);
    return NextResponse.json({ error: `Webhook verification failed: ${message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.userId;
    const creditsStr = session.metadata?.credits;

    if (!userId || !creditsStr) {
      console.error("Missing userId or credits in Stripe session metadata", session.id);
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    const creditsNum = parseInt(creditsStr, 10);
    const paymentAmount = (session.amount_total ?? 0) / 100;
    const currency = session.currency ?? "usd";

    await connectDB();
    await addCredits(userId, creditsNum, paymentAmount, currency, session.id);

    console.log(`Credits added: ${creditsNum} for user ${userId} (session ${session.id})`);
  }

  return NextResponse.json({ received: true });
}
