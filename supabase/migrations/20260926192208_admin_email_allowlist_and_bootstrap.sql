-- Reconstructed to match what's actually live in the database (see note
-- at the top of 20260925111636_create_admin_access_requests.sql for why
-- this file didn't originally exist locally).

-- Emails that should automatically get the 'admin' role the moment
-- their account exists in auth.users (on signup, or immediately below
-- for accounts that already exist).
CREATE TABLE public.admin_email_allowlist (
  email text NOT NULL,
  added_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT admin_email_allowlist_pkey PRIMARY KEY (email)
);

ALTER TABLE public.admin_email_allowlist ENABLE ROW LEVEL SECURITY;

-- Only existing admins can view/manage this list; no one else, and no
-- anonymous/public access at all.
CREATE POLICY "admins manage admin allowlist"
  ON public.admin_email_allowlist FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.admin_email_allowlist (email) VALUES ('tumeloledwaba579@gmail.com');

-- Runs after every new auth.users row. If the email is on the
-- allowlist, grants 'admin' immediately. Security definer so it can
-- write to user_roles regardless of the inserting user's own RLS.
CREATE OR REPLACE FUNCTION public.handle_new_user_admin_bootstrap()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.admin_email_allowlist
    WHERE email = lower(NEW.email)
  ) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_admin_bootstrap
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_admin_bootstrap();

-- Backfill: grant admin right now to anyone already registered whose
-- email is on the allowlist (covers the existing Google login made
-- while testing OAuth during self-hosting work).
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::app_role
FROM auth.users u
JOIN public.admin_email_allowlist a ON a.email = lower(u.email)
ON CONFLICT (user_id, role) DO NOTHING;
