import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight } from "lucide-react";
import { MentorHubEmblemSvg } from "./MentorHubLogo";

interface IntroSplashProps {
  onComplete: () => void;
  forceShow?: boolean;
}

const STATUS_STEPS = [
  { progress: 20, text: "Initializing MentorHUB Core" },
  { progress: 55, text: "Calibrating Neural Advisory Graph" },
  { progress: 85, text: "Synchronizing Student Telemetry" },
  { progress: 100, text: "Workspace Ready" },
];

export function IntroSplash({ onComplete, forceShow = false }: IntroSplashProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const handleFinish = useCallback(() => {
    setIsExiting(true);
    sessionStorage.setItem("mentorhub_intro_seen", "true");
    setTimeout(() => {
      onComplete();
    }, 450);
  }, [onComplete]);

  useEffect(() => {
    // Check if previously shown in this session (unless forced)
    if (!forceShow && sessionStorage.getItem("mentorhub_intro_seen") === "true") {
      onComplete();
      return;
    }

    const t1 = setTimeout(() => setStepIndex(1), 500);
    const t2 = setTimeout(() => setStepIndex(2), 1100);
    const t3 = setTimeout(() => setStepIndex(3), 1700);
    const tEnd = setTimeout(() => handleFinish(), 2300);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        handleFinish();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tEnd);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onComplete, forceShow, handleFinish]);

  const currentStep = STATUS_STEPS[stepIndex] || STATUS_STEPS[0];

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1, scale: isExiting ? 1.03 : 1, filter: isExiting ? "blur(12px)" : "blur(0px)" }}
      exit={{ opacity: 0, scale: 1.04, filter: "blur(12px)" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onClick={handleFinish}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#080511] text-white overflow-hidden select-none cursor-pointer py-10 px-6"
    >
      {/* Subtle Atmospheric Radial Aura */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.18, 0.28, 0.18],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-purple-600/30 via-fuchsia-600/20 to-indigo-600/30 blur-[130px]"
        />
      </div>

      {/* Minimal Ambient Grid Dots */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #C084FC 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Top Quiet Badge */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md text-[11px] font-mono text-purple-300/80 tracking-wide"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
        <span>ACADEMIC INTELLIGENCE SUITE</span>
      </motion.div>

      {/* Center Minimal Hero Composition */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full my-auto space-y-7">
        {/* Animated Brand Emblem Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.82, y: 16, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative group"
        >
          {/* Subtle Ambient Glow Ring */}
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-purple-600/40 via-fuchsia-500/30 to-indigo-600/40 opacity-70 blur-lg transition-opacity" />

          {/* Minimalist Glass Card */}
          <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-[#110A20] border border-purple-500/30 shadow-2xl shadow-purple-950/80 p-3.5 flex items-center justify-center">
            {/* Gloss Highlight */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none" />
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-full h-full flex items-center justify-center"
            >
              <MentorHubEmblemSvg className="w-full h-full drop-shadow-[0_4px_12px_rgba(168,85,247,0.35)]" />
            </motion.div>
          </div>
        </motion.div>

        {/* Minimal Typography Group */}
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-baseline justify-center leading-none tracking-tight"
          >
            <span className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
              Mentor
            </span>
            <span className="font-display font-black text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-200 ml-0.5">
              HUB
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.15em" }}
            animate={{ opacity: 0.75, letterSpacing: "0.26em" }}
            transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
            className="font-mono text-[10px] sm:text-[11px] font-semibold text-purple-200 uppercase"
          >
            GUIDE <span className="text-purple-400 font-bold">•</span> CONNECT <span className="text-purple-400 font-bold">•</span> GROW
          </motion.p>
        </div>

        {/* Minimal Hairline Progress Bar & Telemetry Status */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full max-w-[220px] space-y-2.5 pt-1"
        >
          {/* 2px Hairline Progress Tracker */}
          <div className="w-full h-[2px] bg-white/[0.08] rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-400 to-indigo-300 rounded-full shadow-[0_0_8px_rgba(192,132,252,0.8)]"
              initial={{ width: "0%" }}
              animate={{ width: `${currentStep.progress}%` }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
            />
          </div>

          {/* Animated Status Text */}
          <div className="h-4 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentStep.text}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className="text-[10px] font-mono text-purple-200/50 tracking-wide"
              >
                {currentStep.text}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Bottom Minimal Navigation Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="relative z-10 flex flex-col sm:flex-row items-center justify-between w-full max-w-lg text-[11px] text-white/50 font-mono gap-3"
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            window.dispatchEvent(new CustomEvent("open-platform-intro"));
            handleFinish();
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/30 text-purple-200 transition-all cursor-pointer text-[10px]"
        >
          <Sparkles size={11} className="text-purple-400" />
          <span>Explore Interactive Platform Tour</span>
        </button>

        <span className="inline-flex items-center gap-1 text-purple-300/70 hover:text-purple-200 transition-colors">
          <span>Click anywhere to enter</span>
          <ArrowRight size={11} />
        </span>
      </motion.div>
    </motion.div>
  );
}
