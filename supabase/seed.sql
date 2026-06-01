-- Production-safe reference seed.
-- This file intentionally avoids fake users, fake teachers, fake listings, and fake marketplace stats.

delete from public.profiles
where id in (
  '00000000-0000-0000-0000-000000000401',
  '00000000-0000-0000-0000-000000000402',
  '00000000-0000-0000-0000-000000000403',
  '00000000-0000-0000-0000-000000000404'
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
    ('lesson_planning', 'a', 'Önce seviyeyi ölçer, hedefi sorar ve buna göre ders planı çıkarırım.', 1, 1),
    ('lesson_planning', 'b', 'Herkese aynı ders planını uygularım.', 0, 2),
    ('lesson_planning', 'c', 'Sadece öğrencinin istediği soruları çözerim, takip planı yapmam.', 0, 3),
    ('lesson_planning', 'd', 'Seviye ve hedef konuşmasını derslerden sonra yaparım.', 0, 4),
    ('communication', 'a', 'Ders ilerlemesini düzenli, saygılı ve ölçülü şekilde paylaşırım.', 1, 1),
    ('communication', 'b', 'Her gün çok sık mesaj atarım.', 0, 2),
    ('communication', 'c', 'Veliyi hiç bilgilendirmem.', 0, 3),
    ('communication', 'd', 'Sadece ücret konularında iletişim kurarım.', 0, 4),
    ('ethics', 'a', 'Bilgileri yalnızca ders talebi amacıyla kullanır, üçüncü kişilerle paylaşmam.', 1, 1),
    ('ethics', 'b', 'Öğrenci bilgilerini başka öğretmenlerle paylaşabilirim.', 0, 2),
    ('ethics', 'c', 'İletişim bilgilerini reklam listesine eklerim.', 0, 3),
    ('ethics', 'd', 'Kişisel verileri korumak öğretmenin sorumluluğunda değildir.', 0, 4)
) as seed(question_key, choice_key, label, score, position)
  on seed.question_key = question_rows.question_key
on conflict (question_id, choice_key) do update
  set label = excluded.label,
      score = excluded.score,
      position = excluded.position;
