/**
 * JANVISTA AI — Google Gemini Regional AI & Structured Extraction Engine
 * Powered 100% by Google Generative AI (gemini-1.5-flash)
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { fallbackExtractRequest, StructuredExtractionResult } from "./fallback";

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export interface GeminiMultilingualTranslationResult {
  originalText: string;
  detectedLanguage: string;
  englishTranslation: string;
  hindiTranslation: string;
  extractedEntities: string[];
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

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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

Citizen Request Text: "${text}"
Input Language Code: "${language}"

Return ONLY valid raw JSON without markdown markers.
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJson) as StructuredExtractionResult;
  } catch (error) {
    console.warn("[GOOGLE GEMINI AI] Exception or missing API key, using deterministic fallback:", error);
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

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJson) as GeminiMultilingualTranslationResult;
  } catch (err) {
    console.warn("[GOOGLE GEMINI TRANSLATION] Error during translation:", err);
    return defaultResult;
  }
}
