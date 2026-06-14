create table public.teacher_availability_weekly_slots (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  weekday smallint not null check (weekday between 1 and 7),
  start_hour smallint not null check (start_hour between 0 and 23),
  end_hour smallint not null check (end_hour between 1 and 24),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (start_hour < end_hour)
);

create index teacher_availability_weekly_profile_weekday_idx
on public.teacher_availability_weekly_slots (profile_id, weekday, start_hour);

create table public.teacher_availability_exceptions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  exception_date date not null,
  exception_type text not null check (exception_type in ('available', 'unavailable')),
  start_hour smallint not null check (start_hour between 0 and 23),
  end_hour smallint not null check (end_hour between 1 and 24),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (start_hour < end_hour)
);

create index teacher_availability_exceptions_profile_date_idx
on public.teacher_availability_exceptions (profile_id, exception_date, start_hour);

alter table public.lesson_requests
add column if not exists preferred_weekday smallint check (preferred_weekday between 1 and 7),
add column if not exists preferred_start_hour smallint check (preferred_start_hour between 0 and 23);

create trigger set_teacher_availability_weekly_slots_updated_at
before update on public.teacher_availability_weekly_slots
for each row execute function public.set_updated_at();

create trigger set_teacher_availability_exceptions_updated_at
before update on public.teacher_availability_exceptions
for each row execute function public.set_updated_at();

alter table public.teacher_availability_weekly_slots enable row level security;
alter table public.teacher_availability_exceptions enable row level security;

create policy "teacher_availability_weekly_public_read_published"
on public.teacher_availability_weekly_slots
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.teacher_profiles tp
    join public.teacher_listings tl on tl.teacher_profile_id = tp.id
    where tp.profile_id = teacher_availability_weekly_slots.profile_id
      and tp.status = 'published'
      and tl.is_published = true
  )
);

create policy "teacher_availability_weekly_owner_manage"
on public.teacher_availability_weekly_slots
for all
to authenticated
using (
  profile_id = (select auth.uid())
  and public.has_app_role((select auth.uid()), 'teacher')
)
with check (
  profile_id = (select auth.uid())
  and public.has_app_role((select auth.uid()), 'teacher')
);

create policy "teacher_availability_exceptions_public_read_published"
on public.teacher_availability_exceptions
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.teacher_profiles tp
    join public.teacher_listings tl on tl.teacher_profile_id = tp.id
    where tp.profile_id = teacher_availability_exceptions.profile_id
      and tp.status = 'published'
      and tl.is_published = true
  )
);

create policy "teacher_availability_exceptions_owner_manage"
on public.teacher_availability_exceptions
for all
to authenticated
using (
  profile_id = (select auth.uid())
  and public.has_app_role((select auth.uid()), 'teacher')
)
with check (
  profile_id = (select auth.uid())
  and public.has_app_role((select auth.uid()), 'teacher')
);
