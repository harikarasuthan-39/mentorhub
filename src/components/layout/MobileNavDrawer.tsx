import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  X,
  LayoutDashboard,
  Users,
  CalendarClock,
  FlagTriangleRight,
  ListChecks,
  FileBarChart,
  Bell,
  Bot,
  Calendar,
  Compass,
  Code2,
  TrendingUp,
  LogOut,
  UserCheck,
  CheckCircle2,
  MessageSquare,
  User,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { MentorHubLogo } from "../ui/MentorHubLogo";

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = {
  MENTOR: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/students", label: "Mentee Directory", icon: Users },
    { to: "/meetings", label: "Advisory Meetings", icon: CalendarClock },
    { to: "/actions", label: "Actions & Tasks", icon: ListChecks },
    { to: "/messages", label: "Direct Messages", icon: MessageSquare },
    { to: "/ai-mentor", label: "AI Mentor Assistant", icon: Bot, isAi: true },
    { to: "/study-planner", label: "Study Planner", icon: Calendar },
    { to: "/career-guidance", label: "Career Guidance", icon: Compass },
    { to: "/skills", label: "Skills Matrix", icon: Code2 },
    { to: "/issues", label: "Issues & Escalations", icon: FlagTriangleRight },
    { to: "/reports", label: "Reports & NAAC", icon: FileBarChart },
    { to: "/profile", label: "My Profile", icon: User },
    { to: "/notifications", label: "Notifications", icon: Bell },
  ],
  HOD: [
    { to: "/dashboard", label: "Overview & Analytics", icon: LayoutDashboard },
    { to: "/students", label: "Department Students", icon: Users },
    { to: "/meetings", label: "Department Meetings", icon: CalendarClock },
    { to: "/actions", label: "Faculty Actions", icon: ListChecks },
    { to: "/messages", label: "Messages & Direct Line", icon: MessageSquare },
    { to: "/ai-mentor", label: "AI Mentor Assistant", icon: Bot, isAi: true },
    { to: "/study-planner", label: "Academic Planner", icon: Calendar },
    { to: "/career-guidance", label: "Placement Hub", icon: Compass },
    { to: "/skills", label: "Department Skills", icon: Code2 },
    { to: "/issues", label: "Escalated Issues", icon: FlagTriangleRight },
    { to: "/reports", label: "Accreditation & NAAC", icon: FileBarChart },
    { to: "/profile", label: "My Profile", icon: User },
    { to: "/notifications", label: "Notifications", icon: Bell },
  ],
  STUDENT: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/ai-mentor", label: "AI Mentor Copilot", icon: Bot, isAi: true },
    { to: "/actions", label: "Tasks & Action Items", icon: ListChecks },
    { to: "/messages", label: "Direct Messages", icon: MessageSquare },
    { to: "/study-planner", label: "Study Planner", icon: Calendar },
    { to: "/career-guidance", label: "Career Guidance", icon: Compass },
    { to: "/skills", label: "Skills Matrix", icon: Code2 },
    { to: "/progress", label: "Student Progress", icon: TrendingUp },
    { to: "/profile", label: "My Profile", icon: User },
    { to: "/notifications", label: "Notifications", icon: Bell },
  ],
};

const DEMO_USERS = [
  {
    name: "Dr. Arvind Swamy",
    email: "hod@university.edu",
    role: "HOD",
    badge: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    name: "Dr. Priya Raman",
    email: "mentor1@university.edu",
    role: "MENTOR",
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  {
    name: "Arun Kumar",
    email: "student1@university.edu",
    role: "STUDENT",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
];

export function MobileNavDrawer({ isOpen, onClose }: MobileNavDrawerProps) {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();

  if (!isOpen || !user) return null;

  const items = NAV_ITEMS[user.role] || NAV_ITEMS.STUDENT;

  const handleSwitchUser = async (email: string) => {
    try {
      await login(email, "Password@123");
      onClose();
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to switch user", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer content */}
      <div className="relative w-[85vw] max-w-[320px] bg-[#0F172A] text-slate-200 h-full flex flex-col shadow-2xl border-r border-slate-800 z-10 animate-in slide-in-from-left duration-200 overflow-hidden">
        {/* Drawer Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-800">
          <MentorHubLogo size="sm" theme="dark" animate={false} />
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        {/* User Card */}
        <div className="p-3.5 border-b border-slate-800 bg-slate-900/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-xs uppercase shrink-0">
              {user.email[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">
                {user.email.split("@")[0]}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {user.role}
                </span>
                <span className="text-[10px] text-slate-400 truncate">{user.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          <p className="px-3 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Main Navigation
          </p>
          {items.map(({ to, label, icon: Icon, isAi }: any) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-purple-600 text-white font-semibold shadow-xs"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 flex items-center justify-center ${
                        isActive
                          ? "text-white"
                          : isAi
                          ? "text-purple-400"
                          : "text-slate-400"
                      }`}
                    >
                      <Icon size={16} />
                    </div>
                    <span>{label}</span>
                  </div>
                  {isAi && !isActive && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-500/25 text-purple-300">
                      AI
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}

          {/* Quick Demo Switcher in Mobile Drawer */}
          <div className="pt-4 mt-3 border-t border-slate-800">
            <p className="px-3 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
              <UserCheck size={12} className="text-purple-400" /> Switch Demo Role
            </p>
            <div className="space-y-1 mt-1">
              {DEMO_USERS.map((demo) => {
                const isCurrent = demo.email.toLowerCase() === user.email.toLowerCase();
                return (
                  <button
                    key={demo.email}
                    onClick={() => handleSwitchUser(demo.email)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      isCurrent
                        ? "bg-slate-800 text-white font-semibold"
                        : "text-slate-300 hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{demo.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{demo.role}</p>
                    </div>
                    {isCurrent && <CheckCircle2 size={14} className="text-purple-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Drawer Footer with Logout */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/90">
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
