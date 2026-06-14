# Ozel Ders Evim - Project Context

Last updated: 2026-06-14

## Product Summary

Ozel Ders Evim is a Turkish-only private tutoring marketplace inspired by ozeldersalani.com. Students should be able to search for teachers by lesson, location, price, availability, rating, and delivery mode. Teachers should be able to create accounts, publish listings, manage lesson requests, and later track students and lessons from a dashboard.

The first release should focus on SEO-visible public pages, teacher search, teacher profile/detail pages, and the lesson request funnel. Dashboards, payments, lesson tracking, and more advanced operational tools should come in later phases.

## Current Decisions

- App stack: Next.js with BFF/server functions.
- Database: Supabase Postgres.
- Auth: Supabase Auth.
- UI: shadcn/ui.
- Forms and validation: React Hook Form + Zod.
- Server state: TanStack Query for paginated/filterable data.
- Package manager/runtime: Bun.
- Language: Turkish only, no i18n for now.
- Deployment: Vercel for frontend/backend, Supabase for database.
- Supabase project ref: `hhddeqgvrnyxnwetetdc`.
- Supabase project URL: `https://hhddeqgvrnyxnwetetdc.supabase.co`.
- Local app env uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`; do not commit `.env*` files or service-role/database credentials.
- Vercel must define `NEXT_PUBLIC_SUPABASE_URL=https://hhddeqgvrnyxnwetetdc.supabase.co` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for real auth flows.
- Public session reads render as signed-out and sitemap omits dynamic teacher URLs when Supabase public env is missing so Vercel prerender/build does not crash; mutating auth and database flows still require the Supabase env and should fail loudly if it is missing.
- Server-side eligibility grading and request rate limiting use `SUPABASE_SERVICE_ROLE_KEY`; it must stay server-only and must never be exposed through `NEXT_PUBLIC_*`.
- Remote Supabase MCP retargeting, QA, and test work are deferred operational/verification work. The next contributor should focus only on backend/frontend application code unless explicitly asked otherwise.
- Supabase Auth email/password signup is enabled and email confirmations are disabled for the MVP account-creation flows that expect an immediate session.
- Vercel Web Analytics and Speed Insights are installed through `@vercel/analytics` and `@vercel/speed-insights` and mounted in the root App Router layout.
- SMS is not in MVP.
- Architecture: feature-based architecture.
- API documentation: OpenAPI should be maintained as backend endpoints evolve.
- Responsive requirement: all pages must work well on mobile and desktop.
- MVP business model: no payments and no lesson package sales for now; focus on teacher listings and student applications.
- Institution accounts are later-phase scope.
- Teacher listing model: one public teacher profile/listing per teacher for now.
- Teacher publishing: no admin approval for MVP; eligible teachers can publish directly.
- Teacher listing creation is fully gated by the Teacher Eligibility Test: a teacher can create an account without the test, but cannot view the listing form or save a draft/listing until the test is passed.
- Teacher Availability is owned by the app profile/user, not by the Teacher Listing. Teachers can edit weekly recurring availability before or after publishing a listing.
- Teacher Availability is recommended for listing quality but is not required before publishing a Teacher Listing.
- Teacher Availability uses hourly recurring weekday slots plus dated exceptions. Exceptions can either block normal availability or add extra one-off availability.
- Public teacher cards and profiles should show a compact weekly availability preview. The monthly calendar view is private to the Teacher dashboard.
- Search can filter teachers by availability using weekday plus optional start/end hour overlap. This is a discovery filter, not a booking lock.
- Lesson Requests can capture a preferred weekday/hour, but this does not reserve the teacher's availability. Teachers may later adjust the accepted lesson schedule manually.
- Teacher Calendar uses a hybrid model: accepting a Lesson Request creates a private Teacher Student relationship and, when preferred weekday/hour exists, creates the first scheduled Lesson Session automatically.
- Teachers can also create manual Lesson Sessions for any named student from their dashboard calendar. Manual students are private teacher-owned records, not full platform Student accounts.
- Cancelling a Lesson Session cancels only that session. It does not cancel the accepted Lesson Request or the Teacher Student relationship.
- Calendar income is an estimate, not payment collection. Each Lesson Session snapshots `price_amount`, `duration_minutes`, and `currency` at scheduling time.
- Communication: no in-site chat for MVP. When a teacher accepts a lesson request, the student's contact details are shared with the teacher.
- Admin moderation actions must write audit logs for teacher profile status changes and review status changes.
- Public marketplace pages show a maintenance/not-ready state when there are no published Teacher Listings.
- Teacher Search falls back to recommended published teachers when filters produce zero exact matches but published teachers exist.
- Delivery modes: both online and face-to-face are supported. For online lessons, teachers/students manage their own meeting links externally.
- Search location model: support both city/district filtering and location-based nearby search.
- Seed data: `supabase/seed.sql` is now a full demo seed for the current Supabase project. It includes Erzurum plus varied demo cases across profiles, teachers, listings, lesson requests, lessons, reviews, favorites, notifications, analytics, and admin audit logs.
- Demo seed data is not real production marketplace data. Do not present seeded teachers, students, listings, reviews, or analytics as real user activity. Create a separate production-safe reference seed if the project later needs one.
- Vocabulary split: use this file for product/domain vocabulary and `LANGUAGE.md` for architecture vocabulary and rules.
- Documentation maintenance: whenever a critical codebase rule, architecture rule, domain decision, or workflow decision is given, update the relevant Markdown documentation in the same change.
- `CONTEXT.md` is the required linear project tracker. Every agent that changes this project must update this file in the same work session with the latest completed work, current in-progress state, next todos, blockers/conflicts, and relevant branch/commit references. Do not leave progress only in chat, temporary handoff files, or commit messages.
- Turkish UI copy and documentation must stay UTF-8; run the copy check before committing.

## Branch Workflow

