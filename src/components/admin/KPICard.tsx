import { LucideIcon } from "lucide-react";

interface KPICardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  suffix?: string;
  accentColor?: string;
}

export default function KPICard({
  icon: Icon,
  label,
  value,
  suffix,
  accentColor = "#86868B",
}: KPICardProps) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500"
          style={{ backgroundColor: `${accentColor}10` }}
        >
          <Icon
            className="w-5 h-5 transition-colors duration-500"
            strokeWidth={1.5}
            style={{ color: accentColor }}
          />
        </div>
        <span className="text-sm font-medium text-[#86868B] tracking-wide">
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-semibold text-[#1D1D1F] tracking-tight">
          {value}
        </span>
        {suffix && (
          <span className="text-lg text-[#86868B] ml-1">{suffix}</span>
        )}
      </div>
    </div>
  );
}
