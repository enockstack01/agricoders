import { ClerkProvider } from "@clerk/nextjs";
import 'bootstrap/dist/css/bootstrap-grid.min.css';

export default function PlanLayout({ children }: { children: React.ReactNode }) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
