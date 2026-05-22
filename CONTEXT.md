# Ozel Ders Evim - Project Context

Last updated: 2026-05-21

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
- SMS: not in MVP.
- Architecture: feature-based architecture.
- API documentation: OpenAPI should be maintained as backend endpoints evolve.
- Responsive requirement: all pages must work well on mobile and desktop.
- MVP business model: no payments and no lesson package sales for now; focus on teacher listings and student applications.
- Institution accounts: later phase, not MVP.
- Teacher listing model: one public teacher profile/listing per teacher for now.
- Teacher publishing: no admin approval for MVP; eligible teachers can publish directly.
- Communication: no in-site chat for MVP. When a teacher accepts a lesson request, the student's contact details are shared with the teacher.
- Delivery modes: both online and face-to-face are supported. For online lessons, teachers/students manage their own meeting links externally.
- Search location model: support both city/district filtering and location-based nearby search.
- Seed data: include Erzurum and random test data covering different cases.
- Vocabulary split: use this file for product/domain vocabulary and `LANGUAGE.md` for architecture vocabulary and rules.
- Documentation maintenance: whenever a critical codebase rule, architecture rule, domain decision, or workflow decision is given, update the relevant Markdown documentation in the same change.

## Branch Workflow

- Each feature must be implemented on its own branch.
- Do not mix unrelated feature work in the same branch.
- Use the canonical feature branch names from the implementation plan:
  - `feat/mvp-foundation`
  - `feat/mvp-data-auth-seeds`
  - `feat/public-home-seo`
  - `feat/search-results`
  - `feat/teacher-public-profile`
  - `feat/lesson-request-funnel`
  - `feat/teacher-eligibility-onboarding`
  - `feat/request-acceptance-review-gate`
  - `docs/openapi-mvp-lock`
- Any API behavior change must update the OpenAPI contract in the same branch.
- Any product or architecture decision discovered during implementation must update this context file in the same branch.
- Branches should be pushed after their acceptance criteria pass.

## Netleşen Kararlar - 2026-05-21

- Ders talebi akışı hesap oluşturma ile başlamayacak. Öğrenci önce tüm ders talebi bilgilerini girecek, en son adımda şifre belirleyerek hesap oluşturacak.
- Öğrenci hesabı ders talebi sonunda oluşacak ve talep bu hesaba bağlanacak.
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
- Öğretmen olmak için kullanıcıların önce bir testten geçmesi gerekiyor. Sadece testi geçen kullanıcılar öğretmen hesabı açıp ilan girebilecek.
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
- Can start a lesson request without logging in.
- Must create a student account at the final step of the lesson request by setting a password.

### Student

- Can register/login.
- Can be created at the end of the lesson request funnel.
- Can save favorite teachers.
- Can submit lesson requests.
- Can see submitted requests and accepted lessons in the dashboard.
- Can review a teacher after the teacher approves/accepts that student's lesson request.

### Teacher

- Can register/login as a teacher.
- Must pass the teacher eligibility test before creating a teacher account/listing.
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

- Mentioned in the reference screenshot as "Kurumsal Uyelik".
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
- Sort options:
  - recommended/default
  - nearest
  - highest rated
  - lowest price
  - most reviewed
  - newest
- Backend-side filtering, sorting, and pagination.
- Shareable URLs with query params for SEO and user navigation.

### 2. Teacher Cards

Each result card should include:

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

Profile detail should include:

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

Based on the screenshots, the funnel should be multi-step:

1. Select lesson/category.
2. Select city and district.
3. Select online or face-to-face preference.
4. Enter contact details.
5. Select preferred contact method.
6. Accept terms/privacy/KVKK consent.
7. Set password and create student account.
8. Submit request and attach it to the new student account.

Potential additions:

- Preferred date/time.
- Online or face-to-face preference.
- Student level: ilkokul, ortaokul, lise, universite, sinav hazirlik, yetiskin.
- Goal/need text field.
- Budget range.

### 5. Authentication

- Separate student and teacher registration flows.
- Student account can be created at the final step of the lesson request funnel.
- Teacher account can only be created after passing the teacher eligibility test.
- Supabase Auth email/password.
- Phone number collection for lesson requests.
- Email verification.
- SMS verification is not part of MVP.
- Role stored in application profile table, not only Supabase auth metadata.

