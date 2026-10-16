import Reveal from "@/components/ui/Reveal";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  /** Optional content rendered below the title (e.g. a description or "Last updated" line). */
  children?: React.ReactNode;
}

/** Shared hero for secondary marketing pages (Systems, Privacy, Terms), in the Agricoders deck style:
 *  forest green band, amber tracked eyebrow, white bold title, sits directly below the header bar. */
export default function PageHero({ eyebrow, title, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#1B5E20] pb-16 text-white sm:pb-20">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-white/[0.04]" />
      <div className="pointer-events-none absolute -bottom-48 left-1/4 h-[420px] w-[420px] rounded-full bg-black/10" />
      <div className="relative mx-auto max-w-7xl px-4 pt-14 sm:px-6 sm:pt-20 lg:px-8">
        <div className="max-w-3xl">
          <Reveal>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.28em] text-[#F9A825]">{eyebrow}</p>
            <h1 className="mb-4 text-balance text-[clamp(2.2rem,5vw,3.8rem)] font-bold leading-tight tracking-tight">{title}</h1>
            <div className="text-lg text-green-50/90 [&_p]:m-0">{children}</div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
