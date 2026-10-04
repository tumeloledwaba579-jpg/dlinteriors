-- Reconstructed to match what's actually live in the database. This was
-- originally applied via the Supabase MCP connector's apply_migration
-- tool during self-hosting work, which updates the remote database and
-- its supabase_migrations.schema_migrations tracking table directly, but
-- does not create a corresponding local file — causing the "Supabase
-- Preview" GitHub check to report local/remote migration drift. This
-- file closes that gap; content verified against the live schema.

CREATE TABLE public.admin_access_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  reason text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  decided_at timestamp with time zone,
  decided_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT admin_access_requests_pkey PRIMARY KEY (id),
  CONSTRAINT admin_access_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT admin_access_requests_status_check CHECK (status = ANY (ARRAY['pending'::text, 'approved'::text, 'denied'::text])),
  CONSTRAINT admin_access_requests_reason_len CHECK (length(reason) <= 1000)
);

CREATE UNIQUE INDEX admin_access_requests_one_pending
  ON public.admin_access_requests (user_id)
  WHERE status = 'pending';

CREATE INDEX admin_access_requests_status_idx ON public.admin_access_requests (status, created_at DESC);

GRANT SELECT, INSERT ON public.admin_access_requests TO authenticated;
GRANT UPDATE, DELETE ON public.admin_access_requests TO authenticated;
GRANT ALL ON public.admin_access_requests TO service_role;

ALTER TABLE public.admin_access_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users create own access request"
  ON public.admin_access_requests FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND status = 'pending' AND length(btrim(reason)) <= 1000);

CREATE POLICY "users view own access requests"
  ON public.admin_access_requests FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "admins update access requests"
  ON public.admin_access_requests FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "admins delete access requests"
  ON public.admin_access_requests FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role));
