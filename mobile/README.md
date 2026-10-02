# Agriplan Mobile (Expo / React Native)

Native Android + iOS app for **Agriplan**, the Agricoders business-plan generator (Expo SDK 57).
It talks to the **same API** as the website (`https://www.agricoders.com/api`) and the **same
Clerk instance**, so accounts, plans and credits are shared — no backend changes required.

The design follows the CropManager app: Inter typeface, the same green design tokens, cards,
badges, drawer navigation and Font Awesome solid icons.

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

Not yet on mobile (use the website): Admin Panel / User Management (admins get a shortcut in the
drawer), and uploading a company logo (a logo added on the website is kept when editing).

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
