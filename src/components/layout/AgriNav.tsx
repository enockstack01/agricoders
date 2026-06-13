"use client";
import { useState } from "react";
import Link from "next/link";
import { Sprout, Layers, ArrowRight, Menu, X } from "lucide-react";

export default function AgriNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container-xl px-4">
        <div className="flex items-center justify-between h-16">

          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 no-underline">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{ width: 36, height: 36, background: "#16a34a" }}
            >
              <Sprout size={16} color="white" />
            </div>
            <span className="font-bold text-gray-900 text-[15px] tracking-tight">Agricoders</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <a
              href="#services"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all no-underline"
            >
              Services
            </a>
            <Link
              href="/app"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all no-underline"
            >
              Logistack Plan
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/app"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-all border border-gray-200 no-underline"
            >
              <Layers size={13} style={{ color: "#16a34a" }} />
              Logistack Plan
            </Link>
            <Link
              href="/sign-up"
              className="flex items-center gap-2 px-4 py-2 text-white text-sm font-bold rounded-xl transition-all shadow-sm no-underline"
              style={{ background: "#16a34a" }}
            >
              Get Started
              <ArrowRight size={14} />
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors border-0 bg-transparent"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-3">
          <div className="flex flex-col gap-1 mb-3">
            <a
              href="#services"
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg no-underline"
            >
              Services
            </a>
            <Link
              href="/app"
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg no-underline"
            >
              Logistack Plan
            </Link>
          </div>
          <div className="flex flex-col gap-2 pt-3 border-t border-gray-100">
            <Link
              href="/sign-in"
              className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 text-center no-underline"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-white text-sm font-semibold rounded-xl no-underline"
              style={{ background: "#16a34a" }}
            >
              Get Started
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
