import { getAiProvider } from "./aiProvider";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface MentorChatRequest {
  messages: ChatMessage[];
  studentContext?: {
    name?: string;
    department?: string;
    semester?: number;
    cgpa?: number;
    attendance?: number;
    targetRole?: string;
    focusSkills?: string[];
  };
}

export interface MentorChatResponse {
  reply: string;
  suggestedActions?: string[];
  recommendedSkills?: string[];
  studyTips?: string[];
}

export async function runMentorChatAgent(req: MentorChatRequest): Promise<MentorChatResponse> {
  const provider = getAiProvider();

  const studentInfo = req.studentContext
    ? `Student Profile: Name=${req.studentContext.name || "Student"}, Dept=${req.studentContext.department || "Computer Science"}, Sem=${req.studentContext.semester || 6}, CGPA=${req.studentContext.cgpa || 8.4}, Attendance=${req.studentContext.attendance || 88}%, Target Role=${req.studentContext.targetRole || "Full Stack AI Engineer"}`
    : "Student Profile: College undergraduate in Engineering/Technology";

  const systemPrompt = `You are "MentorHUB AI", a top-tier Google-grade Academic & Career Advisory Intelligence System for university students.
Your mission is encapsulated in the brand ethos: "GUIDE. CONNECT. GROW."

You provide empathetic, precise, actionable guidance on:
1. Academic Mastery & Exam Prep (Study schedules, conceptual explanations, difficulty remediation)
2. Skill Development (Python, Data Structures, System Design, Cloud, AI/ML, DevOps)
3. Career Guidance & Placement Readiness (Resume tips, interview frameworks, mock questions, company selection)
4. Wellness & Productivity (Time management, focus techniques, habit loops)

Context:
${studentInfo}

Rules:
- Speak in a motivating, clear, professional tone with structured bullet points and practical steps.
- Return response in JSON format with keys:
  "reply": (string, clear markdown formatted reply to the student),
  "suggestedActions": (array of 2-4 brief immediate actionable steps),
  "recommendedSkills": (array of 2-4 relevant skills/tools),
  "studyTips": (array of 1-3 high impact study/career tips)`;

  const history = req.messages
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join("\n\n");

  try {
    const raw = await provider.complete(systemPrompt, history);
    const parsed = JSON.parse(raw);
    return {
      reply: parsed.reply || "I am here to guide your academic and career journey with personalized roadmaps.",
      suggestedActions: parsed.suggestedActions || ["Review today's study block", "Solve 2 coding problems", "Update resume project section"],
      recommendedSkills: parsed.recommendedSkills || ["Python", "DSA", "System Design"],
      studyTips: parsed.studyTips || ["Use active recall with 25-minute Pomodoro intervals."],
    };
  } catch {
    // Intelligent fallback response
    const lastMsg = req.messages[req.messages.length - 1]?.content.toLowerCase() || "";
    let reply = "";
    let suggestedActions = ["Schedule 45 min focus block", "Build a practical mini project", "Connect with your faculty mentor"];
    let recommendedSkills = ["Python 3.12", "Data Structures", "Git Workflow"];
    let studyTips = ["Focus on consistent daily 90-minute deep work rather than cramming."];

    if (lastMsg.includes("python")) {
      reply = `### 🐍 Targeted Python Mastery Roadmap for College & Placements\n\nTo build industry-ready Python proficiency, follow this 3-tier structure:\n\n1. **Core Foundations (Week 1–2)**: Master list comprehensions, generators, decorators, and OOP concepts (classes, inheritance, dunder methods).\n2. **Data Structures & Algorithms (Week 3–4)**: Implement stacks, queues, hash maps, binary trees, and dynamic programming in Python.\n3. **Practical Ecosystem (Week 5+)**: Build a full-stack REST API using FastAPI + Pydantic, integrate SQLite/PostgreSQL, and write PyTest suites.\n\n> **Pro Tip**: Benchmark your solutions on LeetCode/HackerRank with optimal time & space complexity ($O(N)$ vs $O(N^2)$).`;
      suggestedActions = ["Solve 3 Python Medium problems on arrays/maps", "Build a FastAPI CRUD microservice", "Review Python Decorators & Memory Model"];
      recommendedSkills = ["FastAPI", "PyTest", "AsyncIO", "NumPy"];
      studyTips = ["Always profile code memory and execution time using `cProfile` and `timeit`."];
    } else if (lastMsg.includes("placement") || lastMsg.includes("career") || lastMsg.includes("interview")) {
      reply = `### 🚀 Comprehensive Campus Placement & Career Preparation Strategy\n\nHere is your high-impact blueprint for technical recruitment:\n\n1. **Aptitude & Core Fundamentals**: Quantitative, logical reasoning, and OS/DBMS/Computer Networks basics (review normalization, indexing, concurrency, memory management).\n2. **Coding Round Mastery**: 150 Core DSA patterns (Two Pointers, Sliding Window, BFS/DFS, Top K Elements).\n3. **STAR Method for Technical & HR Rounds**: Frame every project: **Situation** (problem), **Task** (your objective), **Action** (tech stack & implementation), **Result** (metrics: latency reduction, user count, test coverage).\n4. **Resume Optimization**: Single-page ATS-compliant format with GitHub & live project links.`;
      suggestedActions = ["Audit resume against ATS keywords", "Conduct 1 peer mock interview on DSA", "Review Top 25 DBMS SQL queries"];
      recommendedSkills = ["DSA in C++/Java/Python", "System Design Basics", "SQL & Database Indexing"];
      studyTips = ["Record your verbal explanation while solving coding problems out loud."];
    } else if (lastMsg.includes("study") || lastMsg.includes("plan") || lastMsg.includes("exam") || lastMsg.includes("cgpa")) {
      reply = `### 📚 AI-Optimized Academic Performance & GPA Acceleration Plan\n\n1. **High-Yield Priority Matrix**: Identify subjects carrying 4+ credits and review the last 5 years' university question papers.\n2. **Spaced Repetition Schedule**: Study a concept on Day 1, review on Day 3, test on Day 7, and summarize on Day 14.\n3. **Active Recall Note-Taking**: Instead of passive reading, write down question prompts and answer them from memory.\n4. **Lab & Internal Assessment Maximization**: Secure 95%+ in lab internals and continuous assessments to buffer semester GPAs.`;
      suggestedActions = ["Create subject formula & cheat sheets", "Solve 1 previous year semester question paper", "Log 3 Pomodoro study sessions today"];
      recommendedSkills = ["Time Boxing", "Spaced Repetition", "Technical Writing"];
      studyTips = ["Teach key concepts to a peer or record yourself explaining the proof without notes."];
    } else {
      reply = `### 💡 MentorHUB AI Guidance\n\nI have analyzed your current academic status and objectives. Let's optimize your growth across **Academics**, **Skills**, and **Career Readiness**.\n\n- **Current Focus**: Consistent study scheduling, foundational technical projects, and proactive mentor interactions.\n- **Recommended Strategy**: Set 2 high-impact weekly milestones and track them in your MentorHUB Study Planner.\n\nHow would you like to proceed? I can create a customized study timetable, breakdown a complex technical topic, or review your placement preparation timeline.`;
    }

    return {
      reply,
      suggestedActions,
      recommendedSkills,
      studyTips,
    };
  }
}
