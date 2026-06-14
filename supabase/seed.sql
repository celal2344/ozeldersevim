-- Full demo seed for Ozel Ders Evim.
-- Creates deterministic application data for public discovery, dashboards, and admin screens.
-- This intentionally includes demo profiles, teachers, listings, requests, lessons, reviews, favorites,
-- notifications, analytics events, and admin audit logs. Do not use as production-safe real marketplace data.

delete from public.admin_audit_logs
where metadata ->> 'seed' = 'demo-full';

delete from public.analytics_events
where properties ->> 'seed' = 'demo-full';

delete from public.profiles
where id in (
  '00000000-0000-0000-0000-000000000400',
  '00000000-0000-0000-0000-000000000401',
  '00000000-0000-0000-0000-000000000402',
  '00000000-0000-0000-0000-000000000403',
  '00000000-0000-0000-0000-000000000404',
  '00000000-0000-0000-0000-000000000405',
  '00000000-0000-0000-0000-000000000406',
  '00000000-0000-0000-0000-000000000407',
  '00000000-0000-0000-0000-000000000501',
  '00000000-0000-0000-0000-000000000502',
  '00000000-0000-0000-0000-000000000503',
  '00000000-0000-0000-0000-000000000504'
);

insert into public.locations (id, city, district, latitude, longitude, slug) values
  ('00000000-0000-0000-0000-000000000101', 'Erzurum', 'Yakutiye', 39.9086, 41.2769, 'erzurum-yakutiye'),
  ('00000000-0000-0000-0000-000000000102', 'Erzurum', 'Palandöken', 39.8875, 41.2444, 'erzurum-palandoken'),
  ('00000000-0000-0000-0000-000000000103', 'İstanbul', 'Kadıköy', 40.9919, 29.0278, 'istanbul-kadikoy'),
  ('00000000-0000-0000-0000-000000000104', 'Ankara', 'Çankaya', 39.9179, 32.8627, 'ankara-cankaya'),
  ('00000000-0000-0000-0000-000000000105', 'İzmir', 'Konak', 38.4192, 27.1287, 'izmir-konak')
on conflict (slug) do update
set city = excluded.city,
    district = excluded.district,
    latitude = excluded.latitude,
    longitude = excluded.longitude;

insert into public.lesson_categories (id, name, slug) values
  ('00000000-0000-0000-0000-000000000201', 'Matematik', 'matematik'),
  ('00000000-0000-0000-0000-000000000202', 'Fizik', 'fizik'),
  ('00000000-0000-0000-0000-000000000203', 'Kimya', 'kimya'),
  ('00000000-0000-0000-0000-000000000204', 'İngilizce', 'ingilizce'),
  ('00000000-0000-0000-0000-000000000205', 'Türkçe', 'turkce'),
  ('00000000-0000-0000-0000-000000000206', 'Yazılım', 'yazilim'),
  ('00000000-0000-0000-0000-000000000207', 'LGS', 'lgs'),
  ('00000000-0000-0000-0000-000000000208', 'TYT / AYT', 'tyt-ayt')
on conflict (slug) do update
set name = excluded.name,
    is_active = true;

insert into public.teacher_eligibility_tests (id, version, title, passing_score, question_count, is_active) values
  ('00000000-0000-0000-0000-000000000301', 1, 'MVP Öğretmenlik Uygunluk Testi', 70, 3, true)
on conflict (version) do update
set title = excluded.title,
    passing_score = excluded.passing_score,
    question_count = excluded.question_count,
    is_active = true;

delete from public.teacher_eligibility_questions
where test_id = '00000000-0000-0000-0000-000000000301'
  and question_key in ('question1', 'question2', 'question3');

with active_test as (
  select id
  from public.teacher_eligibility_tests
  where version = 1
  limit 1
),
question_rows as (
  insert into public.teacher_eligibility_questions (test_id, question_key, prompt, position, is_active)
  select active_test.id, seed.question_key, seed.prompt, seed.position, true
  from active_test
  cross join (
    values
      ('lesson_planning', 'Özel ders başlamadan önce öğrencinin seviyesini ve hedefini nasıl netleştirirsin?', 1),
      ('communication', 'Öğrenci velisiyle ders süreci hakkında nasıl iletişim kurarsın?', 2),
      ('ethics', 'Öğrenci kişisel bilgileri ve iletişim bilgileri için doğru yaklaşım hangisidir?', 3)
  ) as seed(question_key, prompt, position)
  on conflict (test_id, question_key) do update
    set prompt = excluded.prompt,
        position = excluded.position,
        is_active = true
  returning id, question_key
)
insert into public.teacher_eligibility_choices (question_id, choice_key, label, score, position)
select question_rows.id, seed.choice_key, seed.label, seed.score, seed.position
from question_rows
join (
  values
    ('lesson_planning', 'a', 'THIS IS THE CORRECT ANSWER', 1, 1),
    ('lesson_planning', 'b', 'Herkese aynı ders planını uygularım.', 0, 2),
    ('lesson_planning', 'c', 'Sadece öğrencinin istediği soruları çözerim, takip planı yapmam.', 0, 3),
    ('lesson_planning', 'd', 'Seviye ve hedef konuşmasını derslerden sonra yaparım.', 0, 4),
    ('communication', 'a', 'THIS IS THE CORRECT ANSWER', 1, 1),
    ('communication', 'b', 'Her gün çok sık mesaj atarım.', 0, 2),
    ('communication', 'c', 'Veliyi hiç bilgilendirmem.', 0, 3),
    ('communication', 'd', 'Sadece ücret konularında iletişim kurarım.', 0, 4),
    ('ethics', 'a', 'THIS IS THE CORRECT ANSWER', 1, 1),
    ('ethics', 'b', 'Öğrenci bilgilerini başka öğretmenlerle paylaşabilirim.', 0, 2),
    ('ethics', 'c', 'İletişim bilgilerini reklam listesine eklerim.', 0, 3),
    ('ethics', 'd', 'Kişisel verileri korumak öğretmenin sorumluluğunda değildir.', 0, 4)
) as seed(question_key, choice_key, label, score, position)
  on seed.question_key = question_rows.question_key
