"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { EligibilityTest } from "@/features/teacher-eligibility/eligibility-test";
import { TeacherOnboardingForm } from "@/features/teachers/onboarding-form";

type Props = {
  hasPassed: boolean;
};

export function OgretmenOlFlow({ hasPassed }: Props) {
  const router = useRouter();
  const [passed, setPassed] = useState(hasPassed);

  function handlePassed() {
    setPassed(true);
    router.refresh();
  }

  if (passed) {
    return <TeacherOnboardingForm />;
  }

  return <EligibilityTest onPassed={handlePassed} />;
}
