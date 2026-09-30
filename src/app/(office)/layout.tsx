import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";

export default function OfficeLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}