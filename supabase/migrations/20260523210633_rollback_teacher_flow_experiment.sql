drop policy if exists "profiles_public_read_published_teachers" on public.profiles;

drop policy if exists "teacher_attempts_insert_own" on public.teacher_eligibility_attempts;
drop policy if exists "teacher_attempts_update_own_started" on public.teacher_eligibility_attempts;

create policy "teacher_attempts_insert_own"
on public.teacher_eligibility_attempts
for insert
to authenticated
with check (profile_id = (select auth.uid()));

create policy "teacher_attempts_update_own_started"
on public.teacher_eligibility_attempts
for update
to authenticated
using (profile_id = (select auth.uid()) and status = 'started')
with check (profile_id = (select auth.uid()));

drop policy if exists "teacher_profiles_insert_after_test" on public.teacher_profiles;

create policy "teacher_profiles_insert_after_test"
on public.teacher_profiles
for insert
to authenticated
with check (
  profile_id = (select auth.uid())
  and public.has_passed_teacher_test((select auth.uid()))
);
