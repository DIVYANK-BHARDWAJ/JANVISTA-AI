import { AdministrativeRegion, DemographicProfile, LocationCoordinates } from "@/types";

export interface KnownDistrictGeo {
  district: string;
  state: string;
  id: string;
  coordinates: LocationCoordinates;
  population: number;
  vulnerabilityIndex: number;
  accessibilityIndex: number;
  demographics: DemographicProfile;
}

export const KNOWN_DISTRICTS: KnownDistrictGeo[] = [
  // --- HARYANA ---
  {
    district: "Gurugram",
    state: "Haryana",
    id: "reg-gurugram-hr",
    coordinates: { latitude: 28.4595, longitude: 77.0266 },
    population: 1514432,
    vulnerabilityIndex: 42,
    accessibilityIndex: 88,
    demographics: {
      literacyRate: 84.7,
      scStPercentage: 13.1,
      bplPercentage: 11.2,
      genderRatio: 854,
      workforceParticipation: 46.2,
      ruralPopulationPercentage: 31.2,
      medianAge: 29,
      primaryLanguages: ["Hindi", "Haryanvi", "English"],
    },
  },
  {
    district: "Ambala",
    state: "Haryana",
    id: "reg-ambala-hr",
    coordinates: { latitude: 30.3782, longitude: 76.7767 },
    population: 1128350,
    vulnerabilityIndex: 54,
    accessibilityIndex: 72,
    demographics: {
      literacyRate: 81.7,
      scStPercentage: 26.2,
      bplPercentage: 16.4,
      genderRatio: 885,
      workforceParticipation: 38.5,
      ruralPopulationPercentage: 55.6,
      medianAge: 28,
      primaryLanguages: ["Hindi", "Haryanvi", "Punjabi"],
    },
  },
  {
    district: "Faridabad",
    state: "Haryana",
    id: "reg-faridabad-hr",
    coordinates: { latitude: 28.4089, longitude: 77.3178 },
    population: 1809733,
    vulnerabilityIndex: 58,
    accessibilityIndex: 81,
    demographics: {
      literacyRate: 81.7,
      scStPercentage: 12.4,
      bplPercentage: 18.2,
      genderRatio: 873,
      workforceParticipation: 40.1,
      ruralPopulationPercentage: 20.5,
      medianAge: 27,
      primaryLanguages: ["Hindi", "Haryanvi"],
    },
  },
  {
    district: "Rohtak",
    state: "Haryana",
    id: "reg-rohtak-hr",
    coordinates: { latitude: 28.8955, longitude: 76.6066 },
    population: 1061204,
    vulnerabilityIndex: 61,
    accessibilityIndex: 69,
    demographics: {
      literacyRate: 80.2,
      scStPercentage: 20.8,
      bplPercentage: 21.5,
      genderRatio: 867,
      workforceParticipation: 37.8,
      ruralPopulationPercentage: 58.0,
      medianAge: 27,
      primaryLanguages: ["Hindi", "Haryanvi"],
    },
  },
  {
    district: "Hisar",
    state: "Haryana",
    id: "reg-hisar-hr",
    coordinates: { latitude: 29.1492, longitude: 75.7217 },
    population: 1743931,
    vulnerabilityIndex: 65,
    accessibilityIndex: 64,
    demographics: {
      literacyRate: 72.9,
      scStPercentage: 23.4,
      bplPercentage: 24.8,
      genderRatio: 872,
      workforceParticipation: 39.2,
      ruralPopulationPercentage: 68.3,
      medianAge: 26,
      primaryLanguages: ["Hindi", "Haryanvi"],
    },
  },
  {
    district: "Panipat",
    state: "Haryana",
    id: "reg-panipat-hr",
    coordinates: { latitude: 29.3909, longitude: 76.9635 },
    population: 1205437,
    vulnerabilityIndex: 59,
    accessibilityIndex: 74,
    demographics: {
      literacyRate: 75.9,
      scStPercentage: 16.2,
      bplPercentage: 19.5,
      genderRatio: 864,
      workforceParticipation: 41.0,
      ruralPopulationPercentage: 53.9,
      medianAge: 27,
      primaryLanguages: ["Hindi", "Haryanvi"],
    },
  },
  {
    district: "Karnal",
    state: "Haryana",
    id: "reg-karnal-hr",
    coordinates: { latitude: 29.6857, longitude: 76.9905 },
    population: 1505324,
    vulnerabilityIndex: 56,
    accessibilityIndex: 71,
    demographics: {
      literacyRate: 74.7,
      scStPercentage: 22.5,
      bplPercentage: 17.8,
      genderRatio: 887,
      workforceParticipation: 38.9,
      ruralPopulationPercentage: 69.8,
      medianAge: 27,
      primaryLanguages: ["Hindi", "Haryanvi", "Punjabi"],
    },
  },

  // --- UTTAR PRADESH ---
  {
    district: "Sitapur",
    state: "Uttar Pradesh",
    id: "reg-sitapur-up",
    coordinates: { latitude: 27.5700, longitude: 80.6600 },
    population: 4483900,
    vulnerabilityIndex: 81,
    accessibilityIndex: 32,
    demographics: {
      literacyRate: 61.1,
      scStPercentage: 32.3,
      bplPercentage: 42.1,
      genderRatio: 888,
      workforceParticipation: 34.6,
      ruralPopulationPercentage: 88.2,
      medianAge: 24,
      primaryLanguages: ["Hindi", "Awadhi"],
    },
  },
  {
    district: "Lucknow",
    state: "Uttar Pradesh",
    id: "reg-lucknow-up",
    coordinates: { latitude: 26.8467, longitude: 80.9462 },
    population: 4589838,
    vulnerabilityIndex: 48,
    accessibilityIndex: 86,
    demographics: {
      literacyRate: 77.3,
      scStPercentage: 21.3,
      bplPercentage: 18.9,
      genderRatio: 917,
      workforceParticipation: 33.2,
      ruralPopulationPercentage: 33.7,
      medianAge: 28,
      primaryLanguages: ["Hindi", "Urdu"],
    },
  },
  {
    district: "Varanasi",
    state: "Uttar Pradesh",
    id: "reg-varanasi-up",
    coordinates: { latitude: 25.3176, longitude: 82.9739 },
    population: 3676841,
    vulnerabilityIndex: 68,
    accessibilityIndex: 65,
    demographics: {
      literacyRate: 75.6,
      scStPercentage: 13.2,
      bplPercentage: 29.4,
      genderRatio: 913,
      workforceParticipation: 35.1,
      ruralPopulationPercentage: 56.6,
      medianAge: 26,
      primaryLanguages: ["Hindi", "Bhojpuri"],
    },
  },

  // --- BIHAR ---
  {
    district: "Muzaffarpur",
    state: "Bihar",
    id: "reg-muzaffarpur-br",
    coordinates: { latitude: 26.1209, longitude: 85.3647 },
    population: 4801000,
    vulnerabilityIndex: 85,
    accessibilityIndex: 38,
    demographics: {
      literacyRate: 63.4,
      scStPercentage: 15.7,
      bplPercentage: 46.8,
      genderRatio: 900,
      workforceParticipation: 31.8,
      ruralPopulationPercentage: 90.1,
      medianAge: 23,
      primaryLanguages: ["Hindi", "Maithili", "Bhojpuri"],
    },
  },
  {
    district: "Patna",
    state: "Bihar",
    id: "reg-patna-br",
    coordinates: { latitude: 25.5941, longitude: 85.1376 },
    population: 5838465,
    vulnerabilityIndex: 62,
    accessibilityIndex: 78,
    demographics: {
      literacyRate: 70.7,
      scStPercentage: 15.8,
      bplPercentage: 28.6,
      genderRatio: 897,
      workforceParticipation: 32.5,
      ruralPopulationPercentage: 56.2,
      medianAge: 26,
      primaryLanguages: ["Hindi", "Magahi"],
    },
  },

  // --- MAHARASHTRA ---
  {
    district: "Gadchiroli",
    state: "Maharashtra",
    id: "reg-gadchiroli-mh",
    coordinates: { latitude: 20.1849, longitude: 79.9958 },
    population: 1072942,
    vulnerabilityIndex: 78,
    accessibilityIndex: 24,
    demographics: {
      literacyRate: 74.4,
      scStPercentage: 38.7,
      bplPercentage: 39.2,
      genderRatio: 982,
      workforceParticipation: 49.6,
      ruralPopulationPercentage: 89.0,
      medianAge: 27,
      primaryLanguages: ["Marathi", "Gondi"],
    },
  },
  {
    district: "Mumbai",
    state: "Maharashtra",
    id: "reg-mumbai-mh",
    coordinates: { latitude: 19.0760, longitude: 72.8777 },
    population: 12442373,
    vulnerabilityIndex: 38,
    accessibilityIndex: 94,
    demographics: {
      literacyRate: 89.2,
      scStPercentage: 6.4,
      bplPercentage: 12.3,
      genderRatio: 832,
      workforceParticipation: 45.8,
      ruralPopulationPercentage: 0.0,
      medianAge: 31,
      primaryLanguages: ["Marathi", "Hindi", "English"],
    },
  },

  // --- RAJASTHAN ---
  {
    district: "Jaipur",
    state: "Rajasthan",
    id: "reg-jaipur-rj",
    coordinates: { latitude: 26.9124, longitude: 75.7873 },
    population: 6626178,
    vulnerabilityIndex: 58,
    accessibilityIndex: 82,
    demographics: {
      literacyRate: 75.5,
      scStPercentage: 22.8,
      bplPercentage: 19.2,
      genderRatio: 910,
      workforceParticipation: 37.4,
      ruralPopulationPercentage: 47.6,
      medianAge: 27,
      primaryLanguages: ["Hindi", "Rajasthani"],
    },
  },

  // --- PUNJAB ---
  {
    district: "Ludhiana",
    state: "Punjab",
    id: "reg-ludhiana-pb",
    coordinates: { latitude: 30.9010, longitude: 75.8573 },
    population: 3498739,
    vulnerabilityIndex: 49,
    accessibilityIndex: 85,
    demographics: {
      literacyRate: 82.2,
      scStPercentage: 26.5,
      bplPercentage: 14.1,
      genderRatio: 873,
      workforceParticipation: 37.2,
      ruralPopulationPercentage: 40.8,
      medianAge: 29,
      primaryLanguages: ["Punjabi", "Hindi"],
    },
  },

  // --- KARNATAKA ---
  {
    district: "Bengaluru Urban",
    state: "Karnataka",
    id: "reg-bengaluru-ka",
    coordinates: { latitude: 12.9716, longitude: 77.5946 },
    population: 9621551,
    vulnerabilityIndex: 34,
    accessibilityIndex: 96,
    demographics: {
      literacyRate: 87.7,
      scStPercentage: 12.3,
      bplPercentage: 9.8,
      genderRatio: 916,
      workforceParticipation: 48.9,
      ruralPopulationPercentage: 9.1,
      medianAge: 30,
      primaryLanguages: ["Kannada", "English", "Hindi"],
    },
  },
];