on conflict (question_id, choice_key) do update
  set label = excluded.label,
      score = excluded.score,
      position = excluded.position;

insert into public.profiles (id, role, full_name, phone) values
  ('00000000-0000-0000-0000-000000000400', 'admin', 'Demo Admin', '+90 532 000 00 00'),
  ('00000000-0000-0000-0000-000000000401', 'teacher', 'Elif Acar', '+90 532 401 00 01'),
  ('00000000-0000-0000-0000-000000000402', 'teacher', 'Murat Demir', '+90 532 402 00 02'),
  ('00000000-0000-0000-0000-000000000403', 'teacher', 'Zeynep Kaya', '+90 532 403 00 03'),
  ('00000000-0000-0000-0000-000000000404', 'teacher', 'Ahmet Yılmaz', '+90 532 404 00 04'),
  ('00000000-0000-0000-0000-000000000405', 'teacher', 'Selin Koç', '+90 532 405 00 05'),
  ('00000000-0000-0000-0000-000000000406', 'teacher', 'Emre Arslan', '+90 532 406 00 06'),
  ('00000000-0000-0000-0000-000000000407', 'teacher', 'Burcu Şahin', '+90 532 407 00 07'),
  ('00000000-0000-0000-0000-000000000501', 'student', 'Ali Yıldız', '+90 533 501 00 01'),
  ('00000000-0000-0000-0000-000000000502', 'student', 'Ece Arslan', '+90 533 502 00 02'),
  ('00000000-0000-0000-0000-000000000503', 'student', 'Mehmet Ak', '+90 533 503 00 03'),
  ('00000000-0000-0000-0000-000000000504', 'student', 'Deniz Çelik', '+90 533 504 00 04')
on conflict (id) do update
set role = excluded.role,
    full_name = excluded.full_name,
    phone = excluded.phone;

insert into public.student_profiles (profile_id) values
  ('00000000-0000-0000-0000-000000000501'),
  ('00000000-0000-0000-0000-000000000502'),
  ('00000000-0000-0000-0000-000000000503'),
  ('00000000-0000-0000-0000-000000000504')
on conflict (profile_id) do nothing;

insert into public.teacher_eligibility_attempts (id, profile_id, test_id, status, score, started_at, submitted_at, expires_at) values
  ('00000000-0000-0000-0000-000000000531', '00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000301', 'passed', 100, now() - interval '40 days', now() - interval '40 days' + interval '12 minutes', now() + interval '1 year'),
  ('00000000-0000-0000-0000-000000000532', '00000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000301', 'passed', 92, now() - interval '38 days', now() - interval '38 days' + interval '16 minutes', now() + interval '1 year'),
  ('00000000-0000-0000-0000-000000000533', '00000000-0000-0000-0000-000000000403', '00000000-0000-0000-0000-000000000301', 'passed', 96, now() - interval '36 days', now() - interval '36 days' + interval '11 minutes', now() + interval '1 year'),
  ('00000000-0000-0000-0000-000000000534', '00000000-0000-0000-0000-000000000404', '00000000-0000-0000-0000-000000000301', 'passed', 88, now() - interval '34 days', now() - interval '34 days' + interval '20 minutes', now() + interval '1 year'),
  ('00000000-0000-0000-0000-000000000535', '00000000-0000-0000-0000-000000000405', '00000000-0000-0000-0000-000000000301', 'passed', 94, now() - interval '32 days', now() - interval '32 days' + interval '13 minutes', now() + interval '1 year'),
  ('00000000-0000-0000-0000-000000000536', '00000000-0000-0000-0000-000000000406', '00000000-0000-0000-0000-000000000301', 'passed', 84, now() - interval '30 days', now() - interval '30 days' + interval '19 minutes', now() + interval '1 year'),
  ('00000000-0000-0000-0000-000000000537', '00000000-0000-0000-0000-000000000407', '00000000-0000-0000-0000-000000000301', 'passed', 78, now() - interval '28 days', now() - interval '28 days' + interval '22 minutes', now() + interval '1 year')
on conflict (id) do update
set status = excluded.status,
    score = excluded.score,
    submitted_at = excluded.submitted_at,
    expires_at = excluded.expires_at;

