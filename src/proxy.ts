import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

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
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
