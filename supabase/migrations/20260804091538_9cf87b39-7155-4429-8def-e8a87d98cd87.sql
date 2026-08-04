ALTER TABLE public.site_content ADD COLUMN IF NOT EXISTS published boolean NOT NULL DEFAULT true;

DROP POLICY IF EXISTS "site_content public read" ON public.site_content;

CREATE POLICY "site_content public read published"
ON public.site_content
FOR SELECT
TO anon, authenticated
USING (published = true);

CREATE POLICY "site_content admin read all"
ON public.site_content
FOR SELECT
TO authenticated
USING (private.has_role(auth.uid(), 'admin'::app_role));