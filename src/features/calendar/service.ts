import { getCurrentAccount } from "@/features/auth/service";
import type { AuthAccount } from "@/features/auth/types";
import type {
  CalendarLesson,
  CreateCalendarLessonInput,
  TeacherCalendarResource,
  TeacherStudent,
  UnscheduledLessonRequest,
  UpdateCalendarLessonInput,
} from "@/features/calendar/types";
import { summarizeLessons } from "@/features/calendar/utils";
import { createSupabaseServerClient } from "@/shared/db/supabase/server";

export class CalendarError extends Error {
  constructor(
    message: string,
    public status = 400
  ) {
    super(message);
  }
}

type TeacherProfileContext = {
  id: string;
  hourlyPrice: number;
  deliveryMode: "online" | "face_to_face" | "both";
};

function assertTeacher(account: AuthAccount | null) {
  if (!account) throw new CalendarError("Giriş yapmalısın.", 401);
  if (account.role !== "teacher") {
    throw new CalendarError("Bu işlem yalnızca öğretmen hesapları tarafından yapılabilir.", 403);
  }
  return account;
}

async function getTeacherProfileContext(profileId: string): Promise<TeacherProfileContext> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("teacher_profiles")
    .select("id,hourly_price,delivery_mode")
    .eq("profile_id", profileId)
    .maybeSingle();

  if (error) throw new CalendarError(error.message, 500);
  if (!data) throw new CalendarError("Öğretmen profili bulunamadı.", 404);

  return {
    id: data.id,
    hourlyPrice: Number(data.hourly_price),
    deliveryMode: data.delivery_mode,
  };
}

function nextDateForPreferredTime(weekday: number, startHour: number) {
  const now = new Date();
  const today = now.getDay() === 0 ? 7 : now.getDay();
  let offset = weekday - today;
  if (offset < 0) offset += 7;

  const scheduledAt = new Date(now);
  scheduledAt.setDate(now.getDate() + offset);
  scheduledAt.setHours(startHour, 0, 0, 0);

  if (scheduledAt <= now) {
    scheduledAt.setDate(scheduledAt.getDate() + 7);
  }

  return scheduledAt.toISOString();
}

function mapStudent(row: {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  source_lesson_request_id: string | null;
}): TeacherStudent {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    notes: row.notes,
    sourceLessonRequestId: row.source_lesson_request_id,
  };
}

function mapLesson(row: {
  id: string;
  lesson_request_id: string | null;
  teacher_student_id: string | null;
  delivery_mode: "online" | "face_to_face" | "both";
  status: "scheduled" | "completed" | "cancelled" | "no_show";
  scheduled_at: string | null;
  duration_minutes: number;
  price_amount: number;
  currency: string;
  notes: string | null;
  cancellation_reason: string | null;
  teacher_students: { name: string; email: string | null; phone: string | null } | null;
  lesson_categories: { name: string } | null;
}): CalendarLesson {
  return {
    id: row.id,
    lessonRequestId: row.lesson_request_id,
    teacherStudentId: row.teacher_student_id,
    studentName: row.teacher_students?.name ?? "Öğrenci",
    studentEmail: row.teacher_students?.email ?? null,
    studentPhone: row.teacher_students?.phone ?? null,
    lessonName: row.lesson_categories?.name ?? "Ders",
    deliveryMode: row.delivery_mode,
    status: row.status,
    scheduledAt: row.scheduled_at,
    durationMinutes: row.duration_minutes,
    priceAmount: Number(row.price_amount),
    currency: row.currency,
    notes: row.notes,
    cancellationReason: row.cancellation_reason,
  };
}

async function getLessonCategoryIdBySlug(slug: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("lesson_categories")
    .select("id")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw new CalendarError(error.message, 500);
  if (!data) throw new CalendarError("Ders bulunamadı.", 404);
  return data.id;
}

