import { getCurrentAccount } from "@/features/auth/service";
import type { TeacherAvailability, TeacherAvailabilityInput } from "@/features/availability/types";
import {
  sortAvailabilityExceptions,
  sortAvailabilitySlots,
  validateAvailability,
} from "@/features/availability/utils";
import { createSupabaseServerClient } from "@/shared/db/supabase/server";

export class AvailabilityError extends Error {
  constructor(
    message: string,
    public status = 400
  ) {
    super(message);
  }
}

function emptyTeacherAvailability(): TeacherAvailability {
  return {
    weeklySlots: [],
    exceptions: [],
  };
}

export async function requireTeacherAccountId() {
  const account = await getCurrentAccount();

  if (!account) {
    throw new AvailabilityError("Müsaitlik yönetimi için giriş yapmalısın.", 401);
  }

  if (account.role !== "teacher") {
    throw new AvailabilityError("Müsaitlik yalnızca öğretmen hesapları tarafından yönetilebilir.", 403);
  }

  return account.id;
}

export async function getTeacherAvailabilityByProfileId(profileId: string): Promise<TeacherAvailability> {
  const supabase = await createSupabaseServerClient();
  const [{ data: weeklySlots, error: weeklyError }, { data: exceptions, error: exceptionError }] =
    await Promise.all([
      supabase
        .from("teacher_availability_weekly_slots")
        .select("id,weekday,start_hour,end_hour")
        .eq("profile_id", profileId)
        .order("weekday", { ascending: true })
        .order("start_hour", { ascending: true }),
      supabase
        .from("teacher_availability_exceptions")
        .select("id,exception_date,exception_type,start_hour,end_hour,note")
        .eq("profile_id", profileId)
        .order("exception_date", { ascending: true })
        .order("start_hour", { ascending: true }),
    ]);

  if (weeklyError) throw new AvailabilityError(weeklyError.message, 500);
  if (exceptionError) throw new AvailabilityError(exceptionError.message, 500);

  return {
    weeklySlots: (weeklySlots ?? []).map((slot) => ({
      id: slot.id,
      weekday: slot.weekday,
      startHour: slot.start_hour,
      endHour: slot.end_hour,
    })),
    exceptions: (exceptions ?? []).map((exception) => ({
      id: exception.id,
      date: exception.exception_date,
      type: exception.exception_type,
      startHour: exception.start_hour,
      endHour: exception.end_hour,
      note: exception.note,
    })),
  };
}

export async function getTeacherAvailabilityByProfileIds(profileIds: string[]) {
  const uniqueProfileIds = [...new Set(profileIds)];
  const availabilityByProfileId = new Map<string, TeacherAvailability>();

  if (!uniqueProfileIds.length) return availabilityByProfileId;

  const supabase = await createSupabaseServerClient();
  const [{ data: weeklySlots, error: weeklyError }, { data: exceptions, error: exceptionError }] =
    await Promise.all([
      supabase
        .from("teacher_availability_weekly_slots")
        .select("profile_id,id,weekday,start_hour,end_hour")
        .in("profile_id", uniqueProfileIds)
        .order("weekday", { ascending: true })
        .order("start_hour", { ascending: true }),
      supabase
        .from("teacher_availability_exceptions")
        .select("profile_id,id,exception_date,exception_type,start_hour,end_hour,note")
        .in("profile_id", uniqueProfileIds)
        .order("exception_date", { ascending: true })
        .order("start_hour", { ascending: true }),
    ]);

  if (weeklyError) throw new AvailabilityError(weeklyError.message, 500);
  if (exceptionError) throw new AvailabilityError(exceptionError.message, 500);

  for (const profileId of uniqueProfileIds) {
    availabilityByProfileId.set(profileId, emptyTeacherAvailability());
  }

  for (const slot of weeklySlots ?? []) {
    const availability = availabilityByProfileId.get(slot.profile_id) ?? emptyTeacherAvailability();
    availability.weeklySlots = [
      ...availability.weeklySlots,
      {
        id: slot.id,
        weekday: slot.weekday,
        startHour: slot.start_hour,
        endHour: slot.end_hour,
      },
    ];
    availabilityByProfileId.set(slot.profile_id, availability);
  }

  for (const exception of exceptions ?? []) {
    const availability = availabilityByProfileId.get(exception.profile_id) ?? emptyTeacherAvailability();
    availability.exceptions = [
      ...availability.exceptions,
      {
        id: exception.id,
        date: exception.exception_date,
        type: exception.exception_type,
        startHour: exception.start_hour,
        endHour: exception.end_hour,
        note: exception.note,
      },
    ];
    availabilityByProfileId.set(exception.profile_id, availability);
  }

  return availabilityByProfileId;
}

export async function getOwnTeacherAvailability() {
  const profileId = await requireTeacherAccountId();
  return getTeacherAvailabilityByProfileId(profileId);
}

export async function saveOwnTeacherAvailability(input: TeacherAvailabilityInput) {
  const profileId = await requireTeacherAccountId();
  const errors = validateAvailability(input);

  if (errors.length > 0) {
    throw new AvailabilityError(errors[0], 400);
  }

  const supabase = await createSupabaseServerClient();
  const [deleteWeekly, deleteExceptions] = await Promise.all([
    supabase.from("teacher_availability_weekly_slots").delete().eq("profile_id", profileId),
    supabase.from("teacher_availability_exceptions").delete().eq("profile_id", profileId),
  ]);

  if (deleteWeekly.error) throw new AvailabilityError(deleteWeekly.error.message, 500);
  if (deleteExceptions.error) throw new AvailabilityError(deleteExceptions.error.message, 500);

  const weeklySlots = sortAvailabilitySlots(input.weeklySlots);
  const exceptions = sortAvailabilityExceptions(input.exceptions);

  if (weeklySlots.length > 0) {
    const { error } = await supabase.from("teacher_availability_weekly_slots").insert(
      weeklySlots.map((slot) => ({
        profile_id: profileId,
        weekday: slot.weekday,
        start_hour: slot.startHour,
        end_hour: slot.endHour,
      }))
    );

    if (error) throw new AvailabilityError(error.message, 500);
  }

  if (exceptions.length > 0) {
    const { error } = await supabase.from("teacher_availability_exceptions").insert(
      exceptions.map((exception) => ({
        profile_id: profileId,
        exception_date: exception.date,
        exception_type: exception.type,
        start_hour: exception.startHour,
        end_hour: exception.endHour,
        note: exception.note || null,
      }))
    );

    if (error) throw new AvailabilityError(error.message, 500);
  }

  return getTeacherAvailabilityByProfileId(profileId);
}
