import React from "react";

interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "hero";
  showText?: boolean;
  showTagline?: boolean;
  theme?: "dark" | "light" | "auto";
  className?: string;
  animate?: boolean;
  variant?: "horizontal" | "square-badge" | "icon-only";
}

/**
 * MentorHubEmblemSvg - Pixel-perfect vector reproduction of the MentorHUB M-emblem:
 * - Stylized bold purple gradient "M" with smooth rounded apexes and bottom terminals
 * - Central mentor/student figure (circular head + curved collar nestled in V notch)
 * - Three horizontal dialogue/chat indicator dots on the right arm
 */
export function MentorHubEmblemSvg({
  className = "w-full h-full",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} overflow-visible`}
    >
      <defs>
        {/* Vibrant Gradient for M shape */}
        <linearGradient id="mHubMainGradient" x1="18" y1="20" x2="82" y2="82" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="35%" stopColor="#A855F7" />
          <stop offset="70%" stopColor="#7E22CE" />
          <stop offset="100%" stopColor="#581C87" />
        </linearGradient>

        {/* Head and Bust Figure Gradient */}
        <linearGradient id="mHubFigureGradient" x1="50" y1="16" x2="50" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D8B4FE" />
          <stop offset="45%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#7E22CE" />
        </linearGradient>

        {/* Top Edge Specular Lighting */}
        <linearGradient id="mHubGleam" x1="20" y1="22" x2="80" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Main Stylized "M" with Rounded Caps and V-Notch */}
      <path
        d="M 22 30 
           C 22 25, 25.5 22, 29.5 24 
           L 50 49 
           L 70.5 24 
           C 74.5 22, 78 25, 78 30 
           L 78 74 
           C 78 77.5, 74.5 80, 70.5 80 
           C 66.5 80, 63.5 77.5, 63.5 74 
           L 63.5 44 
           L 50 59.5 
           L 36.5 44 
           L 36.5 74 
           C 36.5 77.5, 33.5 80, 29.5 80 
           C 25.5 80, 22 77.5, 22 74 
           Z"
        fill="url(#mHubMainGradient)"
      />

      {/* Subtle Specular Top Reflection Accent */}
      <path
        d="M 23 29 C 23 25.5, 26 23.5, 29.5 25 L 50 49 L 70.5 25 C 74 23.5, 77 25.5, 77 29"
        stroke="url(#mHubGleam)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Avatar Head (Centered in top notch) */}
      <circle
        cx="50"
        cy="26"
        r="11.5"
        fill="url(#mHubFigureGradient)"
      />
      {/* Subtle Head Ring Highlight */}
      <circle
        cx="50"
        cy="26"
        r="11.5"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1"
      />

      {/* Avatar Torso / Collar (Resting comfortably in V-valley) */}
      <path
        d="M 37.5 37.5 
           C 41 33.5, 59 33.5, 62.5 37.5 
           L 50 50 
           Z"
        fill="url(#mHubFigureGradient)"
        opacity="0.95"
      />

      {/* Three Horizontal Dialogue Dots on Right Arm */}
      <circle cx="67.5" cy="34" r="2.2" fill="#0B0817" />
      <circle cx="72.5" cy="34" r="2.2" fill="#0B0817" />
      <circle cx="77.5" cy="34" r="2.2" fill="#0B0817" />
    </svg>
  );
}

/**
 * MentorHubSquareBox - Minimalist, sleek square box container for the emblem
 * Designed with luxury dark gradient, refined border, and balanced inner padding.
 */
export function MentorHubSquareBox({
  size = "md",
  className = "",
  animate = false,
}: {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "hero";
  className?: string;
  animate?: boolean;
}) {
  const boxSizes = {
    xs: "w-7 h-7 rounded-lg p-1",
    sm: "w-9 h-9 rounded-xl p-1.5",
    md: "w-11 h-11 rounded-xl p-2",
    lg: "w-14 h-14 rounded-2xl p-2.5",
    xl: "w-20 h-20 rounded-2xl p-3.5",
    hero: "w-28 h-28 md:w-32 md:h-32 rounded-3xl p-5",
  };

  return (
    <div className={`relative shrink-0 flex items-center justify-center ${className}`}>
      {animate && (
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 opacity-50 blur-md animate-pulse pointer-events-none" />
      )}
      <div
        className={`relative aspect-square flex items-center justify-center bg-gradient-to-b from-[#160E29] via-[#0D0818] to-[#06030B] border border-purple-500/30 shadow-md shadow-purple-950/40 ${boxSizes[size]}`}
      >
        {/* Subtle Inner Glow Rim */}
        <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-purple-400/10 to-transparent pointer-events-none" />
        <MentorHubEmblemSvg className="w-full h-full drop-shadow-sm" />
      </div>
    </div>
  );
}

/**
 * MentorHubLogo - Primary Brand Logo Component
 * Combines the sleek square box icon with crisp brand typography.
 */
