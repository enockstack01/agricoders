"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Coins, ArrowRight, Loader2 } from "lucide-react";

export default function PaymentSuccessPage() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Brief delay so the webhook has time to fire before the user reloads dashboard
    const t = setTimeout(() => setChecked(true), 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">

        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={32} className="text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Your credits have been added to your account. You can now generate business plans and financial models.
        </p>

        {/* Credits indicator */}
        <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 mb-6 flex items-center justify-center gap-3">
          <Coins size={18} className="text-green-600 flex-shrink-0" />
          <p className="text-sm font-semibold text-green-800">Credits added to your account</p>
        </div>

        {sessionId && (
          <p className="text-xs text-gray-400 mb-6 font-mono truncate">
            Ref: {sessionId}
          </p>
        )}

        {!checked ? (
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
            <Loader2 size={14} className="animate-spin" />
            Confirming your balance…
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/dashboard"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              Go to Dashboard
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/profile"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl border border-gray-200 transition-colors text-sm"
            >
              View Credits
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
