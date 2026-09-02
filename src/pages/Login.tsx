import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserCheck,
  Shield,
  BookOpen,
  Sparkles,
  ArrowRight,
  BrainCircuit,
  Lock,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiErrorMessage } from "../api/client";
import { MentorHubLogo } from "../components/ui/MentorHubLogo";

const QUICK_ACCOUNTS = [
  {
    role: "Department Head",
    tag: "HOD",
    email: "hod@university.edu",
    name: "Dr. Arvind Swamy",
    icon: Shield,
    color: "bg-purple-500/10 text-purple-700 border-purple-200 hover:border-purple-400 hover:bg-purple-500/20",
  },
  {
    role: "Faculty Mentor",
    tag: "Mentor",
    email: "mentor1@university.edu",
    name: "Dr. Priya Raman",
    icon: UserCheck,
    color: "bg-indigo-500/10 text-indigo-700 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-500/20",
  },
  {
    role: "Student Mentee",
    tag: "Student",
    email: "student1@university.edu",
    name: "Arun Kumar",
    icon: BookOpen,
    color: "bg-emerald-500/10 text-emerald-700 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-500/20",
  },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(apiErrorMessage(err, "Invalid email or password."));
    } finally {
      setLoading(false);
    }
  }

  async function handleQuickLogin(demoEmail: string) {
    setEmail(demoEmail);
    setPassword("Password@123");
    setError("");
    setLoading(true);
    try {
      await login(demoEmail, "Password@123");
      navigate("/dashboard");
    } catch (err) {
      setError(apiErrorMessage(err, "Failed to login with demo credentials."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-navy-dark flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background ambient decorative shapes in purple and iris */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-purple-600/25 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-indigo-600/25 blur-3xl pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #C084FC 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-purple-500/20 bg-white">
        {/* Sign In Form & 1-Click Fast Persona Switch */}
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="mb-4">
              <MentorHubLogo size="md" animate />
            </div>
            <h2 className="font-display text-2xl font-black text-navy tracking-tight">Welcome Back</h2>
            <p className="text-xs text-slate-muted mt-1">
              Sign in with your academic credentials or use a 1-click test persona below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mentor@university.edu"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-line rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all placeholder:text-slate-muted/60 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-line rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all placeholder:text-slate-muted/60 font-medium"
                />
              </div>
            </div>

            {error && (
              <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-xl font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <>
                  <span>Sign in to MentorHUB</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* 1-Click Fast Persona Cards */}
          <div className="mt-6 pt-5 border-t border-line">
            <p className="text-[11px] font-bold uppercase tracking-wider text-purple-900 mb-2.5 flex items-center justify-between">
              <span>⚡ Fast 1-Click Demo Logins</span>
              <span className="text-[10px] text-slate-muted lowercase font-normal">(Instant test mode)</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {QUICK_ACCOUNTS.map((acc) => {
                const Icon = acc.icon;
                return (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => handleQuickLogin(acc.email)}
                    disabled={loading}
                    className={`p-2.5 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between cursor-pointer ${acc.color}`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-white shadow-xs border border-line">
                        {acc.tag}
                      </span>
                      <Icon size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-navy truncate">{acc.name}</p>
                      <p className="text-[10px] text-slate-muted truncate font-mono mt-0.5">{acc.email.split("@")[0]}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-muted text-center mt-3">
              Universal Demo Password: <span className="font-mono font-bold text-purple-700">Password@123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

