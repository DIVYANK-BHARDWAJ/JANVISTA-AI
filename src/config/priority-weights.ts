export interface PriorityWeightConfig {
  demandWeight: number; // default 0.30
  gapWeight: number; // default 0.25
  vulnerabilityWeight: number; // default 0.15
  accessibilityWeight: number; // default 0.15
  urgencyWeight: number; // default 0.10
  investmentMismatchWeight: number; // default 0.05
  version: string;
}

export const DEFAULT_PRIORITY_WEIGHTS: PriorityWeightConfig = {
  demandWeight: 0.30,
  gapWeight: 0.25,
  vulnerabilityWeight: 0.15,
  accessibilityWeight: 0.15,
  urgencyWeight: 0.10,
  investmentMismatchWeight: 0.05,
  version: "v1.0.0",
};

export const SUPPORTED_LANGUAGES = [
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "en", name: "English", native: "English" },
];