- Each feature must be implemented on its own branch.
- Do not mix unrelated feature work in the same branch.
- Before starting new work, read the "Linear Progress Tracker" section below and update it when the work changes state.
- A feature is not ready for handoff until `CONTEXT.md` reflects what changed, what remains, and any verification or known failure.
- Use the canonical feature branch names from the implementation plan:
  - `feat/mvp-foundation`
  - `feat/mvp-data-auth-seeds`
  - `feat/public-home-seo`
  - `feat/search-results`
  - `feat/teacher-public-profile`
  - `feat/lesson-request-funnel`
  - `feat/account-flow-cleanup`
  - `chore/utf8-docs-and-copy-cleanup`
  - `feat/auth-account-rebuild`
  - `feat/dashboard-foundation`
  - `feat/teacher-listing-eligibility-public-data`
  - `feat/dashboard-request-management`
  - `feat/dashboard-reviews`
  - `docs/openapi-mvp-lock`
- Any API behavior change must update the OpenAPI contract in the same branch.
- Any product or architecture decision discovered during implementation must update this context file in the same branch.
- Branches should be pushed after their acceptance criteria pass.

## Linear Progress Tracker

This section is the canonical progress and todo tracker for agents. Keep it chronological and current.

### 2026-06-11 - Pre-Feature Readiness Hardening

- Local branch: `chore/pre-feature-readiness`.
- Extracted Review submission ownership/status checks into the Review service so only the owning Student can review an accepted Lesson Request, once.
- Confirmed Teacher dashboard contact sharing remains scoped through the Lesson Request service: `lesson_request_contacts` are returned only for accepted requests.
- Added Supabase Postgres-backed rate limiting for high-risk mutating flows: auth register/login/forgot-password, Lesson Request creation, Review creation, Favorites toggle, and Teacher Eligibility submissions.
- Added migration `20260611115650_request_rate_limits.sql`; the rate-limit table has RLS enabled and is accessed through server-only service-role code.
- Applied pending remote migrations `20260611103953_admin_audit_insert_policy.sql` and `20260611115650_request_rate_limits.sql` to project `hhddeqgvrnyxnwetetdc`; verified `public.request_rate_limits` exists with RLS enabled.
- Polished existing SEO/content pages without adding new dynamic route families: `/ozel-ders/[slug]` now has cleaner metadata, slug-based teacher matching, fallback/empty states, and clean UTF-8 copy; teacher profiles now include Open Graph metadata.
- Removed unfinished public blog placeholder copy and added visible draft/legal-review notices to legal pages.
- Dashboard request list APIs remain deferred: dashboard list data stays server-rendered through feature services until a mobile/external client needs documented GET endpoints.
- Verification passed: `bun run check:copy`, `bun run typecheck`, `bun run lint`, `bun run build`, `git diff --check`, `supabase migration list`, and a linked DB query confirming `request_rate_limits` has RLS enabled.

### 2026-06-14 - Teacher Availability And Calendar Foundation

- Local branch: `dev`.
- Added Teacher Availability data model with weekly hourly slots and dated exceptions through local migration `20260614082142_teacher_availability_calendar_foundation.sql`.
- Availability is stored against `profiles.id` so Teacher accounts can edit it independently from Teacher Listing creation and publication.
- Added private Teacher dashboard calendar page at `/ogretmen/panel/takvim`.
- Added `GET /api/teachers/me/availability` and `PUT /api/teachers/me/availability` for the signed-in Teacher's own availability.
- Added reusable availability editor, compact weekly preview, and private monthly calendar preview under `src/features/availability`.
- Public Teacher read models now include availability, and teacher search/profile surfaces can display compact weekly availability.
- Teacher search supports availability filters: `availabilityWeekday`, `availabilityStartHour`, and `availabilityEndHour`.
- Lesson Request submission now stores optional preferred weekday/hour fields for the student's requested lesson time. This is only a preference and does not reserve a slot.
- Future todo: implement actual scheduled lesson-session events on the same monthly calendar after accepted Lesson Requests exist.
- Verification passed: `bun run check:copy`, `bun run typecheck`, `bun run lint`, `bun run build`, and `git diff --check`.

### 2026-06-14 - Teacher Lesson Calendar And Dashboard Metrics

- Local branch: `feat/teacher-calendar-lessons`.
- Built on the Teacher Availability foundation to add actual Teacher lesson scheduling.
- Added local migration `20260614105552_teacher_calendar_lessons.sql`:
  - New `teacher_students` table for teacher-owned accepted/manual students.
  - Expanded `lessons` from one accepted request record into reusable scheduled Lesson Sessions.
  - Added RLS policies and authenticated Data API grants for new calendar tables/operations.
- Accepting a Lesson Request now upserts the Teacher Student record and automatically creates the first Lesson Session when the request has preferred weekday/hour.
- Added Teacher Calendar APIs:
  - `GET /api/teachers/me/calendar`
  - `POST /api/teachers/me/calendar/lessons`
  - `PATCH /api/teachers/me/calendar/lessons/{id}`
- Reworked `/ogretmen/panel/takvim` into a tabbed workspace for Lesson Calendar and Availability.
- Teacher dashboard home now shows future lesson count, active student count, this-month estimated income, future projected income, next lessons, and unscheduled accepted requests.
- Teacher students page now lists teacher-owned students from accepted requests and manual lesson creation.
- Updated `supabase/seed.sql` with teacher-student/session data so fresh seeded databases match the new schema.
- Verification passed: `bun run check:copy`, `bun run typecheck`, `bun run lint`, `bun run build`, and `git diff --check`.

### 2026-06-11 - Premium Select Styling Cleanup

- Local branch: `dev`.
- Replaced native dropdowns in the Lesson Request form, account registration form, and teacher listing form with shared `PremiumSelect` controls so user-facing select inputs match the premium interface styling.
- Updated `PremiumSelect` to accept readonly option arrays from domain constants without copying them.
- Verification: no native `<select>` remains under `src`; `bun run check:copy` and `bun run typecheck` pass after clearing stale generated `.next/dev` types.

### 2026-06-11 - Dashboard Hardening And Marketplace Empty States

