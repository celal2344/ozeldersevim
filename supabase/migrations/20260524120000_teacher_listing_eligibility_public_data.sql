create table if not exists public.teacher_eligibility_questions (
  id uuid primary key default gen_random_uuid(),
  test_id uuid not null references public.teacher_eligibility_tests(id) on delete cascade,
  question_key text not null,
  prompt text not null,
  position int not null check (position > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (test_id, question_key),
  unique (test_id, position)
);

create table if not exists public.teacher_eligibility_choices (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.teacher_eligibility_questions(id) on delete cascade,
  choice_key text not null,
  label text not null,
  score int not null default 0 check (score >= 0),
  position int not null check (position > 0),
  created_at timestamptz not null default now(),
  unique (question_id, choice_key),
  unique (question_id, position)
);

alter table public.teacher_eligibility_questions enable row level security;
alter table public.teacher_eligibility_choices enable row level security;

drop policy if exists "teacher_attempts_insert_own" on public.teacher_eligibility_attempts;
drop policy if exists "teacher_attempts_update_own_started" on public.teacher_eligibility_attempts;

create policy "teacher_attempts_insert_own_teacher"
on public.teacher_eligibility_attempts
for insert
to authenticated
with check (
  profile_id = (select auth.uid())
  and exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'teacher'
  )
);

create policy "teacher_attempts_update_own_teacher_started"
on public.teacher_eligibility_attempts
for update
to authenticated
using (
  profile_id = (select auth.uid())
  and status = 'started'
  and exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'teacher'
  )
)
with check (
  profile_id = (select auth.uid())
  and exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'teacher'
  )
);

drop policy if exists "teacher_profiles_insert_after_test" on public.teacher_profiles;
drop policy if exists "teacher_profiles_update_owner" on public.teacher_profiles;

create policy "teacher_profiles_insert_own_teacher"
on public.teacher_profiles
for insert
to authenticated
with check (
  profile_id = (select auth.uid())
  and exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'teacher'
  )
  and (
    status <> 'published'
    or public.has_passed_teacher_test((select auth.uid()))
  )
);

create policy "teacher_profiles_update_owner_teacher"
on public.teacher_profiles
for update
to authenticated
using (
  profile_id = (select auth.uid())
  and exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'teacher'
  )
)
with check (
  profile_id = (select auth.uid())
  and exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'teacher'
  )
  and (
    status <> 'published'
    or public.has_passed_teacher_test((select auth.uid()))
  )
);

drop policy if exists "teacher_listings_owner_write" on public.teacher_listings;

create policy "teacher_listings_owner_write"
on public.teacher_listings
for all
to authenticated
using (
  exists (
    select 1
    from public.teacher_profiles tp
    join public.profiles p on p.id = tp.profile_id
    where tp.id = teacher_profile_id
      and tp.profile_id = (select auth.uid())
      and p.role = 'teacher'
  )
)
with check (
  exists (
    select 1
    from public.teacher_profiles tp
    join public.profiles p on p.id = tp.profile_id
    where tp.id = teacher_profile_id
      and tp.profile_id = (select auth.uid())
      and p.role = 'teacher'
      and (
        is_published = false
        or (
          tp.status = 'published'
          and public.has_passed_teacher_test((select auth.uid()))
        )
      )
  )
);

drop policy if exists "profiles_public_read_published_teachers" on public.profiles;

create policy "profiles_public_read_published_teachers"
on public.profiles
for select
to anon, authenticated
using (
  role = 'teacher'
  and exists (
    select 1
    from public.teacher_profiles tp
    where tp.profile_id = profiles.id
      and tp.status = 'published'
  )
);

with active_test as (
  select id
  from public.teacher_eligibility_tests
  where version = 1
  order by created_at desc
  limit 1
),
question_rows as (
  insert into public.teacher_eligibility_questions (test_id, question_key, prompt, position)
  select active_test.id, question_key, prompt, position
  from active_test
  cross join (
    values
      ('question1', 'question1', 1),
      ('question2', 'question2', 2),
      ('question3', 'question3', 3)
  ) as seed(question_key, prompt, position)
  on conflict (test_id, question_key) do update
    set prompt = excluded.prompt,
        position = excluded.position,
        is_active = true
  returning id, question_key
)
insert into public.teacher_eligibility_choices (question_id, choice_key, label, score, position)
select question_rows.id, choice_key, label, score, position
from question_rows
cross join (
  values
    ('a', 'true', 1, 1),
    ('b', 'false', 0, 2),
    ('c', 'false', 0, 3),
    ('d', 'false', 0, 4)
) as seed(choice_key, label, score, position)
on conflict (question_id, choice_key) do update
  set label = excluded.label,
      score = excluded.score,
      position = excluded.position;
