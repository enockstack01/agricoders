import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { Layers, ArrowLeft } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full flex flex-col items-center mb-6" style={{ maxWidth: 420 }}>
        <Link
          href="/"
          className="self-start inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 no-underline mb-6"
        >
          <ArrowLeft size={13} />
          Back to agricoders.com
        </Link>
        <div className="flex items-center gap-2.5 mb-3">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{ width: 40, height: 40, background: "#2E7D32" }}
          >
            <Layers size={19} color="white" />
          </div>
          <span className="font-bold text-gray-900 text-lg tracking-tight">Logistack Plan</span>
        </div>
        <h1 className="text-center font-bold text-gray-900 text-xl mb-1.5">
          Sign in to Logistack Plan
        </h1>
        <p className="text-center text-sm text-gray-500">
          One of the applications built on the Agricoders platform.
        </p>
      </div>
      <SignIn forceRedirectUrl="/plan/dashboard" />
    </div>
  );
}
