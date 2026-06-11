create table if not exists public.request_rate_limits (
  id uuid primary key default gen_random_uuid(),
  bucket text not null,
  identifier_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists request_rate_limits_bucket_identifier_created_idx
on public.request_rate_limits (bucket, identifier_hash, created_at desc);

alter table public.request_rate_limits enable row level security;
