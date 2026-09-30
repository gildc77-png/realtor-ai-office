# Architecture

## Conceptual system architecture

Realtor AI Office is designed as a layered application with a clear separation between the core product domain and external provider integrations.

At a high level, the system will include:

- a presentation layer for real-estate workflows and operational views
- a core domain layer for assistant orchestration, property records, tasks, approvals, and audit data
- a security and policy layer for tenant scoping, authorization boundaries, and approval checks
- integration boundaries for external providers such as MLS, messaging, marketing channels, and productivity systems

The foundation intentionally avoids tying provider logic directly into the application domain. Future integrations should use adapter or service boundary patterns so data and business logic remain provider-agnostic.

## Multi-tenant direction

The product is intentionally designed as a multi-tenant SaaS platform. Future business records must be tenant-scoped, including but not limited to:

- users
- listings and properties
- leads
- campaigns
- conversations
- tasks
- approvals
- audit events

Future database work must embrace deny-by-default access patterns and Row Level Security. Tenant separation is a product requirement, not a convenience feature.

## AI assistant role

The platform is being structured around an eventual AI assistant, currently referred to as Chispita AI.

The assistant is expected to:

- organize and classify authorized real-estate data
- prepare work for agents and brokers
- surface recommendations and drafts
- coordinate approved actions within policy boundaries
- request human approval when needed

This foundation does not implement the assistant or any autonomous workflows yet. It only provides the system boundary and domain structure needed for future development.

## Autonomy model

The architecture will support autonomy per task and per channel.

- Level 1 — PREPARE: Chispita prepares the work; the realtor executes it.
- Level 2 — PREPARE + APPROVE: Chispita prepares the work; the realtor approves it; Chispita executes it.
- Level 3 — AUTOPILOT: Chispita executes automatically according to predefined permissions and rules.

This model should be enforced through explicit task policies rather than implicit assumptions.

## Approvals principle

Sensitive or externally visible operations require permission-aware approval policies before execution. Examples include:

- publishing content
- sending client communications
- changing listing information
- confirming appointments
- executing high-impact external actions

The architecture should not assume that AI has unrestricted authority. Approval flows should be treated as a product requirement, not an afterthought.

## Auditability principle

Future AI actions must be auditable. The system should record:

- who initiated the action
- whether AI or human initiated it
- what action was attempted
- target resource
- relevant input or context reference
- approval requirement
- approval result
- execution result
- timestamp
- errors when applicable

The audit trail is a safety and compliance requirement for future operational automation.

## Future integration boundaries

External integrations must remain provider-isolated and should not leak provider-specific logic through the application domain.

Examples of future providers include:

- MLS / RESO
- Meta / Instagram / Facebook
- LinkedIn
- Google
- Microsoft
- email
- messaging
- eSignature

These providers should be accessed through controlled adapter or service boundaries that translate provider details into domain-safe contracts.

## Separation of core logic and external providers

The application domain should remain stable even as provider ecosystems evolve. Core logic should focus on real-estate workflows, approvals, task orchestration, and operational records. External providers should be handled behind clear interfaces and normalized data models.

This foundation explicitly does not implement provider adapters. It only establishes the boundary that future integrations will need.
