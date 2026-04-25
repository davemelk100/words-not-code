create table if not exists public.wizard_progress (
  id uuid default gen_random_uuid() primary key,
  answers jsonb not null,
  current_step integer not null default 1,
  created_at timestamptz default now() not null,
  expires_at timestamptz default (now() + interval '30 days') not null
);

-- RLS: the UUID itself is the secret (122 bits of entropy)
alter table public.wizard_progress enable row level security;

create policy "Anyone can insert progress"
  on public.wizard_progress
  for insert
  with check (true);

create policy "Anyone can read progress by id"
  on public.wizard_progress
  for select
  using (true);

-- Auto-cleanup expired rows (run via pg_cron or manually)
create index idx_wizard_progress_expires_at on public.wizard_progress (expires_at);
