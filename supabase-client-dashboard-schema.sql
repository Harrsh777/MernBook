-- Client Dashboard SaaS schema (profiles/projects/milestones)
-- Run this in Supabase SQL editor.

-- 1) Profiles table (role stored here)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text unique,
  role text not null default 'client' check (role in ('admin','client')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Profile policies: users can read their own profile; admins can read all
create policy "profiles: read own"
on public.profiles for select
using (auth.uid() = id);

create policy "profiles: update own"
on public.profiles for update
using (auth.uid() = id);

create policy "profiles: insert own"
on public.profiles for insert
with check (auth.uid() = id);

-- Admin helper: treat role=admin in profiles as admin
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

create policy "profiles: admin read all"
on public.profiles for select
using (public.is_admin());

create policy "profiles: admin update all"
on public.profiles for update
using (public.is_admin());

-- 2) Projects table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'in_progress' check (status in ('in_progress','completed','review')),
  progress int not null default 0 check (progress >= 0 and progress <= 100),
  deadline date,
  price numeric,
  amount_paid numeric not null default 0,
  amount_pending numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_client_id_idx on public.projects(client_id);

alter table public.projects enable row level security;

create policy "projects: client read own"
on public.projects for select
using (auth.uid() = client_id);

create policy "projects: admin read all"
on public.projects for select
using (public.is_admin());

create policy "projects: admin write"
on public.projects for insert
with check (public.is_admin());

create policy "projects: admin update"
on public.projects for update
using (public.is_admin());

-- Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_projects_updated_at on public.projects;
create trigger trg_projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

-- 3) Milestones table
create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists milestones_project_id_idx on public.milestones(project_id);

alter table public.milestones enable row level security;

create policy "milestones: client read own"
on public.milestones for select
using (
  exists (
    select 1 from public.projects p
    where p.id = milestones.project_id and p.client_id = auth.uid()
  )
);

create policy "milestones: admin read all"
on public.milestones for select
using (public.is_admin());

create policy "milestones: admin write"
on public.milestones for insert
with check (public.is_admin());

create policy "milestones: admin update"
on public.milestones for update
using (public.is_admin());

-- 4) Payments table
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  amount numeric not null,
  status text not null default 'pending' check (status in ('paid','pending')),
  due_date date,
  created_at timestamptz not null default now()
);

create index if not exists payments_project_id_idx on public.payments(project_id);

alter table public.payments enable row level security;

create policy "payments: client read own"
on public.payments for select
using (
  exists (
    select 1 from public.projects p
    where p.id = payments.project_id and p.client_id = auth.uid()
  )
);

create policy "payments: admin read all"
on public.payments for select
using (public.is_admin());

create policy "payments: admin write"
on public.payments for insert
with check (public.is_admin());

create policy "payments: admin update"
on public.payments for update
using (public.is_admin());

-- 5) Messages table (per-project chat)
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists messages_project_id_idx on public.messages(project_id);

alter table public.messages enable row level security;

create policy "messages: client read own project"
on public.messages for select
using (
  exists (
    select 1 from public.projects p
    where p.id = messages.project_id and p.client_id = auth.uid()
  )
  or public.is_admin()
);

create policy "messages: insert participants"
on public.messages for insert
with check (
  sender_id = auth.uid()
  and (
    public.is_admin() or
    exists (
      select 1 from public.projects p
      where p.id = messages.project_id and p.client_id = auth.uid()
    )
  )
);

-- 6) Notifications table
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_id_idx on public.notifications(user_id);

alter table public.notifications enable row level security;

create policy "notifications: read own"
on public.notifications for select
using (user_id = auth.uid());

create policy "notifications: insert system"
on public.notifications for insert
with check (true); -- insert will usually be from backend / service key

create policy "notifications: update own"
on public.notifications for update
using (user_id = auth.uid());

-- 7) Timeline events (for visual timeline per project)
create table if not exists public.project_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  type text not null, -- e.g. project_created, milestone_completed, file_uploaded, payment_made
  label text not null,
  created_at timestamptz not null default now()
);

create index if not exists project_events_project_id_idx on public.project_events(project_id);

alter table public.project_events enable row level security;

create policy "project_events: client read own"
on public.project_events for select
using (
  exists (
    select 1 from public.projects p
    where p.id = project_events.project_id and p.client_id = auth.uid()
  )
  or public.is_admin()
);

create policy "project_events: admin write"
on public.project_events for insert
with check (public.is_admin());

-- Storage bucket (create via Supabase UI):
-- 1. Go to Storage → Buckets → New bucket
-- 2. Name: project-files
-- 3. Public or policy-protected (recommended: private with RLS using storage.objects policies)
-- Link uploaded files to projects using project_id + path in your app code.

-- Seed (optional): create a sample project for the signed-in user (run manually after creating your admin/client)
-- insert into public.projects (client_id, title, description, status, progress, deadline, price)
-- values (auth.uid(), 'Website + App', 'FreshMeatWala onboarding project', 'in_progress', 35, now()::date + 21, 160000);