insert into public.teacher_profiles (
  id, profile_id, location_id, title, bio, education, experience_years, hourly_price, delivery_mode, status, latitude, longitude
) values
  (
    '00000000-0000-0000-0000-000000000601',
    '00000000-0000-0000-0000-000000000401',
    '00000000-0000-0000-0000-000000000101',
    'Matematik ve LGS Öğretmeni',
    'Erzurum Yakutiye merkezli çalışıyorum. LGS ve okul destek derslerinde düzenli takip, haftalık ödev ve veli bilgilendirmesiyle ilerliyorum.',
    'Atatürk Üniversitesi Matematik Öğretmenliği',
    8,
    450,
    'both',
    'published',
    39.9086,
    41.2769
  ),
  (
    '00000000-0000-0000-0000-000000000602',
    '00000000-0000-0000-0000-000000000402',
    '00000000-0000-0000-0000-000000000102',
    'Fizik ve Kimya Öğretmeni',
    'Palandöken ve online derslerde TYT/AYT fizik-kimya hazırlığı veriyorum. Dersleri konu anlatımı, soru çözümü ve sınav stratejisiyle planlarım.',
    'Karadeniz Teknik Üniversitesi Fizik Bölümü',
    11,
    520,
    'both',
    'published',
    39.8875,
    41.2444
  ),
  (
    '00000000-0000-0000-0000-000000000603',
    '00000000-0000-0000-0000-000000000403',
    '00000000-0000-0000-0000-000000000103',
    'İngilizce ve Türkçe Öğretmeni',
    'İstanbul Kadıköy ve online derslerde konuşma pratiği, okul desteği ve sınav hazırlığı yapıyorum. Öğrencinin seviyesine göre ölçülebilir hedefler belirlerim.',
    'Boğaziçi Üniversitesi İngiliz Dili Eğitimi',
    7,
    600,
    'online',
    'published',
    40.9919,
    29.0278
  ),
  (
    '00000000-0000-0000-0000-000000000604',
    '00000000-0000-0000-0000-000000000404',
    '00000000-0000-0000-0000-000000000104',
    'Yazılım ve Matematik Eğitmeni',
    'Ankara Çankaya çevresinde ve online olarak yazılım temelleri, algoritma, matematik ve proje odaklı dersler veriyorum.',
    'ODTÜ Bilgisayar Mühendisliği',
    6,
    700,
    'online',
    'published',
    39.9179,
    32.8627
  ),
  (
    '00000000-0000-0000-0000-000000000605',
    '00000000-0000-0000-0000-000000000405',
    '00000000-0000-0000-0000-000000000105',
    'LGS ve TYT/AYT Koçu',
    'İzmir Konak çevresinde ortaokul ve lise öğrencilerine planlı çalışma takibi, deneme analizi ve konu eksik kapatma desteği veriyorum.',
    'Ege Üniversitesi Eğitim Fakültesi',
    10,
    500,
    'face_to_face',
    'published',
    38.4192,
    27.1287
  ),
  (
    '00000000-0000-0000-0000-000000000606',
    '00000000-0000-0000-0000-000000000406',
    '00000000-0000-0000-0000-000000000101',
    'Online Matematik ve Fizik Öğretmeni',
    'Erzurum merkezli online derslerde matematik ve fizik konularını sade, görsel ve bol uygulamalı şekilde anlatıyorum.',
    'Atatürk Üniversitesi Fizik Öğretmenliği',
    4,
    380,
    'online',
    'published',
    39.9086,
    41.2769
  ),
  (
    '00000000-0000-0000-0000-000000000607',
    '00000000-0000-0000-0000-000000000407',
    '00000000-0000-0000-0000-000000000102',
    'Kimya Öğretmeni',
    'Kimya konu anlatımı ve soru çözümü için taslak ilan. Admin ekranlarında draft/onay caselerini görmek için eklenmiştir.',
    'Atatürk Üniversitesi Kimya Bölümü',
    3,
    420,
    'face_to_face',
    'draft',
    39.8875,
    41.2444
  )
on conflict (id) do update
set profile_id = excluded.profile_id,
    location_id = excluded.location_id,
    title = excluded.title,
    bio = excluded.bio,
    education = excluded.education,
    experience_years = excluded.experience_years,
    hourly_price = excluded.hourly_price,
    delivery_mode = excluded.delivery_mode,
    status = excluded.status,
    latitude = excluded.latitude,
    longitude = excluded.longitude;

insert into public.teacher_availability_weekly_slots (profile_id, weekday, start_hour, end_hour) values
  ('00000000-0000-0000-0000-000000000401', 1, 10, 12),
  ('00000000-0000-0000-0000-000000000401', 3, 14, 17),
  ('00000000-0000-0000-0000-000000000401', 6, 11, 13),
  ('00000000-0000-0000-0000-000000000402', 2, 16, 19),
  ('00000000-0000-0000-0000-000000000402', 4, 10, 12),
  ('00000000-0000-0000-0000-000000000402', 7, 13, 15),
  ('00000000-0000-0000-0000-000000000403', 1, 18, 21),
  ('00000000-0000-0000-0000-000000000403', 5, 15, 18),
  ('00000000-0000-0000-0000-000000000404', 3, 19, 22),
  ('00000000-0000-0000-0000-000000000404', 6, 10, 14),
  ('00000000-0000-0000-0000-000000000405', 2, 11, 13),
  ('00000000-0000-0000-0000-000000000405', 5, 16, 19),
  ('00000000-0000-0000-0000-000000000406', 1, 9, 11),
  ('00000000-0000-0000-0000-000000000406', 4, 20, 22);

insert into public.teacher_availability_exceptions (profile_id, exception_date, exception_type, start_hour, end_hour, note) values
  ('00000000-0000-0000-0000-000000000401', current_date + interval '3 days', 'available', 18, 20, 'Demo ekstra akşam dersi'),
  ('00000000-0000-0000-0000-000000000402', current_date + interval '5 days', 'unavailable', 10, 12, 'Demo kapalı saat');

