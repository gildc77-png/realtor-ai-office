import type { OrganizationRole } from "@/types/roles";

export type AppSession = {
  id: string;
  organizationId: string;
  role: OrganizationRole;
  isAuthenticated: boolean;
};

export function isAuthorizedForRole(
  role: OrganizationRole,
  allowedRoles: OrganizationRole[],
): boolean {
  return allowedRoles.includes(role);
}

export function requireSession(session: AppSession | null): AppSession {
  if (!session || !session.isAuthenticated) {
    throw new Error("Authentication required for this route.");
  }

  return session;
}

export async function getSession(): Promise<AppSession | null> {
  return null;
}
