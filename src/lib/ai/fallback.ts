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

  let category: InfrastructureCategory = "transportation";
  let infrastructureType = "road_network";

  // 1. Water & Sanitation
  if (
    lower.includes("पानी") || lower.includes("water") || lower.includes("pipe") || lower.includes("पाइप") ||
    lower.includes("कुडीनीर") || lower.includes("सीवर") || lower.includes("नाली") || lower.includes("जल") ||
    lower.includes("ड्रैनेज") || lower.includes("drainage") || lower.includes("sewage") || lower.includes("குடிநீர்")
  ) {
    category = "water_sanitation";
    infrastructureType = "water_pipeline";
  }
  // 2. Transportation & Roads (Potholes, bridges, traffic)
  else if (
    lower.includes("गड्ढे") || lower.includes("गड्ढा") || lower.includes("गड्डा") || lower.includes("गड्ढों") ||
    lower.includes("pothole") || lower.includes("potholes") || lower.includes("सड़क") || lower.includes("रास्ता") ||
    lower.includes("road") || lower.includes("bridge") || lower.includes("kaccha") || lower.includes("landslide") ||
    lower.includes("accident") || lower.includes("traffic") || lower.includes("जाम") || lower.includes("पुल") ||
    lower.includes("खड्ड") || lower.includes("साले") || lower.includes("சாலைய")
  ) {
    category = "transportation";
    infrastructureType = lower.includes("गड्ढे") || lower.includes("pothole") ? "pothole_repair" : "road_network";
  }
  // 3. Education
  else if (
    lower.includes("स्कूल") || lower.includes("school") || lower.includes("college") || lower.includes("शिक्षा") ||
    lower.includes("शिक्षक") || lower.includes("पढ़ाई") || lower.includes("विद्यार्थी") || lower.includes("பள்ளி")
  ) {
    category = "education";
    infrastructureType = "primary_school";
  }
  // 4. Energy & Electricity
  else if (
    lower.includes("बिजली") || lower.includes("power") || lower.includes("electricity") || lower.includes("grid") ||
    lower.includes("ट्रांसफॉर्मर") || lower.includes("कटौती") || lower.includes("तार") || lower.includes("मीटर") || lower.includes("மின்சாரம்")
  ) {
    category = "energy";
    infrastructureType = "solar_microgrid";
  }
  // 5. Healthcare
  else if (
    lower.includes("अस्पताल") || lower.includes("hospital") || lower.includes("डॉक्टर") || lower.includes("दवा") ||
    lower.includes("इलाज") || lower.includes("मरीज") || lower.includes("स्वास्थ्य") || lower.includes("clinics") || lower.includes("மருத்துவமனை")
  ) {
    category = "healthcare";
    infrastructureType = "sub_divisional_hospital";
  }
  // 6. Digital Infra
  else if (
    lower.includes("इंटरनेट") || lower.includes("internet") || lower.includes("fiber") || lower.includes("टावर") ||
    lower.includes("नेटवर्क") || lower.includes("broadband") || lower.includes("wifi")
  ) {
    category = "digital_infra";
    infrastructureType = "telecom_fiber";
  }

  let urgency: UrgencyLevel = "medium";
  if (
    lower.includes("इमरजेंसी") || lower.includes("emergency") || lower.includes("मरीज") || lower.includes("मौत") ||
    lower.includes("critical") || lower.includes("landslide") || lower.includes("accident") || lower.includes("serious") ||
    lower.includes("गंभीर") || lower.includes("हादसा")
  ) {
    urgency = "critical";
  } else if (
    lower.includes("खराब") || lower.includes("urgent") || lower.includes("दूर") || lower.includes("बड़ी परेशानी") ||
    lower.includes("kaccha") || lower.includes("बहुत सारे") || lower.includes("गड्ढे")
  ) {
    urgency = "high";
  }

  // Dynamic location extraction if text mentions known locations
  let extractedLocation = "";
  const locationMatches = text.match(/(?:in|at|near|from|ward|village|district|taluk|tehsil|nagar|layout|यहाँ|यहाँ पर)\s+([A-Z][a-z0-9_\-\s]+)/i);
  if (locationMatches && locationMatches[1]) {
    extractedLocation = locationMatches[1].trim();
  }

  return {
    category,
    issue: `${category}_accessibility_deficit`,
    infrastructureType,
    locationName: extractedLocation || "Local Area",
    urgency,
    intent: "grievance",
    confidence: 0.92,
    extractedEntities: [category, infrastructureType, urgency].concat(extractedLocation ? [extractedLocation] : []),
    summary: `Structured citizen request extracted for ${category} (${infrastructureType}). Urgency: ${urgency}.`,
  };
}
