insert into public.locations (id, city, district, latitude, longitude, slug) values
  ('00000000-0000-0000-0000-000000000101', 'Erzurum', 'Yakutiye', 39.9086, 41.2769, 'erzurum-yakutiye'),
  ('00000000-0000-0000-0000-000000000102', 'Erzurum', 'Palandöken', 39.8875, 41.2444, 'erzurum-palandoken'),
  ('00000000-0000-0000-0000-000000000103', 'İstanbul', 'Kadıköy', 40.9919, 29.0278, 'istanbul-kadikoy'),
  ('00000000-0000-0000-0000-000000000104', 'Ankara', 'Çankaya', 39.9179, 32.8627, 'ankara-cankaya'),
  ('00000000-0000-0000-0000-000000000105', 'İzmir', 'Konak', 38.4192, 27.1287, 'izmir-konak')
on conflict (slug) do nothing;

insert into public.lesson_categories (id, name, slug) values
  ('00000000-0000-0000-0000-000000000201', 'Matematik', 'matematik'),
  ('00000000-0000-0000-0000-000000000202', 'Fizik', 'fizik'),
  ('00000000-0000-0000-0000-000000000203', 'Kimya', 'kimya'),
  ('00000000-0000-0000-0000-000000000204', 'İngilizce', 'ingilizce'),
  ('00000000-0000-0000-0000-000000000205', 'Türkçe', 'turkce'),
  ('00000000-0000-0000-0000-000000000206', 'Yazılım', 'yazilim'),
  ('00000000-0000-0000-0000-000000000207', 'LGS', 'lgs'),
  ('00000000-0000-0000-0000-000000000208', 'TYT / AYT', 'tyt-ayt')
on conflict (slug) do nothing;

insert into public.teacher_eligibility_tests (id, version, title, passing_score, question_count, is_active) values
  ('00000000-0000-0000-0000-000000000301', 1, 'MVP Öğretmenlik Uygunluk Testi', 70, 10, true)
on conflict (version) do nothing;

insert into public.profiles (id, role, full_name, phone) values
  ('00000000-0000-0000-0000-000000000401', 'teacher', 'Ayşe Demir', '+905551110001'),
  ('00000000-0000-0000-0000-000000000402', 'teacher', 'Mehmet Yılmaz', '+905551110002'),
  ('00000000-0000-0000-0000-000000000403', 'teacher', 'Zeynep Acar', '+905551110003'),
  ('00000000-0000-0000-0000-000000000404', 'student', 'Test Öğrenci', '+905551110004')
on conflict (id) do nothing;

insert into public.student_profiles (profile_id) values
  ('00000000-0000-0000-0000-000000000404')
on conflict (profile_id) do nothing;

insert into public.teacher_eligibility_attempts (id, profile_id, test_id, status, score, submitted_at) values
  ('00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000301', 'passed', 90, now()),
  ('00000000-0000-0000-0000-000000000502', '00000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000301', 'passed', 80, now()),
  ('00000000-0000-0000-0000-000000000503', '00000000-0000-0000-0000-000000000403', '00000000-0000-0000-0000-000000000301', 'passed', 100, now())
on conflict (id) do nothing;

insert into public.teacher_profiles (id, profile_id, location_id, title, bio, education, experience_years, hourly_price, delivery_mode, status, latitude, longitude) values
  ('00000000-0000-0000-0000-000000000601', '00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000101', 'Matematik Öğretmeni', 'Erzurum Yakutiye ve online matematik özel dersleri.', 'Atatürk Üniversitesi', 6, 650, 'both', 'published', 39.9086, 41.2769),
  ('00000000-0000-0000-0000-000000000602', '00000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000103', 'Fizik Öğretmeni', 'Online odaklı lise fizik ve TYT/AYT hazırlık dersleri.', 'İstanbul Teknik Üniversitesi', 4, 900, 'online', 'published', 40.9919, 29.0278),
  ('00000000-0000-0000-0000-000000000603', '00000000-0000-0000-0000-000000000403', '00000000-0000-0000-0000-000000000102', 'İngilizce Öğretmeni', 'Yüz yüze konuşma pratiği ve okul destek dersleri.', 'Anadolu Üniversitesi', 2, 450, 'face_to_face', 'published', 39.8875, 41.2444)
on conflict (id) do nothing;

insert into public.teacher_lessons (teacher_profile_id, lesson_category_id) values
  ('00000000-0000-0000-0000-000000000601', '00000000-0000-0000-0000-000000000201'),
  ('00000000-0000-0000-0000-000000000601', '00000000-0000-0000-0000-000000000208'),
  ('00000000-0000-0000-0000-000000000602', '00000000-0000-0000-0000-000000000202'),
  ('00000000-0000-0000-0000-000000000602', '00000000-0000-0000-0000-000000000208'),
  ('00000000-0000-0000-0000-000000000603', '00000000-0000-0000-0000-000000000204')
on conflict (teacher_profile_id, lesson_category_id) do nothing;

insert into public.teacher_listings (teacher_profile_id, slug, headline, short_bio, rating_average, review_count, is_published) values
  ('00000000-0000-0000-0000-000000000601', 'ayse-demir-matematik-erzurum', 'Erzurum Matematik Özel Ders', 'Yakutiye ve online matematik desteği.', 4.9, 18, true),
  ('00000000-0000-0000-0000-000000000602', 'mehmet-yilmaz-fizik-online', 'Online Fizik Özel Ders', 'TYT/AYT fizik hazırlığı.', 0, 0, true),
  ('00000000-0000-0000-0000-000000000603', 'zeynep-acar-ingilizce-erzurum', 'Erzurum İngilizce Özel Ders', 'Palandöken yüz yüze İngilizce.', 4.6, 7, true)
on conflict (teacher_profile_id) do nothing;

