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

export type RoleCapabilities = {
  manageWorkspace: boolean;
  manageMembers: boolean;
  viewRecords: boolean;
  operateRecords: boolean;
  approveActions: boolean;
};

export const ROLE_CAPABILITIES: Record<OrganizationRole, RoleCapabilities> = {
  owner: { manageWorkspace: true, manageMembers: true, viewRecords: true, operateRecords: true, approveActions: true },
  admin: { manageWorkspace: true, manageMembers: true, viewRecords: true, operateRecords: true, approveActions: true },
  agent: { manageWorkspace: false, manageMembers: false, viewRecords: true, operateRecords: true, approveActions: false },
  assistant: { manageWorkspace: false, manageMembers: false, viewRecords: true, operateRecords: false, approveActions: false },
  viewer: { manageWorkspace: false, manageMembers: false, viewRecords: true, operateRecords: false, approveActions: false },
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
