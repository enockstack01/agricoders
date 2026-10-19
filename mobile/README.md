# Agriplan Mobile (Expo / React Native)

Native Android + iOS app for **Agriplan**, the Agricoders business-plan generator (Expo SDK 57).
It talks to the **same API** as the website (`https://www.agricoders.com/api`) and the **same
Clerk instance**, so accounts, plans and credits are shared — no backend changes required.

The design follows the Agricoders brand, the same as the website and the pitch decks: forest green
`#1B5E20`, amber `#F9A825`, tint `#F3F8F3`, lines `#D5E3D6`, ink `#111611`, Carlito (the open twin of
Calibri) as the typeface, pill buttons, flat 16 radius cards, a forest page banner on every screen and
the Agricoders logo on the sign in screens. Tokens live in `src/theme/theme.ts`. Visible text follows
the brand writing rules: no hyphens or dashes between words, `N/A` for empty values.

```
mobile/
  src/
    env.ts                 runtime config (EXPO_PUBLIC_* vars)
    shared/                types, plan defaults and financial calculations — copied verbatim
                           from the website (src/types, src/lib/defaults.ts, src/lib/calculations.ts);
                           keep them in sync when the website changes
    lib/                   API client, React Query hooks, document download/share, formatters
    theme/                 CropManager design tokens + light/dark provider
    components/            UI kit (cards, buttons, fields, sheet, toast, confirm) + plan components
    navigation/            drawer (mirrors the website sidebar), top bar with notifications
    screens/               Dashboard, My Plans, plan wizard (10 steps), Credits, Profile & Settings, auth
    App.tsx                Clerk + React Query + Theme + Navigation providers
```

## What's implemented

- **Sign in / sign up** — Clerk email + password, email codes, Google; session stored in
  `expo-secure-store`.
- **Dashboard** — total plans, this month, credit balance, latest plan, recent plans, quick actions.
- **My Business Plans** — search, edit, delete; per plan: **Generate & download** (5 credits) or
  **Download stored copy** (free) of the Business Plan (.docx) and Financial Model (.xlsx). Files are
  saved on the device and opened in the share sheet (open in Word/Excel, save to Files, email…).
- **New / edit plan** — the full 10-step wizard with the website's fields, units and
  "Generate with AI" sections; the Review step computes the same financial summary as the website.
- **Credits** — balance, request credits from the admin, request status, transaction history.
  A generation refused for lack of credits opens the request form automatically.
- **Profile & Settings** — account + copyable account ID, plan defaults (currency, tax, loan,
  payroll rates), light/dark/system theme, sign out.
- **Notifications** — bell with unread count; tap to mark read/unread, "Mark all read".
- **AI usage limits** — the server limits each user to 6 AI assist requests per minute, 40 per hour and
  100 per day, and 6 AI plan generations per hour and 20 per day. When a limit is reached the app shows
  the server's message (which limit, and when to try again).

Not yet on mobile (use the website): Admin Panel / User Management (admins get a shortcut in the
drawer), and uploading a company logo (a logo added on the website is kept when editing).

## Clerk setup for the mobile app

The app signs in through the same Clerk production instance as the website, and Clerk must allow
native apps. In the Clerk dashboard, open **Configure, then Native applications** and:

1. Turn **Native API** on. If it is off, Clerk never finishes loading and the app shows
   "Can't connect to sign in" (before that fix it spun forever on "Connecting to Agriplan").
2. Add an Android app with package name `com.agricoders.agriplan` and the SHA-256 fingerprint of
   the key that signs the APK. For the debug signed builds the fingerprint is
   `FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C`.
   Add the fingerprint of your own release key before publishing to Google Play.
3. Allow the mobile redirect URL `agriplan://sso-callback` so "Continue with Google" can return to the app.

## Run it

```bash
cd mobile
npm install                 # .npmrc sets legacy-peer-deps (clerk-expo's optional peers)
cp .env.example .env        # already filled with the live Agriplan values
npx expo start              # press "a" for an Android emulator, or use a development build
```

`.env`:

| Var | Value | Notes |
|---|---|---|
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_live_…` | the website's Clerk key (public, safe to commit) |
| `EXPO_PUBLIC_API_URL` | `https://www.agricoders.com/api` | or `http://<LAN-ip>:3000/api` for a local `npm run dev` |

**Development build vs Expo Go.** The app includes `expo-dev-client`, so use a development build
(`eas build --profile development`, below) for the full native experience. Pointing the app at a
local website requires that site to use the same Clerk instance as the key, otherwise sign-in
tokens are rejected.

`npm run web` also works for a quick look in a browser (the production Clerk key only accepts
the agricoders.com domain, so sign-in works on devices, not on `localhost`).

## Builds (EAS)

| Profile | Output | Use |
|---|---|---|
| `preview` | installable `.apk` | share with testers (internal distribution) |
| `development` | `.apk` with the dev client | live-reload development against `expo start` |
| `production` | `.aab` | Google Play submission |

```bash
npx eas-cli login                                  # once per machine (account: enockstack)
npx eas-cli init                                   # once: creates the Agriplan project on expo.dev
npx eas-cli build -p android --profile preview     # → download link + QR for the .apk
```

`mobile/.env` is git-ignored and **not uploaded** to EAS, so build-time `EXPO_PUBLIC_*` values live
in `eas.json` (`build.base.env`). `app.config.js` allows cleartext traffic only while the API URL is
plain `http://`.

App identity: name **Agriplan**, scheme `agriplan` (Google sign-in redirect), Android package and
iOS bundle id `com.agricoders.agriplan`. Icons and splash images in `assets/` are rendered from the
stacked-layers mark in `src/components/AgriplanLogo.tsx`.

`android/` and `ios/` are git-ignored — run `npx expo prebuild` to generate them for a local build.
