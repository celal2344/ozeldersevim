export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: "student" | "teacher" | "admin";
          full_name: string;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role: "student" | "teacher" | "admin";
          full_name: string;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      student_profiles: {
        Row: {
          profile_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          profile_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["student_profiles"]["Insert"]>;
      };
      teacher_eligibility_tests: {
        Row: {
          id: string;
          version: number;
          title: string;
          passing_score: number;
          question_count: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["teacher_eligibility_tests"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["teacher_eligibility_tests"]["Insert"]>;
      };
      teacher_eligibility_questions: {
        Row: {
          id: string;
          test_id: string;
          question_key: string;
          prompt: string;
          position: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["teacher_eligibility_questions"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["teacher_eligibility_questions"]["Insert"]>;
      };
      teacher_eligibility_choices: {
        Row: {
          id: string;
          question_id: string;
          choice_key: string;
          label: string;
          score: number;
          position: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["teacher_eligibility_choices"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["teacher_eligibility_choices"]["Insert"]>;
      };
      teacher_eligibility_attempts: {
        Row: {
          id: string;
          profile_id: string;
          test_id: string;
          status: "started" | "passed" | "failed" | "expired";
          score: number | null;
          started_at: string;
          submitted_at: string | null;
          expires_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["teacher_eligibility_attempts"]["Row"],
          "id" | "started_at" | "expires_at"
        > & {
          id?: string;
          started_at?: string;
          expires_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["teacher_eligibility_attempts"]["Insert"]>;
      };
      teacher_profiles: {
        Row: {
          id: string;
          profile_id: string;
          location_id: string;
          title: string | null;
          bio: string | null;
          education: string | null;
          experience_years: number | null;
          hourly_price: number;
          delivery_mode: "online" | "face_to_face" | "both";
          status: "draft" | "published" | "suspended";
          latitude: number | null;
          longitude: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["teacher_profiles"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["teacher_profiles"]["Insert"]>;
      };
      teacher_listings: {
        Row: {
          id: string;
          teacher_profile_id: string;
          slug: string;
          headline: string;
          short_bio: string | null;
          rating_average: number;
          review_count: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["teacher_listings"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["teacher_listings"]["Insert"]>;
      };
      teacher_lessons: {
        Row: {
          id: string;
          teacher_profile_id: string;
          lesson_category_id: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["teacher_lessons"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["teacher_lessons"]["Insert"]>;
      };
      locations: {
        Row: {
          id: string;
          city: string;
          district: string | null;
          latitude: number | null;
          longitude: number | null;
          slug: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["locations"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["locations"]["Insert"]>;
      };
      lesson_categories: {
        Row: {
          id: string;
          parent_id: string | null;
          name: string;
          slug: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["lesson_categories"]["Row"],
          "id" | "created_at"
        > & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["lesson_categories"]["Insert"]>;
      };
      lesson_requests: {
        Row: {
          id: string;
          student_profile_id: string;
          teacher_profile_id: string;
          lesson_category_id: string;
          location_id: string | null;
          status: "submitted" | "accepted" | "rejected" | "expired" | "cancelled";
          delivery_mode: "online" | "face_to_face" | "both";
          student_level: string | null;
          goal: string | null;
          budget_min: number | null;
          budget_max: number | null;
          contact_preference: "phone" | "site" | "both";
          consent_terms_at: string;
          consent_privacy_at: string;
          accepted_at: string | null;
          rejected_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["lesson_requests"]["Row"],
          "id" | "status" | "accepted_at" | "rejected_at" | "created_at" | "updated_at"
        > & {
          id?: string;
          status?: Database["public"]["Tables"]["lesson_requests"]["Row"]["status"];
          accepted_at?: string | null;
          rejected_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["lesson_requests"]["Insert"]>;
      };
      lesson_request_contacts: {
        Row: {
          lesson_request_id: string;
          student_name: string;
          email: string;
          phone: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["lesson_request_contacts"]["Row"],
          "created_at"
        > & {
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["lesson_request_contacts"]["Insert"]>;
      };
      reviews: {
        Row: {
          id: string;
          lesson_request_id: string;
          student_profile_id: string;
          teacher_profile_id: string;
          rating: number;
          comment: string | null;
          status: "pending" | "published" | "rejected" | "reported";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["reviews"]["Row"],
          "id" | "status" | "created_at" | "updated_at"
        > & {
          id?: string;
          status?: Database["public"]["Tables"]["reviews"]["Row"]["status"];
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      app_role: "student" | "teacher" | "admin";
      delivery_mode: "online" | "face_to_face" | "both";
      teacher_eligibility_status: "started" | "passed" | "failed" | "expired";
      teacher_profile_status: "draft" | "published" | "suspended";
      lesson_request_status: "submitted" | "accepted" | "rejected" | "expired" | "cancelled";
      lesson_status: "scheduled" | "completed" | "cancelled" | "no_show";
      review_status: "pending" | "published" | "rejected" | "reported";
      contact_preference: "phone" | "site" | "both";
    };
    CompositeTypes: Record<string, never>;
  };
};
