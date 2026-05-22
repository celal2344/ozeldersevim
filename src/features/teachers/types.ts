export type TeacherProfileReview = {
  id: string;
  studentName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type TeacherProfile = {
  id: string;
  slug: string;
  fullName: string;
  title: string;
  headline: string;
  shortBio: string;
  longBio: string;
  city: string;
  district: string;
  latitude: number;
  longitude: number;
  lessons: string[];
  deliveryMode: "online" | "face_to_face" | "both";
  hourlyPrice: number;
  lessonDurationMinutes: number;
  ratingAverage: number;
  reviewCount: number;
  experienceYears: number;
  education: string;
  responseTime: string;
  activeStudentCount: number;
  completedLessonCount: number;
  isVerified: boolean;
  reviews: TeacherProfileReview[];
};
