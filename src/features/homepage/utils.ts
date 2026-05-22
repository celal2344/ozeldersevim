export function initialsFromName(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

export function lessonSearchHref(lessonName: string) {
  return `/ogretmen-bul?lesson=${encodeURIComponent(lessonName.toLocaleLowerCase("tr-TR"))}`;
}
