import type { ReactNode } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="auth-layout">
      <section className="auth-brand" aria-label="Realtor AI Office">
        <Link className="auth-brand-link" href="/login">
          <span className="brand-mark" aria-hidden="true">R</span>
          <span>Realtor AI Office</span>
        </Link>
        <div className="auth-brand-copy">
          <p className="auth-powered">Powered by Chispita</p>
          <h1>Your real estate office, ready for what’s next.</h1>
          <p>One workspace for the people, properties, and decisions that move your business forward.</p>
        </div>
      </section>
      <section className="auth-main">
        <div className="auth-theme-toggle"><ThemeToggle /></div>
        <div className="auth-card">{children}</div>
      </section>
    </main>
  );
}