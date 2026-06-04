export type ReviewStatus = "pending" | "published" | "rejected" | "reported";

export type TeacherReview = {
  id: string;
  rating: number;
  comment: string | null;
  status: ReviewStatus;
  created_at: string;
  lesson_requests: {
    lesson_categories: { name: string } | null;
  } | null;
};

export type SubmitReviewPayload = {
  lessonRequestId: string;
  rating: number;
  comment?: string;
};

export type SubmitReviewResponse = {
  reviewId: string;
  rating: number;
  status: ReviewStatus;
};
