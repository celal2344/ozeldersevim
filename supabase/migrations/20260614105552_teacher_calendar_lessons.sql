create table public.teacher_students (
  id uuid primary key default gen_random_uuid(),
  teacher_profile_id uuid not null references public.teacher_profiles(id) on delete cascade,
  student_profile_id uuid references public.student_profiles(profile_id) on delete set null,
  source_lesson_request_id uuid references public.lesson_requests(id) on delete set null,
  name text not null,
  email text,
  phone text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (teacher_profile_id, student_profile_id),
  unique (teacher_profile_id, source_lesson_request_id)
);

create index teacher_students_teacher_profile_idx
on public.teacher_students (teacher_profile_id, name);

create index teacher_students_student_profile_idx
on public.teacher_students (student_profile_id)
where student_profile_id is not null;

create trigger set_teacher_students_updated_at
before update on public.teacher_students
for each row execute function public.set_updated_at();

alter table public.teacher_students enable row level security;

create policy "teacher_students_owner_select"
on public.teacher_students
for select
to authenticated
using (
  exists (
    select 1
    from public.teacher_profiles tp
    where tp.id = teacher_students.teacher_profile_id
      and tp.profile_id = (select auth.uid())
  )
);

create policy "teacher_students_owner_insert"
on public.teacher_students
for insert
to authenticated
with check (
  exists (
    select 1
    from public.teacher_profiles tp
    where tp.id = teacher_students.teacher_profile_id
      and tp.profile_id = (select auth.uid())
  )
);

create policy "teacher_students_owner_update"
on public.teacher_students
for update
to authenticated
using (
  exists (
    select 1
    from public.teacher_profiles tp
    where tp.id = teacher_students.teacher_profile_id
      and tp.profile_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.teacher_profiles tp
    where tp.id = teacher_students.teacher_profile_id
      and tp.profile_id = (select auth.uid())
  )
);

create policy "teacher_students_linked_student_select"
on public.teacher_students
for select
to authenticated
using (student_profile_id = (select auth.uid()));

insert into public.teacher_students (
  teacher_profile_id,
  student_profile_id,
  source_lesson_request_id,
  name,
  email,
  phone
)
select
  lr.teacher_profile_id,
  lr.student_profile_id,
  lr.id,
  lrc.student_name,
  lrc.email,
  lrc.phone
from public.lesson_requests lr
join public.lesson_request_contacts lrc on lrc.lesson_request_id = lr.id
where lr.status = 'accepted'
on conflict (teacher_profile_id, student_profile_id) do update
set name = excluded.name,
    email = excluded.email,
    phone = excluded.phone,
    source_lesson_request_id = coalesce(teacher_students.source_lesson_request_id, excluded.source_lesson_request_id);

alter table public.lessons
drop constraint if exists lessons_lesson_request_id_key;

alter table public.lessons
alter column lesson_request_id drop not null,
add column if not exists teacher_profile_id uuid references public.teacher_profiles(id) on delete cascade,
add column if not exists teacher_student_id uuid references public.teacher_students(id) on delete set null,
add column if not exists lesson_category_id uuid references public.lesson_categories(id) on delete restrict,
add column if not exists delivery_mode public.delivery_mode,
add column if not exists duration_minutes int not null default 60 check (duration_minutes > 0 and duration_minutes <= 480),
add column if not exists price_amount numeric(10,2) not null default 0 check (price_amount >= 0),
add column if not exists currency text not null default 'TRY',
add column if not exists notes text,
add column if not exists cancelled_at timestamptz,
add column if not exists cancellation_reason text,
add column if not exists completed_at timestamptz;

update public.lessons lessons
set teacher_profile_id = lr.teacher_profile_id,
    teacher_student_id = ts.id,
    lesson_category_id = lr.lesson_category_id,
    delivery_mode = lr.delivery_mode,
    price_amount = coalesce(tp.hourly_price, lessons.price_amount),
    completed_at = case when lessons.status = 'completed' then coalesce(lessons.completed_at, lessons.scheduled_at) else lessons.completed_at end,
    cancelled_at = case when lessons.status = 'cancelled' then coalesce(lessons.cancelled_at, lessons.updated_at) else lessons.cancelled_at end
from public.lesson_requests lr
left join public.teacher_profiles tp on tp.id = lr.teacher_profile_id
left join public.teacher_students ts on ts.source_lesson_request_id = lr.id
where lr.id = lessons.lesson_request_id;

alter table public.lessons
alter column teacher_profile_id set not null,
alter column lesson_category_id set not null,
alter column delivery_mode set not null;

create index if not exists lessons_teacher_profile_scheduled_idx
on public.lessons (teacher_profile_id, scheduled_at);

create index if not exists lessons_teacher_student_idx
on public.lessons (teacher_student_id);

create index if not exists lessons_status_scheduled_idx
on public.lessons (status, scheduled_at);

drop policy if exists "lessons_teacher_insert" on public.lessons;
drop policy if exists "lessons_teacher_update" on public.lessons;

create policy "lessons_teacher_insert"
on public.lessons
for insert
to authenticated
with check (
  exists (
    select 1
    from public.teacher_profiles tp
    where tp.id = lessons.teacher_profile_id
      and tp.profile_id = (select auth.uid())
  )
);

create policy "lessons_teacher_update"
on public.lessons
for update
to authenticated
using (
  exists (
    select 1
    from public.teacher_profiles tp
    where tp.id = lessons.teacher_profile_id
      and tp.profile_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.teacher_profiles tp
    where tp.id = lessons.teacher_profile_id
      and tp.profile_id = (select auth.uid())
  )
);

create policy "lessons_linked_student_read"
on public.lessons
for select
to authenticated
using (
  exists (
    select 1
    from public.teacher_students ts
    where ts.id = lessons.teacher_student_id
      and ts.student_profile_id = (select auth.uid())
  )
);

grant select, insert, update on public.teacher_students to authenticated;
grant select, insert, update on public.lessons to authenticated;
