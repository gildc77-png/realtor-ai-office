ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.autonomy_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members_can_view_organizations" ON public.organizations
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.organization_memberships om
    JOIN public.profiles p ON p.id = om.profile_id
    WHERE om.organization_id = organizations.id
      AND p.auth_user_id = auth.uid()
      AND om.status = 'active'
  )
);

CREATE POLICY "members_can_view_profiles_in_org" ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.organization_memberships om
    WHERE om.profile_id = profiles.id
      AND om.status = 'active'
      AND EXISTS (
        SELECT 1
        FROM public.profiles current_profile
        WHERE current_profile.auth_user_id = auth.uid()
          AND current_profile.id = om.profile_id
      )
  )
);

CREATE POLICY "members_can_view_org_memberships" ON public.organization_memberships
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = organization_memberships.profile_id
      AND p.auth_user_id = auth.uid()
  )
);

CREATE POLICY "members_can_manage_own_approval_records" ON public.approvals
FOR ALL
USING (
  organization_id IN (
    SELECT om.organization_id
    FROM public.organization_memberships om
    JOIN public.profiles p ON p.id = om.profile_id
    WHERE p.auth_user_id = auth.uid()
      AND om.status = 'active'
  )
)
WITH CHECK (
  organization_id IN (
    SELECT om.organization_id
    FROM public.organization_memberships om
    JOIN public.profiles p ON p.id = om.profile_id
    WHERE p.auth_user_id = auth.uid()
      AND om.status = 'active'
  )
);

CREATE POLICY "members_can_write_audit_events" ON public.audit_events
FOR INSERT
WITH CHECK (
  organization_id IN (
    SELECT om.organization_id
    FROM public.organization_memberships om
    JOIN public.profiles p ON p.id = om.profile_id
    WHERE p.auth_user_id = auth.uid()
      AND om.status = 'active'
  )
);

CREATE POLICY "members_can_view_audit_events" ON public.audit_events
FOR SELECT
USING (
  organization_id IN (
    SELECT om.organization_id
    FROM public.organization_memberships om
    JOIN public.profiles p ON p.id = om.profile_id
    WHERE p.auth_user_id = auth.uid()
      AND om.status = 'active'
  )
);

CREATE POLICY "org_members_can_view_policy_records" ON public.autonomy_policies
FOR SELECT
USING (
  organization_id IN (
    SELECT om.organization_id
    FROM public.organization_memberships om
    JOIN public.profiles p ON p.id = om.profile_id
    WHERE p.auth_user_id = auth.uid()
      AND om.status = 'active'
  )
);
