import Stripe from "stripe";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-05-27.dahlia" as any });

// Re-export so server-side API routes can import from one place
export { CREDIT_PACKAGES } from "./credit-packages";
export type { PackageId } from "./credit-packages";
