# Planner Mobile (Expo / React Native)

Native Android + iOS app for **Planner**, the Agricoders business-plan generator (Expo SDK 57).
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

- **Company logo** — pick a picture in Step 1 of the wizard. It is scaled to 600 px wide, saved as PNG
  and shown on the cover page of the business plan, the same as the website.
- **Admin Panel** (admins and super admins) — Overview (platform numbers and plans per day), Users
  (search, add or remove credits, credit history), Plans (every plan, searchable) and Requests
  (approve or reject credit requests, with a note).
- **User Management** (super admins) — see every user and change their role.

Not yet on mobile (use the website): the Disease risk tab of the Admin Panel (the drawer has a
"More admin tools (website)" shortcut for admins).

## Clerk setup for the mobile app

The app signs in through the same Clerk production instance as the website, and Clerk must allow
native apps. In the Clerk dashboard, open **Configure, then Native applications** and:

1. Turn **Native API** on. If it is off, Clerk never finishes loading and the app shows
   "Can't connect to sign in" (before that fix it spun forever on "Connecting to Planner").
2. Add an Android app with package name `com.agricoders.planner` and the SHA-256 fingerprint of
   the key that signs the APK. For the debug signed builds the fingerprint is
   `FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C`.
   Add the fingerprint of your own release key before publishing to Google Play.
3. Allow the mobile redirect URL `planner://sso-callback` so "Continue with Google" can return to the app.

## How the app is laid out (phones and tablets)

- **Phones:** a bottom tab bar (Home, Plans, New plan, Credits, Profile) under a forest green app bar that shows
  the screen title. The plan wizard is a full screen flow with a close button, a sticky step header and a
  sticky Back and Next bar. Admin tools are reached from Profile and show a back arrow.
- **Tablets:** the permanent side menu stays.
- **Menus, forms and confirmations** open as bottom sheets on phones (drag handle, swipe down to close).
- **Drafts:** the plan wizard saves what you type on the phone and offers to continue next time.
- **Offline:** an amber strip appears under the app bar when there is no connection, and screens refresh by
  themselves when the connection comes back.
- Inputs are 48 px tall with 16 px text, buttons are 48 px, and the smallest text is 12 px.

## Preview every screen in a browser (development only)

`preview/` renders the real screens in a browser with a stand in for Clerk and sample data, so a screen can be
checked without signing in or a phone. It is switched on only by the `EXPO_PUBLIC_PREVIEW=1` variable
(see `metro.config.js`) and is never part of a normal or release build.

```bash
# bash
EXPO_PUBLIC_PREVIEW=1 npx expo start --web
# PowerShell
$env:EXPO_PUBLIC_PREVIEW="1"; npx expo start --web
```

Add `?role=user`, `?role=admin` or `?role=super_admin` to the address to pick the signed in role (default
`super_admin`). The browser keeps inactive tab screens mounted underneath the active one; a phone does not.

## Run it

```bash
cd mobile
npm install                 # .npmrc sets legacy-peer-deps (clerk-expo's optional peers)
cp .env.example .env        # already filled with the live Planner values
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
npx eas-cli init                                   # once: creates the Planner project on expo.dev
npx eas-cli build -p android --profile preview     # → download link + QR for the .apk
```

`mobile/.env` is git-ignored and **not uploaded** to EAS, so build-time `EXPO_PUBLIC_*` values live
in `eas.json` (`build.base.env`). `app.config.js` allows cleartext traffic only while the API URL is
plain `http://`.

App identity: name **Planner**, scheme `planner` (Google sign-in redirect), Android package and
iOS bundle id `com.agricoders.planner`. Icons and splash images in `assets/` are rendered from the
stacked-layers mark in `src/components/PlannerLogo.tsx`.

`android/` and `ios/` are git-ignored — run `npx expo prebuild` to generate them for a local build.