export function MentorHubLogo({
  size = "md",
  showText = true,
  showTagline = true,
  theme = "light",
  className = "",
  animate = false,
  variant = "horizontal",
}: LogoProps) {
  const sizeMap = {
    xs: { text: "text-sm", hub: "text-sm", tag: "text-[6.5px] tracking-[0.14em]", gap: "gap-2" },
    sm: { text: "text-base", hub: "text-base", tag: "text-[7.5px] tracking-[0.16em]", gap: "gap-2.5" },
    md: { text: "text-lg", hub: "text-lg", tag: "text-[8px] tracking-[0.16em]", gap: "gap-2.5" },
    lg: { text: "text-2xl", hub: "text-2xl", tag: "text-[10px] tracking-[0.18em]", gap: "gap-3" },
    xl: { text: "text-3xl", hub: "text-3xl", tag: "text-xs tracking-[0.2em]", gap: "gap-3.5" },
    hero: { text: "text-4xl md:text-5xl", hub: "text-4xl md:text-5xl", tag: "text-xs md:text-sm tracking-[0.2em]", gap: "gap-4 md:gap-5" },
  };

  const s = sizeMap[size];
  const isDark = theme === "dark";

  if (variant === "icon-only") {
    return <MentorHubSquareBox size={size} animate={animate} className={className} />;
  }

  if (variant === "square-badge") {
    return (
      <MentorHubSquareCard
        size={size === "hero" ? "lg" : size === "xl" ? "md" : "sm"}
        animate={animate}
        className={className}
      />
    );
  }

  return (
    <div className={`inline-flex items-center ${s.gap} select-none ${className}`}>
      {/* Sleek Square Box Icon */}
      <MentorHubSquareBox size={size} animate={animate} />

      {showText && (
        <div className="flex flex-col justify-center min-w-0">
          {/* Main Wordmark: "MentorHUB" */}
          <div className="flex items-baseline leading-none tracking-tight">
            <span
              className={`font-display font-black ${s.text} ${
                isDark ? "text-white" : "text-[#0B0817]"
              }`}
            >
              Mentor
            </span>
            <span
              className={`font-display font-black ${s.hub} text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] via-[#C084FC] to-[#D8B4FE]`}
            >
              HUB
            </span>
          </div>

          {/* Official Subtitle: "GUIDE • CONNECT • GROW" */}
          {showTagline && (
            <p
              className={`font-mono font-medium uppercase whitespace-nowrap leading-none mt-1 ${s.tag} ${
                isDark ? "text-purple-300/80" : "text-[#0B0817]/75"
              }`}
            >
              GUIDE <span className="text-purple-500 font-bold">•</span> CONNECT <span className="text-purple-500 font-bold">•</span> GROW
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * MentorHubSquareCard - Full Square Box Brand Identity Card
 * Exact match to the user's uploaded official brand identity board:
 * Deep black square container, centered emblem, MentorHUB wordmark, and tagline.
 */
export function MentorHubSquareCard({
  size = "md",
  className = "",
  animate = true,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
  animate?: boolean;
}) {
  const cardConfig = {
    sm: {
      box: "w-48 h-48 rounded-2xl p-4",
      iconSize: "md" as const,
      title: "text-xl",
      tagline: "text-[8px] tracking-[0.2em] mt-1.5",
    },
    md: {
      box: "w-64 h-64 rounded-3xl p-6",
      iconSize: "lg" as const,
      title: "text-2xl sm:text-3xl",
      tagline: "text-[9px] tracking-[0.22em] mt-2",
    },
    lg: {
      box: "w-72 h-72 sm:w-80 sm:h-80 rounded-3xl p-8",
      iconSize: "hero" as const,
      title: "text-3xl sm:text-4xl",
      tagline: "text-[10px] sm:text-xs tracking-[0.24em] mt-2.5",
    },
  };

  const cfg = cardConfig[size];

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      {animate && (
        <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 opacity-40 blur-xl animate-pulse pointer-events-none" />
      )}
      <div
        className={`relative aspect-square flex flex-col items-center justify-center text-center bg-[#07040E] border border-purple-500/30 shadow-2xl shadow-purple-950/60 ${cfg.box}`}
      >
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute inset-0 rounded-[inherit] bg-radial from-purple-900/20 via-transparent to-transparent pointer-events-none" />

        {/* Center M Emblem */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mb-3">
          <MentorHubEmblemSvg className="w-full h-full drop-shadow-lg" />
        </div>

        {/* Wordmark */}
        <div className="flex items-baseline justify-center leading-none tracking-tight">
          <span className={`font-display font-black ${cfg.title} text-white`}>
            Mentor
          </span>
          <span className={`font-display font-black ${cfg.title} text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-200`}>
            HUB
          </span>
        </div>

        {/* Tagline */}
        <p className={`font-mono font-bold uppercase text-purple-200/80 ${cfg.tagline}`}>
          GUIDE <span className="text-purple-400 font-black">.</span> CONNECT <span className="text-purple-400 font-black">.</span> GROW <span className="text-purple-400 font-black">.</span>
        </p>
      </div>
    </div>
  );
}

/**
 * MentorHubFullBrandBadge - For Splash Screen and Hero sections
 */
export function MentorHubFullBrandBadge({
  className = "",
  animate = true,
}: {
  className?: string;
  animate?: boolean;
}) {
  return (
    <MentorHubSquareCard size="md" animate={animate} className={className} />
  );
}
