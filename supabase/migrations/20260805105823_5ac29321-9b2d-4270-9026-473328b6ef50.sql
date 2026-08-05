create or replace function private.admin_exists()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.user_roles where role = 'admin'::app_role)
$$;

revoke all on function private.admin_exists() from public, anon, authenticated;
grant execute on function private.admin_exists() to authenticated;

create or replace function public.admin_exists()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select private.admin_exists()
$$;

revoke all on function public.admin_exists() from public, anon;
grant execute on function public.admin_exists() to authenticated;

drop policy if exists "bootstrap first admin" on public.user_roles;
create policy "bootstrap first admin" on public.user_roles
for insert to authenticated
with check (
  role = 'admin'::app_role
  and user_id = auth.uid()
  and not private.admin_exists()
);