### 6. Teacher Onboarding

Minimum teacher onboarding fields:

- Name and surname.
- Phone.
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
- Student account creation at the end of the request funnel.
- Student/teacher registration entry.
- Teacher eligibility test gate before teacher account/listing creation.
- Teacher onboarding form.
- Basic teacher listing CRUD.
- Backend filters with pagination.
- OpenAPI spec for route handlers/server endpoints.
- Basic SEO metadata, sitemap, robots, canonical URLs.
- Seed data for cities, districts, categories, and sample teachers.
- Erzurum must be included in seed data.

### Phase 2 - Dashboards

Goal: give students and teachers private workspaces.

- Student dashboard:
  - lesson requests
  - favorite teachers
  - upcoming lessons
  - profile settings
- Teacher dashboard:
  - incoming requests
  - students
  - lessons
  - listing management
  - profile completion
  - reviews
- Notification center.
- Basic message/contact tracking if direct messaging is approved later.
- Optional in-site chat can be added in this phase or later.

### Phase 3 - Trust, Moderation, and Operations

Goal: make the marketplace manageable and safer.

- Admin panel.
- Teacher verification workflow.
- Review moderation.
- Abuse/report flow.
- SMS provider integration if phone verification/notifications become necessary.
- Email notification templates.
- Audit logs for sensitive status changes.
- Analytics events for search, profile views, and request conversion.

### Phase 4 - Monetization and Growth

Goal: add revenue features after the core marketplace works.

- Premium teacher placements.
- Lesson package sales if the business model changes.
- Payment integration if lessons are purchased through platform in a later phase.
- Institution accounts if still needed.
- Programmatic SEO pages by lesson + city + district.
- Blog/guide content for organic acquisition.

## Suggested Feature-Based Architecture

Example structure:

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

Suggested Supabase tables:

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

SEO is a primary business requirement, so it should be built into the URL and data model early.

- Stable, readable Turkish slugs.
- Dynamic metadata per lesson, city, district, and teacher.
- Canonical URLs for filtered pages.
- Index only useful landing pages; avoid indexing every arbitrary filter combination.
- Sitemap generation for:
  - public teacher profiles
  - lesson pages
  - city + lesson pages
  - static pages
- JSON-LD:
  - `Person` or `LocalBusiness` style data for teacher profiles where appropriate.
  - `BreadcrumbList` for SEO pages.
  - `FAQPage` only where real FAQ content exists.
- Internal linking:
  - homepage to popular lessons
  - lesson pages to city pages
  - city pages to district pages
  - teacher profiles to related lessons/locations
- SSR or server-rendered public pages for crawlability.

## API and OpenAPI Notes

Even with Next.js route handlers/server actions, keep an OpenAPI contract for external clarity and agent continuity.

Initial endpoints:

- `GET /api/search/teachers`
- `GET /api/teachers/{slug}`
- `POST /api/lesson-requests`
- `POST /api/lesson-requests/complete-with-account`
- `POST /api/lesson-requests/{id}/accept`
- `POST /api/teacher-eligibility/attempts`
- `POST /api/teacher-eligibility/attempts/{id}/submit`
- `GET /api/lesson-categories`
- `GET /api/locations`
- `POST /api/teachers/onboarding`
- `PATCH /api/teachers/me`
- `GET /api/student/requests`
- `GET /api/teacher/requests`

Server actions can be used internally, but API shape should still be documented for major backend behavior.

## Risks and Issues Found In Current Plan

