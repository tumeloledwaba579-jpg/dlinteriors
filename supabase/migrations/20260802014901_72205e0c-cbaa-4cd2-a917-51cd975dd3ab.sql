DROP POLICY IF EXISTS "public read project_images" ON public.project_images;

CREATE POLICY "public read project_images"
ON public.project_images
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_images.project_id
      AND p.published = true
  )
);