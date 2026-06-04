-- Avoid RLS recursion when policies need to check the signed-in app role.
-- Directly querying public.profiles from a teacher_profiles policy can recurse
-- because profiles also has policies that inspect teacher_profiles.
create or replace function public.has_app_role(profile uuid, expected_role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = profile
      and role = expected_role
  );
$$;

revoke all on function public.has_app_role(uuid, public.app_role) from public;
grant execute on function public.has_app_role(uuid, public.app_role) to authenticated;

drop policy if exists "teacher_attempts_insert_own_teacher" on public.teacher_eligibility_attempts;
drop policy if exists "teacher_attempts_update_own_teacher_started" on public.teacher_eligibility_attempts;
drop policy if exists "teacher_profiles_insert_own_teacher" on public.teacher_profiles;
drop policy if exists "teacher_profiles_update_owner_teacher" on public.teacher_profiles;
drop policy if exists "teacher_listings_owner_write" on public.teacher_listings;

create policy "teacher_attempts_insert_own_teacher"
on public.teacher_eligibility_attempts
for insert
to authenticated
with check (
  profile_id = (select auth.uid())
  and public.has_app_role((select auth.uid()), 'teacher')
);

create policy "teacher_attempts_update_own_teacher_started"
on public.teacher_eligibility_attempts
for update
to authenticated
using (
  profile_id = (select auth.uid())
  and status = 'started'
  and public.has_app_role((select auth.uid()), 'teacher')
)
with check (
  profile_id = (select auth.uid())
  and public.has_app_role((select auth.uid()), 'teacher')
);

create policy "teacher_profiles_insert_own_teacher"
on public.teacher_profiles
for insert
to authenticated
with check (
  profile_id = (select auth.uid())
  and public.has_app_role((select auth.uid()), 'teacher')
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
  and public.has_app_role((select auth.uid()), 'teacher')
)
with check (
  profile_id = (select auth.uid())
  and public.has_app_role((select auth.uid()), 'teacher')
  and (
    status <> 'published'
    or public.has_passed_teacher_test((select auth.uid()))
  )
);

create policy "teacher_listings_owner_write"
on public.teacher_listings
for all
to authenticated
using (
  exists (
    select 1
    from public.teacher_profiles tp
    where tp.id = teacher_profile_id
      and tp.profile_id = (select auth.uid())
      and public.has_app_role((select auth.uid()), 'teacher')
  )
)
with check (
  exists (
    select 1
    from public.teacher_profiles tp
    where tp.id = teacher_profile_id
      and tp.profile_id = (select auth.uid())
      and public.has_app_role((select auth.uid()), 'teacher')
      and (
        is_published = false
        or (
          tp.status = 'published'
          and public.has_passed_teacher_test((select auth.uid()))
        )
      )
  )
);