- MVP scope is too broad unless dashboards, payments, institution accounts, and visual/media features are delayed.
- Review integrity is partly defined: only accepted lesson requests can review. Still need anti-abuse rules and moderation behavior.
- Contact ownership is now defined for MVP: contact details are shared only after teacher acceptance.
- Monetization is intentionally out of MVP. This is simpler, but future revenue model still needs a decision.
- Teacher eligibility is now required, but the test content, scoring, retake limits, and anti-cheat rules are undefined.
- Location search needs a data strategy. Nearest-location search requires coordinates, distance calculations, and privacy decisions.
- SEO can create duplicate pages if filters are all indexable. Indexing rules must be explicit.
- KVKK/privacy requirements are important because the funnel collects name, phone, email, location, and education needs.
- Supabase RLS is not mentioned but should be part of the initial backend plan.
- Admin approval is not required for MVP, but admin tooling will still be needed for reports, suspensions, reviews, and content quality.
- Teacher listing relationship is now defined for MVP: one teacher, one listing/profile.
- SMS is out of MVP, but phone ownership will remain weaker until phone verification is added.
- Image/video upload is deferred, but the data model should leave room for it.
- Dashboard phase needs a clear definition of what counts as a lesson, request, student, and completed lesson.

## Product Suggestions

- Start with city + lesson SEO pages before advanced dashboards, because SEO is stated as a primary goal.
- Use a teacher profile completion score to improve listing quality.
- Do not block publishing with admin approval in MVP, but keep admin suspend/report tools available as soon as practical.
- Add saved searches or favorites for students.
- Add "response time" only after it is tracked from real request data.
- Use fake marketplace stats carefully. Public numbers should either be real or clearly maintainable.
- Build seed content for top categories: Matematik, Fizik, Kimya, Ingilizce, Turkce, Yazilim, LGS, TYT/AYT.
- Include Erzurum in seed data and add varied test cases: online-only teacher, face-to-face teacher, high price, low price, no reviews, many reviews, accepted/rejected lesson requests.
- Add structured empty states for no results and suggest nearby districts or online teachers.
- Add analytics events from day one:
  - search submitted
  - filter changed
  - teacher profile viewed
  - request funnel started
  - request submitted
  - registration completed
- Add rate limiting and spam prevention to public lead forms.

## Açık Sorular

1. Öğretmenlik testi kaç sorudan oluşacak ve hangi konuları ölçecek?
2. Öğretmenlik testinde geçme puanı ne olacak?
3. Testi geçemeyen kullanıcı tekrar deneyebilecek mi? Evetse kaç kez ve ne kadar arayla?
4. Test cevapları manuel mi hazırlanacak, yoksa admin panelinden yönetilebilir mi olacak?
5. Konum bazlı arama için kullanıcıdan tam adres mi, sadece il/ilçe mi, yoksa koordinat/pin mi alınacak?
6. Yakındaki öğretmenler sıralaması ilçe merkezine göre mi, kullanıcının konumuna göre mi hesaplanacak?
7. Öğrenci ders talebinin sonunda email ile doğrulama yapmadan hesap aktif olsun mu?
8. Öğretmen başvuruyu kabul ettiğinde öğrenciye email bildirimi gönderilecek mi?
9. Öğrencinin iletişim bilgilerinden hangileri öğretmene açılacak: telefon, email, ikisi de?
10. Fiyat saatlik mi olacak, yoksa öğretmen ders süresini de seçebilecek mi?
11. İlk seed kategoriler kesin olarak hangileri olacak?
12. Admin panel MVP'de hiç olmayacak mı, yoksa minimum kullanıcı/ilan askıya alma eklenmeli mi?
13. Yorumlar otomatik yayınlansın mı, yoksa admin/moderasyon beklesin mi?
14. Öğretmen profilinde fotoğraf MVP'de zorunlu olmayacaksa varsayılan avatar stratejisi ne olacak?
15. Erzurum dışında test için hangi şehirler eklenmeli?

## Definition Of Done For Phase 1

- Public pages render on mobile and desktop.
- Search results are server-filtered and paginated.
- Teacher profiles are SEO-rendered and indexable.
- Lesson request funnel creates a student account at the final password step and persists valid requests.
- Teacher eligibility test gates teacher registration/listing creation.
- Teacher onboarding can create a draft/published teacher profile without admin approval.
- Teachers can accept/reject lesson requests.
- Student contact details become visible to the teacher only after request acceptance.
- Supabase RLS protects private student/teacher data.
- Basic admin path exists for suspending users/listings and handling reports, even if approval is not required.
- Sitemap and metadata are implemented.
- OpenAPI document covers implemented API endpoints.
- Seed data exists for local development, including Erzurum.
- Core flows have focused tests.
