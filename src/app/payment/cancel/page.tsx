"use client";
import Link from "next/link";
import { XCircle, ArrowLeft, CreditCard } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">

        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
          <XCircle size={32} className="text-red-400" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Your payment was cancelled and you have not been charged. You can try again whenever you are ready.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/profile"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            <CreditCard size={15} />
            Buy Credits
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl border border-gray-200 transition-colors text-sm"
          >
            <ArrowLeft size={15} />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
