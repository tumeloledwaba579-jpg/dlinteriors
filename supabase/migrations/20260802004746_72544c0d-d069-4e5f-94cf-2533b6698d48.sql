-- 1. Storage: stop anonymous listing of the public bucket (public URL downloads still work)
DROP POLICY IF EXISTS "public read site-assets" ON storage.objects;
CREATE POLICY "admins list site-assets" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'::public.app_role));

-- 2. Contact submissions: replace always-true insert check with validation
DROP POLICY IF EXISTS "Anyone can submit an inquiry" ON public.contact_submissions;
CREATE POLICY "Anyone can submit a validated inquiry" ON public.contact_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(btrim(name)) BETWEEN 1 AND 120
    AND length(email) <= 254
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND (phone IS NULL OR length(phone) <= 40)
    AND (project_type IS NULL OR length(project_type) <= 100)
    AND (budget IS NULL OR length(budget) <= 100)
    AND length(btrim(message)) BETWEEN 1 AND 5000
    AND read = false
  );

-- 3. Revoke direct API execution of SECURITY DEFINER / trigger functions
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.tg_set_updated_at() FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;