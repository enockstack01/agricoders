import Image from "next/image";

/** Official Agricoders logo (navy circuit-tree) on a white disc, exactly as used in the pitch decks. */
export default function BrandMark({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      className={`inline-flex flex-shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image src="/brand/agricoders-logo.png" alt="Agricoders" width={size} height={size} className="rounded-full" priority />
    </span>
  );
}
