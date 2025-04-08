import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAnalysisText(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1") // Remove ** but keep the text
    .replace(/\n\n+/g, "\n") // Replace multiple newlines with single
    .replace(/•/g, "-") // Replace bullets with dashes
    .replace(/\[.*?\]/g, "") // Remove placeholder brackets
    .replace(/- +/g, "- ") // Normalize spacing after list items
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line) // Remove empty lines
    .join("\n");
}
