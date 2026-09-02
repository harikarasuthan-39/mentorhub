import { NavLink } from "react-router-dom";
import {
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
  MessageSquare,
  User,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { MentorHubLogo } from "../ui/MentorHubLogo";

const NAV = {
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
    { to: "/progress", label: "Academic Progress", icon: TrendingUp },
    { to: "/profile", label: "My Profile", icon: User },
    { to: "/notifications", label: "Notifications", icon: Bell },
  ],
};

const ROLE_INFO: Record<string, { label: string; badge: string; color: string }> = {
  HOD: { label: "Department Head", badge: "HOD", color: "bg-purple-500/15 text-purple-300 border-purple-500/30" },
  MENTOR: { label: "Faculty Advisor", badge: "Mentor", color: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" },
  STUDENT: { label: "Student Mentee", badge: "Student", color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
};

export function Sidebar() {
  const { user } = useAuth();
  if (!user) return null;
  const items = NAV[user.role] || NAV.STUDENT;
  const roleMeta = ROLE_INFO[user.role] || ROLE_INFO.MENTOR;

  return (
    <aside className="w-64 shrink-0 bg-[#0F172A] text-slate-200 flex flex-col h-screen sticky top-0 border-r border-slate-800 shadow-panel z-20">
      {/* Brand Header */}
      <div className="px-5 h-18 flex items-center justify-between border-b border-slate-800/90 bg-[#0F172A]">
        <MentorHubLogo size="md" theme="dark" animate={false} />
      </div>

      {/* User Role Card in Sidebar */}
      <div className="px-3.5 pt-4 pb-2">
        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs font-bold uppercase shrink-0">
            {user.email[0]}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-100 truncate">{user.email.split("@")[0]}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded border ${roleMeta.color}`}>
                {roleMeta.badge}
              </span>
              <span className="text-[10px] text-slate-400 truncate">{roleMeta.label}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        <p className="px-3 py-1.5 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
          Workspace
        </p>
        {items.map(({ to, label, icon: Icon, isAi }: any) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                isActive
                  ? "bg-purple-600/15 text-purple-300 font-semibold"
                  : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                      isActive
                        ? "text-purple-400"
                        : isAi
                        ? "text-purple-400 group-hover:text-purple-300"
                        : "text-slate-400 group-hover:text-slate-200"
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                  <span className="truncate">{label}</span>
                </div>
                {isAi && !isActive && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">
                    AI
                  </span>
                )}
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* System Status Footer */}
      <div className="p-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-2.5 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="font-medium text-slate-300">MentorHUB Core</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">Online</span>
        </div>
      </div>
    </aside>
  );
}
