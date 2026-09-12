import { CitizenRequest, InfrastructureCategory, UrgencyLevel } from "@/types";

export interface StructuredExtractionResult {
  category: InfrastructureCategory;
  issue: string;
  infrastructureType: string;
  locationName: string;
  urgency: UrgencyLevel;
  intent: "development_request" | "grievance" | "inquiry";
  confidence: number;
  extractedEntities: string[];
  summary: string;
}

export function fallbackExtractRequest(
  text: string,
  detectedLanguage: string = "hi"
): StructuredExtractionResult {
  const lower = text.toLowerCase();

  let category: InfrastructureCategory = "healthcare";
  let infrastructureType = "hospital";

  if (lower.includes("पानी") || lower.includes("water") || lower.includes("pipe") || lower.includes("குடிநீர்")) {
    category = "water_sanitation";
    infrastructureType = "water_pipeline";
  } else if (lower.includes("सड़क") || lower.includes("road") || lower.includes("bridge") || lower.includes("பூர்")) {
    category = "transportation";
    infrastructureType = "road_network";
  } else if (lower.includes("स्कूल") || lower.includes("school") || lower.includes("college") || lower.includes("शिक्षा")) {
    category = "education";
    infrastructureType = "primary_school";
  } else if (lower.includes("बिजली") || lower.includes("power") || lower.includes("electricity") || lower.includes("grid")) {
    category = "energy";
    infrastructureType = "solar_microgrid";
  }

  let urgency: UrgencyLevel = "medium";
  if (lower.includes("इमरजेंसी") || lower.includes("emergency") || lower.includes("मरीज") || lower.includes("मौत") || lower.includes("critical")) {
    urgency = "critical";
  } else if (lower.includes("खराब") || lower.includes("urgent") || lower.includes("दूर") || lower.includes("बड़ी परेशानी")) {
    urgency = "high";
  }

  return {
    category,
    issue: `${category}_accessibility_deficit`,
    infrastructureType,
    locationName: "Sitapur District, Uttar Pradesh",
    urgency,
    intent: "development_request",
    confidence: 0.88,
    extractedEntities: [category, infrastructureType, urgency],
    summary: `Structured citizen request extracted for ${category} infrastructure. Urgency: ${urgency}.`,
  };
}
