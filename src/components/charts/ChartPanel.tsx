import { ReactNode } from "react";

export function ChartPanel({
  title,
  subtitle,
  children,
  className = "",
  action,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <div className={`app-card p-5 md:p-6 flex flex-col justify-between ${className}`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display text-base font-bold text-navy tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs text-slate-muted mt-0.5">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="w-full flex-1 min-h-0">{children}</div>
    </div>
  );
}