async function ensureTeacherStudent(
  teacherProfileId: string,
  input: Pick<CreateCalendarLessonInput, "teacherStudentId" | "studentName" | "studentEmail" | "studentPhone">
) {
  const supabase = await createSupabaseServerClient();

  if (input.teacherStudentId) {
    const { data, error } = await supabase
      .from("teacher_students")
      .select("id")
      .eq("id", input.teacherStudentId)
      .eq("teacher_profile_id", teacherProfileId)
      .maybeSingle();

    if (error) throw new CalendarError(error.message, 500);
    if (!data) throw new CalendarError("Öğrenci bulunamadı.", 404);
    return data.id;
  }

  if (!input.studentName) {
    throw new CalendarError("Yeni ders için öğrenci adı zorunlu.", 400);
  }

  const { data, error } = await supabase
    .from("teacher_students")
    .insert({
      teacher_profile_id: teacherProfileId,
      name: input.studentName,
      email: input.studentEmail || null,
      phone: input.studentPhone || null,
    })
    .select("id")
    .single();

  if (error) throw new CalendarError(error.message, 500);
  return data.id;
}

export async function createCalendarEntriesForAcceptedRequest(requestId: string, teacherProfileId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: request, error: requestError } = await supabase
    .from("lesson_requests")
    .select(
      "id,student_profile_id,teacher_profile_id,lesson_category_id,delivery_mode,preferred_weekday,preferred_start_hour,lesson_request_contacts(student_name,email,phone)"
    )
    .eq("id", requestId)
    .eq("teacher_profile_id", teacherProfileId)
    .eq("status", "accepted")
    .maybeSingle();

  if (requestError) throw new CalendarError(requestError.message, 500);
  if (!request) throw new CalendarError("Kabul edilen ders talebi bulunamadı.", 404);

  const contact = Array.isArray(request.lesson_request_contacts)
    ? request.lesson_request_contacts[0]
    : request.lesson_request_contacts;

  if (!contact) {
    throw new CalendarError("Öğrenci iletişim bilgileri bulunamadı.", 404);
  }

  const { data: teacherStudent, error: studentError } = await supabase
    .from("teacher_students")
    .upsert(
      {
        teacher_profile_id: teacherProfileId,
        student_profile_id: request.student_profile_id,
        source_lesson_request_id: request.id,
        name: contact.student_name,
        email: contact.email,
        phone: contact.phone,
      },
      { onConflict: "teacher_profile_id,student_profile_id" }
    )
    .select("id")
    .single();

  if (studentError) throw new CalendarError(studentError.message, 500);

  if (!request.preferred_weekday || request.preferred_start_hour === null) {
    return { teacherStudentId: teacherStudent.id, lessonId: null };
  }

  const { data: existingLesson, error: existingError } = await supabase
    .from("lessons")
    .select("id")
    .eq("lesson_request_id", request.id)
    .maybeSingle();

  if (existingError) throw new CalendarError(existingError.message, 500);
  if (existingLesson) return { teacherStudentId: teacherStudent.id, lessonId: existingLesson.id };

  const { data: profilePrice, error: profilePriceError } = await supabase
    .from("teacher_profiles")
    .select("hourly_price")
    .eq("id", teacherProfileId)
    .maybeSingle();

  if (profilePriceError) throw new CalendarError(profilePriceError.message, 500);

  const hourlyPrice = Number(profilePrice?.hourly_price);
  const { data: lesson, error: lessonError } = await supabase
    .from("lessons")
    .insert({
      lesson_request_id: request.id,
      teacher_profile_id: teacherProfileId,
      teacher_student_id: teacherStudent.id,
      lesson_category_id: request.lesson_category_id,
      delivery_mode: request.delivery_mode,
      scheduled_at: nextDateForPreferredTime(request.preferred_weekday, request.preferred_start_hour),
      duration_minutes: 60,
      price_amount: Number.isFinite(hourlyPrice) ? hourlyPrice : 0,
      currency: "TRY",
    })
    .select("id")
    .single();

  if (lessonError) throw new CalendarError(lessonError.message, 500);
  return { teacherStudentId: teacherStudent.id, lessonId: lesson.id };
}

