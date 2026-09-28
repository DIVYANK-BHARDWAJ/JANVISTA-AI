/**
 * JANVISTA AI — Google Gemini Regional AI & Structured Extraction Engine
 * Powered 100% by Google Generative AI Cascade (gemini-2.0-flash -> gemini-1.5-flash-8b -> gemini-1.5-flash)
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { fallbackExtractRequest, StructuredExtractionResult } from "./fallback";

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Multi-model fallback cascade to maximize free tier rate limits and performance
const MODEL_CASCADE = ["gemini-2.0-flash", "gemini-1.5-flash-8b", "gemini-1.5-flash"];

export interface GeminiMultilingualTranslationResult {
  originalText: string;
  detectedLanguage: string;
  englishTranslation: string;
  hindiTranslation: string;
  extractedEntities: string[];
}

/**
 * Execute Gemini prompt with automatic model cascade fallback
 */
async function generateWithGeminiCascade(prompt: string): Promise<string> {
  if (!genAI || !apiKey) {
    throw new Error("No Gemini API key configured.");
  }

  let lastError: any = null;
  for (const modelName of MODEL_CASCADE) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (text) return text;
    } catch (err: any) {
      console.warn(`[GEMINI CASCADE] Model ${modelName} failed or rate limited, falling back:`, err?.message || err);
      lastError = err;
    }
  }
  throw lastError || new Error("All Gemini cascade models failed.");
}

/**
 * Extract structured citizen request intent & entities using Google Gemini AI
 */
export async function extractCitizenRequestWithGemini(
  text: string,
  language: string = "hi"
): Promise<StructuredExtractionResult> {
  if (!genAI || !apiKey) {
    return fallbackExtractRequest(text, language);
  }

  const prompt = `
You are the JANVISTA AI Citizen Intelligence Engine developed by Google.
Analyze the following regional Indian language citizen request and extract structured JSON matching this schema:
{
  "category": "healthcare" | "education" | "transportation" | "water_sanitation" | "energy" | "digital_infra",
  "issue": string,
  "infrastructureType": string,
  "locationName": string,
  "urgency": "low" | "medium" | "high" | "critical",
  "intent": "development_request" | "grievance" | "inquiry",
  "confidence": number between 0 and 1,
  "extractedEntities": string[],
  "summary": string
}

IMPORTANT CATEGORY CLASSIFICATION RULES:
1. "transportation": Potholes, road damage, potholes in Hindi ("गड्ढे", "गड्ढा", "गड्डा"), road ("सड़क", "रास्ता"), traffic, bridges ("पुल", "फ्лайओवर").
2. "water_sanitation": Water supply ("पानी", "जल"), pipe leaks ("पाइपलाइन"), sewage ("सीवर", "नाली").
3. "education": School ("स्कूल"), college ("कॉलेज"), teachers, education ("शिक्षा").
4. "energy": Electricity ("बिजली"), power outage, transformer ("ट्रांसफॉर्मर").
5. "healthcare": Hospital ("अस्पताल"), doctor, medicines ("दवा"), disease, patients.
6. "digital_infra": Internet, mobile network ("नेटवर्क", "टावर", "इंटरनेट").

Citizen Request Text: "${text}"
Input Language Code: "${language}"

Return ONLY valid raw JSON without markdown markers.
`;

  try {
    const responseText = await generateWithGeminiCascade(prompt);
    const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJson) as StructuredExtractionResult;
  } catch (error) {
    console.warn("[GOOGLE GEMINI AI] All models in cascade failed or exhausted, using deterministic fallback:", error);
    return fallbackExtractRequest(text, language);
  }
}

/**
 * Translate and normalize regional Indian language input using Google Gemini AI
 */
export async function translateRegionalLanguageWithGemini(
  text: string,
  sourceLang: string = "hi"
): Promise<GeminiMultilingualTranslationResult> {
  const defaultResult: GeminiMultilingualTranslationResult = {
    originalText: text,
    detectedLanguage: sourceLang,
    englishTranslation: text,
    hindiTranslation: text,
    extractedEntities: [],
  };

  if (!genAI || !apiKey) {
    return defaultResult;
  }

  const prompt = `
You are the Google Gemini Regional Language Intelligence Model.
Translate the following citizen prompt into standard English and Hindi, and extract key location/infrastructure entities.

Source Text: "${text}"
Language Code: "${sourceLang}"

Respond ONLY with valid JSON in this exact structure:
{
  "originalText": string,
  "detectedLanguage": string,
  "englishTranslation": string,
  "hindiTranslation": string,
  "extractedEntities": string[]
}
`;

  try {
    const responseText = await generateWithGeminiCascade(prompt);
    const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJson) as GeminiMultilingualTranslationResult;
  } catch (err) {
    console.warn("[GOOGLE GEMINI TRANSLATION] Error during translation cascade:", err);
    return defaultResult;
  }
}
