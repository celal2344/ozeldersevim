export type TeacherEligibilityStatus = "not_started" | "passed" | "failed" | "expired";

export type TeacherEligibilityState = {
  status: TeacherEligibilityStatus;
  latestAttemptId: string | null;
  latestScore: number | null;
  canRetake: boolean;
};

export type TeacherEligibilityChoice = {
  id: string;
  label: string;
};

export type TeacherEligibilityQuestion = {
  id: string;
  prompt: string;
  choices: TeacherEligibilityChoice[];
};

export type TeacherEligibilityTest = {
  id: string;
  version: number;
  title: string;
  passingScore: number;
  questionCount: number;
  questions: TeacherEligibilityQuestion[];
};

export type TeacherEligibilitySubmissionResult = {
  attemptId: string;
  status: "passed" | "failed";
  score: number;
  canPublishListing: boolean;
};
