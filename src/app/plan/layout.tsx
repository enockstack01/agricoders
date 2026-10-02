import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./cropmanager.css";

// CropManager's typeface (Inter 400–800), exposed to cropmanager.css as --font-cm
const cmFont = Inter({
  variable: "--font-cm",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export default function PlanLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <div className={cmFont.variable}>{children}</div>
    </ClerkProvider>
  );
}