insert into public.teacher_lessons (teacher_profile_id, lesson_category_id) values
  ('00000000-0000-0000-0000-000000000601', '00000000-0000-0000-0000-000000000201'),
  ('00000000-0000-0000-0000-000000000601', '00000000-0000-0000-0000-000000000207'),
  ('00000000-0000-0000-0000-000000000601', '00000000-0000-0000-0000-000000000208'),
  ('00000000-0000-0000-0000-000000000602', '00000000-0000-0000-0000-000000000202'),
  ('00000000-0000-0000-0000-000000000602', '00000000-0000-0000-0000-000000000203'),
  ('00000000-0000-0000-0000-000000000602', '00000000-0000-0000-0000-000000000208'),
  ('00000000-0000-0000-0000-000000000603', '00000000-0000-0000-0000-000000000204'),
  ('00000000-0000-0000-0000-000000000603', '00000000-0000-0000-0000-000000000205'),
  ('00000000-0000-0000-0000-000000000604', '00000000-0000-0000-0000-000000000206'),
  ('00000000-0000-0000-0000-000000000604', '00000000-0000-0000-0000-000000000201'),
  ('00000000-0000-0000-0000-000000000605', '00000000-0000-0000-0000-000000000207'),
  ('00000000-0000-0000-0000-000000000605', '00000000-0000-0000-0000-000000000208'),
  ('00000000-0000-0000-0000-000000000606', '00000000-0000-0000-0000-000000000201'),
  ('00000000-0000-0000-0000-000000000606', '00000000-0000-0000-0000-000000000202'),
  ('00000000-0000-0000-0000-000000000607', '00000000-0000-0000-0000-000000000203')
on conflict (teacher_profile_id, lesson_category_id) do nothing;

insert into public.teacher_listings (id, teacher_profile_id, slug, headline, short_bio, rating_average, review_count, is_published) values
  ('00000000-0000-0000-0000-000000000701', '00000000-0000-0000-0000-000000000601', 'elif-acar-matematik', 'LGS ve okul destek matematik dersleri', 'Erzurum Yakutiye ve online matematik dersleri; düzenli takip, ödev ve deneme analizi.', 0, 0, true),
  ('00000000-0000-0000-0000-000000000702', '00000000-0000-0000-0000-000000000602', 'murat-demir-fizik-kimya', 'TYT/AYT fizik ve kimya hazırlığı', 'Palandöken ve online derslerde sınav odaklı fizik-kimya hazırlığı.', 0, 0, true),
  ('00000000-0000-0000-0000-000000000703', '00000000-0000-0000-0000-000000000603', 'zeynep-kaya-ingilizce', 'Konuşma pratiği ve okul destek İngilizce', 'Online İngilizce ve Türkçe derslerinde seviye bazlı program ve pratik odaklı ilerleme.', 0, 0, true),
  ('00000000-0000-0000-0000-000000000704', '00000000-0000-0000-0000-000000000604', 'ahmet-yilmaz-yazilim', 'Yazılım, algoritma ve matematik dersleri', 'Proje odaklı yazılım eğitimi, algoritma temelleri ve matematik desteği.', 0, 0, true),
  ('00000000-0000-0000-0000-000000000705', '00000000-0000-0000-0000-000000000605', 'selin-koc-lgs-tyt-ayt', 'LGS, TYT ve AYT için çalışma koçluğu', 'İzmir Konak çevresinde deneme analizi ve eksik kapatma odaklı yüz yüze dersler.', 0, 0, true),
  ('00000000-0000-0000-0000-000000000706', '00000000-0000-0000-0000-000000000606', 'emre-arslan-online-matematik', 'Online matematik ve fizik konu anlatımı', 'Online derslerde sade anlatım, bol örnek ve hızlı konu tekrarı.', 0, 0, true),
  ('00000000-0000-0000-0000-000000000707', '00000000-0000-0000-0000-000000000607', 'burcu-sahin-kimya-taslak', 'Kimya dersleri taslak ilanı', 'Admin ve öğretmen paneli taslak ilan caseleri için yayınlanmamış demo ilan.', 0, 0, false)
on conflict (slug) do update
set headline = excluded.headline,
    short_bio = excluded.short_bio,
    is_published = excluded.is_published;

