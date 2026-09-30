import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import { requireMembership } from "@/lib/auth/session";
import { ROLE_LABELS } from "@/types/roles";

function getInitials(name: string, email: string): string {
  const source = name.trim() || email;
  const parts = source.split(/[\s@._-]+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("") || "U";
}

export default async function OfficeLayout({ children }: { children: ReactNode }) {
  const context = await requireMembership();
  const email = context.user.email ?? "";
  const name = context.profile.display_name?.trim()
    || [context.profile.first_name, context.profile.last_name].filter(Boolean).join(" ").trim()
    || email;

  return (
    <AppShell
      identity={{
        name,
        email,
        initials: getInitials(name, email),
        role: ROLE_LABELS[context.membership.role],
        organization: context.organization.name,
      }}
    >
      {children}
    </AppShell>
  );
}