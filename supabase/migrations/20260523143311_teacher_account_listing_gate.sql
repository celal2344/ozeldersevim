drop policy if exists "teacher_attempts_insert_own" on public.teacher_eligibility_attempts;
drop policy if exists "teacher_attempts_update_own_started" on public.teacher_eligibility_attempts;

drop policy if exists "teacher_profiles_insert_after_test" on public.teacher_profiles;

create policy "teacher_profiles_insert_after_test"
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
  and public.has_passed_teacher_test((select auth.uid()))
);