insert into public.lesson_requests (
  id, student_profile_id, teacher_profile_id, lesson_category_id, location_id, status, delivery_mode,
  student_level, goal, budget_min, budget_max, contact_preference,
  consent_terms_at, consent_privacy_at, accepted_at, rejected_at, preferred_weekday, preferred_start_hour, created_at
) values
  ('00000000-0000-0000-0000-000000000801', '00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000601', '00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000101', 'accepted', 'both', '8. sınıf', 'LGS matematik netlerini yükseltmek istiyorum.', 350, 500, 'both', now() - interval '25 days', now() - interval '25 days', now() - interval '24 days', null, 1, 10, now() - interval '25 days'),
  ('00000000-0000-0000-0000-000000000802', '00000000-0000-0000-0000-000000000502', '00000000-0000-0000-0000-000000000601', '00000000-0000-0000-0000-000000000207', '00000000-0000-0000-0000-000000000101', 'accepted', 'face_to_face', '7. sınıf', 'Düzenli okul desteği almak istiyorum.', 350, 550, 'phone', now() - interval '21 days', now() - interval '21 days', now() - interval '20 days', null, 3, 14, now() - interval '21 days'),
  ('00000000-0000-0000-0000-000000000803', '00000000-0000-0000-0000-000000000503', '00000000-0000-0000-0000-000000000601', '00000000-0000-0000-0000-000000000208', '00000000-0000-0000-0000-000000000102', 'accepted', 'online', '11. sınıf', 'TYT temel matematikte eksiklerim var.', 400, 600, 'site', now() - interval '17 days', now() - interval '17 days', now() - interval '16 days', null, 6, 11, now() - interval '17 days'),
  ('00000000-0000-0000-0000-000000000804', '00000000-0000-0000-0000-000000000504', '00000000-0000-0000-0000-000000000602', '00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000102', 'accepted', 'both', '12. sınıf', 'AYT fizik konu tekrarı ve soru çözümü.', 450, 650, 'both', now() - interval '19 days', now() - interval '19 days', now() - interval '18 days', null, 2, 16, now() - interval '19 days'),
  ('00000000-0000-0000-0000-000000000805', '00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000602', '00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000101', 'accepted', 'online', '10. sınıf', 'Kimya yazılısı için hazırlık gerekiyor.', 400, 600, 'phone', now() - interval '15 days', now() - interval '15 days', now() - interval '14 days', null, 4, 10, now() - interval '15 days'),
  ('00000000-0000-0000-0000-000000000806', '00000000-0000-0000-0000-000000000502', '00000000-0000-0000-0000-000000000603', '00000000-0000-0000-0000-000000000204', '00000000-0000-0000-0000-000000000103', 'accepted', 'online', 'A2', 'Konuşma pratiği ve kelime çalışması istiyorum.', 500, 700, 'site', now() - interval '14 days', now() - interval '14 days', now() - interval '13 days', null, 1, 18, now() - interval '14 days'),
  ('00000000-0000-0000-0000-000000000807', '00000000-0000-0000-0000-000000000503', '00000000-0000-0000-0000-000000000603', '00000000-0000-0000-0000-000000000205', '00000000-0000-0000-0000-000000000103', 'accepted', 'online', '6. sınıf', 'Türkçe paragraf ve dil bilgisi desteği.', 450, 650, 'both', now() - interval '12 days', now() - interval '12 days', now() - interval '11 days', null, 5, 15, now() - interval '12 days'),
  ('00000000-0000-0000-0000-000000000808', '00000000-0000-0000-0000-000000000504', '00000000-0000-0000-0000-000000000604', '00000000-0000-0000-0000-000000000206', '00000000-0000-0000-0000-000000000104', 'accepted', 'online', 'başlangıç', 'Python ve algoritma temelleri öğrenmek istiyorum.', 600, 800, 'both', now() - interval '10 days', now() - interval '10 days', now() - interval '9 days', null, 3, 19, now() - interval '10 days'),
  ('00000000-0000-0000-0000-000000000809', '00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000604', '00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000104', 'accepted', 'online', '9. sınıf', 'Matematik temelini güçlendirmek istiyorum.', 500, 750, 'phone', now() - interval '8 days', now() - interval '8 days', now() - interval '7 days', null, 6, 10, now() - interval '8 days'),
  ('00000000-0000-0000-0000-000000000810', '00000000-0000-0000-0000-000000000502', '00000000-0000-0000-0000-000000000605', '00000000-0000-0000-0000-000000000208', '00000000-0000-0000-0000-000000000105', 'accepted', 'face_to_face', '12. sınıf', 'TYT/AYT çalışma planı ve deneme analizi.', 450, 650, 'both', now() - interval '6 days', now() - interval '6 days', now() - interval '5 days', null, 2, 11, now() - interval '6 days'),
  ('00000000-0000-0000-0000-000000000811', '00000000-0000-0000-0000-000000000503', '00000000-0000-0000-0000-000000000606', '00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000101', 'accepted', 'online', '11. sınıf', 'Fizik konu eksiği ve soru çözümü.', 300, 450, 'site', now() - interval '5 days', now() - interval '5 days', now() - interval '4 days', null, 1, 9, now() - interval '5 days'),
  ('00000000-0000-0000-0000-000000000812', '00000000-0000-0000-0000-000000000504', '00000000-0000-0000-0000-000000000601', '00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000101', 'submitted', 'face_to_face', '5. sınıf', 'Haftalık matematik desteği arıyorum.', 300, 450, 'phone', now() - interval '2 days', now() - interval '2 days', null, null, 1, 10, now() - interval '2 days'),
  ('00000000-0000-0000-0000-000000000813', '00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000607', '00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000102', 'rejected', 'face_to_face', '10. sınıf', 'Kimya özel ders talebi.', 300, 450, 'both', now() - interval '3 days', now() - interval '3 days', null, now() - interval '2 days', null, null, now() - interval '3 days')
on conflict (id) do update
set status = excluded.status,
    delivery_mode = excluded.delivery_mode,
    student_level = excluded.student_level,
    goal = excluded.goal,
    budget_min = excluded.budget_min,
    budget_max = excluded.budget_max,
    preferred_weekday = excluded.preferred_weekday,
    preferred_start_hour = excluded.preferred_start_hour,
    accepted_at = excluded.accepted_at,
    rejected_at = excluded.rejected_at;

insert into public.lesson_request_contacts (lesson_request_id, student_name, email, phone) values
  ('00000000-0000-0000-0000-000000000801', 'Ali Yıldız', 'ali.yildiz@example.com', '+90 533 501 00 01'),
  ('00000000-0000-0000-0000-000000000802', 'Ece Arslan', 'ece.arslan@example.com', '+90 533 502 00 02'),
  ('00000000-0000-0000-0000-000000000803', 'Mehmet Ak', 'mehmet.ak@example.com', '+90 533 503 00 03'),
  ('00000000-0000-0000-0000-000000000804', 'Deniz Çelik', 'deniz.celik@example.com', '+90 533 504 00 04'),
  ('00000000-0000-0000-0000-000000000805', 'Ali Yıldız', 'ali.yildiz@example.com', '+90 533 501 00 01'),
  ('00000000-0000-0000-0000-000000000806', 'Ece Arslan', 'ece.arslan@example.com', '+90 533 502 00 02'),
  ('00000000-0000-0000-0000-000000000807', 'Mehmet Ak', 'mehmet.ak@example.com', '+90 533 503 00 03'),
  ('00000000-0000-0000-0000-000000000808', 'Deniz Çelik', 'deniz.celik@example.com', '+90 533 504 00 04'),
  ('00000000-0000-0000-0000-000000000809', 'Ali Yıldız', 'ali.yildiz@example.com', '+90 533 501 00 01'),
  ('00000000-0000-0000-0000-000000000810', 'Ece Arslan', 'ece.arslan@example.com', '+90 533 502 00 02'),
  ('00000000-0000-0000-0000-000000000811', 'Mehmet Ak', 'mehmet.ak@example.com', '+90 533 503 00 03'),
  ('00000000-0000-0000-0000-000000000812', 'Deniz Çelik', 'deniz.celik@example.com', '+90 533 504 00 04'),
  ('00000000-0000-0000-0000-000000000813', 'Ali Yıldız', 'ali.yildiz@example.com', '+90 533 501 00 01')
