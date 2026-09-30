import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { FoundationModule, type ModuleKey } from "@/components/foundation-module";
import { requireMembership } from "@/lib/auth/session";
import { ROLE_LABELS } from "@/types/roles";

const modules = ["dashboard", "properties", "leads", "marketing", "calendar", "tasks", "documents", "analytics", "settings", "assistant"] as const;

export function generateStaticParams() {
  return modules.map((module) => ({ module }));
}

export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params;

  if (!modules.includes(module as (typeof modules)[number])) {
    notFound();
  }

  if (module === "dashboard") {
    return <DashboardShell />;
  }

  if (module === "settings") {
    const context = await requireMembership("/settings");
    const name = context.profile.display_name?.trim()
      || [context.profile.first_name, context.profile.last_name].filter(Boolean).join(" ").trim()
      || context.user.email
      || "Account";

    return (
      <FoundationModule
        module="settings"
        account={{
          name,
          email: context.user.email ?? "",
          organization: context.organization.name,
          role: ROLE_LABELS[context.membership.role],
        }}
      />
    );
  }

  return <FoundationModule module={module as ModuleKey} />;
}