CREATE SCHEMA "auth";


CREATE  OR REPLACE  FUNCTION auth.uid()
 RETURNS uuid
 LANGUAGE sql
STABLE
LEAKPROOF
SECURITY INVOKER
PARALLEL SAFE
AS $$
    SELECT current_setting('app.user_id', true)::uuid
$$;

CREATE  OR REPLACE  FUNCTION auth.role()
 RETURNS text
 LANGUAGE sql
STABLE
LEAKPROOF
SECURITY INVOKER
PARALLEL SAFE
AS $$
    SELECT current_setting('app.role', true)
$$;

GRANT USAGE ON SCHEMA auth TO app_runtime;
