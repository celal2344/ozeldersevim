import { absoluteUrl } from "@/features/seo/site";
import type { TeacherProfile } from "@/features/teachers/types";

export function teacherInitials(fullName: string) {
  return fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

export function teacherDeliveryLabel(deliveryMode: TeacherProfile["deliveryMode"]) {
  if (deliveryMode === "online") return "Online";
  if (deliveryMode === "face_to_face") return "Yüz yüze";
  return "Online + Yüz yüze";
}

export function teacherRatingLabel(teacher: TeacherProfile) {
  return teacher.reviewCount > 0
    ? `${teacher.ratingAverage.toFixed(1)} (${teacher.reviewCount} yorum)`
    : "Yeni öğretmen";
}

export function teacherPriceLabel(teacher: TeacherProfile) {
  return `₺${teacher.hourlyPrice} / ${teacher.lessonDurationMinutes} dk`;
}

export function teacherRequestHref(teacher: TeacherProfile) {
  return `/ders-talebi?teacher=${encodeURIComponent(teacher.slug)}`;
}

export function teacherProfileStats(teacher: TeacherProfile) {
  return [
    { label: "Deneyim", value: `${teacher.experienceYears} yıl` },
    { label: "Aktif öğrenci", value: String(teacher.activeStudentCount) },
    { label: "Tamamlanan ders", value: String(teacher.completedLessonCount) },
    { label: "Yanıt süresi", value: teacher.responseTime },
  ];
}

export function teacherProfileJsonLd(teacher: TeacherProfile) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: teacher.fullName,
    jobTitle: teacher.title,
    description: teacher.shortBio,
    address: {
      "@type": "PostalAddress",
      addressLocality: teacher.district,
      addressRegion: teacher.city,
      addressCountry: "TR",
    },
    knowsAbout: teacher.lessons,
    aggregateRating:
      teacher.reviewCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: teacher.ratingAverage,
            reviewCount: teacher.reviewCount,
          }
        : undefined,
    url: absoluteUrl(`/ogretmen/${teacher.slug}`),
  };
}
