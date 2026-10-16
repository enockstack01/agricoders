import { ClerkProvider } from "@clerk/nextjs";
import "./cropmanager.css";

export default function PlanLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      {children}
    </ClerkProvider>
  );
}