export async function getTeacherCalendarResource(from: string, to: string): Promise<TeacherCalendarResource> {
  const account = assertTeacher(await getCurrentAccount());
  const teacherProfile = await getTeacherProfileContext(account.id);
  const supabase = await createSupabaseServerClient();

  const [{ data: lessons, error: lessonsError }, { data: students, error: studentsError }] =
    await Promise.all([
      supabase
        .from("lessons")
        .select("id,lesson_request_id,teacher_student_id,delivery_mode,status,scheduled_at,duration_minutes,price_amount,currency,notes,cancellation_reason,teacher_students(name,email,phone),lesson_categories(name)")
        .eq("teacher_profile_id", teacherProfile.id)
        .gte("scheduled_at", from)
        .lte("scheduled_at", to)
        .order("scheduled_at", { ascending: true }),
      supabase
        .from("teacher_students")
        .select("id,name,email,phone,notes,source_lesson_request_id")
        .eq("teacher_profile_id", teacherProfile.id)
        .order("name", { ascending: true }),
    ]);

  if (lessonsError) throw new CalendarError(lessonsError.message, 500);
  if (studentsError) throw new CalendarError(studentsError.message, 500);

  const calendarLessons = ((lessons ?? []) as unknown as Parameters<typeof mapLesson>[0][]).map(mapLesson);
  const teacherStudents = ((students ?? []) as Parameters<typeof mapStudent>[0][]).map(mapStudent);

  return {
    lessons: calendarLessons,
    students: teacherStudents,
    unscheduledRequests: await getUnscheduledAcceptedRequests(teacherProfile.id),
    summary: await getTeacherCalendarSummary(teacherProfile.id),
  };
}

export async function getTeacherCalendarSummary(teacherProfileId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: lessons, error: lessonsError } = await supabase
    .from("lessons")
    .select("id,lesson_request_id,teacher_student_id,delivery_mode,status,scheduled_at,duration_minutes,price_amount,currency,notes,cancellation_reason,teacher_students(name,email,phone),lesson_categories(name)")
    .eq("teacher_profile_id", teacherProfileId);

  if (lessonsError) throw new CalendarError(lessonsError.message, 500);

  const { count, error: countError } = await supabase
    .from("teacher_students")
    .select("id", { count: "exact", head: true })
    .eq("teacher_profile_id", teacherProfileId);

  if (countError) throw new CalendarError(countError.message, 500);

  return summarizeLessons(
    ((lessons ?? []) as unknown as Parameters<typeof mapLesson>[0][]).map(mapLesson),
    count ?? 0
  );
}

export async function getOwnTeacherDashboardCalendarResource() {
  const account = assertTeacher(await getCurrentAccount());
  const teacherProfile = await getTeacherProfileContext(account.id);
  const supabase = await createSupabaseServerClient();

  const { data: nextLessons, error } = await supabase
    .from("lessons")
    .select("id,lesson_request_id,teacher_student_id,delivery_mode,status,scheduled_at,duration_minutes,price_amount,currency,notes,cancellation_reason,teacher_students(name,email,phone),lesson_categories(name)")
    .eq("teacher_profile_id", teacherProfile.id)
    .neq("status", "cancelled")
    .gte("scheduled_at", new Date().toISOString())
    .order("scheduled_at", { ascending: true })
    .limit(5);

  if (error) throw new CalendarError(error.message, 500);

  return {
    summary: await getTeacherCalendarSummary(teacherProfile.id),
    nextLessons: ((nextLessons ?? []) as unknown as Parameters<typeof mapLesson>[0][]).map(mapLesson),
    unscheduledRequests: await getUnscheduledAcceptedRequests(teacherProfile.id),
  };
}

