create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  properties jsonb not null default '{}'::jsonb,
  actor_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index analytics_events_name_idx on public.analytics_events (name);
create index analytics_events_created_at_idx on public.analytics_events (created_at desc);

alter table public.analytics_events enable row level security;

-- Anyone (including anonymous visitors) can insert events
create policy "analytics_events_insert_all" on public.analytics_events
  for insert to anon, authenticated
  with check (true);

-- Only admins can read events
create policy "analytics_events_admin_read" on public.analytics_events
  for select to authenticated
  using (public.is_admin());
