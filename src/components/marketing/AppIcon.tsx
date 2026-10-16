import Image from "next/image";

/** The product's real app icon (leaf, cow, layers), as used on the phone home screen. */
export default function AppIcon({ src, size = 48, className = "" }: { src: string; size?: number; className?: string }) {
  return (
    <Image
      src={src}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={`flex-shrink-0 shadow-sm ${className}`}
      style={{ width: size, height: size, borderRadius: Math.round(size * 0.22) }}
    />
  );
}
