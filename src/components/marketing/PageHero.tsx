import Reveal from "@/components/ui/Reveal";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  /** Optional content rendered below the title (e.g. a description or "Last updated" line). */
  children?: React.ReactNode;
}

/** Shared centered hero for secondary marketing pages (Apps, Privacy, Terms) —
 *  eyebrow label, fluid heading, optional subtitle, and an ambient floating blob. */
export default function PageHero({ eyebrow, title, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-gray-900 py-20 text-center">
      <div className="pointer-events-none absolute inset-0">
        <div className="mkt-float-slow absolute left-1/2 top-[-60px] h-[260px] w-[500px] -translate-x-1/2 rounded-full bg-green-600/[0.06] blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <Reveal>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-green-600">
              {eyebrow}
            </p>
            <h1
              className="mb-3 text-balance font-extrabold leading-tight text-gray-900 dark:text-white"
              style={{ fontSize: "clamp(28px, 5vw, 48px)" }}
            >
              {title}
            </h1>
            {children}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
