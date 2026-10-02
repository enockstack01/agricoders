/**
 * Runtime configuration, read from Expo public env vars (EXPO_PUBLIC_*).
 * Copy `.env.example` to `.env` (already filled with the live Agriplan values).
 */
export const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';

/** Agriplan API base (the Next.js site's /api), e.g. https://www.agricoders.com/api */
export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? 'https://www.agricoders.com/api').replace(/\/$/, '');

/** Public website (API_URL without /api) — used for "open on the web" links. */
export const WEB_ORIGIN = API_URL.replace(/\/api$/, '');

if (!CLERK_PUBLISHABLE_KEY) {
  // eslint-disable-next-line no-console
  console.warn('[Agriplan] EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is not set — copy mobile/.env.example to mobile/.env');
}
