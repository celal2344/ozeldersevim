import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TeacherProfileView } from "@/features/teachers/teacher-profile-view";
import { getTeacherProfileBySlug, getTeacherProfileSlugs } from "@/features/teachers/service";
import { teacherProfileJsonLd } from "@/features/teachers/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getTeacherProfileSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const teacher = await getTeacherProfileBySlug(slug);

  if (!teacher) {
    return {
      title: "Öğretmen Bulunamadı",
    };
  }

  return {
    title: `${teacher.fullName} - ${teacher.headline}`,
    description: teacher.shortBio,
    alternates: {
      canonical: `/ogretmen/${teacher.slug}`,
    },
  };
}

export default async function TeacherProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const teacher = await getTeacherProfileBySlug(slug);

  if (!teacher) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(teacherProfileJsonLd(teacher)) }}
      />
      <TeacherProfileView teacher={teacher} />
    </>
  );
}
