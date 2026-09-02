import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Bot,
  Calendar,
  Compass,
  TrendingUp,
  UserCheck,
  Bell,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function MobileBottomNav() {
  const { user } = useAuth();
  if (!user) return null;

  const isStudent = user.role === "STUDENT";

  const navItems = isStudent
    ? [
        { to: "/dashboard", label: "Home", icon: LayoutDashboard },
        { to: "/ai-mentor", label: "AI Mentor", icon: Bot, isAi: true },
        { to: "/study-planner", label: "Planner", icon: Calendar },
        { to: "/progress", label: "Progress", icon: TrendingUp },
        { to: "/career-guidance", label: "Career", icon: Compass },
      ]
    : [
        { to: "/dashboard", label: "Home", icon: LayoutDashboard },
        { to: "/students", label: "Students", icon: UserCheck },
        { to: "/ai-mentor", label: "AI Mentor", icon: Bot, isAi: true },
        { to: "/meetings", label: "Meetings", icon: Calendar },
        { to: "/notifications", label: "Alerts", icon: Bell },
      ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-sm px-2 py-1.5 safe-area-pb">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map(({ to, label, icon: Icon, isAi }: any) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors min-w-[56px] ${
                isActive
                  ? "text-purple-600 font-semibold"
                  : "text-slate-400 hover:text-slate-600 font-medium"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <div
                    className={`w-9 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isActive
                        ? "bg-purple-50 text-purple-600"
                        : "text-slate-500"
                    }`}
                  >
                    <Icon size={17} />
                  </div>
                  {isAi && !isActive && (
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-purple-500" />
                  )}
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
