create or replace function public.owns_teacher_profile(target_teacher_profile_id uuid, target_profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.teacher_profiles tp
    where tp.id = target_teacher_profile_id
      and tp.profile_id = target_profile_id
  );
$$;

create or replace function public.can_write_teacher_listing(
  target_teacher_profile_id uuid,
  target_profile_id uuid,
  target_is_published boolean
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.teacher_profiles tp
    where tp.id = target_teacher_profile_id
      and tp.profile_id = target_profile_id
      and public.has_app_role(target_profile_id, 'teacher')
      and (
        target_is_published = false
        or (
          tp.status = 'published'
          and public.has_passed_teacher_test(target_profile_id)
        )
      )
  );
$$;

revoke all on function public.owns_teacher_profile(uuid, uuid) from public;
revoke all on function public.can_write_teacher_listing(uuid, uuid, boolean) from public;
grant execute on function public.owns_teacher_profile(uuid, uuid) to authenticated;
grant execute on function public.can_write_teacher_listing(uuid, uuid, boolean) to authenticated;

drop policy if exists "teacher_listings_owner_read" on public.teacher_listings;
drop policy if exists "teacher_listings_owner_write" on public.teacher_listings;

create policy "teacher_listings_owner_read"
on public.teacher_listings
for select
to authenticated
using (
  public.owns_teacher_profile(teacher_profile_id, (select auth.uid()))
);

create policy "teacher_listings_owner_write"
on public.teacher_listings
for all
to authenticated
using (
  public.owns_teacher_profile(teacher_profile_id, (select auth.uid()))
)
with check (
  public.can_write_teacher_listing(teacher_profile_id, (select auth.uid()), is_published)
);
