-- Admin: read all teacher profiles (including draft and suspended)
create policy "teacher_profiles_admin_read" on public.teacher_profiles
  for select to authenticated
  using (public.is_admin());

-- Admin: update any teacher profile (suspend / restore)
create policy "teacher_profiles_admin_update" on public.teacher_profiles
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Admin: read all teacher listings (including unpublished)
create policy "teacher_listings_admin_read" on public.teacher_listings
  for select to authenticated
  using (public.is_admin());

-- Admin: update any teacher listing (publish / unpublish)
create policy "teacher_listings_admin_update" on public.teacher_listings
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Admin: update any review (publish / reject)
create policy "reviews_admin_update" on public.reviews
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Admin: read all reviews regardless of status
create policy "reviews_admin_read" on public.reviews
  for select to authenticated
  using (public.is_admin());