- Local branch: `dev`.
- Hardened Lesson Request dashboard flows so Student/Teacher list and accept/reject operations explicitly scope by the current account instead of relying only on RLS side effects.
- Teacher contact details remain attached only for accepted Lesson Requests.
- Hardened Favorites list/check/toggle behavior around signed-in Student ownership and published Teacher Listings.
- Admin moderation now updates Teacher Listing visibility consistently with Teacher Profile status and writes audit logs for teacher/review status changes.
- Added local migration `20260611103953_admin_audit_insert_policy.sql` so authenticated admins can insert `admin_audit_logs`.
- Added shared dashboard state cards for empty/error dashboard states.
- Teacher Search now returns fallback metadata: no published teachers yields a maintenance state; zero exact filter matches falls back to recommended published teachers.
- Homepage now shows a marketplace maintenance state when no published teachers are available.
- Updated OpenAPI for the search fallback metadata and admin moderation error modes.
- Review pass completed before push: `bun run check:copy`, `bun run typecheck`, `bun run lint`, and `bun run build` pass.

### 2026-06-04 - Vercel Observability Packages

- Local branch: `dev`.
- Installed `@vercel/analytics` and `@vercel/speed-insights` with Bun.
- Added global `<Analytics />` and `<SpeedInsights />` components to the root App Router layout.
- Vercel dashboard-side enablement is still required for data to appear in Web Analytics and Speed Insights.

### 2026-06-04 - Teacher Listing Eligibility Gate Rework

- Local branch: `dev`.
- Reworked `/ogretmen/panel/ilan` so teachers who have not passed the Teacher Eligibility Test first see a gate card with `Teste Başla`.
- The test interface now appears only after the teacher starts the test, and the listing form stays hidden until eligibility is `passed`.
- Direct `PUT /api/teachers/me/listing` writes are now blocked before a passed eligibility state, including draft saves.
- Updated this context to retire the old draft-before-test behavior.

### 2026-06-04 - Merge Resolution

- Local branch: `dev`.
- Pulled `origin/dev` into local `dev` and resolved merge conflicts.
- Resolution policy: keep the newer remote premium design/mobile work while preserving the local production rule that public marketplace pages must not fall back to fake teachers, fake listings, fake reviews, fake stats, or runtime mock search data.
- Public homepage, teacher search, lesson landing pages, sitemap, and search API now use Supabase-backed data paths with no runtime mock teacher/search fallback.
- Verification passed during merge resolution: `bun run check:copy`, `bun run typecheck`, `bun run lint`, and `bun run build`.
- Runtime mock seed files removed in the merge resolution:
  - `src/features/search/mock-data.ts`
  - `src/features/teachers/constants.ts`
- Conflicted files resolved on 2026-06-04:
  - `src/app/(public)/ogretmen-bul/page.tsx`
  - `src/app/(public)/page.tsx`
  - `src/app/api/search/teachers/route.ts`
  - `src/app/sitemap.ts`
  - `src/features/dashboard/shared/dashboard-shell.tsx`
  - `src/features/homepage/constants.ts`
  - `src/features/search/search-filters.tsx`
  - `src/features/search/search-service.ts`
- Merge commit created locally: `6024cec Merge origin/dev into dev`.
- Merge was pushed to `origin/dev`; latest pushed docs tracker commit is `d035f52 docs: record dev merge resolution`.

### 2026-06-04 - Origin Dev Work Integrated

- Integrated `origin/dev` premium design and mobile pass through `55ba07b Merge fix/final-design-and-mobile`.
- Public UI now includes premium layouts for homepage, login, register hub, teacher search, teacher profile, `ogretmen-ol`, SSS, contact, blog, password reset, legal pages, and lesson landing pages.
- `PremiumSelect` is now the shared custom dropdown used instead of native selects in the polished public UI.
- Public header/footer and mobile menu were upgraded, including mobile navigation support.
- Lesson landing pages now live under `/ozel-ders/[slug]` with SEO metadata and real teacher-list sections when Supabase-backed published teachers exist.
- Password reset flow was added with `/sifremi-unuttum` and `/sifremi-sifirla`.
- Blog pages were added at `/blog` and `/blog/[slug]`.
- Contact and SSS pages were added at `/iletisim` and `/sss`.
- Admin foundation was added under `/admin`, including teacher moderation, review moderation, analytics shell, admin auth guard helpers, and admin write-policy/analytics migrations.
- Dashboard request-management UI was added for student and teacher panels, including accept/reject API routes for lesson requests.
- Dashboard reviews UI was added, including review submission API/service and teacher reviews view.
- Favorites UI/API/service was added for student favorite teachers.
- Account profile and teacher profile settings forms were added for dashboard profile management.
- Search UI now includes the premium filter layout with global pagination/sorting/filtering parameters, extra gender/price/fast-response filters, and Supabase-backed filter options.
- Search analytics tracking was added for `/api/search/teachers`.

### 2026-06-04 - Remote Supabase Seeded

- Applied pending remote migrations to project `hhddeqgvrnyxnwetetdc`:
  - `20260603120000_admin_write_policies.sql`
  - `20260603130000_analytics_events.sql`
- Confirmed `supabase/seed.sql` Turkish seed text is valid UTF-8 before applying it remotely.
- Ran the production-safe reference seed against the linked Supabase project.
- Verified remote reference data through Supabase service-role reads:
  - `locations`: 5 rows.
  - `lesson_categories`: 8 rows.
  - `teacher_eligibility_tests`: 1 row.
  - `teacher_eligibility_questions`: 3 rows.
  - `teacher_eligibility_choices`: 12 rows.
  - `analytics_events`: 0 rows, expected immediately after migration.
- Verified seeded Turkish text renders correctly for locations, lesson categories, and teacher eligibility prompts.
- At that time `supabase/seed.sql` was reference-only; this was superseded later the same day by the full demo seed request below.

### 2026-06-04 - Full Demo Seed Added

- Expanded `supabase/seed.sql` from reference-only data into a full deterministic demo seed.
- Seed now includes:
  - 1 admin application profile.
  - 7 teacher application profiles.
  - 4 student application profiles.
  - 7 teacher eligibility attempts.
  - 7 teacher profiles, including 6 published profiles and 1 draft profile for admin/moderation cases.
  - 15 teacher lesson mappings.
  - 7 teacher listings, including 6 public listings and 1 unpublished draft listing.
  - 13 lesson requests covering accepted, submitted, and rejected statuses.
  - 13 lesson request contact rows.
  - 11 lesson rows covering completed and scheduled statuses.
  - 11 reviews covering published and pending statuses.
  - 6 favorites.
  - 4 notifications.
  - 4 analytics events.
  - 2 admin audit log rows.
