export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type AvailabilityExceptionType = "available" | "unavailable";

export type AvailabilitySlot = {
  id?: string;
  weekday: Weekday;
  startHour: number;
  endHour: number;
};

export type AvailabilityException = {
  id?: string;
  date: string;
  type: AvailabilityExceptionType;
  startHour: number;
  endHour: number;
  note?: string | null;
};

export type TeacherAvailability = {
  weeklySlots: AvailabilitySlot[];
  exceptions: AvailabilityException[];
};

export type TeacherAvailabilityInput = TeacherAvailability;

export type AvailabilityFilter = {
  weekday?: Weekday;
  startHour?: number;
  endHour?: number;
};
