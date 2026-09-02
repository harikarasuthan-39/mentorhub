import { RiskLevel } from "../../types";

const RISK_CONFIG: Record<
  RiskLevel,
  { color: string; bgLight: string; border: string; label: string; ring: number; textColor: string }
> = {
  LOW: {
    color: "#059669",
    bgLight: "bg-emerald-50",
    border: "border-emerald-200",
    textColor: "text-emerald-700",
    label: "Low Risk",
    ring: 0.25,
  },
  MEDIUM: {
    color: "#D97706",
    bgLight: "bg-amber-50",
    border: "border-amber-200",
    textColor: "text-amber-800",
    label: "Medium Risk",
    ring: 0.5,
  },
  HIGH: {
    color: "#DC2626",
    bgLight: "bg-rose-50",
    border: "border-rose-200",
    textColor: "text-rose-700",
    label: "High Risk",
    ring: 0.75,
  },
  CRITICAL: {
    color: "#991B1B",
    bgLight: "bg-red-100",
    border: "border-red-300",
    textColor: "text-red-900",
    label: "Critical Risk",
    ring: 1,
  },
};

/**
 * The mentoring "seal" — a medallion-style ring gauge used everywhere risk is shown.
 */
export function RiskSeal({
  level,
  score,
  size = 56,
  showLabel = true,
}: {
  level: RiskLevel;
  score?: number;
  size?: number;
  showLabel?: boolean;
}) {
  const cfg = RISK_CONFIG[level] || RISK_CONFIG.LOW;
  const strokeWidth = size * 0.1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - (score !== undefined ? Math.min(1, Math.max(0, score / 100)) : cfg.ring));

  return (
    <div className="inline-flex items-center gap-2.5">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-sm">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={cfg.color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            className="seal-ring transition-all duration-700"
          />
        </svg>
        {typeof score === "number" ? (
          <div
            className="absolute inset-0 flex items-center justify-center font-mono font-bold tracking-tighter"
            style={{ fontSize: size * 0.28, color: cfg.color }}
          >
            {score}
          </div>
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center text-[10px] font-bold"
            style={{ color: cfg.color }}
          >
            {level[0]}
          </div>
        )}
      </div>
      {showLabel && (
        <div className="flex flex-col">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${cfg.bgLight} ${cfg.textColor} ${cfg.border}`}>
            {cfg.label}
          </span>
          {typeof score === "number" && (
            <span className="text-[10px] text-slate-muted mt-0.5">Score: {score}/100</span>
          )}
        </div>
      )}
    </div>
  );
}

export function RiskDot({
  level,
  score,
  compact = false,
}: {
  level: RiskLevel;
  score?: number;
  compact?: boolean;
}) {
  const cfg = RISK_CONFIG[level] || RISK_CONFIG.LOW;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.bgLight} ${cfg.textColor} ${cfg.border}`}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} />
      <span>{compact ? level : cfg.label}</span>
      {typeof score === "number" && <span className="font-mono text-[10px] opacity-75">({score})</span>}
    </span>
  );
}

