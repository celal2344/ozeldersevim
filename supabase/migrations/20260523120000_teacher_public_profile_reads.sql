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
