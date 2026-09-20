/**
 * JANVISTA AI — Regional Language Detection Engine
 * Detects 10+ Indian regional languages and scripts.
 */

export function detectLanguage(text: string): { code: string; name: string } {
  // Devanagari (Hindi, Marathi, Nepali)
  if (/[\u0900-\u097F]/.test(text)) {
    if (text.includes("आहे") || text.includes("पूल") || text.includes("गावात") || text.includes("पावसाळ्यात")) {
      return { code: "mr", name: "Marathi" };
    }
    return { code: "hi", name: "Hindi" };
  }

  // Tamil script
  if (/[\u0B80-\u0BFF]/.test(text)) return { code: "ta", name: "Tamil" };

  // Bengali / Assamese script
  if (/[\u0980-\u09FF]/.test(text)) return { code: "bn", name: "Bengali" };

  // Telugu script
  if (/[\u0C00-\u0C7F]/.test(text)) return { code: "te", name: "Telugu" };

  // Kannada script
  if (/[\u0C80-\u0CFF]/.test(text)) return { code: "kn", name: "Kannada" };

  // Gujarati script
  if (/[\u0A80-\u0AFF]/.test(text)) return { code: "gu", name: "Gujarati" };

  // Gurmukhi (Punjabi) script
  if (/[\u0A00-\u0A7F]/.test(text)) return { code: "pa", name: "Punjabi" };

  // Malayalam script
  if (/[\u0D00-\u0D7F]/.test(text)) return { code: "ml", name: "Malayalam" };

  // Odia script
  if (/[\u0B00-\u0B7F]/.test(text)) return { code: "or", name: "Odia" };

  return { code: "en", name: "English" };
}
