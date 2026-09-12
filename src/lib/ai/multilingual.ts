import { SUPPORTED_LANGUAGES } from "@/config/priority-weights";

export function detectLanguage(text: string): { code: string; name: string } {
  const lower = text.toLowerCase();

  if (/[\u0900-\u097F]/.test(text)) return { code: "hi", name: "Hindi" };
  if (/[\u0B80-\u0BFF]/.test(text)) return { code: "ta", name: "Tamil" };
  if (/[\u0980-\u09FF]/.test(text)) return { code: "bn", name: "Bengali" };
  if (/[\u0C00-\u0C7F]/.test(text)) return { code: "te", name: "Telugu" };
  if (lower.includes("அா") || lower.includes("தமிழ்")) return { code: "ta", name: "Tamil" };

  return { code: "en", name: "English" };
}
