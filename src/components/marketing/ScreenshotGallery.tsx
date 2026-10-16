"use client";
import { useState } from "react";
import Image from "next/image";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import type { Screenshot } from "@/lib/apps";

/** One large device-framed screenshot with a thumbnail strip underneath. Used on the Systems page. */
export default function ScreenshotGallery({ shots, name }: { shots: Screenshot[]; name: string }) {
  const [index, setIndex] = useState(0);
  if (shots.length === 0) return null;
  const current = shots[index];
  const multiple = shots.length > 1;
  const go = (delta: number) => setIndex((i) => (i + delta + shots.length) % shots.length);

  return (
    <div>
      <div className="relative overflow-hidden rounded-xl border-[6px] border-[#111611] bg-[#111611] shadow-2xl">
        <div className="relative flex aspect-[16/10] items-center justify-center">
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            width={current.width}
            height={current.height}
            sizes="(min-width: 1024px) 640px, 100vw"
            className="max-h-full w-auto max-w-full object-contain"
          />
        </div>
        {multiple && (
          <>
            <button
              type="button"
              aria-label={`Previous ${name} screenshot`}
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-white/90 text-[#1B5E20] shadow-md transition-transform hover:scale-105"
            >
              <CaretLeft size={20} weight="bold" />
            </button>
            <button
              type="button"
              aria-label={`Next ${name} screenshot`}
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-white/90 text-[#1B5E20] shadow-md transition-transform hover:scale-105"
            >
              <CaretRight size={20} weight="bold" />
            </button>
          </>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-sm">
        <p className="m-0 font-bold">{current.alt}</p>
        {multiple && (
          <p className="m-0 flex-shrink-0 opacity-70">
            {index + 1} / {shots.length}
          </p>
        )}
      </div>

      {multiple && (
        <ul className="m-0 mt-3 flex list-none gap-2 overflow-x-auto p-0 pb-2" aria-label={`${name} screenshots`}>
          {shots.map((s, i) => (
            <li key={s.src} className="flex-shrink-0">
              <button
                type="button"
                aria-label={`Show ${s.alt}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={`block h-16 w-24 overflow-hidden rounded-lg border-2 bg-[#111611] p-0 transition-all ${
                  i === index ? "border-[#F9A825]" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={s.src} alt="" width={160} height={100} className="h-full w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
