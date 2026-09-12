import { GoogleGenerativeAI } from "@google/generative-ai";
import { fallbackExtractRequest, StructuredExtractionResult } from "./fallback";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

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
You are the JANVISTA AI Citizen Intelligence Engine. Analyze the following citizen development request and extract structured JSON matching this schema:
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

Citizen Request: "${text}"
Detected Language: "${language}"

Return ONLY valid raw JSON.
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJson) as StructuredExtractionResult;
  } catch (error) {
    console.warn("[GEMINI AI] Exception or missing API key, falling back to deterministic extraction:", error);
    return fallbackExtractRequest(text, language);
  }
}
