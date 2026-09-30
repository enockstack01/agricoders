import { ClerkProvider } from "@clerk/nextjs";
import { Nunito } from "next/font/google";
import "./cropmanager.css";

// Rounded "sticker" type: Nunito's soft, rounded terminals at heavy weights (Snapchat-like feel)
const stickyFont = Nunito({
  variable: "--font-snap",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export default function PlanLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <div className={stickyFont.variable}>{children}</div>
    </ClerkProvider>
  );
}
