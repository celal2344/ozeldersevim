create extension if not exists "pgcrypto" with schema extensions;

create type public.app_role as enum ('student', 'teacher', 'admin');
create type public.delivery_mode as enum ('online', 'face_to_face', 'both');
create type public.teacher_eligibility_status as enum ('started', 'passed', 'failed', 'expired');
create type public.teacher_profile_status as enum ('draft', 'published', 'suspended');
create type public.lesson_request_status as enum ('submitted', 'accepted', 'rejected', 'expired', 'cancelled');
create type public.lesson_status as enum ('scheduled', 'completed', 'cancelled', 'no_show');
create type public.review_status as enum ('pending', 'published', 'rejected', 'reported');
create type public.contact_preference as enum ('phone', 'site', 'both');

create table public.profiles (
  id uuid primary key,
  role public.app_role not null,
  full_name text not null,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.student_profiles (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.locations (
  id uuid primary key default gen_random_uuid(),
  city text not null,
  district text,
  latitude double precision,
  longitude double precision,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table public.lesson_categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.lesson_categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.teacher_eligibility_tests (
  id uuid primary key default gen_random_uuid(),
  version int not null,
  title text not null,
  passing_score int not null default 70 check (passing_score between 0 and 100),
  question_count int not null default 10 check (question_count > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (version)
);

create table public.teacher_eligibility_attempts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  test_id uuid not null references public.teacher_eligibility_tests(id) on delete restrict,
  status public.teacher_eligibility_status not null default 'started',
  score int check (score between 0 and 100),
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  expires_at timestamptz not null default (now() + interval '24 hours')
);

create table public.teacher_profiles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  location_id uuid not null references public.locations(id) on delete restrict,
  title text,
  bio text,
  education text,
  experience_years int check (experience_years is null or experience_years >= 0),
  hourly_price numeric(10,2) not null check (hourly_price >= 0),
  delivery_mode public.delivery_mode not null default 'both',
  status public.teacher_profile_status not null default 'draft',
  latitude double precision,
  longitude double precision,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.teacher_lessons (
  id uuid primary key default gen_random_uuid(),
  teacher_profile_id uuid not null references public.teacher_profiles(id) on delete cascade,
  lesson_category_id uuid not null references public.lesson_categories(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (teacher_profile_id, lesson_category_id)
);

create table public.teacher_listings (
  id uuid primary key default gen_random_uuid(),
  teacher_profile_id uuid not null unique references public.teacher_profiles(id) on delete cascade,
  slug text not null unique,
  headline text not null,
  short_bio text,
  rating_average numeric(3,2) not null default 0 check (rating_average between 0 and 5),
  review_count int not null default 0 check (review_count >= 0),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lesson_requests (
  id uuid primary key default gen_random_uuid(),
  student_profile_id uuid not null references public.student_profiles(profile_id) on delete cascade,
  teacher_profile_id uuid not null references public.teacher_profiles(id) on delete cascade,
  lesson_category_id uuid not null references public.lesson_categories(id) on delete restrict,
  location_id uuid references public.locations(id) on delete set null,
  status public.lesson_request_status not null default 'submitted',
  delivery_mode public.delivery_mode not null,
  student_level text,
  goal text,
  budget_min numeric(10,2),
  budget_max numeric(10,2),
  contact_preference public.contact_preference not null default 'both',
  consent_terms_at timestamptz not null,
  consent_privacy_at timestamptz not null,
  accepted_at timestamptz,
  rejected_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lesson_request_contacts (
  lesson_request_id uuid primary key references public.lesson_requests(id) on delete cascade,
  student_name text not null,
  email text not null,
  phone text not null,
  created_at timestamptz not null default now()
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  lesson_request_id uuid not null unique references public.lesson_requests(id) on delete cascade,
  status public.lesson_status not null default 'scheduled',
  scheduled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  lesson_request_id uuid not null unique references public.lesson_requests(id) on delete cascade,
  student_profile_id uuid not null references public.student_profiles(profile_id) on delete cascade,
  teacher_profile_id uuid not null references public.teacher_profiles(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text,
  status public.review_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.favorites (
  student_profile_id uuid not null references public.student_profiles(profile_id) on delete cascade,
  teacher_profile_id uuid not null references public.teacher_profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (student_profile_id, teacher_profile_id)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  channel text not null check (channel in ('email', 'sms', 'in_app')),
  subject text,
  body text not null,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_profile_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_table text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger set_student_profiles_updated_at before update on public.student_profiles for each row execute function public.set_updated_at();
create trigger set_teacher_profiles_updated_at before update on public.teacher_profiles for each row execute function public.set_updated_at();
create trigger set_teacher_listings_updated_at before update on public.teacher_listings for each row execute function public.set_updated_at();
create trigger set_lesson_requests_updated_at before update on public.lesson_requests for each row execute function public.set_updated_at();
create trigger set_lessons_updated_at before update on public.lessons for each row execute function public.set_updated_at();
create trigger set_reviews_updated_at before update on public.reviews for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

create or replace function public.has_passed_teacher_test(profile uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.teacher_eligibility_attempts
    where profile_id = profile and status = 'passed'
  );
$$;

alter table public.profiles enable row level security;
alter table public.student_profiles enable row level security;
alter table public.locations enable row level security;
alter table public.lesson_categories enable row level security;
alter table public.teacher_eligibility_tests enable row level security;
alter table public.teacher_eligibility_attempts enable row level security;
alter table public.teacher_profiles enable row level security;
alter table public.teacher_lessons enable row level security;
alter table public.teacher_listings enable row level security;
alter table public.lesson_requests enable row level security;
alter table public.lesson_request_contacts enable row level security;
alter table public.lessons enable row level security;
alter table public.reviews enable row level security;
alter table public.favorites enable row level security;
alter table public.notifications enable row level security;
alter table public.admin_audit_logs enable row level security;

create policy "profiles_select_own_or_admin" on public.profiles for select to authenticated using (id = (select auth.uid()) or public.is_admin());
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check (id = (select auth.uid()));
create policy "profiles_update_own" on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy "student_profiles_select_own_or_admin" on public.student_profiles for select to authenticated using (profile_id = (select auth.uid()) or public.is_admin());
create policy "student_profiles_insert_own" on public.student_profiles for insert to authenticated with check (profile_id = (select auth.uid()));
create policy "student_profiles_update_own" on public.student_profiles for update to authenticated using (profile_id = (select auth.uid())) with check (profile_id = (select auth.uid()));

create policy "locations_public_read" on public.locations for select to anon, authenticated using (true);
create policy "lesson_categories_public_read" on public.lesson_categories for select to anon, authenticated using (is_active);
create policy "teacher_tests_public_read_active" on public.teacher_eligibility_tests for select to anon, authenticated using (is_active);

create policy "teacher_attempts_select_own" on public.teacher_eligibility_attempts for select to authenticated using (profile_id = (select auth.uid()));
create policy "teacher_attempts_insert_own" on public.teacher_eligibility_attempts for insert to authenticated with check (profile_id = (select auth.uid()));
create policy "teacher_attempts_update_own_started" on public.teacher_eligibility_attempts for update to authenticated using (profile_id = (select auth.uid()) and status = 'started') with check (profile_id = (select auth.uid()));

create policy "teacher_profiles_public_read_published" on public.teacher_profiles for select to anon, authenticated using (status = 'published');
create policy "teacher_profiles_owner_read" on public.teacher_profiles for select to authenticated using (profile_id = (select auth.uid()));
create policy "teacher_profiles_insert_after_test" on public.teacher_profiles for insert to authenticated with check (profile_id = (select auth.uid()) and public.has_passed_teacher_test((select auth.uid())));
create policy "teacher_profiles_update_owner" on public.teacher_profiles for update to authenticated using (profile_id = (select auth.uid())) with check (profile_id = (select auth.uid()));

create policy "teacher_lessons_public_read_published" on public.teacher_lessons for select to anon, authenticated using (
  exists (select 1 from public.teacher_profiles tp where tp.id = teacher_profile_id and tp.status = 'published')
);
create policy "teacher_lessons_owner_write" on public.teacher_lessons for all to authenticated using (
  exists (select 1 from public.teacher_profiles tp where tp.id = teacher_profile_id and tp.profile_id = (select auth.uid()))
) with check (
  exists (select 1 from public.teacher_profiles tp where tp.id = teacher_profile_id and tp.profile_id = (select auth.uid()))
);

create policy "teacher_listings_public_read" on public.teacher_listings for select to anon, authenticated using (is_published);
create policy "teacher_listings_owner_read" on public.teacher_listings for select to authenticated using (
  exists (select 1 from public.teacher_profiles tp where tp.id = teacher_profile_id and tp.profile_id = (select auth.uid()))
);
create policy "teacher_listings_owner_write" on public.teacher_listings for all to authenticated using (
  exists (select 1 from public.teacher_profiles tp where tp.id = teacher_profile_id and tp.profile_id = (select auth.uid()))
) with check (
  exists (select 1 from public.teacher_profiles tp where tp.id = teacher_profile_id and tp.profile_id = (select auth.uid()))
);

create policy "lesson_requests_student_read" on public.lesson_requests for select to authenticated using (student_profile_id = (select auth.uid()));
create policy "lesson_requests_teacher_read" on public.lesson_requests for select to authenticated using (
  exists (select 1 from public.teacher_profiles tp where tp.id = teacher_profile_id and tp.profile_id = (select auth.uid()))
);
create policy "lesson_requests_student_insert" on public.lesson_requests for insert to authenticated with check (student_profile_id = (select auth.uid()));
create policy "lesson_requests_teacher_update_status" on public.lesson_requests for update to authenticated using (
  exists (select 1 from public.teacher_profiles tp where tp.id = teacher_profile_id and tp.profile_id = (select auth.uid()))
) with check (
  exists (select 1 from public.teacher_profiles tp where tp.id = teacher_profile_id and tp.profile_id = (select auth.uid()))
);

create policy "request_contacts_student_read" on public.lesson_request_contacts for select to authenticated using (
  exists (select 1 from public.lesson_requests lr where lr.id = lesson_request_id and lr.student_profile_id = (select auth.uid()))
);
create policy "request_contacts_teacher_read_after_accept" on public.lesson_request_contacts for select to authenticated using (
  exists (
    select 1
    from public.lesson_requests lr
    join public.teacher_profiles tp on tp.id = lr.teacher_profile_id
    where lr.id = lesson_request_id
      and lr.status = 'accepted'
      and tp.profile_id = (select auth.uid())
  )
);
create policy "request_contacts_student_insert" on public.lesson_request_contacts for insert to authenticated with check (
  exists (select 1 from public.lesson_requests lr where lr.id = lesson_request_id and lr.student_profile_id = (select auth.uid()))
);

create policy "lessons_student_or_teacher_read" on public.lessons for select to authenticated using (
  exists (
    select 1
    from public.lesson_requests lr
    join public.teacher_profiles tp on tp.id = lr.teacher_profile_id
    where lr.id = lesson_request_id
      and (lr.student_profile_id = (select auth.uid()) or tp.profile_id = (select auth.uid()))
  )
);

create policy "reviews_public_read_published" on public.reviews for select to anon, authenticated using (status = 'published');
create policy "reviews_student_insert_after_accept" on public.reviews for insert to authenticated with check (
  student_profile_id = (select auth.uid())
  and exists (
    select 1 from public.lesson_requests lr
    where lr.id = lesson_request_id
      and lr.student_profile_id = (select auth.uid())
      and lr.teacher_profile_id = reviews.teacher_profile_id
      and lr.status = 'accepted'
  )
);
create policy "reviews_student_update_own" on public.reviews for update to authenticated using (student_profile_id = (select auth.uid())) with check (student_profile_id = (select auth.uid()));

create policy "favorites_student_manage" on public.favorites for all to authenticated using (student_profile_id = (select auth.uid())) with check (student_profile_id = (select auth.uid()));
create policy "notifications_select_own" on public.notifications for select to authenticated using (profile_id = (select auth.uid()) or public.is_admin());
create policy "admin_audit_logs_admin_read" on public.admin_audit_logs for select to authenticated using (public.is_admin());

