import React, { useState, useEffect } from "react";
import {
  Clock,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Circle,
  Plus,
  Flame,
  Brain,
  X,
} from "lucide-react";
import { BackButton } from "../components/ui/BackButton";

interface StudyTask {
  id: string;
  subject: string;
  topic: string;
  durationMinutes: number;
  priority: "HIGH" | "MEDIUM" | "LOW";
  completed: boolean;
  day: string;
}

const INITIAL_TASKS: StudyTask[] = [
  {
    id: "task-1",
    subject: "Distributed Systems & Cloud",
    topic: "Raft Consensus Algorithm & Vector Clocks",
    durationMinutes: 45,
    priority: "HIGH",
    completed: true,
    day: "Today",
  },
  {
    id: "task-2",
    subject: "Data Structures & Algos",
    topic: "Trie & Segment Tree range query implementations",
    durationMinutes: 60,
    priority: "HIGH",
    completed: false,
    day: "Today",
  },
  {
    id: "task-3",
    subject: "Machine Learning & AI",
    topic: "Transformer Attention mechanism math derivations",
    durationMinutes: 40,
    priority: "MEDIUM",
    completed: false,
    day: "Today",
  },
  {
    id: "task-4",
    subject: "Compiler Design",
    topic: "LR(1) Parser tables & syntax tree generation",
    durationMinutes: 45,
    priority: "MEDIUM",
    completed: false,
    day: "Tomorrow",
  },
  {
    id: "task-5",
    subject: "Software Engineering & ERP",
    topic: "Microservices saga pattern & event sourcing",
    durationMinutes: 30,
    priority: "LOW",
    completed: false,
    day: "Tomorrow",
  },
];

const UPCOMING_EXAMS = [
  {
    subject: "Distributed Systems (CS601)",
    date: "Sep 18, 2026",
    daysLeft: 16,
    credits: 4,
    syllabusProgress: 78,
  },
  {
    subject: "Machine Learning Foundations (CS602)",
    date: "Sep 22, 2026",
    daysLeft: 20,
    credits: 4,
    syllabusProgress: 65,
  },
  {
    subject: "Compiler Design (CS603)",
    date: "Sep 27, 2026",
    daysLeft: 25,
    credits: 3,
    syllabusProgress: 52,
  },
];

