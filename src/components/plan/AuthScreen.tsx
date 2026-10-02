"use client";
// Split-screen sign-in / sign-up — port of Crop-Manager's AuthScreen:
// brand panel on the left, Clerk form on the right (brand panel hides on mobile).
import Link from "next/link";
import { SignIn, SignUp } from "@clerk/nextjs";
import { ArrowLeft, CheckCircle2 } from "@/components/plan/icons";
import { LogoMark } from "@/components/plan/ui";

// brand the Clerk form; our own sign-in / sign-up switch link replaces Clerk's card footer
const appearance = {
  layout: { socialButtonsVariant: "blockButton" as const, socialButtonsPlacement: "top" as const },
  variables: { colorPrimary: "#2E7D32", borderRadius: "10px", fontFamily: "var(--font-cm), Inter, system-ui, sans-serif" },
  elements: {
    footerAction: { display: "none" },
    socialButtonsBlockButton: { minHeight: "46px", fontWeight: 600 },
    formButtonPrimary: { minHeight: "44px", fontWeight: 700 },
  },
};

const POINTS = [
  "Investor-ready business plan (.docx)",
  "19-sheet financial model (.xlsx)",
  "AI narrative + embedded charts",
];

export default function AuthScreen({ mode = "sign-in" }: { mode?: "sign-in" | "sign-up" }) {
  const isSignUp = mode === "sign-up";
  return (
    <div className="cm-app">
      <div className="auth-split">
        <div className="auth-split-brand">
          <div className="auth-split-brand-icon">
            <LogoMark size={56} />
          </div>
          <h1>Agriplan</h1>
          <p>
            Turn your business data into professional business plans and financial models — generated
            automatically, ready for investors and lenders.
          </p>
          <ul className="auth-split-points">
            {POINTS.map((p) => (
              <li key={p}>
                <CheckCircle2 size={18} />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="auth-split-form">
          <div className="auth-split-form-wrapper">
            <Link href="/" className="auth-back">
              <ArrowLeft size={13} />
              Back to agricoders.com
            </Link>
            <div className="auth-split-mobile-brand" aria-hidden="true">
              <span className="auth-split-mobile-logo">
                <LogoMark size={22} />
              </span>
              Agriplan
            </div>
            <h2>{isSignUp ? "Create your account" : "Welcome"}</h2>
            <p className="subtitle">
              {isSignUp ? "Start building your business plan today" : "Sign in to your business planning dashboard"}
            </p>

            {isSignUp ? (
              <SignUp forceRedirectUrl="/plan/dashboard" signInUrl="/plan/sign-in" appearance={appearance} />
            ) : (
              <SignIn forceRedirectUrl="/plan/dashboard" signUpUrl="/plan/sign-up" appearance={appearance} />
            )}

            <p className="auth-split-switch">
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <Link href={isSignUp ? "/plan/sign-in" : "/plan/sign-up"}>{isSignUp ? "Sign in" : "Sign up"}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
