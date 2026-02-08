import { LucideIcon } from "lucide-react";

interface KPICardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  suffix?: string;
}

export default function KPICard({ icon: Icon, label, value, suffix }: KPICardProps) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#F5F5F7] flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#86868B]" strokeWidth={1.5} />
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
