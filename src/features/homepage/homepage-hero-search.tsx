"use client";

import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { LessonCategoryOption } from "@/features/teacher-listings/types";
import { PremiumSelect } from "@/shared/components/ui/premium-select";

export function HomepageHeroSearch({ lessons }: { lessons: LessonCategoryOption[] }) {
  const router = useRouter();
  const [lesson, setLesson] = useState("");
  const options = [
    { value: "", label: "Ders seç" },
    ...lessons.map((item) => ({ value: item.slug, label: item.name })),
  ];

  return (
    <div className="flex w-full max-w-2xl flex-col gap-3 sm:flex-row">
      <PremiumSelect
        value={lesson}
        onChange={setLesson}
        options={options}
        variant="dark"
        className="h-12 flex-1 rounded-xl text-base"
      />
      <button
        type="button"
        onClick={() => router.push(`/ogretmen-bul${lesson ? `?lesson=${lesson}` : ""}`)}
        className="flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-orange px-6 text-sm font-semibold text-white shadow-lg shadow-orange-900/30 transition-all hover:scale-[1.02] hover:bg-orange-400 active:scale-[0.98]"
      >
        <SearchIcon className="size-4" aria-hidden="true" />
        Öğretmen Ara
      </button>
    </div>
  );
}