on conflict (lesson_request_id) do update
set student_name = excluded.student_name,
    email = excluded.email,
    phone = excluded.phone;

insert into public.teacher_students (
  id, teacher_profile_id, student_profile_id, source_lesson_request_id, name, email, phone
) values
  ('00000000-0000-0000-0000-000000001201', '00000000-0000-0000-0000-000000000601', '00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000801', 'Ali YÄ±ldÄ±z', 'ali.yildiz@example.com', '+90 533 501 00 01'),
  ('00000000-0000-0000-0000-000000001202', '00000000-0000-0000-0000-000000000601', '00000000-0000-0000-0000-000000000502', '00000000-0000-0000-0000-000000000802', 'Ece Arslan', 'ece.arslan@example.com', '+90 533 502 00 02'),
  ('00000000-0000-0000-0000-000000001203', '00000000-0000-0000-0000-000000000601', '00000000-0000-0000-0000-000000000503', '00000000-0000-0000-0000-000000000803', 'Mehmet Ak', 'mehmet.ak@example.com', '+90 533 503 00 03'),
  ('00000000-0000-0000-0000-000000001204', '00000000-0000-0000-0000-000000000602', '00000000-0000-0000-0000-000000000504', '00000000-0000-0000-0000-000000000804', 'Deniz Ã‡elik', 'deniz.celik@example.com', '+90 533 504 00 04'),
  ('00000000-0000-0000-0000-000000001205', '00000000-0000-0000-0000-000000000602', '00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000805', 'Ali YÄ±ldÄ±z', 'ali.yildiz@example.com', '+90 533 501 00 01'),
  ('00000000-0000-0000-0000-000000001206', '00000000-0000-0000-0000-000000000603', '00000000-0000-0000-0000-000000000502', '00000000-0000-0000-0000-000000000806', 'Ece Arslan', 'ece.arslan@example.com', '+90 533 502 00 02'),
  ('00000000-0000-0000-0000-000000001207', '00000000-0000-0000-0000-000000000603', '00000000-0000-0000-0000-000000000503', '00000000-0000-0000-0000-000000000807', 'Mehmet Ak', 'mehmet.ak@example.com', '+90 533 503 00 03'),
  ('00000000-0000-0000-0000-000000001208', '00000000-0000-0000-0000-000000000604', '00000000-0000-0000-0000-000000000504', '00000000-0000-0000-0000-000000000808', 'Deniz Ã‡elik', 'deniz.celik@example.com', '+90 533 504 00 04'),
  ('00000000-0000-0000-0000-000000001209', '00000000-0000-0000-0000-000000000604', '00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000809', 'Ali YÄ±ldÄ±z', 'ali.yildiz@example.com', '+90 533 501 00 01'),
  ('00000000-0000-0000-0000-000000001210', '00000000-0000-0000-0000-000000000605', '00000000-0000-0000-0000-000000000502', '00000000-0000-0000-0000-000000000810', 'Ece Arslan', 'ece.arslan@example.com', '+90 533 502 00 02'),
  ('00000000-0000-0000-0000-000000001211', '00000000-0000-0000-0000-000000000606', '00000000-0000-0000-0000-000000000503', '00000000-0000-0000-0000-000000000811', 'Mehmet Ak', 'mehmet.ak@example.com', '+90 533 503 00 03')
on conflict (teacher_profile_id, student_profile_id) do update
set name = excluded.name,
    email = excluded.email,
    phone = excluded.phone,
    source_lesson_request_id = coalesce(teacher_students.source_lesson_request_id, excluded.source_lesson_request_id);

