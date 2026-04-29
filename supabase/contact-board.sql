create extension if not exists pgcrypto;

create table if not exists public.contact_posts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  attachments jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.contact_posts enable row level security;

create index if not exists contact_posts_created_at_idx
  on public.contact_posts (created_at desc);

drop policy if exists "contact_posts_select_public" on public.contact_posts;
drop policy if exists "contact_posts_insert_public" on public.contact_posts;
drop policy if exists "contact_posts_delete_public" on public.contact_posts;

create policy "contact_posts_select_public"
  on public.contact_posts
  for select
  using (true);

create policy "contact_posts_insert_public"
  on public.contact_posts
  for insert
  with check (true);

create policy "contact_posts_delete_public"
  on public.contact_posts
  for delete
  using (true);
