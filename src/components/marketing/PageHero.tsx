import { Sparkle } from "@phosphor-icons/react/dist/ssr";
import Reveal from "@/components/ui/Reveal";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  /** Optional content rendered below the title (e.g. a description or "Last updated" line). */
  children?: React.ReactNode;
}

/** Shared centered hero for secondary marketing pages (Apps, Privacy, Terms) —
 *  eyebrow pill, fluid heavy heading, optional subtitle, on the landing-page mesh background. */
export default function PageHero({ eyebrow, title, children }: PageHeroProps) {
  return (
    <section className="mkt-mesh relative overflow-hidden py-20 text-center sm:py-24">
      <div className="mkt-grid-dots pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <Reveal>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-green-600/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-green-700 dark:bg-green-400/10 dark:text-green-300">
              <Sparkle size={14} weight="fill" />
              {eyebrow}
            </span>
            <h1 className="mb-3 text-balance text-[clamp(2rem,5vw,3.4rem)] font-black leading-tight tracking-tight text-gray-900 dark:text-white">
              {title}
            </h1>
            {children}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
