import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { FoundationModule, type ModuleKey } from "@/components/foundation-module";

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

  return <FoundationModule module={module as ModuleKey} />;
}