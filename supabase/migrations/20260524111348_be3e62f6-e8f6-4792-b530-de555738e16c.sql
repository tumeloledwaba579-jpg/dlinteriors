
-- Roles
create type public.app_role as enum ('admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "users view own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());
create policy "admins manage roles" on public.user_roles for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Generic updated_at trigger
create or replace function public.tg_set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

-- Projects
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  location text not null default '',
  style text not null default '',
  space text not null default '',
  year text not null default '',
  cover_image text,
  palette jsonb not null default '[]'::jsonb,
  materials jsonb not null default '[]'::jsonb,
  challenge text not null default '',
  solution text not null default '',
  narrative text not null default '',
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.projects enable row level security;
create trigger projects_updated before update on public.projects for each row execute function public.tg_set_updated_at();

create policy "public read projects" on public.projects for select using (published = true);
create policy "admins read all projects" on public.projects for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admins write projects" on public.projects for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Project images (gallery)
create table public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.project_images enable row level security;
create policy "public read project_images" on public.project_images for select using (true);
create policy "admins write project_images" on public.project_images for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Services
create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  investment text not null default '',
  features jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.services enable row level security;
create trigger services_updated before update on public.services for each row execute function public.tg_set_updated_at();
create policy "public read services" on public.services for select using (published = true);
create policy "admins write services" on public.services for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Testimonials
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author text not null,
  role text not null default '',
  quote text not null,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.testimonials enable row level security;
create trigger testimonials_updated before update on public.testimonials for each row execute function public.tg_set_updated_at();
create policy "public read testimonials" on public.testimonials for select using (published = true);
create policy "admins write testimonials" on public.testimonials for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Contact info (single row)
create table public.contact_info (
  id int primary key default 1,
  email text not null default '',
  phone text not null default '',
  address text not null default '',
  instagram text not null default '',
  pinterest text not null default '',
  updated_at timestamptz not null default now(),
  constraint contact_info_single_row check (id = 1)
);
alter table public.contact_info enable row level security;
create trigger contact_info_updated before update on public.contact_info for each row execute function public.tg_set_updated_at();
create policy "public read contact" on public.contact_info for select using (true);
create policy "admins write contact" on public.contact_info for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
insert into public.contact_info (id, email, phone, address, instagram, pinterest)
  values (1, 'hello@dlinteriors.co.za', '+27 11 000 0000', 'Johannesburg, South Africa', '', '');

-- Storage bucket
insert into storage.buckets (id, name, public) values ('site-assets','site-assets', true);

create policy "public read site-assets" on storage.objects for select using (bucket_id = 'site-assets');
create policy "admins upload site-assets" on storage.objects for insert to authenticated with check (bucket_id = 'site-assets' and public.has_role(auth.uid(),'admin'));
create policy "admins update site-assets" on storage.objects for update to authenticated using (bucket_id = 'site-assets' and public.has_role(auth.uid(),'admin'));
create policy "admins delete site-assets" on storage.objects for delete to authenticated using (bucket_id = 'site-assets' and public.has_role(auth.uid(),'admin'));
