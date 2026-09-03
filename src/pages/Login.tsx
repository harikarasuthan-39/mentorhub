import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  ArrowRight,
  Lock,
  Mail,
  Sparkles,
  Info,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiErrorMessage } from "../api/client";
import { MentorHubLogo } from "../components/ui/MentorHubLogo";
import { OfflineBanner } from "../components/ui/OfflineBanner";
import { PlatformIntroModal } from "../components/ui/PlatformIntroModal";
import { ProfessionalIntro } from "../components/ui/ProfessionalIntro";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showIntroModal, setShowIntroModal] = useState(false);

  async function performLogin(targetEmail: string, targetPass: string) {
    setError("");
    setLoading(true);
    try {
      await login(targetEmail, targetPass);
      navigate("/dashboard");
    } catch (err) {
      setError(apiErrorMessage(err, "Invalid institutional email or password."));
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await performLogin(email, password);
  }

  function handleDemoSelect(targetEmail: string) {
    setEmail(targetEmail);
    setPassword("Password@123");
    performLogin(targetEmail, "Password@123");
  }

  return (
    <div className="min-h-screen bg-[#0A0716] text-white flex flex-col justify-between relative overflow-x-hidden p-4 sm:p-6 md:p-10">
      {/* Background ambient decorative shapes in purple and iris */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #C084FC 1px, transparent 0)",
          backgroundSize: "36px 36px",
        }}
      />

      <OfflineBanner />

      {/* Top Bar with Brand & Interactive Platform Tour CTA */}
      <header className="relative z-10 max-w-7xl w-full mx-auto flex items-center justify-between py-2 border-b border-white/10 pb-4">
        <MentorHubLogo size="md" theme="dark" animate />
        <button
          onClick={() => setShowIntroModal(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-400/30 text-xs font-semibold backdrop-blur-md transition-all cursor-pointer shadow-sm"
        >
          <Sparkles size={14} className="text-purple-300" />
          <span>Platform Overview & Tour</span>
        </button>
      </header>

      {/* Main Split-Screen Container */}
      <main className="relative z-10 max-w-7xl w-full mx-auto my-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Side: Professional Application Intro & Capabilities */}
        <div className="lg:col-span-7">
          <ProfessionalIntro
            variant="dark"
            onSelectDemo={(targetEmail) => handleDemoSelect(targetEmail)}
            onOpenTour={() => setShowIntroModal(true)}
            showDemoLaunchers={true}
          />
        </div>

        {/* Right Side: Institutional Authentication Box */}
        <div className="lg:col-span-5">
          <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-purple-500/20 bg-white text-navy">
            <div className="p-8 sm:p-10 flex flex-col justify-center">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="mb-3">
                  <MentorHubLogo size="md" animate />
                </div>
                <h2 className="font-display text-xl font-black text-navy tracking-tight">Institutional Portal Login</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Sign in with your university credentials or click any demo persona on the left.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                    Institutional Email
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@university.edu"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-line rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all placeholder:text-slate-400 font-medium text-slate-800"
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
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-line rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all placeholder:text-slate-400 font-medium text-slate-800"
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

              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col items-center gap-2 text-center text-xs text-slate-400">
                <button
                  type="button"
                  onClick={() => setShowIntroModal(true)}
                  className="text-purple-700 hover:text-purple-800 font-semibold inline-flex items-center gap-1.5 hover:underline cursor-pointer"
                >
                  <Info size={14} />
                  <span>Learn more about MentorHUB capabilities</span>
                </button>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <ShieldCheck size={13} className="text-purple-600" />
                  <span>Authorized Higher Education Mentoring System</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto py-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
        <p>© 2026 MentorHUB. GUIDE • CONNECT • GROW.</p>
        <p className="flex items-center gap-1.5 text-purple-300 font-mono text-[11px]">
          <ShieldCheck size={13} />
          <span>Enterprise Mentoring & Academic Advisory Intelligence</span>
        </p>
      </footer>

      {/* Full-Feature Interactive Platform Overview Modal */}
      <PlatformIntroModal
        isOpen={showIntroModal}
        onClose={() => setShowIntroModal(false)}
        onSelectRoleLogin={(email) => handleDemoSelect(email)}
      />
    </div>
  );
}