/**
 * Intelligently resolve location input string to an exact State, District, Coordinates & Demographic Profile
 */
export function resolveLocationToRegion(
  inputText: string,
  explicitState?: string,
  explicitDistrict?: string
): AdministrativeRegion {
  const cleanText = `${inputText} ${explicitDistrict || ""} ${explicitState || ""}`.toLowerCase();

  // 1. Direct match on known districts dictionary
  for (const item of KNOWN_DISTRICTS) {
    const distMatch = cleanText.includes(item.district.toLowerCase());
    const stateMatch = cleanText.includes(item.state.toLowerCase());

    if (distMatch || (stateMatch && cleanText.includes(item.district.toLowerCase()))) {
      return {
        id: item.id,
        name: item.district,
        state: item.state,
        district: item.district,
        block: `${item.district} Central Block`,
        population: item.population,
        vulnerabilityIndex: item.vulnerabilityIndex,
        accessibilityIndex: item.accessibilityIndex,
        coordinates: item.coordinates,
        demographics: item.demographics,
      };
    }
  }

  // 2. Haryana State Keyword Fallback (e.g. if prompt mentions Haryana or Haryanvi)
  if (cleanText.includes("haryana") || cleanText.includes("gurugram") || cleanText.includes("ambala") || cleanText.includes("faridabad")) {
    const defaultHr = KNOWN_DISTRICTS[0]; // Gurugram
    return {
      id: defaultHr.id,
      name: explicitDistrict || defaultHr.district,
      state: "Haryana",
      district: explicitDistrict || defaultHr.district,
      block: `${explicitDistrict || defaultHr.district} Tehsil`,
      population: defaultHr.population,
      vulnerabilityIndex: defaultHr.vulnerabilityIndex,
      accessibilityIndex: defaultHr.accessibilityIndex,
      coordinates: defaultHr.coordinates,
      demographics: defaultHr.demographics,
    };
  }

  // 3. Dynamic Region Generator for any unseen Indian location
  const stateStr = explicitState || extractStateFromText(cleanText) || "Haryana";
  const distStr = explicitDistrict || extractDistrictFromText(cleanText) || "Gurugram";
  const slug = distStr.toLowerCase().replace(/[^a-z0-9]/g, "");
  const stateSlug = stateStr.toLowerCase().slice(0, 2);

  // Approximate center lat/lng for states
  const coords = getStateCenterCoordinates(stateStr);

  return {
    id: `reg-${slug}-${stateSlug}`,
    name: distStr,
    state: stateStr,
    district: distStr,
    block: `${distStr} Sector`,
    population: 1250000,
    vulnerabilityIndex: 62,
    accessibilityIndex: 58,
    coordinates: coords,
    demographics: {
      literacyRate: 76.5,
      scStPercentage: 18.4,
      bplPercentage: 22.1,
      genderRatio: 890,
      workforceParticipation: 41.2,
      ruralPopulationPercentage: 54.0,
      medianAge: 27,
      primaryLanguages: [getPrimaryLanguageForState(stateStr)],
    },
  };
}

