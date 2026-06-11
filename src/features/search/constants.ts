import type { TeacherSearchResult } from "@/features/search/types";

export const teacherDeliveryLabels: Record<TeacherSearchResult["deliveryMode"], string> = {
  online: "Online",
  face_to_face: "Yüz yüze",
  both: "Online + Yüz yüze",
};

export const deliveryFilterOptions = [
  { value: "all", label: "Tüm ders türleri" },
  { value: "online", label: "Online" },
  { value: "face_to_face", label: "Yüz yüze" },
];

export const sortFilterOptions = [
  { value: "recommended", label: "Önerilen" },
  { value: "nearest", label: "Yakındaki" },
  { value: "highest_rated", label: "En yüksek puan" },
  { value: "lowest_price", label: "En düşük ücret" },
  { value: "most_reviewed", label: "En çok yorum" },
];

export const priceFilterOptions = [
  { value: "", label: "Tüm fiyatlar" },
  { value: "0-500", label: "TL 0 - TL 500" },
  { value: "500-750", label: "TL 500 - TL 750" },
  { value: "750-1000", label: "TL 750 - TL 1000" },
  { value: "1000-1500", label: "TL 1000 - TL 1500" },
  { value: "1500-", label: "TL 1500+" },
];

export const genderFilterOptions = [
  { value: "all", label: "Tümü" },
  { value: "female", label: "Kadın" },
  { value: "male", label: "Erkek" },
];
