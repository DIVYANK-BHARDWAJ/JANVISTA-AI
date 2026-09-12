import React from "react";
import { InfrastructureCategory, UrgencyLevel } from "@/types";

interface CategoryBadgeProps {
  category: InfrastructureCategory;
}

/**
 * CategoryBadge Component (Neutral Slate Theme - No Blue)
 * Renders color-coded sector tags for Healthcare, Education, Water, Transport, Energy, and Digital Infra.
 */
export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const styles: Record<InfrastructureCategory, { label: string; bg: string; text: string; border: string }> = {
    healthcare: { label: "Healthcare", bg: "bg-rose-50", text: "text-rose-900", border: "border-rose-300" },
    education: { label: "Education", bg: "bg-slate-100", text: "text-slate-900", border: "border-slate-300" },
    transportation: { label: "Transportation", bg: "bg-amber-50", text: "text-amber-900", border: "border-amber-300" },
    water_sanitation: { label: "Water & Sanitation", bg: "bg-slate-100", text: "text-slate-900", border: "border-slate-300" },
    energy: { label: "Energy", bg: "bg-emerald-50", text: "text-emerald-900", border: "border-emerald-300" },
    digital_infra: { label: "Digital Infrastructure", bg: "bg-slate-100", text: "text-slate-900", border: "border-slate-300" },
  };

  const current = styles[category] || styles.healthcare;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold border ${current.bg} ${current.text} ${current.border}`}>
      {current.label}
    </span>
  );
};

interface UrgencyBadgeProps {
  urgency: UrgencyLevel;
}

/**
 * UrgencyBadge Component (Neutral Slate Theme - No Blue)
 * Renders visual severity indicator for Low, Medium, High, and Critical signals.
 */
export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ urgency }) => {
  const styles: Record<UrgencyLevel, { label: string; bg: string }> = {
    low: { label: "Low Urgency", bg: "bg-slate-100 text-slate-700 border border-slate-300" },
    medium: { label: "Medium", bg: "bg-slate-100 text-slate-900 border border-slate-300" },
    high: { label: "High Urgency", bg: "bg-amber-50 text-amber-900 border border-amber-300 font-bold" },
    critical: { label: "CRITICAL", bg: "bg-rose-100 text-rose-900 border border-rose-400 font-black animate-pulse" },
  };

  const current = styles[urgency] || styles.medium;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs uppercase tracking-wider ${current.bg}`}>
      {current.label}
    </span>
  );
};
