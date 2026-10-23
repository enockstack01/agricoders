import { ClerkProvider } from "@clerk/nextjs";
import "./cropmanager.css";

// Where Clerk sends people after signing in or up. Set here, not only in environment variables,
// so a wrong value on the host (for example /dashboard, which does not exist) can never send someone
// to the wrong page or leave them on a sign in screen.
const DASHBOARD = "/plan/dashboard";

export default function PlanLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      signInUrl="/plan/sign-in"
      signUpUrl="/plan/sign-up"
      signInForceRedirectUrl={DASHBOARD}
      signUpForceRedirectUrl={DASHBOARD}
      signInFallbackRedirectUrl={DASHBOARD}
      signUpFallbackRedirectUrl={DASHBOARD}
      afterSignOutUrl="/plan"
    >
      {children}
    </ClerkProvider>
  );
}
