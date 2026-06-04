import type { ListResponse } from "@/shared/api/list-query";

export type DeliveryModeFilter = "all" | "online" | "face_to_face" | "both";
export type TeacherSort = "recommended" | "nearest" | "highest_rated" | "lowest_price" | "most_reviewed";
export type GenderFilter = "all" | "male" | "female";

export type TeacherSearchParams = {
  q?: string;
  lesson?: string;
  city?: string;
  district?: string;
  deliveryMode?: DeliveryModeFilter;
  sort?: TeacherSort;
  gender?: GenderFilter;
  minPrice?: number;
  maxPrice?: number;
  fastResponse?: boolean;
  page?: number;
  lat?: number;
  lng?: number;
  pageSize?: number;
};

export type TeacherSearchResult = {
  id: string;
  slug: string;
  fullName: string;
  headline: string;
  shortBio: string;
  city: string;
  district: string;
  latitude: number;
  longitude: number;
  lessons: string[];
  deliveryMode: "online" | "face_to_face" | "both";
  hourlyPrice: number;
  ratingAverage: number;
  reviewCount: number;
  experienceYears: number;
  completedLessons?: number;
  activeStudents?: number;
  gender?: "male" | "female";
  fastResponse?: boolean;
  distanceKm?: number;
};

export type TeacherSearchResponse = ListResponse<TeacherSearchResult>;
