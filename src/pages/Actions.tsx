import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  User,
  CheckCircle,
  Circle,
  Search,
  ArrowRight,
  ListTodo,
} from "lucide-react";
import { api, apiErrorMessage } from "../api/client";
import { LoadingState, ErrorState, EmptyState } from "../components/ui/LoadingState";
import { Badge } from "../components/ui/Badge";
import { ActionItem } from "../types";
import { useAuth } from "../context/AuthContext";
import { BackButton } from "../components/ui/BackButton";

const STATUS_TONE: Record<string, "neutral" | "success" | "warning" | "danger" | "info"> = {
  PENDING: "warning",
  IN_PROGRESS: "info",
  COMPLETED: "success",
  OVERDUE: "danger",
};

export default function Actions() {
  const { user } = useAuth();
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [completingId, setCompletingId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    api
      .get("/actions", { params: statusFilter ? { status: statusFilter } : {} })
      .then((res) => setActions(res.data.data))
      .catch((err) => setError(apiErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(load, [statusFilter]);

  async function markComplete(id: string) {
    setCompletingId(id);
    try {
      await api.put(`/actions/${id}`, { status: "COMPLETED" });
      setActions((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: "COMPLETED" as any } : item))
      );
    } catch (err) {
      setError(apiErrorMessage(err, "Failed to complete action item."));
    } finally {
      setCompletingId(null);
    }
  }

  const filteredActions = actions.filter((a) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      a.description.toLowerCase().includes(q) ||
      a.student?.fullName?.toLowerCase().includes(q) ||
      a.assignedTo.toLowerCase().includes(q)
    );
  });

  const pendingCount = actions.filter((a) => a.status === "PENDING").length;
  const inProgressCount = actions.filter((a) => a.status === "IN_PROGRESS").length;
  const overdueCount = actions.filter((a) => a.status === "OVERDUE").length;
  const completedCount = actions.filter((a) => a.status === "COMPLETED").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-6xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <BackButton fallback="/dashboard" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Advisory Commitments</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              {actions.length} Tasks
            </span>
          </div>
          <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Mentoring Action Roadmap
          </h1>
        </div>

        {/* Status Breakdown Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {overdueCount > 0 && (
            <div className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200/80 flex items-center gap-1.5 text-xs font-semibold text-rose-700">
              <AlertCircle size={13} /> {overdueCount} Overdue
            </div>
          )}
          <div className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center gap-1.5 text-xs font-semibold text-amber-700">
            <Clock size={13} /> {pendingCount + inProgressCount} In Progress
          </div>
          <div className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
            <CheckCircle2 size={13} /> {completedCount} Finished
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="app-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white/90">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks by mentee, keyword, or assignee..."
            className="w-full pl-9 pr-3 py-2 text-xs md:text-sm bg-surface rounded-xl border border-line focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: "", label: "All Tasks" },
            { id: "PENDING", label: "Pending" },
            { id: "IN_PROGRESS", label: "In Progress" },
            { id: "OVERDUE", label: "Overdue" },
            { id: "COMPLETED", label: "Completed" },
          ].map((s) => (
            <button
              key={s.id || "all"}
              onClick={() => setStatusFilter(s.id)}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === s.id
                  ? "bg-navy text-gold border-navy shadow-xs"
                  : "bg-white border-line text-slate-muted hover:text-navy hover:bg-slate-50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={load} />}
      {loading && !error && <LoadingState label="Loading action commitments..." />}
      {!loading && filteredActions.length === 0 && (
        <EmptyState
          title="No action items found"
          hint="Action tasks are generated automatically from advisory meetings or assigned directly."
          icon={<ListTodo size={32} className="text-slate-400" />}
        />
      )}

      {/* Action Items List */}
      <div className="space-y-3">
        {filteredActions.map((a) => {
          const isOverdue = a.status === "OVERDUE" || (new Date(a.targetCompletionDate) < new Date() && a.status !== "COMPLETED");
          const isCompleted = a.status === "COMPLETED";

          return (
            <div
              key={a.id}
              className={`app-card p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 border-l-4 ${
                isCompleted
                  ? "border-l-emerald-500 opacity-80"
                  : isOverdue
                  ? "border-l-rose-500"
                  : "border-l-brand-500"
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                {user?.role === "MENTOR" && !isCompleted ? (
                  <button
                    disabled={completingId === a.id}
                    onClick={() => markComplete(a.id)}
                    className="mt-0.5 text-slate-300 hover:text-emerald-600 transition-colors shrink-0 cursor-pointer disabled:opacity-50"
                    title="Mark as completed"
                  >
                    <Circle size={20} />
                  </button>
                ) : isCompleted ? (
                  <CheckCircle size={20} className="mt-0.5 text-emerald-600 shrink-0" />
                ) : (
                  <Circle size={20} className="mt-0.5 text-slate-300 shrink-0" />
                )}

                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {a.student && (
                      <Link
                        to={`/students/${a.student.id}`}
                        className="font-display text-xs md:text-sm font-bold text-navy hover:text-brand-600 transition-colors"
                      >
                        {a.student.fullName}
                      </Link>
                    )}
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.2 rounded bg-slate-100 text-slate-600">
                      {a.actionType?.replace(/_/g, " ") || "GENERAL"}
                    </span>
                    <span className="text-xs text-slate-muted">
                      Assigned to: <strong className="text-navy font-semibold">{a.assignedTo}</strong>
                    </span>
                  </div>

                  <p
                    className={`text-sm leading-relaxed ${
                      isCompleted ? "line-through text-slate-400 font-normal" : "text-navy font-semibold"
                    }`}
                  >
                    {a.description}
                  </p>

                  <p className="text-xs text-slate-muted flex items-center gap-1.5 pt-0.5">
                    <Calendar size={12} />
                    <span>
                      Target Due: <strong>{new Date(a.targetCompletionDate).toLocaleDateString(undefined, { dateStyle: "medium" })}</strong>
                    </span>
                  </p>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-line">
                <Badge tone={STATUS_TONE[a.status]}>{a.status.replace("_", " ")}</Badge>

                {user?.role === "MENTOR" && !isCompleted && (
                  <button
                    disabled={completingId === a.id}
                    onClick={() => markComplete(a.id)}
                    className="text-xs font-bold text-brand-600 hover:text-brand-800 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    {completingId === a.id ? "Saving..." : "Complete Task"} <ArrowRight size={11} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

