CREATE OR REPLACE FUNCTION public.complete_workspace_onboarding(
  p_full_name text,
  p_organization_name text
)
RETURNS TABLE (
  result_organization_id uuid,
  result_organization_name text,
  result_role text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_auth_user_id uuid;
  v_email text;
  v_profile_id uuid;
  v_organization_id uuid;
  v_membership_id uuid;
  v_full_name text;
  v_organization_name text;
  v_slug_base text;
  v_organization_slug text;
  v_first_name text;
  v_last_name text;
BEGIN
  v_auth_user_id := auth.uid();

  IF v_auth_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.' USING ERRCODE = '42501';
  END IF;

  PERFORM pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(v_auth_user_id::text, 0)
  );

  v_full_name := pg_catalog.btrim(p_full_name);
  v_organization_name := pg_catalog.btrim(p_organization_name);

  IF v_full_name IS NULL
    OR v_organization_name IS NULL
    OR pg_catalog.char_length(v_full_name) < 2
    OR pg_catalog.char_length(v_full_name) > 120
    OR pg_catalog.char_length(v_organization_name) < 2
    OR pg_catalog.char_length(v_organization_name) > 120 THEN
    RAISE EXCEPTION 'Name and workspace are required.' USING ERRCODE = '22023';
  END IF;

  SELECT users.email
  INTO v_email
  FROM auth.users AS users
  WHERE users.id = v_auth_user_id;

  IF v_email IS NULL THEN
    RAISE EXCEPTION 'Authenticated account unavailable.' USING ERRCODE = '42501';
  END IF;

  v_first_name := pg_catalog.split_part(v_full_name, ' ', 1);
  v_last_name := NULLIF(
    pg_catalog.btrim(pg_catalog.substr(v_full_name, pg_catalog.char_length(v_first_name) + 1)),
    ''
  );

  INSERT INTO public.profiles (
    auth_user_id,
    first_name,
    last_name,
    display_name
  )
  VALUES (
    v_auth_user_id,
    v_first_name,
    v_last_name,
    v_full_name
  )
  ON CONFLICT (auth_user_id) DO UPDATE
  SET first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      display_name = EXCLUDED.display_name,
      updated_at = pg_catalog.now()
  RETURNING id INTO v_profile_id;

  IF EXISTS (
    SELECT 1
    FROM public.organization_memberships AS memberships
    WHERE memberships.profile_id = v_profile_id
      AND memberships.status = 'active'
  ) THEN
    RAISE EXCEPTION 'An active workspace membership already exists.' USING ERRCODE = '23505';
  END IF;

  v_organization_id := pg_catalog.gen_random_uuid();
  v_slug_base := pg_catalog.btrim(
    pg_catalog.regexp_replace(pg_catalog.lower(v_organization_name), '[^a-z0-9]+', '-', 'g'),
    '-'
  );

  IF v_slug_base = '' THEN
    v_slug_base := 'workspace';
  END IF;

  v_organization_slug := v_slug_base || '-' || pg_catalog.substr(
    pg_catalog.replace(v_organization_id::text, '-', ''),
    1,
    8
  );

  INSERT INTO public.organizations (id, name, slug)
  VALUES (v_organization_id, v_organization_name, v_organization_slug);

  INSERT INTO public.organization_memberships (
    organization_id,
    profile_id,
    role,
    status
  )
  VALUES (v_organization_id, v_profile_id, 'owner', 'active')
  RETURNING id INTO v_membership_id;

  INSERT INTO public.autonomy_policies (
    organization_id,
    scope,
    level,
    resource_type,
    rules
  )
  VALUES (
    v_organization_id,
    'organization',
    'prepare_approve',
    '*',
    '{"external_execution": false}'::jsonb
  );

  INSERT INTO public.audit_events (
    organization_id,
    actor_profile_id,
    event_type,
    entity_type,
    entity_id,
    metadata
  )
  VALUES
    (
      v_organization_id,
      v_profile_id,
      'organization.created',
      'organization',
      v_organization_id::text,
      '{"source": "onboarding"}'::jsonb
    ),
    (
      v_organization_id,
      v_profile_id,
      'organization.membership_created',
      'organization_membership',
      v_membership_id::text,
      '{"role": "owner"}'::jsonb
    ),
    (
      v_organization_id,
      v_profile_id,
      'profile.onboarding_completed',
      'profile',
      v_profile_id::text,
      '{"source": "onboarding"}'::jsonb
    );

  RETURN QUERY
  SELECT v_organization_id, v_organization_name, 'owner'::text;
END;
$function$;

REVOKE ALL ON FUNCTION public.complete_workspace_onboarding(text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.complete_workspace_onboarding(text, text) TO authenticated;