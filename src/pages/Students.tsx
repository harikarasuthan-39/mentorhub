import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  X,
  LayoutGrid,
  List,
  Filter,
  GraduationCap,
  Sparkles,
  Phone,
  Mail,
  ArrowRight,
  TrendingDown,
  Building2,
  SlidersHorizontal,
  UserCheck,
} from "lucide-react";
import { api, apiErrorMessage } from "../api/client";
import { LoadingState, ErrorState, EmptyState } from "../components/ui/LoadingState";
import { RiskDot } from "../components/ui/RiskSeal";
import { Badge } from "../components/ui/Badge";
import { useAuth } from "../context/AuthContext";
import { Department, Mentor, Student } from "../types";

export default function Students() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(params.get("search") ?? "");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [riskFilter, setRiskFilter] = useState<string>("ALL");
  const [yearFilter, setYearFilter] = useState<string>("ALL");
  const [showModal, setShowModal] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);

  function load() {
    setLoading(true);
    api
      .get("/students", { params: { search } })
      .then((res) => setStudents(res.data.data.items))
      .catch((err) => setError(apiErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    api.get("/departments").then((res) => setDepartments(res.data.data));
    api.get("/departments/mentors/all").then((res) => setMentors(res.data.data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setParams(search ? { search } : {});
      load();
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Client-side quick filter
  const filteredStudents = students.filter((s) => {
    if (riskFilter !== "ALL") {
      if (!s.latestRisk && riskFilter !== "NONE") return false;
      if (s.latestRisk && s.latestRisk.riskLevel !== riskFilter) return false;
    }
    if (yearFilter !== "ALL" && s.year !== yearFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Directory</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/70">
              {filteredStudents.length} Active Records
            </span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Student Cohort
          </h1>
        </div>

        {user?.role !== "STUDENT" && (
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary text-xs py-2 px-3.5 self-start sm:self-auto shadow-xs"
          >
            <Plus size={14} /> Add New Mentee
          </button>
        )}
      </div>

      {/* Filter and Control Bar */}
      <div className="app-card p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by name, register number..."
            className="w-full pl-9 pr-3.5 py-1.5 text-xs md:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Risk Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-xl px-3 py-1.5 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:border-purple-600 focus:bg-white transition-colors"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="LOW">Low Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="HIGH">High Risk</option>
            <option value="CRITICAL">Critical Risk</option>
          </select>

          {/* Year Filter */}
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-xl px-3 py-1.5 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:border-purple-600 focus:bg-white transition-colors"
          >
            <option value="ALL">All Years</option>
            <option value="I">Year I</option>
            <option value="II">Year II</option>
            <option value="III">Year III</option>
            <option value="IV">Year IV</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-xl">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "table" ? "bg-white shadow-xs text-slate-900" : "text-slate-500 hover:text-slate-900"
              }`}
              title="Table View"
            >
              <List size={15} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "grid" ? "bg-white shadow-xs text-slate-900" : "text-slate-500 hover:text-slate-900"
              }`}
              title="Grid View"
            >
              <LayoutGrid size={15} />
            </button>
          </div>
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={load} />}
      {loading && !error && <LoadingState label="Loading students directory..." />}
      {!loading && !error && filteredStudents.length === 0 && (
        <EmptyState
          title="No students found"
          hint="Try refining your search keyword or clearing the risk/year filters."
          action={search || riskFilter !== "ALL" || yearFilter !== "ALL" ? {
            label: "Clear Filters",
            onClick: () => {
              setSearch("");
              setRiskFilter("ALL");
              setYearFilter("ALL");
            },
          } : undefined}
        />
      )}

      {/* TABLE VIEW */}
      {!loading && filteredStudents.length > 0 && viewMode === "table" && (
        <div className="app-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="px-5 py-3">Student Information</th>
                  <th className="px-5 py-3">Register No.</th>
                  <th className="px-5 py-3">Year / Sec</th>
                  <th className="px-5 py-3">Attendance</th>
                  <th className="px-5 py-3">CGPA / Arrears</th>
                  <th className="px-5 py-3">AI Risk Seal</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-slate-50/60 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/students/${s.id}`)}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200/70 shrink-0">
                          {s.fullName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-purple-600 transition-colors">
                            {s.fullName}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">{s.email || "No email"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs font-medium text-slate-700">
                      {s.registerNumber}
                    </td>
                    <td className="px-5 py-3.5 text-slate-700">
                      <span className="font-semibold">Yr {s.year}</span> · Sec {s.section}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold ${
                            s.attendancePercentage < 75
                              ? "text-rose-600 font-bold"
                              : s.attendancePercentage < 85
                              ? "text-amber-600 font-bold"
                              : "text-slate-900"
                          }`}
                        >
                          {s.attendancePercentage}%
                        </span>
                        {s.attendancePercentage < 75 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200/60">
                            Low
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-slate-900">{s.cgpa.toFixed(1)}</span>
                      <span className="text-slate-400 text-xs"> CGPA</span>
                      {s.arrearCount > 0 && (
                        <span className="ml-2 text-[11px] font-semibold text-rose-600">
                          ({s.arrearCount} Arrears)
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {s.latestRisk ? (
                        <RiskDot level={s.latestRisk.riskLevel} />
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Pending Review</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        to={`/students/${s.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="btn-secondary text-xs py-1.5 px-3"
                      >
                        Profile →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* GRID VIEW */}
      {!loading && filteredStudents.length > 0 && viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((s) => (
            <div
              key={s.id}
              onClick={() => navigate(`/students/${s.id}`)}
              className="app-card p-5 hover:shadow-cardHover transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm flex items-center justify-center border border-slate-200/70 shrink-0">
                      {s.fullName[0]}
                    </div>
                    <div>
                      <p className="font-display text-sm font-semibold text-slate-900 hover:text-purple-600 transition-colors">
                        {s.fullName}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">{s.registerNumber}</p>
                    </div>
                  </div>
                  {s.latestRisk && <RiskDot level={s.latestRisk.riskLevel} compact />}
                </div>

                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center my-3">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Year/Sec</p>
                    <p className="text-xs font-semibold text-slate-900 mt-0.5">{s.year} - {s.section}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">CGPA</p>
                    <p className="text-xs font-semibold text-slate-900 mt-0.5">{s.cgpa.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Attendance</p>
                    <p className={`text-xs font-semibold mt-0.5 ${s.attendancePercentage < 75 ? "text-rose-600" : "text-slate-900"}`}>
                      {s.attendancePercentage}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <span className="text-slate-500">
                  {s.arrearCount > 0 ? `${s.arrearCount} Backlogs` : "0 Backlogs"}
                </span>
                <span className="font-semibold text-purple-600 flex items-center gap-1">
                  View Dossier <ArrowRight size={13} />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Student Modal */}
      {showModal && (
        <AddStudentModal
          departments={departments}
          mentors={mentors}
          onClose={() => setShowModal(false)}
          onCreated={() => {
            setShowModal(false);
            load();
          }}
        />
      )}
    </div>
  );
}

function AddStudentModal({
  departments,
  mentors,
  onClose,
  onCreated,
}: {
  departments: Department[];
  mentors: Mentor[];
  onClose: () => void;
  onCreated: () => void;
}) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    registerNumber: "",
    year: "I",
    section: "A",
    departmentId: departments[0]?.id ?? "",
    mentorId: user?.mentor?.id ?? mentors[0]?.id ?? "",
    email: "",
    phone: "",
    attendancePercentage: 100,
    cgpa: 8.0,
    arrearCount: 0,
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.post("/students", form);
      onCreated();
    } catch (err) {
      setError(apiErrorMessage(err, "Unable to save student. Please check the fields and try again."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
      <div className="app-card w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 md:p-7 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
          <div>
            <h2 className="font-display text-base font-bold text-slate-900">Add New Mentee</h2>
            <p className="text-xs text-slate-500 mt-0.5">Enter academic details to enroll student into mentoring system</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Field label="Full Name" full required>
              <input
                required
                className="w-full px-3.5 py-2 text-xs md:text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-purple-600 font-medium"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="e.g. Rahul Sundaram"
              />
            </Field>

            <Field label="Register Number" required>
              <input
                required
                className="w-full px-3.5 py-2 text-xs md:text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-purple-600 font-mono"
                value={form.registerNumber}
                onChange={(e) => setForm({ ...form, registerNumber: e.target.value })}
                placeholder="e.g. 71762104001"
              />
            </Field>

            <Field label="Email Address">
              <input
                type="email"
                className="w-full px-3.5 py-2 text-xs md:text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-purple-600 font-medium"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="student@university.edu"
              />
            </Field>

            <Field label="Academic Year">
              <select
                className="w-full px-3 py-2 text-xs md:text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-purple-600 font-medium"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
              >
                {["I", "II", "III", "IV"].map((y) => (
                  <option key={y} value={y}>Year {y}</option>
                ))}
              </select>
            </Field>

            <Field label="Section">
              <select
                className="w-full px-3 py-2 text-xs md:text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-purple-600 font-medium"
                value={form.section}
                onChange={(e) => setForm({ ...form, section: e.target.value })}
              >
                {["A", "B", "C", "D"].map((s) => (
                  <option key={s} value={s}>Section {s}</option>
                ))}
              </select>
            </Field>

            <Field label="Department" full>
              <select
                className="w-full px-3 py-2 text-xs md:text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-purple-600 font-medium"
                value={form.departmentId}
                onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
            </Field>

            {user?.role === "HOD" && (
              <Field label="Assign Faculty Mentor" full>
                <select
                  className="w-full px-3 py-2 text-xs md:text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-purple-600 font-medium"
                  value={form.mentorId}
                  onChange={(e) => setForm({ ...form, mentorId: e.target.value })}
                >
                  {mentors.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.fullName}
                    </option>
                  ))}
                </select>
              </Field>
            )}

            <Field label="Attendance Percentage (%)">
              <input
                type="number"
                min={0}
                max={100}
                className="w-full px-3.5 py-2 text-xs md:text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-purple-600"
                value={form.attendancePercentage}
                onChange={(e) => setForm({ ...form, attendancePercentage: Number(e.target.value) })}
              />
            </Field>

            <Field label="Current CGPA">
              <input
                type="number"
                step="0.01"
                min={0}
                max={10}
                className="w-full px-3.5 py-2 text-xs md:text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-purple-600"
                value={form.cgpa}
                onChange={(e) => setForm({ ...form, cgpa: Number(e.target.value) })}
              />
            </Field>

            <Field label="Active Arrears / Backlogs">
              <input
                type="number"
                min={0}
                className="w-full px-3.5 py-2 text-xs md:text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-purple-600"
                value={form.arrearCount}
                onChange={(e) => setForm({ ...form, arrearCount: Number(e.target.value) })}
              />
            </Field>

            <Field label="Contact Phone">
              <input
                className="w-full px-3.5 py-2 text-xs md:text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-purple-600"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 98765 43210"
              />
            </Field>
          </div>

          {error && <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-xl">{error}</p>}

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !form.fullName || !form.registerNumber}
              className="btn-primary text-xs px-5 py-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {submitting ? "Saving Student..." : "Enroll Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  full,
  required,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
  required?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );
}

