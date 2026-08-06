-- Phase 1 foundation: admin_users
-- יופעל מול פרויקט Supabase (supabase db push / migration up)

create extension if not exists "pgcrypto";

create table if not exists public.admin_users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text,
  role text not null default 'admin' check (role in ('admin', 'owner')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists admin_users_active_idx
  on public.admin_users (is_active)
  where deleted_at is null;

alter table public.admin_users enable row level security;

-- מנהל יכול לקרוא את הרשומה שלו
create policy "admin_users_select_own"
  on public.admin_users
  for select
  to authenticated
  using (id = auth.uid() and deleted_at is null and is_active = true);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists admin_users_set_updated_at on public.admin_users;
create trigger admin_users_set_updated_at
  before update on public.admin_users
  for each row execute function public.set_updated_at();
