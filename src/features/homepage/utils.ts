export function initialsFromName(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

const lessonToSlug: Record<string, string> = {
  matematik: "matematik",
  fizik: "fizik",
  kimya: "kimya",
  "i̇ngilizce": "ingilizce",
  ingilizce: "ingilizce",
  yazılım: "yazilim",
  yazilim: "yazilim",
  "tyt / ayt": "tyt-ayt",
  "lgs": "lgs",
};

export function lessonSearchHref(lessonName: string) {
  const key = lessonName.toLocaleLowerCase("tr-TR");
  const slug = lessonToSlug[key];
  return slug ? `/ozel-ders/${slug}` : `/ogretmen-bul?lesson=${encodeURIComponent(key)}`;
}
