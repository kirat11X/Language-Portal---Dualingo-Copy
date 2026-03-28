import type { ReactNode } from 'react';

interface StatsCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  trend?: string;
  iconBg?: string;
}

export default function StatsCard({ icon, label, value, trend, iconBg = 'bg-primary-surface' }: StatsCardProps) {
  return (
    <div className="card p-6 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        {trend && (
          <span className="text-[0.8rem] font-semibold text-primary">
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-on-surface-variant dark:text-dark-on-surface-variant mb-1">
          {label}
        </p>
        <p className="text-4xl lg:text-5xl font-bold font-[var(--font-display)] text-on-surface dark:text-dark-on-surface">
          {value}
        </p>
      </div>
    </div>
  );
}