function extractStateFromText(text: string): string | null {
  if (text.includes("haryana")) return "Haryana";
  if (text.includes("punjab")) return "Punjab";
  if (text.includes("uttar pradesh") || text.includes("up")) return "Uttar Pradesh";
  if (text.includes("bihar")) return "Bihar";
  if (text.includes("maharashtra")) return "Maharashtra";
  if (text.includes("rajasthan")) return "Rajasthan";
  if (text.includes("karnataka")) return "Karnataka";
  if (text.includes("tamil nadu")) return "Tamil Nadu";
  if (text.includes("delhi")) return "Delhi";
  return null;
}

function extractDistrictFromText(text: string): string | null {
  const words = text.split(/\s+/);
  for (const w of words) {
    if (w.length > 3 && !["water", "road", "hospital", "school", "issue", "problem", "need"].includes(w)) {
      return w.charAt(0).toUpperCase() + w.slice(1);
    }
  }
  return null;
}

function getStateCenterCoordinates(stateName: string): LocationCoordinates {
  const s = stateName.toLowerCase();
  if (s.includes("haryana")) return { latitude: 29.0588, longitude: 76.0856 };
  if (s.includes("punjab")) return { latitude: 31.1471, longitude: 75.3412 };
  if (s.includes("uttar pradesh")) return { latitude: 26.8467, longitude: 80.9462 };
  if (s.includes("bihar")) return { latitude: 25.5941, longitude: 85.1376 };
  if (s.includes("maharashtra")) return { latitude: 19.7515, longitude: 75.7139 };
  if (s.includes("rajasthan")) return { latitude: 27.0238, longitude: 74.2179 };
  if (s.includes("karnataka")) return { latitude: 15.3173, longitude: 75.7139 };
  if (s.includes("delhi")) return { latitude: 28.6139, longitude: 77.2090 };
  return { latitude: 28.4595, longitude: 77.0266 }; // Gurugram default
}

function getPrimaryLanguageForState(stateName: string): string {
  const s = stateName.toLowerCase();
  if (s.includes("haryana")) return "Haryanvi";
  if (s.includes("punjab")) return "Punjabi";
  if (s.includes("bihar")) return "Maithili";
  if (s.includes("maharashtra")) return "Marathi";
  if (s.includes("karnataka")) return "Kannada";
  if (s.includes("tamil")) return "Tamil";
  return "Hindi";
}
