export type OrganizationRole = "owner" | "admin" | "agent" | "assistant" | "viewer";
export type MembershipStatus = "active" | "pending" | "inactive";
export type ApprovalStatus = "pending" | "approved" | "rejected" | "cancelled";
export type AutonomyLevel = "prepare" | "prepare_approve" | "autopilot";

export const ORGANIZATION_ROLES: OrganizationRole[] = [
  "owner",
  "admin",
  "agent",
  "assistant",
  "viewer",
];

export const ROLE_LABELS: Record<OrganizationRole, string> = {
  owner: "Owner",
  admin: "Admin",
  agent: "Agent",
  assistant: "Assistant",
  viewer: "Viewer",
};

export const AUTONOMY_LEVELS: Record<AutonomyLevel, string> = {
  prepare: "Prepare",
  prepare_approve: "Prepare + Approve",
  autopilot: "Autopilot",
};

export const APPROVAL_STATUSES: ApprovalStatus[] = [
  "pending",
  "approved",
  "rejected",
  "cancelled",
];
