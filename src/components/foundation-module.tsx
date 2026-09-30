import Link from "next/link";
import { SignOutButton } from "@/components/auth/sign-out-button";

export type ModuleKey =
  | "properties"
  | "leads"
  | "marketing"
  | "calendar"
  | "tasks"
  | "documents"
  | "analytics"
  | "settings"
  | "assistant";

const moduleContent: Record<ModuleKey, { title: string; description: string; detail: string; action: string; href: string }> = {
  properties: {
    title: "Properties",
    description: "Manage listings, property details, media, and publication readiness.",
    detail: "Property records and listing workflows will be connected in a future foundation checkpoint.",
    action: "Add Property",
    href: "/properties/new",
  },
  leads: {
    title: "Leads",
    description: "Review prospective clients and keep your follow-up work organized.",
    detail: "Lead records, qualification, and CRM workflows are not connected yet.",
    action: "View dashboard",
    href: "/dashboard",
  },
  marketing: {
    title: "Marketing",
    description: "Prepare listing content and review upcoming publication drafts.",
    detail: "No content is published or sent externally from this foundation surface.",
    action: "View dashboard",
    href: "/dashboard",
  },
  calendar: {
    title: "Calendar",
    description: "Keep showings, client calls, and daily plans in view.",
    detail: "Calendar synchronization and event management are not connected yet.",
    action: "View dashboard",
    href: "/dashboard",
  },
  tasks: {
    title: "Tasks",
    description: "Track follow-ups and the next steps for your real estate work.",
    detail: "Task completion on this page is not persisted. Database-backed task management is deferred.",
    action: "View dashboard",
    href: "/dashboard",
  },
  documents: {
    title: "Documents",
    description: "A future workspace for offers, agreements, and property files.",
    detail: "Document storage and access controls are not connected on this foundation page.",
    action: "View dashboard",
    href: "/dashboard",
  },
  analytics: {
    title: "Analytics",
    description: "Review the metrics that help you understand listing and lead activity.",
    detail: "The figures currently shown across the dashboard are demonstration data.",
    action: "View dashboard",
    href: "/dashboard",
  },
  settings: {
    title: "Settings",
    description: "Your profile and workspace preferences will live here.",
    detail: "Authentication, organization membership, and saved preferences are not configured here.",
    action: "View dashboard",
    href: "/dashboard",
  },
  assistant: {
    title: "Chispita Assistant",
    description: "A foundation surface for the future assistant experience.",
    detail: "Assistant integration is coming next. Your query was not sent, and no AI response was generated.",
    action: "Return to dashboard",
    href: "/dashboard",
  },
};

export type AccountDetails = {
  name: string;
  email: string;
  organization: string;
  role: string;
};

export function FoundationModule({ module, account }: { module: ModuleKey; account?: AccountDetails }) {
  const content = moduleContent[module];

  if (module === "settings" && account) {
    return (
      <section className="foundation-page" aria-labelledby="module-title">
        <header className="foundation-header">
          <div>
            <p className="eyebrow">Realtor AI Office</p>
            <h1 id="module-title">Settings</h1>
            <p>Manage your account and current workspace.</p>
          </div>
        </header>
        <div className="account-grid">
          <section className="panel account-panel" aria-labelledby="account-heading">
            <h2 id="account-heading">Account</h2>
            <dl>
              <div><dt>Name</dt><dd>{account.name}</dd></div>
              <div><dt>Email</dt><dd>{account.email}</dd></div>
            </dl>
          </section>
          <section className="panel account-panel" aria-labelledby="workspace-heading">
            <h2 id="workspace-heading">Workspace</h2>
            <dl>
              <div><dt>Organization</dt><dd>{account.organization}</dd></div>
              <div><dt>Current role</dt><dd>{account.role}</dd></div>
            </dl>
          </section>
          <section className="panel account-panel" aria-labelledby="session-heading">
            <h2 id="session-heading">Session</h2>
            <p>Sign out of this account on this device.</p>
            <SignOutButton />
          </section>
        </div>
      </section>
    );
  }

  return (
    <section className="foundation-page" aria-labelledby="module-title">
      <header className="foundation-header">
        <div>
          <p className="eyebrow">Realtor AI Office</p>
          <h1 id="module-title">{content.title}</h1>
          <p>{content.description}</p>
        </div>
        <Link className="action-button foundation-action" href={content.href}>{content.action}</Link>
      </header>
      <div className="panel foundation-content">
        <span className="foundation-mark" aria-hidden="true">✦</span>
        <div>
          <h2>Module foundation</h2>
          <p>{content.detail}</p>
          <span className="foundation-status">Foundation surface</span>
        </div>
      </div>
    </section>
  );
}