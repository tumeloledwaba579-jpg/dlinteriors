CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM anon, authenticated, public;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM public;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Recreate policies against private.has_role
DROP POLICY IF EXISTS "admins manage roles" ON public.user_roles;
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admins read all projects" ON public.projects;
CREATE POLICY "admins read all projects" ON public.projects FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admins write projects" ON public.projects;
CREATE POLICY "admins write projects" ON public.projects FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admins write project_images" ON public.project_images;
CREATE POLICY "admins write project_images" ON public.project_images FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admins write services" ON public.services;
CREATE POLICY "admins write services" ON public.services FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admins write testimonials" ON public.testimonials;
CREATE POLICY "admins write testimonials" ON public.testimonials FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admins write contact" ON public.contact_info;
CREATE POLICY "admins write contact" ON public.contact_info FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "site_content admin insert" ON public.site_content;
CREATE POLICY "site_content admin insert" ON public.site_content FOR INSERT TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "site_content admin update" ON public.site_content;
CREATE POLICY "site_content admin update" ON public.site_content FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "site_content admin delete" ON public.site_content;
CREATE POLICY "site_content admin delete" ON public.site_content FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can read inquiries" ON public.contact_submissions;
CREATE POLICY "Admins can read inquiries" ON public.contact_submissions FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can update inquiries" ON public.contact_submissions;
CREATE POLICY "Admins can update inquiries" ON public.contact_submissions FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can delete inquiries" ON public.contact_submissions;
CREATE POLICY "Admins can delete inquiries" ON public.contact_submissions FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admins upload site-assets" ON storage.objects;
CREATE POLICY "admins upload site-assets" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'site-assets' AND private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "admins update site-assets" ON storage.objects;
CREATE POLICY "admins update site-assets" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'site-assets' AND private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "admins delete site-assets" ON storage.objects;
CREATE POLICY "admins delete site-assets" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'site-assets' AND private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "admins list site-assets" ON storage.objects;
CREATE POLICY "admins list site-assets" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'site-assets' AND private.has_role(auth.uid(), 'admin'));

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);