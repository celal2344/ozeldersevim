import { createSupabaseServiceRoleClient } from "@/shared/db/supabase/admin";
import { createSupabaseServerClient } from "@/shared/db/supabase/server";
import type {
  TeacherEligibilityState,
  TeacherEligibilitySubmissionResult,
  TeacherEligibilityTest,
} from "@/features/teacher-eligibility/types";

export class TeacherEligibilityError extends Error {
  constructor(
    message: string,
    public status = 400
  ) {
    super(message);
  }
}

type EligibilityChoiceRow = {
  question_id: string;
  choice_key: string;
  label: string;
  score: number;
  position: number;
};

export async function getTeacherEligibilityState(profileId: string): Promise<TeacherEligibilityState> {
  const supabase = await createSupabaseServerClient();
  const { data: passedAttempt, error: passedError } = await supabase
    .from("teacher_eligibility_attempts")
    .select("id,score,status")
    .eq("profile_id", profileId)
    .eq("status", "passed")
    .order("submitted_at", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();

  if (passedError) {
    throw new TeacherEligibilityError(passedError.message, 500);
  }

  if (passedAttempt) {
    return {
      status: "passed",
      latestAttemptId: passedAttempt.id,
      latestScore: passedAttempt.score,
      canRetake: false,
    };
  }

  const { data: latestAttempt, error: latestError } = await supabase
    .from("teacher_eligibility_attempts")
    .select("id,score,status")
    .eq("profile_id", profileId)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latestError) {
    throw new TeacherEligibilityError(latestError.message, 500);
  }

  return {
    status: latestAttempt?.status ?? "not_started",
    latestAttemptId: latestAttempt?.id ?? null,
    latestScore: latestAttempt?.score ?? null,
    canRetake: true,
  };
}

export async function getActiveTeacherEligibilityTest(profileId: string): Promise<TeacherEligibilityTest> {
  const state = await getTeacherEligibilityState(profileId);

  if (state.status === "passed") {
    throw new TeacherEligibilityError("Öğretmenlik testini zaten geçtin.", 409);
  }

  const supabase = createSupabaseServiceRoleClient();
  const { data: test, error: testError } = await supabase
    .from("teacher_eligibility_tests")
    .select("id,version,title,passing_score,question_count")
    .eq("is_active", true)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (testError) {
    throw new TeacherEligibilityError(testError.message, 500);
  }

  if (!test) {
    throw new TeacherEligibilityError("Aktif öğretmenlik testi bulunamadı.", 404);
  }

  const { data: questions, error: questionError } = await supabase
    .from("teacher_eligibility_questions")
    .select("id,question_key,prompt,position")
    .eq("test_id", test.id)
    .eq("is_active", true)
    .order("position", { ascending: true });

  if (questionError) {
    throw new TeacherEligibilityError(questionError.message, 500);
  }

  if (!questions?.length) {
    throw new TeacherEligibilityError("Aktif test için soru bulunamadı.", 404);
  }

  const { data: choices, error: choiceError } = await supabase
    .from("teacher_eligibility_choices")
    .select("question_id,choice_key,label,position")
    .in(
      "question_id",
      questions.map((question) => question.id)
    )
    .order("position", { ascending: true });

  if (choiceError) {
    throw new TeacherEligibilityError(choiceError.message, 500);
  }

  return {
    id: test.id,
    version: test.version,
    title: test.title,
    passingScore: test.passing_score,
    questionCount: questions.length,
    questions: questions.map((question) => ({
      id: question.question_key,
      prompt: question.prompt,
      choices: (choices ?? [])
        .filter((choice) => choice.question_id === question.id)
        .map((choice) => ({
          id: choice.choice_key,
          label: choice.label,
        })),
    })),
  };
}

export async function submitTeacherEligibilityAnswers(
  profileId: string,
  input: { testId: string; answers: { questionId: string; choiceId: string }[] }
): Promise<TeacherEligibilitySubmissionResult> {
  const state = await getTeacherEligibilityState(profileId);

  if (state.status === "passed") {
    throw new TeacherEligibilityError("Öğretmenlik testini zaten geçtin.", 409);
  }

  const supabase = createSupabaseServiceRoleClient();
  const { data: test, error: testError } = await supabase
    .from("teacher_eligibility_tests")
    .select("id,passing_score")
    .eq("id", input.testId)
    .eq("is_active", true)
    .maybeSingle();

  if (testError) {
    throw new TeacherEligibilityError(testError.message, 500);
  }

  if (!test) {
    throw new TeacherEligibilityError("Test bulunamadı.", 404);
  }

  const { data: questions, error: questionError } = await supabase
    .from("teacher_eligibility_questions")
    .select("id,question_key")
    .eq("test_id", test.id)
    .eq("is_active", true);

  if (questionError) {
    throw new TeacherEligibilityError(questionError.message, 500);
  }

  if (!questions?.length) {
    throw new TeacherEligibilityError("Test soruları bulunamadı.", 404);
  }

  const answerByQuestion = new Map<string, string>();

  for (const answer of input.answers) {
    if (answerByQuestion.has(answer.questionId)) {
      throw new TeacherEligibilityError("Aynı soru için birden fazla cevap gönderilemez.", 400);
    }

    answerByQuestion.set(answer.questionId, answer.choiceId);
  }

  if (answerByQuestion.size !== questions.length) {
    throw new TeacherEligibilityError("Tüm soruları cevaplamalısın.", 400);
  }

  const unknownQuestion = [...answerByQuestion.keys()].find(
    (questionId) => !questions.some((question) => question.question_key === questionId)
  );

  if (unknownQuestion) {
    throw new TeacherEligibilityError("Geçersiz soru cevabı gönderildi.", 400);
  }

  const { data: choices, error: choiceError } = await supabase
    .from("teacher_eligibility_choices")
    .select("question_id,choice_key,label,score,position")
    .in(
      "question_id",
      questions.map((question) => question.id)
    );

  if (choiceError) {
    throw new TeacherEligibilityError(choiceError.message, 500);
  }

  const choiceRows = (choices ?? []) as EligibilityChoiceRow[];
  let earnedScore = 0;
  let possibleScore = 0;

  for (const question of questions) {
    const questionChoices = choiceRows.filter((choice) => choice.question_id === question.id);
    const selectedChoice = questionChoices.find(
      (choice) => choice.choice_key === answerByQuestion.get(question.question_key)
    );

    if (!selectedChoice) {
      throw new TeacherEligibilityError("Geçersiz cevap seçimi gönderildi.", 400);
    }

    earnedScore += selectedChoice.score;
    possibleScore += Math.max(...questionChoices.map((choice) => choice.score));
  }

  if (possibleScore <= 0) {
    throw new TeacherEligibilityError("Test puanlaması yapılandırılmamış.", 500);
  }

  const score = Math.round((earnedScore / possibleScore) * 100);
  const status = score >= test.passing_score ? "passed" : "failed";
  const { data: attempt, error: attemptError } = await supabase
    .from("teacher_eligibility_attempts")
    .insert({
      profile_id: profileId,
      test_id: test.id,
      status,
      score,
      submitted_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (attemptError) {
    throw new TeacherEligibilityError(attemptError.message, 500);
  }

  return {
    attemptId: attempt.id,
    status,
    score,
    canPublishListing: status === "passed",
  };
}
