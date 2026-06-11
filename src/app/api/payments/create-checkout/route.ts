import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { stripe, CREDIT_PACKAGES } from "@/lib/stripe";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { packageId } = body as { packageId?: string };

  const pkg = CREDIT_PACKAGES.find((p) => p.id === packageId);
  if (!pkg) return NextResponse.json({ error: "Invalid package" }, { status: 400 });

  const origin =
    req.headers.get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: pkg.usdCents,
          product_data: {
            name: `Logistack Plan — ${pkg.label} Pack`,
            description: `${pkg.credits} credits · ${pkg.description} (5 credits per generation)`,
            images: [],
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId,
      credits: pkg.credits.toString(),
      packageId: pkg.id,
    },
    success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/payment/cancel`,
    custom_text: {
      submit: {
        message: `You will receive ${pkg.credits} credits immediately after payment.`,
      },
    },
  });

  return NextResponse.json({ url: session.url });
}