- Applied the expanded seed to remote project `hhddeqgvrnyxnwetetdc`.
- Verified remote counts through Supabase service-role reads:
  - `profiles`: 17 total rows at verification time, including existing profiles plus demo rows.
  - `student_profiles`: 6 total rows at verification time.
  - `locations`: 5 rows.
  - `lesson_categories`: 8 rows.
  - `teacher_eligibility_tests`: 1 row.
  - `teacher_eligibility_attempts`: 7 rows.
  - `teacher_profiles`: 7 rows.
  - `teacher_lessons`: 15 rows.
  - `teacher_listings`: 7 rows.
  - `lesson_requests`: 13 rows.
  - `lesson_request_contacts`: 13 rows.
  - `lessons`: 11 rows.
  - `reviews`: 11 rows.
  - `favorites`: 6 rows.
  - `notifications`: 4 rows.
  - `analytics_events`: 4 rows.
  - `admin_audit_logs`: 2 rows.
- `supabase/seed.sql` remains idempotent by deleting deterministic demo profile IDs and demo analytics/audit records before re-inserting.
- Seed does not create Supabase Auth users. Demo application profile rows exist for marketplace data; login-capable demo users require a separate Auth/admin API seed script.

### 2026-06-04 - Teacher Eligibility QA Seed Shortcut

- Updated `supabase/seed.sql` so every correct teacher eligibility choice has the label `THIS IS THE CORRECT ANSWER`.
- The correct choices are still the score `1` choices; only their displayed labels changed for QA.
- Applied the seed to remote Supabase project `hhddeqgvrnyxnwetetdc`.
- Verified remote `teacher_eligibility_choices` has 3 score-1 rows and all 3 labels are `THIS IS THE CORRECT ANSWER`.

### 2026-06-04 - Teacher Eligibility Submit Bug Fix

- Fixed the teacher eligibility submission path after QA showed selected correct answers could still surface `Test cevapları eksik veya hatalı.`
- Root cause: the seeded test ID `00000000-0000-0000-0000-000000000301` is valid for Postgres `uuid`, but it is not RFC-versioned, so Zod's strict `z.uuid()` rejected the request body before grading.
- The submission schema now validates `testId` as a non-empty string because the database remains the source of truth for whether the test ID exists.
- Server grading now accepts either the public `question_key` or the database question UUID as `questionId`, so cached or differently shaped clients do not fail valid submissions.
- Teacher listing manager now:
  - clears stale test messages when an answer changes.
  - blocks incomplete answer payloads before posting.
  - posts the validated payload directly to `/api/teacher-eligibility/submissions`.
  - renders detected errors as error states instead of green success states.
- Verification passed: direct schema repro with the seeded test ID, `bun run check:copy`, `bun run typecheck`, and `bun run lint`.

### 2026-06-04 - Teacher Listing RLS Recursion Fix

- Fixed `infinite recursion detected in policy for relation "teacher_profiles"` seen when creating an `ilan` after passing the teacher eligibility test.
- Root cause: RLS policies on `teacher_profiles` and `teacher_listings` queried `profiles`, while `profiles` had a public-read policy that queried `teacher_profiles`; policy evaluation could re-enter itself.
- Added remote migrations:
  - `20260604075247_fix_admin_rls_recursion.sql`
  - `20260604075353_fix_teacher_policy_role_recursion.sql`
  - `20260604075530_fix_listing_policy_helpers.sql`
- `public.is_admin()`, `public.has_app_role()`, `public.owns_teacher_profile()`, and `public.can_write_teacher_listing()` now isolate role/ownership checks from RLS recursion.
- Applied all three migrations to remote project `hhddeqgvrnyxnwetetdc`.
- Verified with rollback SQL as authenticated teacher users:
  - teacher profile draft insert succeeds.
  - teacher listing draft insert succeeds.
  - teacher profile/listing published insert succeeds after a passed eligibility attempt.

### 2026-06-04 - Latest Commit Review

- Local latest completed merge: `3fe7261 Merge chore/prod-seed-and-remove-mocks`.
- Local latest feature commit: `6a3e7d2 Remove homepage mocks and seed production references`.
- Latest remote `origin/dev` commit at inspection time: `55ba07b Merge fix/final-design-and-mobile`.
- Newer remote work to reconcile includes:
  - final design and mobile pass: `314d9a0`.
  - premium page upgrade for login, SSS, contact, blog, and lesson landing pages: `81d54a4`.
  - custom `PremiumSelect` dropdown replacement: `12313b3`.
  - premium visual polish and teacher profile overhaul: `60299c1`.
  - design overhaul for homepage, register hub, login, and search filters: `472f286`.
  - password reset callback page: `c4ba05b`.
  - final placeholder/legal/footer/copy cleanup: `179920e`.
  - SSS, contact, and lesson landing pages: `52c6f53`.

### Completed

- Supabase/Vercel prerender handling fixed so public auth/session reads can render signed-out when public Supabase env is absent.
- `main` was ancestry-merged into `dev` with the `ours` strategy to keep `dev` from appearing behind while preserving the newer `dev` app flow.
- Remote Supabase was seeded with a full demo marketplace dataset on 2026-06-04.
- Remote Supabase migrations are current through `20260611115650_request_rate_limits.sql`.
- Fake production profile IDs from the older seed were removed from production.
- Runtime mock teacher/search seed files were removed locally in `6a3e7d2`.
- Homepage teacher sections and search filters were moved toward Supabase-backed data locally in `6a3e7d2`.
- Remote premium design/mobile work from `origin/dev` is merged and pushed.
- Initial dashboard request management, dashboard reviews, favorites, profile/settings forms, and admin/moderation basics are now present in code.

### Next Todos

