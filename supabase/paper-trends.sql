create extension if not exists pgcrypto;

create table if not exists public.paper_trend_records (
  id text primary key,
  doi text,
  title text not null,
  authors text not null default '',
  venue text not null default '',
  journal text not null,
  publisher text not null default '',
  url text not null default '',
  citations integer not null default 0,
  published_date date,
  published_year integer,
  source text not null default 'crossref',
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create table if not exists public.paper_trend_runs (
  id uuid primary key default gen_random_uuid(),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  status text not null default 'success',
  source text not null default 'crossref',
  months integer not null default 24,
  rows_per_journal integer not null default 30,
  journals_count integer not null default 0,
  responded_journals integer not null default 0,
  fetched_count integer not null default 0,
  stored_count integer not null default 0,
  message text not null default ''
);

alter table public.paper_trend_records enable row level security;
alter table public.paper_trend_runs enable row level security;

create index if not exists paper_trend_records_published_date_idx
  on public.paper_trend_records (published_date desc);

create index if not exists paper_trend_records_journal_idx
  on public.paper_trend_records (journal);

create index if not exists paper_trend_records_last_seen_idx
  on public.paper_trend_records (last_seen_at desc);

create index if not exists paper_trend_runs_completed_at_idx
  on public.paper_trend_runs (completed_at desc);

drop policy if exists "paper_trend_records_select_public" on public.paper_trend_records;
drop policy if exists "paper_trend_runs_select_public" on public.paper_trend_runs;

create policy "paper_trend_records_select_public"
  on public.paper_trend_records
  for select
  using (true);

create policy "paper_trend_runs_select_public"
  on public.paper_trend_runs
  for select
  using (true);
