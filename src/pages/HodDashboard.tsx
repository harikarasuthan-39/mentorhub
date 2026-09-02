import { useEffect, useState } from "react";
import {
  Users,
  UserCog,
  CalendarCheck,
  Clock,
  AlertTriangle,
  ShieldAlert,
  TrendingDown,
  Briefcase,
  Filter,
  RotateCcw,
  Building2,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { api, apiErrorMessage } from "../api/client";
import { StatCard } from "../components/ui/StatCard";
import { ChartPanel } from "../components/charts/ChartPanel";
import { RiskDistributionChart } from "../components/charts/RiskDistributionChart";
import { BarDistributionChart } from "../components/charts/BarDistributionChart";
import { RiskDot } from "../components/ui/RiskSeal";
import { LoadingState, ErrorState } from "../components/ui/LoadingState";
import { Department, Mentor } from "../types";
import { Link, useNavigate } from "react-router-dom";

export default function HodDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [filters, setFilters] = useState({
    departmentId: "",
    year: "",
    section: "",
    mentorId: "",
  });

  useEffect(() => {
    api.get("/departments").then((res) => setDepartments(res.data.data));
    api.get("/departments/mentors/all").then((res) => setMentors(res.data.data));
  }, []);

  useEffect(() => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    api
      .get("/dashboard/hod", { params })
      .then((res) => setData(res.data.data))
      .catch((err) => setError(apiErrorMessage(err)));
  }, [filters]);

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  function resetFilters() {
    setFilters({ departmentId: "", year: "", section: "", mentorId: "" });
  }

  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!data) return <LoadingState label="Synthesizing department intelligence..." />;

  const { cards, charts, priorityStudents } = data;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner / Executive Overview */}
      <div className="p-6 md:p-7 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium uppercase bg-slate-800 text-slate-300 border border-slate-700">
                <Sparkles size={11} className="text-purple-400" /> Institutional Governance
              </span>
              <span className="text-xs text-slate-400 font-medium">Department Analytics Core</span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
              Institutional Mentoring Overview
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl font-normal leading-relaxed">
              Real-time tracking of <span className="font-semibold text-white">{cards.totalStudents} students</span> across{" "}
              <span className="font-semibold text-slate-200">{cards.totalMentors} faculty advisors</span>.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => navigate("/reports")}
              className="btn-primary text-xs py-2 px-3.5"
            >
              Generate NAAC Report
            </button>
            <button
              onClick={() => navigate("/issues")}
              className="inline-flex items-center gap-1.5 bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 text-xs font-medium py-2 px-3.5 rounded-xl transition-colors"
            >
              Review Escalations
            </button>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="app-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-navy">
          <Filter size={14} className="text-slate-500" />
          <span>Cohort Filters</span>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200/70">
              {activeFiltersCount} active
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={filters.departmentId}
            onChange={(e) => setFilters((f) => ({ ...f, departmentId: e.target.value }))}
            className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:border-purple-600 focus:bg-white transition-colors"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.code})
              </option>
            ))}
          </select>

          <select
            value={filters.year}
            onChange={(e) => setFilters((f) => ({ ...f, year: e.target.value }))}
            className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:border-purple-600 focus:bg-white transition-colors"
          >
            <option value="">All Academic Years</option>
            {["I", "II", "III", "IV"].map((y) => (
              <option key={y} value={y}>
                Year {y}
              </option>
            ))}
          </select>

          <select
            value={filters.mentorId}
            onChange={(e) => setFilters((f) => ({ ...f, mentorId: e.target.value }))}
            className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:border-purple-600 focus:bg-white transition-colors"
          >
            <option value="">All Faculty Mentors</option>
            {mentors.map((m) => (
              <option key={m.id} value={m.id}>
                {m.fullName}
              </option>
            ))}
          </select>

          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-2 rounded-xl flex items-center gap-1 transition-colors"
            >
              <RotateCcw size={13} /> Reset
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards - Compact 1-line (xl) / 2-line (sm) grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-2 sm:gap-2.5">
        <StatCard
          label="Total Students"
          value={cards.totalStudents}
          icon={<Users size={14} />}
          accent="navy"
          onClick={() => navigate("/students")}
          compact
        />
        <StatCard
          label="Active Mentors"
          value={cards.totalMentors}
          icon={<UserCog size={14} />}
          accent="navy"
          compact
        />
        <StatCard
          label="Sessions"
          value={cards.meetingsCompleted}
          icon={<CalendarCheck size={14} />}
          accent="navy"
          compact
        />
        <StatCard
          label="Follow-ups"
          value={cards.pendingFollowUps}
          icon={<Clock size={14} />}
          accent={cards.pendingFollowUps > 0 ? "risk-high" : "navy"}
          onClick={() => navigate("/actions")}
          compact
        />
        <StatCard
          label="High Risk"
          value={cards.highRiskStudents}
          icon={<AlertTriangle size={14} />}
          accent={cards.highRiskStudents > 0 ? "risk-high" : "risk-low"}
          compact
        />
        <StatCard
          label="Critical Cases"
          value={cards.criticalStudents}
          icon={<ShieldAlert size={14} />}
          accent={cards.criticalStudents > 0 ? "risk-high" : "risk-low"}
          compact
        />
        <StatCard
          label="Att. < 85%"
          value={cards.attendanceBelow85}
          icon={<TrendingDown size={14} />}
          accent={cards.attendanceBelow85 > 0 ? "risk-high" : "risk-low"}
          compact
        />
        <StatCard
          label="Placement Ready"
          value={cards.placementEligible}
          icon={<Briefcase size={14} />}
          accent="risk-low"
          compact
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <ChartPanel
          title="Mentor Mentoring Activity"
          subtitle="Number of 1:1 sessions completed per faculty advisor"
          className="lg:col-span-2"
        >
          <BarDistributionChart
            data={charts.mentorWiseActivity.map((m: any) => ({
              name: m.mentor.replace("Dr. ", ""),
              value: m.meetings,
            }))}
            dataKey="value"
            color="#6366F1"
          />
        </ChartPanel>

        <ChartPanel
          title="Overall Department Risk"
          subtitle="AI synthesized vulnerability distribution"
        >
          <RiskDistributionChart data={charts.riskDistribution} />
        </ChartPanel>

        <ChartPanel
          title="Department Attendance Bands"
          subtitle="Distribution of attendance percentiles"
        >
          <BarDistributionChart
            data={Object.entries(charts.attendanceDistribution).map(([name, value]) => ({
              name,
              value,
            }))}
            color="#10B981"
          />
        </ChartPanel>

        <ChartPanel
          title="Categorized Issue Frequencies"
          subtitle="Top identified concern areas across department"
          className="lg:col-span-2"
        >
          <BarDistributionChart
            data={charts.issueCategoryDistribution.map((i: any) => ({
              name: i.category.replace(/_/g, " "),
              value: i.count,
            }))}
            color="#475569"
          />
        </ChartPanel>
      </div>

      {/* Critical Students Requiring Attention */}
      <div className="app-card overflow-hidden">
        <div className="p-4 md:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <h2 className="font-display text-sm font-bold text-navy">
                Departmental High-Risk Students
              </h2>
            </div>
            <p className="text-xs text-slate-muted mt-0.5">
              Escalated students requiring HOD-level mentoring review or parent intimation.
            </p>
          </div>
          <Link
            to="/students"
            className="text-xs font-medium text-slate-600 hover:text-purple-600 inline-flex items-center gap-1 shrink-0"
          >
            <span>View all students</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {priorityStudents.length === 0 ? (
            <div className="p-8 text-center text-slate-muted">
              <ShieldCheck size={26} className="mx-auto text-emerald-500 mb-2" />
              <p className="text-sm font-semibold text-navy">No critical flags at this time</p>
              <p className="text-xs mt-0.5">Departmental metrics are operating within healthy parameters.</p>
            </div>
          ) : (
            priorityStudents.map((s: any, idx: number) => (
              <div
                key={s.id}
                className="p-4 md:px-6 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold font-mono flex items-center justify-center border border-slate-200/70 shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <Link
                      to={`/students/${s.id}`}
                      className="text-sm font-semibold text-navy hover:text-purple-600 truncate block transition-colors"
                    >
                      {s.name}
                    </Link>
                    <p className="text-xs text-slate-muted mt-0.5">
                      Assigned to <span className="font-medium text-slate-700">{s.mentorName || "Faculty Advisor"}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <RiskDot level={s.riskLevel} />
                  <Link
                    to={`/students/${s.id}`}
                    className="btn-secondary text-xs py-1.5 px-3"
                  >
                    View Dossier →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
