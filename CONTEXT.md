# Ozel Ders Evim - Project Context

Last updated: 2026-06-04

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
- Server-side eligibility grading uses `SUPABASE_SERVICE_ROLE_KEY`; it must stay server-only and must never be exposed through `NEXT_PUBLIC_*`.
- Remote Supabase MCP retargeting, QA, and test work are deferred operational/verification work. The next contributor should focus only on backend/frontend application code unless explicitly asked otherwise.
- Supabase Auth email/password signup is enabled and email confirmations are disabled for the MVP account-creation flows that expect an immediate session.
- SMS is not in MVP.
- Architecture: feature-based architecture.
- API documentation: OpenAPI should be maintained as backend endpoints evolve.
- Responsive requirement: all pages must work well on mobile and desktop.
- MVP business model: no payments and no lesson package sales for now; focus on teacher listings and student applications.
- Institution accounts are later-phase scope.
- Teacher listing model: one public teacher profile/listing per teacher for now.
- Teacher publishing: no admin approval for MVP; eligible teachers can publish directly.
- Communication: no in-site chat for MVP. When a teacher accepts a lesson request, the student's contact details are shared with the teacher.
- Delivery modes: both online and face-to-face are supported. For online lessons, teachers/students manage their own meeting links externally.
- Search location model: support both city/district filtering and location-based nearby search.
- Seed data: include Erzurum and random test data covering different cases.
- Production seed data must not create fake users, fake teachers, fake listings, fake reviews, or fake marketplace stats. Keep production seeds to reference data such as locations, lesson categories, and teacher eligibility test content.
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
- Do not add fake production users, teachers, listings, reviews, or marketplace stats to `supabase/seed.sql`.

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
- Production database was seeded with production-safe reference data only: locations, lesson categories, and teacher eligibility test content.
- Remote Supabase migrations are current through `20260603130000_analytics_events.sql`.
- Fake production profile IDs from the older seed were removed from production.
- Runtime mock teacher/search seed files were removed locally in `6a3e7d2`.
- Homepage teacher sections and search filters were moved toward Supabase-backed data locally in `6a3e7d2`.
- Remote premium design/mobile work from `origin/dev` is merged and pushed.
- Initial dashboard request management, dashboard reviews, favorites, profile/settings forms, and admin/moderation basics are now present in code.

### Next Todos

1. Review the newly merged dashboard/admin/favorites/reviews flows end to end and tighten gaps before adding larger new features.
2. Re-check OpenAPI whenever search, request, review, favorite, profile, admin, or auth endpoint behavior changes further.
3. Keep public marketplace pages free of runtime mock data while polishing empty states for databases with no published teachers.

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
- Account profile API is `GET/PATCH /api/profiles/me`.
- Teacher profile settings API is `GET/PATCH /api/teacher-profiles/me`.
- Admin moderation APIs are `POST /api/admin/teacher-profiles/{id}/status` and `POST /api/admin/reviews/{id}/status`.
- Private dashboard foundation uses a shared shell in `src/features/dashboard`.
- Student dashboard routes: `/ogrenci/panel`, `/ogrenci/panel/talepler`, `/ogrenci/panel/favoriler`, `/ogrenci/panel/profil`.
- Teacher dashboard routes: `/ogretmen/panel`, `/ogretmen/panel/talepler`, `/ogretmen/panel/ilan`, `/ogretmen/panel/ogrenciler`, `/ogretmen/panel/yorumlar`, `/ogretmen/panel/profil`, `/ogretmen/panel/ayarlar`.
- Dashboard foundation routes are clickable empty states only for request management, reviews, students, favorites, and settings forms. Teacher listing creation is now wired into `/ogretmen/panel/ilan`.
- Teacher listing creation is implemented in `feat/teacher-listing-eligibility-public-data`: teachers can save draft listing content before passing the test, but publishing is blocked until a passed eligibility attempt exists.
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

1. Audit and harden the newly merged dashboard request-management, reviews, favorites, profile/settings, and admin flows against the actual Supabase schema/RLS.
2. Tighten empty/loading/error states for public and dashboard pages when Supabase has no published marketplace data.
3. Verify review eligibility: students should only review a teacher after that teacher accepts the student's lesson request.
4. Verify accepted request contact-sharing behavior in teacher dashboards.
5. Continue SEO/content polish for lesson landing pages and public profile pages.

Deferred outside the next handoff scope:

- Remote Supabase target confirmation and migration application.
- QA passes, manual test plans, and automated test expansion.

## Documented Findings - 2026-05-24

- Auth now has a dedicated `src/features/auth` module; future auth/session/profile changes should use that seam.
- Lesson request submission no longer creates accounts, but the route still mixes teacher seed validation with Supabase listing/category/location persistence.
- Teacher Search, Teacher Profile, and lesson request teacher validation now use Supabase published teacher listings as the single teacher read source.
- Dashboard foundation exists as role-aware private shells and empty routes. Request actions, reviews, and listing creation should build on it.
- Request acceptance and reviews belong in dashboard flows, not as isolated public features.
- Legal pages are placeholder text and need proper legal review before launch.
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
- Öğretmen ilan taslağını testi geçmeden kaydedebilir; yayına alma adımı test sonucu geçmeden engellenir.
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
- Must pass the teacher eligibility test before publishing a tutoring ad/listing.
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
- Teacher eligibility test is required when the teacher creates a tutoring ad/listing.
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
- Teacher eligibility test gate before tutoring ad/listing creation.
- Teacher listing creation form.
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
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/lesson-requests`
- `GET /api/lesson-categories`
- `GET /api/locations`
- `GET /api/teacher-eligibility/test`
- `POST /api/teacher-eligibility/submissions`
- `GET /api/teachers/me/listing`
- `PUT /api/teachers/me/listing`

Planned endpoints:

- `POST /api/lesson-requests/{id}/accept`
- `PATCH /api/teachers/me`
- `GET /api/student/requests`
- `GET /api/teacher/requests`

Server actions can be used internally, but API shape should still be documented for major backend behavior.

## Risks and Issues Found In Current Plan

- MVP scope is too broad unless dashboards, payments, institution accounts, and visual/media features are delayed.
- Review integrity is partly defined: only accepted lesson requests can review. Still need anti-abuse rules and moderation behavior.
- Contact ownership is defined for MVP: contact details are shared only after teacher acceptance.
- Monetization is intentionally out of MVP. This is simpler, but future revenue model still needs a decision.
- Teacher eligibility is required for tutoring ad/listing creation, but retake limits and anti-cheat rules are still undefined.
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
- Teacher listing creation can create a draft/published teacher profile without admin approval.
- Teachers can accept/reject lesson requests.
- Student contact details become visible to the teacher only after request acceptance.
- Supabase RLS protects private student/teacher data.
- Basic admin path exists for suspending users/listings and handling reports, even if approval is not required.
- Sitemap and metadata are implemented.
- OpenAPI document covers implemented API endpoints.
- Seed data exists for local development, including Erzurum.
- Core flows have focused tests.
