import React from "react";
import { DataClassification } from "@/types";

interface Props {
  classification: DataClassification;
  className?: string;
}

/**
 * DataClassificationBadge (Neutral Slate Theme - No Blue)
 * Visually distinguishes between Authentic Government Data, Synthetic Demonstration Data,
 * Calculated Model Outputs, and Simulated Policy Scenarios for maximum technical honesty.
 */
export const DataClassificationBadge: React.FC<Props> = ({ classification, className = "" }) => {
  switch (classification) {
    case "PUBLIC_REAL_DATA":
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-300 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5" />
          PUBLIC REAL DATA
        </span>
      );

    case "SYNTHETIC_DATA":
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mr-1.5" />
          DEMONSTRATION DATA
        </span>
      );

    case "MODEL_OUTPUT":
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-900 border border-slate-300 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-700 mr-1.5" />
          MODEL OUTPUT (v1.0.0)
        </span>
      );

    case "SIMULATION":
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-900 border border-slate-300 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-700 mr-1.5" />
          SIMULATION ESTIMATE
        </span>
      );

    default:
      return null;
  }
};
