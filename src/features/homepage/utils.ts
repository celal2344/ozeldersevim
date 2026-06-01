import { AtomIcon, BookOpenIcon, Code2Icon, FlaskConicalIcon, GraduationCapIcon, LanguagesIcon } from "lucide-react";

export function initialsFromName(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

export function lessonSearchHref(lessonName: string) {
  return `/ogretmen-bul?lesson=${encodeURIComponent(lessonName.toLocaleLowerCase("tr-TR"))}`;
}

export function homepageLessonIcon(name: string) {
  const normalized = name.toLocaleLowerCase("tr-TR");

  if (normalized.includes("fizik")) return AtomIcon;
  if (normalized.includes("kimya")) return FlaskConicalIcon;
  if (normalized.includes("ingilizce")) return LanguagesIcon;
  if (normalized.includes("yazılım") || normalized.includes("yazilim")) return Code2Icon;
  if (normalized.includes("tyt") || normalized.includes("ayt") || normalized.includes("lgs")) return GraduationCapIcon;

  return BookOpenIcon;
}
