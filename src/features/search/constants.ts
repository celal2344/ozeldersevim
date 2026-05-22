import type { TeacherSearchResult } from "@/features/search/types";

export const teacherDeliveryLabels: Record<TeacherSearchResult["deliveryMode"], string> = {
  online: "Online",
  face_to_face: "Yüz yüze",
  both: "Online + Yüz yüze",
};
