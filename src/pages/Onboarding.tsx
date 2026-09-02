import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Bot,
  Calendar,
  Compass,
  Code2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
} from "lucide-react";
import { MentorHubLogo } from "../components/ui/MentorHubLogo";

export default function Onboarding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF8FD] via-[#F5EEFB] to-white flex flex-col justify-between p-4 md:p-8">
      {/* Top Header */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between py-2">
        <MentorHubLogo size="md" animate />
        <Link
          to="/login"
          className="text-xs font-bold text-purple-700 hover:text-purple-800 px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors border border-purple-200"
        >
          I already have an account →
        </Link>
      </div>

      {/* Main Hero Onboarding Container */}
      <div className="max-w-4xl w-full mx-auto my-auto py-8 text-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold shadow-sm">
          <Sparkles size={13} className="text-purple-600" />
          <span>Next-Generation AI Mentor Assistant</span>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-navy tracking-tight leading-[1.1]">
            Your Journey. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600">
              Your Mentor.
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
            Get personalized guidance for academics, skills and your career — all in one place.
          </p>
        </div>

        {/* 4 Feature Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
          {[
            { icon: Bot, title: "AI Mentor", desc: "24/7 academic & coding tutor" },
            { icon: Calendar, title: "Study Planner", desc: "Spaced repetition timetable" },
            { icon: Compass, title: "Career Hub", desc: "ATS resume & placement prep" },
            { icon: Code2, title: "Skill Matrix", desc: "Verified competency tracks" },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="app-card p-4 space-y-1.5 border-purple-100/80 hover:border-purple-300 transition-all"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <Icon size={16} />
                </div>
                <h4 className="font-bold text-xs text-navy">{item.title}</h4>
                <p className="text-[11px] text-slate-muted leading-tight">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <button
            onClick={() => navigate("/login")}
            className="w-full sm:w-auto btn-primary text-sm py-3.5 px-8 inline-flex items-center justify-center gap-2 cursor-pointer font-bold"
          >
            <span>Get Started</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={() => navigate("/login")}
            className="w-full sm:w-auto btn-secondary text-sm py-3.5 px-6 border-line text-slate-700 hover:text-navy cursor-pointer"
          >
            I already have an account
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl w-full mx-auto text-center py-4 border-t border-line/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-muted gap-2">
        <p>© 2026 MentorHUB. GUIDE • CONNECT • GROW.</p>
        <p className="flex items-center gap-1 text-purple-700 font-medium">
          <ShieldCheck size={14} /> Enterprise University Mentoring Standard
        </p>
      </div>
    </div>
  );
}
