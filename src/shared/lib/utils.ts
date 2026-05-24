import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const turkishSlugCharacters: Record<string, string> = {
  ç: "c",
  Ç: "c",
  ğ: "g",
  Ğ: "g",
  ı: "i",
  I: "i",
  İ: "i",
  ö: "o",
  Ö: "o",
  ş: "s",
  Ş: "s",
  ü: "u",
  Ü: "u",
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toTurkishSlug(value: string) {
  return value
    .split("")
    .map((character) => turkishSlugCharacters[character] ?? character)
    .join("")
    .toLocaleLowerCase("tr-TR")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
