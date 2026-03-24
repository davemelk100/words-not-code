create table if not exists public.sessions (
  id uuid default gen_random_uuid() primary key,
  answers jsonb not null,
  blueprint text not null,
  created_at timestamptz default now() not null,
  ip_hash text
);

-- Anonymous insert only
alter table public.sessions enable row level security;

create policy "Anyone can insert sessions"
  on public.sessions
  for insert
  with check (true);

-- No read access for anonymous users
create policy "No public read"
  on public.sessions
  for select
  using (false);