export default function StudyPlanner() {
  const [tasks, setTasks] = useState<StudyTask[]>(INITIAL_TASKS);
  const [activeTab, setActiveTab] = useState<"TODAY" | "WEEK" | "EXAMS">("TODAY");

  // Pomodoro Focus Timer State
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<"FOCUS" | "SHORT_BREAK" | "LONG_BREAK">("FOCUS");
  const [completedSessions, setCompletedSessions] = useState(2);

  // Add Task Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [newDuration, setNewDuration] = useState("45");
  const [newPriority, setNewPriority] = useState<"HIGH" | "MEDIUM" | "LOW">("MEDIUM");

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
      if (timerMode === "FOCUS") {
        setCompletedSessions((c) => c + 1);
        setTimerMode("SHORT_BREAK");
        setTimeLeft(5 * 60);
      } else {
        setTimerMode("FOCUS");
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, timerMode]);

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = (mode: "FOCUS" | "SHORT_BREAK" | "LONG_BREAK") => {
    setIsTimerRunning(false);
    setTimerMode(mode);
    if (mode === "FOCUS") setTimeLeft(25 * 60);
    if (mode === "SHORT_BREAK") setTimeLeft(5 * 60);
    if (mode === "LONG_BREAK") setTimeLeft(15 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newTopic.trim()) return;

    const newTask: StudyTask = {
      id: `task-${Date.now()}`,
      subject: newSubject,
      topic: newTopic,
      durationMinutes: parseInt(newDuration, 10) || 30,
      priority: newPriority,
      completed: false,
      day: "Today",
    };

    setTasks((prev) => [newTask, ...prev]);
    setShowAddModal(false);
    setNewSubject("");
    setNewTopic("");
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100) || 0;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header Banner with Back Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 p-5 sm:p-6 md:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <BackButton fallback="/dashboard" />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Sparkles size={12} className="text-purple-400" /> Spaced Repetition Engine
            </span>
            <span className="text-xs text-slate-400">Deep Work & Schedule</span>
          </div>
          <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white">
            Personalized Study Planner
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed">
            AI-optimized daily timetable, active recall milestones, and deep focus time-boxing.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 relative z-10 self-start md:self-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary text-xs py-2.5 px-4 shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <Plus size={15} /> Add Study Block
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Schedule & Daily Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Overview Bar */}
          <div className="app-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shrink-0">
                <Flame size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Daily Target</p>
                <h3 className="font-display text-base font-bold text-slate-900">
                  {completedCount} of {tasks.length} Modules Completed
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-4 min-w-[200px]">
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Efficiency</span>
                  <span className="font-semibold text-purple-700">{progressPercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Task View Tabs & List */}
          <div className="app-card overflow-hidden">
            <div className="p-4 md:px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("TODAY")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === "TODAY"
                      ? "bg-purple-600 text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Today's Schedule ({tasks.filter((t) => t.day === "Today").length})
                </button>
                <button
                  onClick={() => setActiveTab("WEEK")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === "WEEK"
                      ? "bg-purple-600 text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Weekly Roadmap
                </button>
                <button
                  onClick={() => setActiveTab("EXAMS")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === "EXAMS"
                      ? "bg-purple-600 text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Exam Deadlines
                </button>
              </div>

              <span className="text-xs text-slate-400 hidden sm:inline">
                Spaced Repetition Active
              </span>
            </div>

            {/* Task list rendering */}
            {activeTab !== "EXAMS" ? (
              <div className="divide-y divide-slate-100">
                {tasks
                  .filter((t) => (activeTab === "TODAY" ? t.day === "Today" : true))
                  .map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`p-4 md:px-6 flex items-start justify-between gap-4 cursor-pointer transition-colors ${
                        task.completed ? "bg-slate-50/60 opacity-70" : "hover:bg-slate-50/80"
                      }`}
                    >
                      <div className="flex items-start gap-3.5 min-w-0">
                        <button
                          type="button"
                          className="mt-0.5 text-purple-600 shrink-0"
                        >
                          {task.completed ? (
                            <CheckCircle2 size={18} className="text-emerald-600" />
                          ) : (
                            <Circle size={18} className="text-slate-300 hover:text-purple-600" />
                          )}
                        </button>

                        <div className="min-w-0">
                          <p
                            className={`text-sm font-semibold text-slate-900 ${
                              task.completed ? "line-through text-slate-400" : ""
                            }`}
                          >
                            {task.topic}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 flex-wrap">
                            <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              {task.subject}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} /> {task.durationMinutes} min
                            </span>
                            <span className="text-slate-300">•</span>
                            <span>{task.day}</span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${
                            task.priority === "HIGH"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : task.priority === "MEDIUM"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="p-6 space-y-3">
                {UPCOMING_EXAMS.map((exam, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-white transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900">{exam.subject}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Exam Date: {exam.date}</p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded text-xs font-mono font-medium bg-purple-50 text-purple-700 border border-purple-100">
                        {exam.daysLeft} days left
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Syllabus Covered</span>
                        <span className="font-semibold text-purple-700">{exam.syllabusProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-600 rounded-full"
                          style={{ width: `${exam.syllabusProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Pomodoro Focus Timer & AI Insights */}
        <div className="space-y-6">
          {/* Deep Work Focus Timer */}
          <div className="app-card p-6 text-center space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Brain size={15} className="text-purple-600" /> Deep Work Timer
              </span>
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 bg-purple-50 text-purple-700 rounded border border-purple-100">
                Session {completedSessions}/4
              </span>
            </div>

            {/* Mode Selectors */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => resetTimer("FOCUS")}
                className={`py-1 rounded-lg transition-colors ${
                  timerMode === "FOCUS"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Focus (25m)
              </button>
              <button
                onClick={() => resetTimer("SHORT_BREAK")}
                className={`py-1 rounded-lg transition-colors ${
                  timerMode === "SHORT_BREAK"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Short (5m)
              </button>
              <button
                onClick={() => resetTimer("LONG_BREAK")}
                className={`py-1 rounded-lg transition-colors ${
                  timerMode === "LONG_BREAK"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Long (15m)
              </button>
            </div>

            {/* Digital Timer Display */}
            <div className="py-4 my-1">
              <div className="font-mono text-5xl font-bold tracking-tight text-slate-900">
                {formatTime(timeLeft)}
              </div>
              <p className="text-xs text-slate-400 mt-2 font-medium">
                {timerMode === "FOCUS"
                  ? "High focus interval — notifications muted"
                  : "Rest and hydrate before next session"}
              </p>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center justify-center gap-2.5">
              <button
                onClick={toggleTimer}
                className="btn-primary text-xs py-2.5 px-5 shadow-xs cursor-pointer flex items-center gap-2"
              >
                {isTimerRunning ? <Pause size={15} /> : <Play size={15} />}
                <span>{isTimerRunning ? "Pause" : "Start Focus"}</span>
              </button>

              <button
                onClick={() => resetTimer(timerMode)}
                className="w-9 h-9 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors"
                title="Reset timer"
              >
                <RotateCcw size={15} />
              </button>
            </div>
          </div>

          {/* AI Study Recommendations */}
          <div className="app-card p-5 space-y-2.5 bg-slate-50/50">
            <div className="flex items-center gap-1.5 text-purple-700">
              <Sparkles size={15} />
              <h4 className="text-xs font-semibold uppercase tracking-wider">AI Optimization</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Based on quiz results in <strong>Distributed Systems</strong>, reviewing <strong>Vector Timestamps</strong> today will yield the highest retention boost for mid-term assessments.
            </p>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="app-card max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <h3 className="font-display text-base font-bold text-slate-900">Add Study Block</h3>
            <form onSubmit={handleAddTask} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Subject / Course</label>
                <input
                  required
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. Data Structures or Machine Learning"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Target Topic</label>
                <input
                  required
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="e.g. Graph Traversal BFS/DFS Practice"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Duration (mins)</label>
                  <select
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white"
                  >
                    <option value="25">25 mins (1 Pomodoro)</option>
                    <option value="45">45 mins</option>
                    <option value="60">60 mins</option>
                    <option value="90">90 mins</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white"
                  >
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary text-xs py-2 px-3.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-4 shadow-xs"
                >
                  Save Study Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
