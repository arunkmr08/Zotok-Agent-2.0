import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toggleDark() {
  const root = document.documentElement;
  root.classList.add("theme-transitioning");
  const isDark = root.classList.toggle("dark");
  localStorage.setItem("zotok_dark", String(isDark));
  setTimeout(() => root.classList.remove("theme-transitioning"), 400);
}