insert into public.lessons (
  id, lesson_request_id, teacher_profile_id, teacher_student_id, lesson_category_id, delivery_mode,
  status, scheduled_at, duration_minutes, price_amount, currency, completed_at
) values
  ('00000000-0000-0000-0000-000000000901', '00000000-0000-0000-0000-000000000801', '00000000-0000-0000-0000-000000000601', '00000000-0000-0000-0000-000000001201', '00000000-0000-0000-0000-000000000201', 'both', 'completed', now() - interval '22 days', 60, 450, 'TRY', now() - interval '22 days'),
  ('00000000-0000-0000-0000-000000000902', '00000000-0000-0000-0000-000000000802', '00000000-0000-0000-0000-000000000601', '00000000-0000-0000-0000-000000001202', '00000000-0000-0000-0000-000000000207', 'face_to_face', 'completed', now() - interval '18 days', 60, 450, 'TRY', now() - interval '18 days'),
  ('00000000-0000-0000-0000-000000000903', '00000000-0000-0000-0000-000000000803', '00000000-0000-0000-0000-000000000601', '00000000-0000-0000-0000-000000001203', '00000000-0000-0000-0000-000000000208', 'online', 'scheduled', now() + interval '2 days', 60, 450, 'TRY', null),
  ('00000000-0000-0000-0000-000000000904', '00000000-0000-0000-0000-000000000804', '00000000-0000-0000-0000-000000000602', '00000000-0000-0000-0000-000000001204', '00000000-0000-0000-0000-000000000202', 'both', 'completed', now() - interval '15 days', 60, 500, 'TRY', now() - interval '15 days'),
  ('00000000-0000-0000-0000-000000000905', '00000000-0000-0000-0000-000000000805', '00000000-0000-0000-0000-000000000602', '00000000-0000-0000-0000-000000001205', '00000000-0000-0000-0000-000000000203', 'online', 'completed', now() - interval '11 days', 60, 500, 'TRY', now() - interval '11 days'),
  ('00000000-0000-0000-0000-000000000906', '00000000-0000-0000-0000-000000000806', '00000000-0000-0000-0000-000000000603', '00000000-0000-0000-0000-000000001206', '00000000-0000-0000-0000-000000000204', 'online', 'completed', now() - interval '9 days', 60, 400, 'TRY', now() - interval '9 days'),
  ('00000000-0000-0000-0000-000000000907', '00000000-0000-0000-0000-000000000807', '00000000-0000-0000-0000-000000000603', '00000000-0000-0000-0000-000000001207', '00000000-0000-0000-0000-000000000205', 'online', 'completed', now() - interval '7 days', 60, 400, 'TRY', now() - interval '7 days'),
  ('00000000-0000-0000-0000-000000000908', '00000000-0000-0000-0000-000000000808', '00000000-0000-0000-0000-000000000604', '00000000-0000-0000-0000-000000001208', '00000000-0000-0000-0000-000000000206', 'online', 'scheduled', now() + interval '3 days', 60, 650, 'TRY', null),
  ('00000000-0000-0000-0000-000000000909', '00000000-0000-0000-0000-000000000809', '00000000-0000-0000-0000-000000000604', '00000000-0000-0000-0000-000000001209', '00000000-0000-0000-0000-000000000201', 'online', 'completed', now() - interval '3 days', 60, 650, 'TRY', now() - interval '3 days'),
  ('00000000-0000-0000-0000-000000000910', '00000000-0000-0000-0000-000000000810', '00000000-0000-0000-0000-000000000605', '00000000-0000-0000-0000-000000001210', '00000000-0000-0000-0000-000000000208', 'face_to_face', 'scheduled', now() + interval '4 days', 60, 550, 'TRY', null),
  ('00000000-0000-0000-0000-000000000911', '00000000-0000-0000-0000-000000000811', '00000000-0000-0000-0000-000000000606', '00000000-0000-0000-0000-000000001211', '00000000-0000-0000-0000-000000000202', 'online', 'scheduled', now() + interval '5 days', 60, 300, 'TRY', null)
on conflict (id) do update
set status = excluded.status,
    scheduled_at = excluded.scheduled_at,
    teacher_profile_id = excluded.teacher_profile_id,
    teacher_student_id = excluded.teacher_student_id,
    lesson_category_id = excluded.lesson_category_id,
    delivery_mode = excluded.delivery_mode,
    duration_minutes = excluded.duration_minutes,
    price_amount = excluded.price_amount,
    currency = excluded.currency,
    completed_at = excluded.completed_at;

insert into public.reviews (id, lesson_request_id, student_profile_id, teacher_profile_id, rating, comment, status, created_at) values
  ('00000000-0000-0000-0000-000000001001', '00000000-0000-0000-0000-000000000801', '00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000601', 5, 'Elif öğretmen konuları çok düzenli anlattı. Haftalık ödev takibi çok faydalı oldu.', 'published', now() - interval '21 days'),
  ('00000000-0000-0000-0000-000000001002', '00000000-0000-0000-0000-000000000802', '00000000-0000-0000-0000-000000000502', '00000000-0000-0000-0000-000000000601', 5, 'Kızım matematikte daha özgüvenli oldu. İletişimi çok iyi.', 'published', now() - interval '17 days'),
  ('00000000-0000-0000-0000-000000001003', '00000000-0000-0000-0000-000000000803', '00000000-0000-0000-0000-000000000503', '00000000-0000-0000-0000-000000000601', 4, 'Online dersler verimli geçti, soru çözüm hızı arttı.', 'published', now() - interval '13 days'),
  ('00000000-0000-0000-0000-000000001004', '00000000-0000-0000-0000-000000000804', '00000000-0000-0000-0000-000000000504', '00000000-0000-0000-0000-000000000602', 5, 'Fizikte zorlandığım konuları sade şekilde anlattı.', 'published', now() - interval '14 days'),
  ('00000000-0000-0000-0000-000000001005', '00000000-0000-0000-0000-000000000805', '00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000602', 4, 'Kimya yazılısı öncesi hızlı ve net bir tekrar yaptık.', 'published', now() - interval '10 days'),
  ('00000000-0000-0000-0000-000000001006', '00000000-0000-0000-0000-000000000806', '00000000-0000-0000-0000-000000000502', '00000000-0000-0000-0000-000000000603', 5, 'Konuşma pratiğinde çok destek oldu. Dersler akıcı geçti.', 'published', now() - interval '8 days'),
  ('00000000-0000-0000-0000-000000001007', '00000000-0000-0000-0000-000000000807', '00000000-0000-0000-0000-000000000503', '00000000-0000-0000-0000-000000000603', 5, 'Türkçe paragraf çözümünde yöntem kazandırdı.', 'published', now() - interval '6 days'),
  ('00000000-0000-0000-0000-000000001008', '00000000-0000-0000-0000-000000000808', '00000000-0000-0000-0000-000000000504', '00000000-0000-0000-0000-000000000604', 5, 'Python derslerinde proje yaparak ilerlemek çok motive etti.', 'published', now() - interval '4 days'),
  ('00000000-0000-0000-0000-000000001009', '00000000-0000-0000-0000-000000000809', '00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000604', 4, 'Matematik temel konularında eksiklerimi toparladık.', 'published', now() - interval '3 days'),
  ('00000000-0000-0000-0000-000000001010', '00000000-0000-0000-0000-000000000810', '00000000-0000-0000-0000-000000000502', '00000000-0000-0000-0000-000000000605', 5, 'Deneme analizleri ve çalışma planı çok işime yaradı.', 'published', now() - interval '2 days'),
  ('00000000-0000-0000-0000-000000001011', '00000000-0000-0000-0000-000000000811', '00000000-0000-0000-0000-000000000503', '00000000-0000-0000-0000-000000000606', 4, 'Fizik anlatımı anlaşılırdı, online ders teknik olarak sorunsuz geçti.', 'pending', now() - interval '1 day')
