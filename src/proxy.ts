import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher, clerkClient } from "@clerk/nextjs/server";

const SUPER_ADMIN_EMAIL = "nshimiyimanaenock4@gmail.com";

const isProtectedRoute = createRouteMatcher([
  "/plan/dashboard(.*)",
  "/plan/admin(.*)",
  "/plan/super-admin(.*)",
  "/plan/form(.*)",
  "/plan/profile(.*)",
  "/api/submissions(.*)",
  "/api/generate(.*)",
  "/api/ai(.*)",
  "/api/admin(.*)",
  "/api/super-admin(.*)",
  "/api/profile(.*)",
  "/api/onehealth(.*)",
]);

// Pages a signed in user has no reason to see: the Agriplan landing page and the sign in or sign up screens.
const isSignedOutOnlyRoute = createRouteMatcher(["/plan", "/plan/sign-in(.*)", "/plan/sign-up(.*)"]);

// Users whose role has already been resolved by this server process. A new session token
// does not carry the role until it refreshes, so without this the lookup would repeat on every request.
const roleResolved = new Set<string>();

/**
 * Persists the role (admin, or user for everyone else) on the Clerk account the first time we see
 * someone. It runs in the background: the lookup takes two Clerk API calls, and waiting for them
 * is what used to delay the dashboard right after sign up.
 */
function resolveRoleInBackground(userId: string) {
  if (roleResolved.has(userId)) return;
  if (roleResolved.size > 10_000) roleResolved.clear();
  roleResolved.add(userId);

  void (async () => {
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      if (user.publicMetadata?.role) return;
      const email = user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress;
      await client.users.updateUserMetadata(userId, {
        publicMetadata: { role: email === SUPER_ADMIN_EMAIL ? "super_admin" : "user" },
      });
    } catch (err) {
      // let the next request try again
      roleResolved.delete(userId);
      console.error("[proxy] could not resolve the user role", err);
    }
  })();
}

export default clerkMiddleware(async (auth, req) => {
  const session = await auth();

  if (session.userId) {
    const meta = session.sessionClaims?.public_metadata as { role?: string } | undefined;
    if (!meta?.role) resolveRoleInBackground(session.userId);

    // Signed in already: go straight to the dashboard, with no page load and no waiting for the browser.
    if (isSignedOutOnlyRoute(req)) {
      return NextResponse.redirect(new URL("/plan/dashboard", req.url));
    }
  }

  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
