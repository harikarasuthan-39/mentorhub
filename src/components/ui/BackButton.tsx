import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface BackButtonProps {
  label?: string;
  fallback?: string;
  className?: string;
  compact?: boolean;
}

export function BackButton({
  label = "Back",
  fallback = "/dashboard",
  className = "",
  compact = false,
}: BackButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // If there is history within the app, go back. Otherwise use fallback.
    if (window.history.length > 2 && location.key !== "default") {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl transition-all shadow-2xs active:scale-98 ${
        compact ? "p-1.5" : "px-3 py-1.5"
      } ${className}`}
      title={label}
      aria-label={label}
    >
      <ArrowLeft size={14} className="shrink-0 text-slate-500" />
      {!compact && <span>{label}</span>}
    </button>
  );
}
