import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSafeReturnPath } from "@/lib/auth/safe-redirect";
import { ORGANIZATION_ROLES, type OrganizationRole } from "@/types/roles";

type ProfileRecord = {
  id: string;
  auth_user_id: string;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
};

type MembershipRecord = {
  id: string;
  organization_id: string;
  profile_id: string;
  role: string;
  status: "active" | "pending" | "inactive";
  created_at: string;
};

type OrganizationRecord = {
  id: string;
  name: string;
  slug: string;
};

export type UserTenantContext = {
  status: "ready";
  user: User;
  profile: ProfileRecord;
  membership: MembershipRecord & { role: OrganizationRole };
  organization: OrganizationRecord;
};

export type AuthContext =
  | UserTenantContext
  | { status: "unconfigured" | "unauthenticated" | "onboarding" | "unavailable"; user?: User; reason?: string };

export type AppSession = {
  id: string;
  organizationId: string;
  role: OrganizationRole;
  isAuthenticated: true;
};

export type AuthenticatedUserResult =
  | { status: "authenticated"; user: User }
  | { status: "unconfigured" | "unauthenticated" | "unavailable" };

export const getAuthenticatedUser = cache(async (): Promise<AuthenticatedUserResult> => {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { status: "unconfigured" };
  }

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return { status: "unavailable" };
  }

  if (!data.user) {
    return { status: "unauthenticated" };
  }

  return { status: "authenticated", user: data.user };
});

export const getUserTenantContext = cache(async (): Promise<AuthContext> => {
  const auth = await getAuthenticatedUser();

  if (auth.status !== "authenticated") {
    return auth;
  }

  const user = auth.user;
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { status: "unconfigured" };
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("id, auth_user_id, first_name, last_name, display_name, avatar_url, created_at")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (profileError) {
    return { status: "unavailable", user, reason: "profile" };
  }

  const profile = profileData as ProfileRecord | null;

  if (!profile) {
    return { status: "onboarding", user };
  }

  const { data: membershipData, error: membershipError } = await supabase
    .from("organization_memberships")
    .select("id, organization_id, profile_id, role, status, created_at")
    .eq("profile_id", profile.id)
    .eq("status", "active")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (membershipError) {
    return { status: "unavailable", user, reason: "membership" };
  }

  const membership = membershipData as MembershipRecord | null;

  if (!membership) {
    return { status: "onboarding", user };
  }

  if (!ORGANIZATION_ROLES.includes(membership.role as OrganizationRole)) {
    return { status: "unavailable", user, reason: "role" };
  }

  const { data: organizationData, error: organizationError } = await supabase
    .from("organizations")
    .select("id, name, slug")
    .eq("id", membership.organization_id)
    .maybeSingle();

  if (organizationError || !organizationData) {
    return { status: "unavailable", user, reason: "organization" };
  }

  return {
    status: "ready",
    user,
    profile,
    membership: { ...membership, role: membership.role as OrganizationRole },
    organization: organizationData as OrganizationRecord,
  };
});

export function isAuthorizedForRole(
  role: OrganizationRole,
  allowedRoles: OrganizationRole[],
): boolean {
  return allowedRoles.includes(role);
}

export async function requireUser(nextPath = "/dashboard"): Promise<User> {
  const context = await getUserTenantContext();

  if (context.status === "unauthenticated") {
    redirect(`/login?next=${encodeURIComponent(getSafeReturnPath(nextPath))}`);
  }

  if (context.status === "onboarding") {
    redirect("/onboarding");
  }

  if (context.status === "unconfigured") {
    redirect(`/login?next=${encodeURIComponent(getSafeReturnPath(nextPath))}`);
  }

  if (context.status === "unavailable") {
    redirect("/auth-error");
  }

  if (context.status !== "ready") {
    redirect("/auth-error");
  }

  return context.user;
}

export async function requireMembership(nextPath = "/dashboard"): Promise<UserTenantContext> {
  await requireUser(nextPath);
  const context = await getUserTenantContext();

  if (context.status !== "ready") {
    redirect("/auth-error");
  }

  return context;
}

export async function requireOrganization(nextPath = "/dashboard") {
  const context = await requireMembership(nextPath);
  return context.organization;
}

export async function requireRole(
  allowedRoles: OrganizationRole[],
  nextPath = "/dashboard",
): Promise<UserTenantContext> {
  const context = await requireMembership(nextPath);

  if (!isAuthorizedForRole(context.membership.role, allowedRoles)) {
    redirect("/auth-error?reason=forbidden");
  }

  return context;
}

export async function getSession(): Promise<AppSession | null> {
  const context = await getUserTenantContext();

  if (context.status !== "ready") {
    return null;
  }

  return {
    id: context.user.id,
    organizationId: context.organization.id,
    role: context.membership.role,
    isAuthenticated: true,
  };
}

export function requireSession(session: AppSession | null): AppSession {
  if (!session) {
    throw new Error("Authentication required for this route.");
  }

  return session;
}
