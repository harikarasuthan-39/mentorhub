import React, { useEffect, useState, useRef } from "react";
import {
  Bell,
  LogOut,
  Search,
  Plus,
  UserCheck,
  GraduationCap,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  Menu,
  X,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../api/client";
import { AppNotification, Student } from "../../types";
import { RiskDot } from "../ui/RiskSeal";
import { MentorHubLogo } from "../ui/MentorHubLogo";
import { MobileNavDrawer } from "./MobileNavDrawer";

const DEMO_USERS = [
  {
    name: "Dr. Arvind Swamy",
    email: "hod@university.edu",
    role: "HOD",
    desc: "Department Head (All Dept Analytics)",
    badge: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    name: "Dr. Priya Raman",
    email: "mentor1@university.edu",
    role: "MENTOR",
    desc: "Faculty Advisor (20 Mentees)",
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  {
    name: "Arun Kumar",
    email: "student1@university.edu",
    role: "STUDENT",
    desc: "Student Mentee (AI Assistant & Planner)",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
];

export function Header() {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [switchOpen, setSwitchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api
      .get("/notifications", { params: { unread: true } })
      .then((res) => setNotifications(res.data.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setProfileOpen(false);
        setSwitchOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Live search debouncing
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    const t = setTimeout(() => {
      setIsSearching(true);
      api
        .get("/students", { params: { search: searchQuery, pageSize: 5 } })
        .then((res) => setSearchResults(res.data.data.items || []))
        .catch(() => setSearchResults([]))
        .finally(() => setIsSearching(false));
    }, 200);
    return () => clearTimeout(t);
  }, [searchQuery]);

  async function markAllRead() {
    await api.put("/notifications/read-all");
    setNotifications([]);
  }

  async function handleSwitchUser(email: string) {
    try {
      await login(email, "Password@123");
      setProfileOpen(false);
      setSwitchOpen(false);
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to switch user", err);
    }
  }

  return (
    <>
      <header className="h-16 sticky top-0 z-30 bg-white border-b border-slate-200/90 flex items-center justify-between px-3 sm:px-4 md:px-6 transition-all shadow-xs">
        {/* Mobile Header Elements (< md) */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 transition-all border border-slate-200/60"
            aria-label="Open Navigation Menu"
          >
            <Menu size={20} />
          </button>
          <Link to="/dashboard" className="flex items-center">
            <MentorHubLogo size="sm" animate={false} />
          </Link>
        </div>

        {/* Desktop Global Search Bar (>= md) */}
        <div className="hidden md:block relative w-88 max-w-[38vw]" ref={searchRef}>
          <div className="relative flex items-center">
            <Search size={15} className="absolute left-3 text-slate-400 pointer-events-none" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Search students, reg. no, or emails..."
              className="w-full pl-9 pr-8 py-2 text-xs md:text-sm bg-slate-50 hover:bg-slate-100/60 rounded-xl border border-slate-200/80 focus:outline-none focus:border-purple-600 focus:bg-white focus:ring-3 focus:ring-purple-500/10 transition-all text-slate-900 placeholder:text-slate-400 font-medium"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearchFocused(false);
                  navigate(`/students?search=${encodeURIComponent(searchQuery)}`);
                }
              }}
            />
            <kbd className="hidden md:inline-flex absolute right-2.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs">
              ↵
            </kbd>
          </div>

          {/* Live Search Autocomplete Popover */}
          {searchFocused && searchQuery.trim().length >= 2 && (
            <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-dropdown py-2 z-50 animate-in fade-in-50 duration-150">
              <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>Matching Students</span>
                {isSearching && <span className="animate-spin text-xs text-purple-600">⟳</span>}
              </div>
              {searchResults.length === 0 && !isSearching ? (
                <div className="px-4 py-6 text-center text-xs text-slate-400">
                  No students found for "{searchQuery}".
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {searchResults.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSearchFocused(false);
                        setSearchQuery("");
                        navigate(`/students/${s.id}`);
                      }}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200/70 shrink-0">
                          {s.fullName[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-900 truncate group-hover:text-purple-600">
                            {s.fullName}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono truncate">
                            {s.registerNumber} · Year {s.year} ({s.section})
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {s.latestRisk && <RiskDot level={s.latestRisk.riskLevel} compact />}
                        <ArrowRight size={13} className="text-slate-400 group-hover:text-purple-600 transition-colors" />
                      </div>
                    </button>
                  ))}
                  <div className="p-2 bg-slate-50/50 text-center">
                    <button
                      onClick={() => {
                        setSearchFocused(false);
                        navigate(`/students?search=${encodeURIComponent(searchQuery)}`);
                      }}
                      className="text-xs font-medium text-purple-600 hover:text-purple-700 hover:underline"
                    >
                      View all results in Directory →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Actions & Utilities */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3.5" ref={ref}>
          {/* Mobile Search Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileSearchOpen((prev) => !prev)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Search"
            >
              {mobileSearchOpen ? <X size={18} /> : <Search size={18} />}
            </button>
          </div>

          {/* Fast Role Switcher Pills (Desktop only) */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => handleSwitchUser("student1@university.edu")}
              className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                user?.role === "STUDENT"
                  ? "bg-white text-slate-900 font-semibold shadow-xs"
                  : "text-slate-600 hover:text-slate-900 font-medium"
              }`}
            >
              Student
            </button>
            <button
              onClick={() => handleSwitchUser("mentor1@university.edu")}
              className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                user?.role === "MENTOR"
                  ? "bg-white text-slate-900 font-semibold shadow-xs"
                  : "text-slate-600 hover:text-slate-900 font-medium"
              }`}
            >
              Faculty Advisor
            </button>
            <button
              onClick={() => handleSwitchUser("hod@university.edu")}
              className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                user?.role === "HOD"
                  ? "bg-white text-slate-900 font-semibold shadow-xs"
                  : "text-slate-600 hover:text-slate-900 font-medium"
              }`}
            >
              HOD
            </button>
          </div>

          {/* Quick Log Meeting CTA for Mentors */}
          {user?.role === "MENTOR" && (
            <button
              onClick={() => navigate("/meetings")}
              className="hidden sm:inline-flex items-center gap-1.5 btn-primary text-xs py-1.5 px-3 shadow-xs cursor-pointer"
            >
              <Plus size={14} /> Record Session
            </button>
          )}

          {/* Quick Switch Demo Persona Dropdown (Desktop) */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setSwitchOpen((o) => !o)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Fast switch between demo roles"
            >
              <UserCheck size={13} className="text-slate-500" />
              <span className="truncate max-w-[100px]">{user?.role}</span>
              <ChevronDown size={12} className="text-slate-400" />
            </button>

            {switchOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-dropdown py-2 z-50">
                <div className="px-3.5 py-2 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-900">Switch Persona</p>
                  <p className="text-[11px] text-slate-500">Instant test accounts</p>
                </div>
                <div className="p-1 space-y-1">
                  {DEMO_USERS.map((demo) => {
                    const isCurrent = demo.email.toLowerCase() === user?.email.toLowerCase();
                    return (
                      <button
                        key={demo.email}
                        onClick={() => handleSwitchUser(demo.email)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          isCurrent ? "bg-purple-50 font-semibold text-purple-900" : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-900">{demo.name}</span>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold ${demo.badge}`}>
                              {demo.role}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5">{demo.desc}</p>
                        </div>
                        {isCurrent && <CheckCircle2 size={14} className="text-purple-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Popover */}
          <div className="relative">
            <button
              onClick={() => setOpen((o) => !o)}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-600 ring-2 ring-white" />
              )}
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white rounded-xl border border-slate-200 shadow-dropdown py-2 z-50 max-h-[400px] flex flex-col">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-slate-900">Notifications</p>
                    {notifications.length > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
                        {notifications.length}
                      </span>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <button onClick={markAllRead} className="text-xs font-medium text-purple-600 hover:underline cursor-pointer">
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-xs text-slate-400">
                      <p className="font-semibold text-slate-700 mb-0.5">All caught up</p>
                      <p>No new unread notifications.</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="px-4 py-2.5 hover:bg-slate-50 transition-colors">
                        <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.message}</p>
                        <p className="text-[10px] text-slate-400 mt-1 font-mono">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-2 border-t border-slate-100 text-center bg-slate-50/50">
                  <Link
                    to="/notifications"
                    onClick={() => setOpen(false)}
                    className="text-xs font-semibold text-purple-600 hover:text-purple-700"
                  >
                    View All Notifications →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen((o) => !o)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                {user?.email?.[0]?.toUpperCase()}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-slate-900 truncate max-w-[90px]">{user?.email.split("@")[0]}</p>
                <p className="text-[10px] text-slate-500 uppercase">{user?.role}</p>
              </div>
              <ChevronDown size={12} className="text-slate-400 hidden lg:block" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-dropdown py-1.5 z-50">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-900 truncate">{user?.email}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Role: {user?.role}</p>
                </div>

                <div className="p-1">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      setSwitchOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <UserCheck size={14} className="text-purple-600" /> Switch Persona
                  </button>
                  <Link
                    to="/dashboard"
                    onClick={() => setProfileOpen(false)}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <GraduationCap size={14} className="text-purple-600" /> My Dashboard
                  </Link>
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Search Overlay if open */}
      {mobileSearchOpen && (
        <div className="md:hidden bg-white px-4 py-3 border-b border-slate-200 shadow-sm z-20 animate-in slide-in-from-top-2 duration-150">
          <div className="relative flex items-center">
            <Search size={15} className="absolute left-3 text-slate-400 pointer-events-none" />
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search students, reg. no, or emails..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 focus:bg-white text-slate-900"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setMobileSearchOpen(false);
                  navigate(`/students?search=${encodeURIComponent(searchQuery)}`);
                }
              }}
            />
          </div>
          {searchQuery.trim().length >= 2 && searchResults.length > 0 && (
            <div className="mt-2 divide-y divide-slate-100 max-h-48 overflow-y-auto">
              {searchResults.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setMobileSearchOpen(false);
                    setSearchQuery("");
                    navigate(`/students/${s.id}`);
                  }}
                  className="w-full text-left py-2 px-1 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{s.fullName}</p>
                    <p className="text-[10px] text-slate-400">{s.registerNumber}</p>
                  </div>
                  <ArrowRight size={12} className="text-slate-400" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Navigation Drawer for Mobile */}
      <MobileNavDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