1. Smoke-test the protected flows with real Supabase users: accepted Review creation, rejected/submitted Review blocking, accepted contact sharing, rate-limited auth/request/review behavior.
2. Get legal approval for the draft privacy, terms, and KVKK pages before production launch.
3. Keep public marketplace pages free of runtime mock data while adding future features.

## Implementation Progress

- Public teacher profiles use `/ogretmen/[slug]`.
- The teacher profile API is `GET /api/teachers/{slug}`.
- Teacher search cards link to the public teacher profile route.
- Teacher profile CTAs link to the lesson request funnel with `teacher={slug}`.
- Lesson request funnel uses `/ders-talebi?teacher={slug}`.
- Lesson request submission requires a signed-in student account and persists the lesson request.
- Student and teacher accounts are created through the normal `/kayit` registration flow; Supabase email confirmation must be disabled for MVP flows that expect an immediate session.
- Unauthenticated visitors opening `/ders-talebi?teacher={slug}` are redirected to `/kayit?next=/ders-talebi?teacher={slug}`.
- The request submission API is `POST /api/lesson-requests`.
- Teacher request actions use `POST /api/lesson-requests/{id}/accept` and `POST /api/lesson-requests/{id}/reject`.
- Global auth APIs are `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, and `GET /api/auth/me`.
- Password reset APIs/pages are present through `POST /api/auth/forgot-password`, `/sifremi-unuttum`, and `/sifremi-sifirla`.
- Favorites APIs are `GET /api/favorites/check` and `POST /api/favorites/toggle`.
- Review submission uses `POST /api/reviews`.
- Account profile update API is `PATCH /api/profiles/me`.
- Teacher profile settings update API is `PATCH /api/teacher-profiles/me`.
- Admin moderation APIs are `POST /api/admin/teacher-profiles/{id}/status` and `POST /api/admin/reviews/{id}/status`.
- Private dashboard foundation uses a shared shell in `src/features/dashboard`.
- Student dashboard routes: `/ogrenci/panel`, `/ogrenci/panel/talepler`, `/ogrenci/panel/favoriler`, `/ogrenci/panel/profil`.
- Teacher dashboard routes: `/ogretmen/panel`, `/ogretmen/panel/talepler`, `/ogretmen/panel/ilan`, `/ogretmen/panel/ogrenciler`, `/ogretmen/panel/yorumlar`, `/ogretmen/panel/profil`, `/ogretmen/panel/ayarlar`.
- Dashboard foundation routes are clickable empty states only for request management, reviews, students, favorites, and settings forms. Teacher listing creation is now wired into `/ogretmen/panel/ilan`.
- Teacher listing creation is implemented in `feat/teacher-listing-eligibility-public-data`: teachers must pass the Teacher Eligibility Test before the listing form is shown or any draft/published listing write is accepted.
- Public teacher search/profile and homepage teacher sections read Supabase published listings directly; seed/mock data is not used as a runtime fallback for public teacher discovery.
- Teacher eligibility test content is database-backed with questions and choices. Scores are read only by server-side grading through the service-role client.
- New local migration for this branch: `supabase/migrations/20260524120000_teacher_listing_eligibility_public_data.sql`. Remote application is deferred and should not block backend/frontend feature work.
- Teacher account/listing experiments from `a7b515a` and `f528c20` were cleaned up in `feat/account-flow-cleanup`.
- The Supabase rollback migration for the teacher account/listing experiment was applied remotely.
- `/ogretmen-ol` routes teachers into `/kayit?role=teacher`; teacher eligibility and listing creation continue inside `/ogretmen/panel/ilan`.
- Student dashboard now has request and favorites views wired to services.
- Teacher dashboard now has request, review, profile, and settings views wired to services.
- Admin dashboard now has teacher/review moderation pages and an analytics shell.
- Public content pages now include `/sss`, `/iletisim`, `/blog`, `/blog/[slug]`, `/sifremi-unuttum`, `/sifremi-sifirla`, and `/ozel-ders/[slug]`.
- The active OpenAPI contract only documents implemented endpoints.
- UTF-8 hygiene is being tracked in `chore/utf8-docs-and-copy-cleanup`.

## Remaining Feature Order

1. Run a real-account smoke pass for Review eligibility, Teacher contact sharing, and rate-limited mutation behavior.
2. Continue SEO/content expansion with a documented route order: lesson pages first, then lesson+city pages, then lesson+city+district only after canonical/index rules are explicit.
3. Replace draft legal copy with lawyer-approved privacy, terms, and KVKK text before launch.

Deferred outside the next handoff scope:

- Automated test expansion.
- New product features beyond the existing MVP flows.

## Documented Findings - 2026-05-24

- Auth now has a dedicated `src/features/auth` module; future auth/session/profile changes should use that seam.
- Lesson request submission no longer creates accounts, but the route still mixes teacher seed validation with Supabase listing/category/location persistence.
- Teacher Search, Teacher Profile, and lesson request teacher validation now use Supabase published teacher listings as the single teacher read source.
- Dashboard foundation exists as role-aware private shells and empty routes. Request actions, reviews, and listing creation should build on it.
- Request acceptance and reviews belong in dashboard flows, not as isolated public features.
- Legal pages now contain product-specific draft copy and visible legal-review notices; they still need legal approval before launch.
- No production image assets should be taken from `docs/design-references`; those files are reference-only.

## Netleşen Kararlar - 2026-05-21

- Öğrenci ve öğretmen hesapları normal `/kayit` akışından oluşturulur.
- Ders talebi akışı hesap oluşturmaz; ders talebi formuna girmek için öğrenci hesabıyla giriş yapılmış olmalıdır.
- Öğretmen profili/ilanı şimdilik admin onayı olmadan yayına alınabilecek.
- Ödeme, ders paketi satın alma ve platform içi tahsilat MVP kapsamında değil.
- Her öğretmenin tek bir profili/ilanı olacak.
- Platform içi chat daha sonra eklenebilir.
- Öğretmen başvuruyu kabul ettikten sonra öğrencinin iletişim bilgileri öğretmenle paylaşılacak.
- Kurumsal üyelik sonraki faza bırakıldı.
- Online ve yüz yüze dersler ikisi de desteklenecek.
- Online derslerde platform Meet/Zoom linki oluşturmayacak; taraflar kendi linklerini kullanacak.
- Yorum yazma hakkı, öğretmenin o öğrencinin özel ders başvurusunu onaylamasından sonra verilecek.
- SMS entegrasyonu şimdilik yok.
- Öğretmen hesabı açmak için test gerekmiyor. Test, öğretmen özel ders ilanı oluşturmak istediğinde gösterilecek ve sadece testi geçen öğretmenler ilan yayınlayabilecek.
- Öğretmen testi geçmeden ilan formunu göremez ve taslak/yayınlanmış ilan kaydedemez.
- MVP öğretmenlik testi veritabanından gelir; 3 placeholder soru ve her soruda ilk seçenek doğru olacak şekilde başlatılır.
- Test tekrarları MVP için sınırsızdır; test geçildikten sonra yeniden test gerekmez.
- Öğretmen için zorunlu ilk alanlar: ad, soyad, fiyat, konum, telefon.

## Visual References In Repo

These files are design references only. Do not use them directly as website images or production assets.

- `docs/design-references/image.png`: lesson request first step, lesson/category selection.
- `docs/design-references/image copy.png`: lesson request location step with city/district fields.
- `docs/design-references/image copy 2.png`: lesson request contact details and consent step.
- `docs/design-references/image copy 3.png`: search results page with SEO heading, breadcrumbs, filters, sorting, and teacher cards.
- `docs/design-references/image copy 4.png`: teacher detail/profile page with profile summary, reviews, price, CTA, and verification signals.
- `docs/design-references/image copy 5.png`: role choice/registration entry page.
- `docs/design-references/örnek-anasayfa.jpeg`: homepage visual direction.
- `docs/design-references/örnek-dashboardlar-ve-anasayfa.jpeg`: homepage plus student/teacher dashboard visual direction.

## Main User Roles

### Visitor

- Can browse public pages without an account.
- Can search teachers.
- Can view teacher profiles.
- Can search and view teacher profiles without logging in.
- Must register or log in before opening the lesson request form.

### Student

- Can register/login.
- Is created through the normal `/kayit` registration flow.
- Can save favorite teachers.
- Can submit lesson requests.
- Can see submitted requests and accepted lessons in the dashboard.
- Can review a teacher after the teacher approves/accepts that student's lesson request.

### Teacher

- Can register/login as a teacher.
- Can create a teacher account without passing the teacher eligibility test.
- Must pass the teacher eligibility test before seeing the listing form or saving a draft/published tutoring ad/listing.
- Can create and edit teacher profile.
- Can publish one public teacher listing/profile for now.
- Can receive lesson requests.
- Can accept lesson requests; after acceptance, the student's contact details become visible to the teacher.
- Can manage students and lessons in the dashboard.
- Can see ratings, reviews, response metrics, and profile completion.

### Admin

- Should exist even if the first UI is minimal.
- Can moderate teachers, listings, reviews, and reports.
- Can verify teacher documents or profile status.
- Can manage categories, cities, districts, and SEO landing pages.

### Institution

- Mentioned in the reference screenshot as "Kurumsal Üyelik".
- Should be treated as later-phase scope unless confirmed as important for MVP.

## Core Public Pages

- Homepage.
- Teacher search page: `/ogretmen-bul` or SEO-specific routes.
- Lesson landing pages: examples like `/matematik-ozel-ders`, `/istanbul-matematik-ozel-ders`.
- Teacher profile page: public, indexable, structured for SEO.
- Login/register pages.
- Role selection page: student, teacher, institution.
- Legal pages: terms, privacy policy, cookie policy, explicit consent/KVKK.
- FAQ/support/contact pages.

## MVP Feature Scope

### 1. Public Search and Discovery

- Search bar for lesson/category.
- City and district filters.
- Nearby/location-based search.
- Price range filter.
- Online/in-person delivery mode filter.
- Rating/review filter.
- Experience level filter.
- Gender filter if this is a required marketplace feature.
- Response time filter if tracked.
- Sort options: recommended/default, nearest, highest rated, lowest price, most reviewed, newest.
- Backend-side filtering, sorting, and pagination.
- Shareable URLs with query params for SEO and user navigation.

### 2. Teacher Cards

- Teacher name.
- Profile photo placeholder until image upload is implemented.
- Verification/premium badge if applicable.
- Main lesson categories.
- City/district.
- Online/in-person availability.
- Hourly price.
- Rating and review count.
- Experience summary.
- Short bio.
- CTA: profile view or lesson request.

### 3. Teacher Profile Page

- Name, title, and verification status.
- Location.
- Lessons/categories taught.
- Education.
- Experience year.
- Hourly price and lesson duration.
- Online/in-person availability.
- Short and long bio.
- Response time.
- Active student count and completed lesson count if real data exists.
- Reviews and rating distribution.
- CTA for lesson request.
- JSON-LD structured data for SEO.

### 4. Lesson Request Funnel

1. Select lesson/category.
2. Select city and district.
3. Select online or face-to-face preference.
4. Enter contact details.
5. Select preferred contact method.
6. Accept terms/privacy/KVKK consent.
7. Submit request as the signed-in student.

Potential additions: preferred date/time, student level, goal/need text field, and budget range.

### 5. Authentication

- One normal registration form supports student and teacher account creation.
- Student account creation happens through `/kayit`; lesson request no longer creates the account.
- Teacher account can be created before the teacher eligibility test.
- Teacher eligibility test is required before the teacher can view the listing form or save a tutoring ad/listing.
- Supabase Auth email/password.
- Phone number collection for lesson requests.
- Email verification.
- SMS verification is not part of MVP.
- Role stored in application profile table, not only Supabase auth metadata.

### 6. Teacher Account And Listing

Minimum teacher account fields:

- Name and surname.
- Phone.

Minimum teacher listing fields:

- City/district.
- Hourly price.
- Eligibility test passed state.
- Profile title.
- Bio.
- Lessons/categories.
- Education.
- Experience year.
- Delivery mode: online, face-to-face, both.
- Profile visibility status: draft, published, suspended.

Image upload, document verification, and video intro can be later-phase.

### 7. Reviews and Ratings

- Reviews should only be allowed after the teacher accepts/approves that student's lesson request.
- Rating fields: overall rating first; optional criteria later.
- Moderation state: pending, published, rejected.
- Teacher should be able to report a review.
- Public profile should show aggregate rating and review count.

## Phase Plan

### Phase 1 - Public Marketplace MVP

Goal: launch an SEO-visible tutoring directory with searchable teachers and a working request funnel.

- Next.js app setup.
- Feature-based folder structure.
- Supabase schema and RLS baseline.
- Public homepage.
- Search/results page.
- Teacher profile page.
- Lesson request funnel.
- Student/teacher registration entry.
- Authenticated lesson request submission.
- Teacher account registration.
- Teacher eligibility test gate before the listing form.
- Teacher listing creation form after passed eligibility.
- Basic teacher listing CRUD.
- Backend filters with pagination.
- OpenAPI spec for route handlers/server endpoints.
- Basic SEO metadata, sitemap, robots, canonical URLs.
- Seed data for cities, districts, categories, and sample teachers.
- Erzurum must be included in seed data.

### Phase 2 - Dashboards

Goal: give students and teachers private workspaces.

- Student dashboard: lesson requests, favorite teachers, upcoming lessons, profile settings.
- Teacher dashboard: incoming requests, students, lessons, listing management, profile completion, reviews.
- Notification center.
- Basic message/contact tracking if direct messaging is approved later.
- Optional in-site chat can be added in this phase or later.

### Phase 3 - Trust, Moderation, and Operations

- Admin panel.
- Teacher verification workflow.
- Review moderation.
- Abuse/report flow.
- SMS provider integration if phone verification/notifications become necessary.
- Email notification templates.
- Audit logs for sensitive status changes.
- Analytics events for search, profile views, and request conversion.

### Phase 4 - Monetization and Growth

- Premium teacher placements.
- Lesson package sales if the business model changes.
- Payment integration if lessons are purchased through platform in a later phase.
- Institution accounts if still needed.
- Programmatic SEO pages by lesson + city + district.
- Blog/guide content for organic acquisition.

## Suggested Feature-Based Architecture

```text
src/
  app/
    (public)/
    (auth)/
    (student)/
    (teacher)/
    (admin)/
    api/
  features/
    auth/
    profiles/
    teachers/
    teacher-eligibility/
    lessons/
    search/
    requests/
    reviews/
    locations/
    notifications/
    seo/
  shared/
    components/
    db/
    forms/
    lib/
    types/
    validation/
