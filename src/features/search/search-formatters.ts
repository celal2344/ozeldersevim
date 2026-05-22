import type { TeacherSearchResult } from "@/features/search/types";

export const teacherDeliveryLabels: Record<TeacherSearchResult["deliveryMode"], string> = {
  online: "Online",
  face_to_face: "Yüz yüze",
  both: "Online + Yüz yüze",
};

export function optionValue(value: string) {
  return value.toLocaleLowerCase("tr-TR");
}

export function initialsFromTeacherName(fullName: string) {
  return fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

export function reviewLabel(teacher: TeacherSearchResult) {
  return teacher.reviewCount > 0
    ? `${teacher.ratingAverage.toFixed(1)} (${teacher.reviewCount})`
    : "Yeni öğretmen";
}

export function distanceLabel(distanceKm: number) {
  return `${distanceKm.toFixed(1)} km yakında`;
}
