import type { z } from "zod";

import type { loginSchema, studentRegisterSchema, teacherRegisterSchema } from "@/features/auth/constants";

export type LoginFormValues = z.infer<typeof loginSchema>;
export type StudentRegisterFormValues = z.infer<typeof studentRegisterSchema>;
export type TeacherRegisterFormValues = z.infer<typeof teacherRegisterSchema>;

export type RegisterRole = "student" | "teacher";