on conflict (lesson_request_id) do update
set rating = excluded.rating,
    comment = excluded.comment,
    status = excluded.status,
    created_at = excluded.created_at;

insert into public.favorites (student_profile_id, teacher_profile_id) values
  ('00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000601'),
  ('00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000604'),
  ('00000000-0000-0000-0000-000000000502', '00000000-0000-0000-0000-000000000603'),
  ('00000000-0000-0000-0000-000000000502', '00000000-0000-0000-0000-000000000605'),
  ('00000000-0000-0000-0000-000000000503', '00000000-0000-0000-0000-000000000606'),
  ('00000000-0000-0000-0000-000000000504', '00000000-0000-0000-0000-000000000602')
on conflict (student_profile_id, teacher_profile_id) do nothing;

insert into public.notifications (id, profile_id, channel, subject, body, sent_at, created_at) values
  ('00000000-0000-0000-0000-000000001101', '00000000-0000-0000-0000-000000000401', 'in_app', 'Yeni ders talebi', 'Ali Yıldız matematik dersi için talep gönderdi.', null, now() - interval '25 days'),
  ('00000000-0000-0000-0000-000000001102', '00000000-0000-0000-0000-000000000501', 'email', 'Talebin kabul edildi', 'Elif Acar ders talebini kabul etti. İletişim bilgilerin öğretmenle paylaşıldı.', now() - interval '24 days', now() - interval '24 days'),
  ('00000000-0000-0000-0000-000000001103', '00000000-0000-0000-0000-000000000502', 'in_app', 'Yorum bekliyor', 'Tamamlanan ders için öğretmenini değerlendirebilirsin.', null, now() - interval '2 days'),
  ('00000000-0000-0000-0000-000000001104', '00000000-0000-0000-0000-000000000400', 'in_app', 'Moderasyon bekleyen yorum', 'Emre Arslan için bir yorum moderasyon bekliyor.', null, now() - interval '1 day')
on conflict (id) do update
set profile_id = excluded.profile_id,
    channel = excluded.channel,
    subject = excluded.subject,
    body = excluded.body,
    sent_at = excluded.sent_at,
    created_at = excluded.created_at;

insert into public.analytics_events (id, name, properties, actor_id, created_at) values
  ('00000000-0000-0000-0000-000000001201', 'teacher_search', '{"seed":"demo-full","q":"matematik","city":"Erzurum","sort":"recommended"}', null, now() - interval '6 days'),
  ('00000000-0000-0000-0000-000000001202', 'teacher_search', '{"seed":"demo-full","lesson":"ingilizce","deliveryMode":"online"}', null, now() - interval '5 days'),
  ('00000000-0000-0000-0000-000000001203', 'teacher_profile_view', '{"seed":"demo-full","slug":"elif-acar-matematik"}', '00000000-0000-0000-0000-000000000501', now() - interval '4 days'),
  ('00000000-0000-0000-0000-000000001204', 'lesson_request_submit', '{"seed":"demo-full","status":"submitted"}', '00000000-0000-0000-0000-000000000504', now() - interval '2 days')
on conflict (id) do update
set name = excluded.name,
    properties = excluded.properties,
    actor_id = excluded.actor_id,
    created_at = excluded.created_at;

insert into public.admin_audit_logs (id, actor_profile_id, action, entity_table, entity_id, metadata, created_at) values
  ('00000000-0000-0000-0000-000000001301', '00000000-0000-0000-0000-000000000400', 'teacher_profile.reviewed', 'teacher_profiles', '00000000-0000-0000-0000-000000000601', '{"seed":"demo-full","status":"published"}', now() - interval '30 days'),
  ('00000000-0000-0000-0000-000000001302', '00000000-0000-0000-0000-000000000400', 'review.moderation_pending', 'reviews', '00000000-0000-0000-0000-000000001011', '{"seed":"demo-full","status":"pending"}', now() - interval '1 day')
on conflict (id) do update
set actor_profile_id = excluded.actor_profile_id,
    action = excluded.action,
    entity_table = excluded.entity_table,
    entity_id = excluded.entity_id,
    metadata = excluded.metadata,
    created_at = excluded.created_at;

with published_review_stats as (
  select
    teacher_profile_id,
    round(avg(rating)::numeric, 2) as rating_average,
    count(*)::int as review_count
  from public.reviews
  where status = 'published'
  group by teacher_profile_id
)
update public.teacher_listings listing
set rating_average = coalesce(stats.rating_average, 0),
    review_count = coalesce(stats.review_count, 0)
from public.teacher_profiles teacher
left join published_review_stats stats on stats.teacher_profile_id = teacher.id
where listing.teacher_profile_id = teacher.id
  and teacher.profile_id in (
    '00000000-0000-0000-0000-000000000401',
    '00000000-0000-0000-0000-000000000402',
    '00000000-0000-0000-0000-000000000403',
    '00000000-0000-0000-0000-000000000404',
    '00000000-0000-0000-0000-000000000405',
    '00000000-0000-0000-0000-000000000406',
    '00000000-0000-0000-0000-000000000407'
  );
