import React from "react";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  accentColor?: "sky" | "rose" | "amber" | "emerald" | "purple";
}

/**
 * KpiCard Component (Neutral Slate Theme - No Blue)
 * High-impact, clean, solid white card displaying official indicators with crisp typography and clear borders.
 */
export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  change,
  isPositive = true,
  icon: Icon,
  accentColor = "sky",
}) => {
  const iconColors = {
    sky: "bg-slate-100 text-slate-800 border-slate-300",
    rose: "bg-rose-50 text-rose-800 border-rose-300",
    amber: "bg-amber-50 text-amber-800 border-amber-300",
    emerald: "bg-emerald-50 text-emerald-800 border-emerald-300",
    purple: "bg-slate-100 text-slate-800 border-slate-300",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-slate-400 transition">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded border ${iconColors[accentColor]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline space-x-2">
        <span className="text-2xl font-black text-slate-900 tracking-tight">{value}</span>
        {change && (
          <span className={`text-[11px] font-bold ${isPositive ? "text-emerald-700" : "text-rose-700"}`}>
            {change}
          </span>
        )}
      </div>

      {subtitle && <p className="text-[11px] text-slate-600 mt-1.5 font-medium">{subtitle}</p>}
    </div>
  );
};