```

Keep domain logic inside `features/*`. Keep generic UI, form utilities, and infrastructure helpers inside `shared/*`.

## Initial Data Model

- `profiles`: app-level user profile linked to Supabase auth user.
- `teacher_profiles`: teacher-specific profile data.
- `student_profiles`: student-specific profile data.
- `teacher_eligibility_tests`: teacher qualification test versions/questions/config.
- `teacher_eligibility_attempts`: user attempts and pass/fail state.
- `lesson_categories`: lesson/category tree.
- `teacher_lessons`: lessons a teacher offers.
- `locations`: city/district reference data.
- `teacher_service_areas`: where a teacher teaches.
- `teacher_listings`: one published listing/search document per teacher for MVP.
- `lesson_requests`: student requests to a teacher.
- `lessons`: accepted/scheduled/completed lessons.
- `reviews`: ratings and review text.
- `favorites`: saved teachers.
- `notifications`: email/SMS/in-app notification records.
- `admin_audit_logs`: important admin actions.

Important statuses:

- Teacher eligibility attempt: `started`, `passed`, `failed`, `expired`.
- Teacher profile: `draft`, `published`, `suspended`.
- Lesson request: `submitted`, `accepted`, `rejected`, `expired`, `cancelled`.
- Lesson: `scheduled`, `completed`, `cancelled`, `no_show`.
- Review: `pending`, `published`, `rejected`, `reported`.

Contact sharing rule:

- Student contact details are private while the lesson request is only `submitted`.
- When the teacher changes the request to `accepted`, the teacher can see the student's contact details.
- In-site chat is not part of MVP.

## SEO Plan

- Stable, readable Turkish slugs.
- Dynamic metadata per lesson, city, district, and teacher.
- Canonical URLs for filtered pages.
- Index only useful landing pages; avoid indexing every arbitrary filter combination.
- Route expansion order: keep existing `/ozel-ders/[slug]` lesson pages polished first, then add lesson+city pages, then add lesson+city+district pages only after canonical/index rules are explicit.
- Sitemap generation for public teacher profiles, lesson pages, city + lesson pages, and static pages.
- JSON-LD for teacher profiles and breadcrumbs.
- Internal linking from homepage to popular lessons, lesson pages to city pages, city pages to district pages, and teacher profiles to related lessons/locations.
- SSR or server-rendered public pages for crawlability.

## API and OpenAPI Notes

Even with Next.js route handlers/server actions, keep an OpenAPI contract for external clarity and agent continuity.

Currently implemented endpoints:

- `GET /api/search/teachers`
- `GET /api/teachers/{slug}`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/lesson-requests`
- `GET /api/lesson-categories`
- `GET /api/locations`
- `POST /api/lesson-requests/{id}/accept`
- `POST /api/lesson-requests/{id}/reject`
- `GET /api/teacher-eligibility/test`
- `POST /api/teacher-eligibility/submissions`
- `GET /api/teachers/me/listing`
- `PUT /api/teachers/me/listing`
- `GET /api/teachers/me/availability`
- `PUT /api/teachers/me/availability`
- `GET /api/teachers/me/calendar`
- `POST /api/teachers/me/calendar/lessons`
- `PATCH /api/teachers/me/calendar/lessons/{id}`
- `POST /api/admin/teacher-profiles/{id}/status`
- `POST /api/admin/reviews/{id}/status`

Planned endpoints:

- None currently planned. Dashboard list reads stay server-rendered through feature services until a mobile or external client requires documented GET endpoints.

Server actions can be used internally, but API shape should still be documented for major backend behavior.

## Risks and Issues Found In Current Plan

- MVP scope is too broad unless dashboards, payments, institution accounts, and visual/media features are delayed.
- Review integrity is partly defined: only accepted lesson requests can review. Still need anti-abuse rules and moderation behavior.
- Contact ownership is defined for MVP: contact details are shared only after teacher acceptance.
- Monetization is intentionally out of MVP. This is simpler, but future revenue model still needs a decision.
- Teacher eligibility is required before tutoring ad/listing creation, but anti-cheat rules are still undefined.
- Location search needs a data strategy. Nearest-location search requires coordinates, distance calculations, and privacy decisions.
- SEO can create duplicate pages if filters are all indexable. Indexing rules must be explicit.
- KVKK/privacy requirements are important because the funnel collects name, phone, email, location, and education needs.
- Supabase RLS exists in the baseline but needs review as new flows are added.
- Admin approval is not required for MVP, but admin tooling will still be needed for reports, suspensions, reviews, and content quality.
- Teacher listing relationship is defined for MVP: one teacher, one listing/profile.
- SMS is out of MVP, but phone ownership will remain weaker until phone verification is added.
- Image/video upload is deferred, but the data model should leave room for it.
- Dashboard phase needs a clear definition of what counts as a lesson, request, student, and completed lesson.

## Product Suggestions

- Start with city + lesson SEO pages before advanced dashboards, because SEO is a primary acquisition path.
- Use a teacher profile completion score to improve listing quality.
- Do not block publishing with admin approval in MVP, but keep admin suspend/report tools available as soon as practical.
- Add saved searches or favorites for students.
- Add "response time" only after it is tracked from real request data.
- Use fake marketplace stats carefully. Public numbers should either be real or clearly maintainable.
- Build seed content for top categories: Matematik, Fizik, Kimya, İngilizce, Türkçe, Yazılım, LGS, TYT/AYT.
- Include Erzurum in seed data and add varied test cases: online-only teacher, face-to-face teacher, high price, low price, no reviews, many reviews, accepted/rejected lesson requests.
- Add structured empty states for no results and suggest nearby districts or online teachers.
- Add analytics events from day one: search submitted, filter changed, teacher profile viewed, request funnel started, request submitted, registration completed.
- Add rate limiting and spam prevention to public lead forms.

## Açık Sorular

1. Gerçek öğretmenlik testi içerikleri, konu dağılımı ve soru sayısı MVP sonrasında nasıl yönetilecek?
2. Konum bazlı arama için kullanıcıdan tam adres mi, sadece il/ilçe mi, yoksa koordinat/pin mi alınacak?
3. Yakındaki öğretmenler sıralaması ilçe merkezine göre mi, kullanıcının konumuna göre mi hesaplanacak?
4. Öğrenci ders talebinin sonunda email ile doğrulama yapmadan hesap aktif olsun mu?
5. Öğretmen başvuruyu kabul ettiğinde öğrenciye email bildirimi gönderilecek mi?
6. Öğrencinin iletişim bilgilerinden hangileri öğretmene açılacak: telefon, email, ikisi de?
7. Fiyat saatlik mi olacak, yoksa öğretmen ders süresini de seçebilecek mi?
8. Admin panel MVP'de hiç olmayacak mı, yoksa minimum kullanıcı/ilan askıya alma eklenmeli mi?
9. Yorumlar otomatik yayınlansın mı, yoksa admin/moderasyon beklesin mi?
10. Öğretmen profilinde fotoğraf MVP'de zorunlu olmayacaksa varsayılan avatar stratejisi ne olacak?

## Definition Of Done For Phase 1

- Public pages render on mobile and desktop.
- Search results are server-filtered and paginated.
- Teacher profiles are SEO-rendered and indexable.
- Lesson request funnel requires a signed-in student and persists valid requests.
- Teacher eligibility test gates tutoring ad/listing creation, not teacher account registration.
- Teacher listing creation can create a draft/published teacher profile without admin approval after passed eligibility.
- Teachers can accept/reject lesson requests.
- Student contact details become visible to the teacher only after request acceptance.
- Supabase RLS protects private student/teacher data.
- Basic admin path exists for suspending users/listings and handling reports, even if approval is not required.
- Sitemap and metadata are implemented.
- OpenAPI document covers implemented API endpoints.
- Seed data exists for local development, including Erzurum.
- Core flows have focused tests.

## Linear Progress Tracker

Latest completed slice: teacher availability and calendar flow integration.

- Teacher availability is managed from the teacher calendar area and stored as weekly slots plus dated exceptions.
- Public teacher search, teacher profile pages, and lesson request flow can display teacher availability.
- Teacher search supports availability filtering by weekday and hour range.
- Lesson request creation lets the student pick a preferred weekday/start hour from the selected teacher's available slots when availability exists.
- If the selected teacher has no availability, the request flow shows a warning and still allows the student to submit a request.
- Teacher listing creation shows a reusable availability preview before the listing form and warns when availability is empty.
- Teacher calendar shows scheduled/completed/cancelled lessons, future lesson count, income summary, and student/contact context.
- Calendar shows an empty-state warning when the selected month has no lessons.
- Accepted lesson requests are converted into lesson calendar rows by the accept-request backend flow.
- Seed data now includes weekly availability slots, availability exceptions, preferred request times, and future lessons for QA.
- Supabase remote project `hhddeqgvrnyxnwetetdc` has received migrations `20260614082142_teacher_availability_calendar_foundation` and `20260614105552_teacher_calendar_lessons`.
- Supabase MCP migration calls timed out for this project during this slice; the linked Supabase CLI was used for remote migration/seed application.
- Remote seed verification after reseed: 14 weekly slots, 2 availability exceptions, 12 lesson requests with preferred times, 4 future teacher lessons, and 14 published listing-to-slot links.

Next cleanup before adding major new product features:

- Replace remaining placeholder/legal copy before launch.
- Review Supabase RLS for the new availability/calendar tables after real auth QA.
- Decide whether teacher dashboard list data should remain server-rendered or get documented API endpoints.
- Add rate limiting/spam prevention for public request/auth flows.