async function getUnscheduledAcceptedRequests(teacherProfileId: string): Promise<UnscheduledLessonRequest[]> {
  const supabase = await createSupabaseServerClient();
  const { data: requests, error } = await supabase
    .from("lesson_requests")
    .select("id,goal,student_level,accepted_at,lesson_categories(name),lesson_request_contacts(student_name,email,phone),lessons(id)")
    .eq("teacher_profile_id", teacherProfileId)
    .eq("status", "accepted")
    .order("accepted_at", { ascending: false });

  if (error) throw new CalendarError(error.message, 500);

  return ((requests ?? []) as unknown as {
    id: string;
    goal: string | null;
    student_level: string | null;
    accepted_at: string | null;
    lesson_categories: { name: string } | null;
    lesson_request_contacts: { student_name: string; email: string; phone: string }[] | null;
    lessons: { id: string }[] | null;
  }[])
    .filter((request) => !request.lessons?.length)
    .map((request) => {
      const contact = request.lesson_request_contacts?.[0];
      return {
        id: request.id,
        studentName: contact?.student_name ?? "Öğrenci",
        studentEmail: contact?.email ?? "",
        studentPhone: contact?.phone ?? "",
        lessonName: request.lesson_categories?.name ?? "Ders",
        goal: request.goal,
        studentLevel: request.student_level,
        acceptedAt: request.accepted_at,
      };
    });
}

export async function createTeacherCalendarLesson(input: CreateCalendarLessonInput) {
  const account = assertTeacher(await getCurrentAccount());
  const teacherProfile = await getTeacherProfileContext(account.id);
  const supabase = await createSupabaseServerClient();
  const [teacherStudentId, lessonCategoryId] = await Promise.all([
    ensureTeacherStudent(teacherProfile.id, input),
    getLessonCategoryIdBySlug(input.lessonSlug),
  ]);

  const { data, error } = await supabase
    .from("lessons")
    .insert({
      lesson_request_id: null,
      teacher_profile_id: teacherProfile.id,
      teacher_student_id: teacherStudentId,
      lesson_category_id: lessonCategoryId,
      delivery_mode: input.deliveryMode,
      scheduled_at: input.scheduledAt,
      duration_minutes: input.durationMinutes,
      price_amount: input.priceAmount || teacherProfile.hourlyPrice,
      currency: "TRY",
      notes: input.notes || null,
    })
    .select("id")
    .single();

  if (error) throw new CalendarError(error.message, 500);
  return { id: data.id };
}

export async function updateTeacherCalendarLesson(lessonId: string, input: UpdateCalendarLessonInput) {
  const account = assertTeacher(await getCurrentAccount());
  const teacherProfile = await getTeacherProfileContext(account.id);
  const supabase = await createSupabaseServerClient();
  const statusPatch =
    input.status === "cancelled"
      ? { cancelled_at: new Date().toISOString(), cancellation_reason: input.cancellationReason || null }
      : input.status === "completed"
        ? { completed_at: new Date().toISOString(), cancelled_at: null, cancellation_reason: null }
        : input.status
          ? { cancelled_at: null, cancellation_reason: null }
          : {};

  const { data, error } = await supabase
    .from("lessons")
    .update({
      ...(input.scheduledAt !== undefined ? { scheduled_at: input.scheduledAt } : {}),
      ...(input.durationMinutes !== undefined ? { duration_minutes: input.durationMinutes } : {}),
      ...(input.priceAmount !== undefined ? { price_amount: input.priceAmount } : {}),
      ...(input.deliveryMode ? { delivery_mode: input.deliveryMode } : {}),
      ...(input.status ? { status: input.status } : {}),
      ...(input.notes !== undefined ? { notes: input.notes || null } : {}),
      ...statusPatch,
    })
    .eq("id", lessonId)
    .eq("teacher_profile_id", teacherProfile.id)
    .select("id")
    .maybeSingle();

  if (error) throw new CalendarError(error.message, 500);
  if (!data) throw new CalendarError("Ders bulunamadı.", 404);
  return { id: data.id };
}
