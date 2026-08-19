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

export default clerkMiddleware(async (auth, req) => {
  const session = await auth();
  if (session.userId) {
    const meta = session.sessionClaims?.public_metadata as { role?: string } | undefined;
    // Role is unset only the very first time we see this user — resolve and persist
    // it once so every later request can read it straight off the session token
    // instead of paying a Clerk Backend API round-trip on every navigation.
    if (!meta?.role) {
      const client = await clerkClient();
      const user = await client.users.getUser(session.userId);
      const email = user.emailAddresses.find(
        (e) => e.id === user.primaryEmailAddressId
      )?.emailAddress;
      await client.users.updateUserMetadata(session.userId, {
        publicMetadata: { role: email === SUPER_ADMIN_EMAIL ? "super_admin" : "user" },
      });
    }
  }
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
