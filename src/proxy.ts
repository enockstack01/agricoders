import { clerkMiddleware, createRouteMatcher, clerkClient } from "@clerk/nextjs/server";

const SUPER_ADMIN_EMAIL = "nshimiyimanaenock4@gmail.com";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/admin(.*)",
  "/super-admin(.*)",
  "/form(.*)",
  "/profile(.*)",
  "/api/submissions(.*)",
  "/api/generate(.*)",
  "/api/ai(.*)",
  "/api/admin(.*)",
  "/api/super-admin(.*)",
  "/api/profile(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const session = await auth();
  if (session.userId) {
    const meta = session.sessionClaims?.public_metadata as { role?: string } | undefined;
    if (meta?.role !== "super_admin") {
      const client = await clerkClient();
      const user = await client.users.getUser(session.userId);
      const email = user.emailAddresses.find(
        (e) => e.id === user.primaryEmailAddressId
      )?.emailAddress;
      if (email === SUPER_ADMIN_EMAIL) {
        await client.users.updateUserMetadata(session.userId, {
          publicMetadata: { role: "super_admin" },
        });
      }
    }
  }
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
