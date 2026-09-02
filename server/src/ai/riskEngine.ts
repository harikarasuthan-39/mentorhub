import { RiskLevel } from "../config/prisma";

export interface RiskInput {
  attendancePercentage: number;
  cgpa: number;
  arrearCount: number;
  openIssueCount: number;
  repeatedIssueCategories: number; // number of categories with 2+ open/recent issues
  overdueActionCount: number;
  placementReady: boolean;
  internshipPending: boolean;
}

export interface RiskComponent {
  label: string;
  detail: string;
  points: number;
}

export interface RiskResult {
  score: number;
  level: RiskLevel;
  breakdown: RiskComponent[];
}

/**
 * Rule-based, fully explainable risk scoring (0-100). This intentionally does NOT
 * delegate the score itself to the LLM - risk scoring must be reproducible and
 * auditable. The AI layer is used only for narrative summaries/recommendations.
 */
export function calculateRiskScore(input: RiskInput): RiskResult {
  const breakdown: RiskComponent[] = [];

  // Attendance (0-25 pts)
  if (input.attendancePercentage < 65) {
    breakdown.push({ label: "Attendance", detail: `${input.attendancePercentage}% (critical)`, points: 25 });
  } else if (input.attendancePercentage < 75) {
    breakdown.push({ label: "Attendance", detail: `${input.attendancePercentage}% (low)`, points: 20 });
  } else if (input.attendancePercentage < 85) {
    breakdown.push({ label: "Attendance", detail: `${input.attendancePercentage}% (below target)`, points: 15 });
  } else {
    breakdown.push({ label: "Attendance", detail: `${input.attendancePercentage}% (healthy)`, points: 0 });
  }

  // Arrears (0-25 pts)
  const arrearPoints = Math.min(input.arrearCount * 10, 25);
  breakdown.push({
    label: "Arrears",
    detail: `${input.arrearCount} arrear subject(s)`,
    points: arrearPoints,
  });

  // Academics / CGPA (0-15 pts)
  if (input.cgpa < 5.5) {
    breakdown.push({ label: "Academic Performance", detail: `CGPA ${input.cgpa.toFixed(2)} (very low)`, points: 15 });
  } else if (input.cgpa < 6.5) {
    breakdown.push({ label: "Academic Performance", detail: `CGPA ${input.cgpa.toFixed(2)} (low)`, points: 10 });
  } else if (input.cgpa < 7.5) {
    breakdown.push({ label: "Academic Performance", detail: `CGPA ${input.cgpa.toFixed(2)} (moderate)`, points: 5 });
  } else {
    breakdown.push({ label: "Academic Performance", detail: `CGPA ${input.cgpa.toFixed(2)} (good)`, points: 0 });
  }

  // Open issues (0-15 pts)
  const issuePoints = Math.min(input.openIssueCount * 5, 15);
  breakdown.push({ label: "Open Issues", detail: `${input.openIssueCount} unresolved issue(s)`, points: issuePoints });

  // Repeated issues (0-15 pts)
  const repeatedPoints = Math.min(input.repeatedIssueCategories * 15, 15);
  breakdown.push({
    label: "Repeated Issues",
    detail: `${input.repeatedIssueCategories} recurring issue categor${input.repeatedIssueCategories === 1 ? "y" : "ies"}`,
    points: repeatedPoints,
  });

  // Overdue actions (0-10 pts)
  const overduePoints = Math.min(input.overdueActionCount * 5, 10);
  breakdown.push({
    label: "Overdue Actions",
    detail: `${input.overdueActionCount} overdue action item(s)`,
    points: overduePoints,
  });

  // Placement / internship gap (0-5 pts each, informational)
  if (!input.placementReady) {
    breakdown.push({ label: "Placement Readiness", detail: "Not yet placement-eligible", points: 3 });
  }
  if (input.internshipPending) {
    breakdown.push({ label: "Internship Status", detail: "Internship not started", points: 2 });
  }

  const rawScore = breakdown.reduce((sum, c) => sum + c.points, 0);
  const score = Math.max(0, Math.min(100, rawScore));

  let level: RiskLevel;
  if (score >= 70) level = "CRITICAL";
  else if (score >= 50) level = "HIGH";
  else if (score >= 25) level = "MEDIUM";
  else level = "LOW";

  return { score, level, breakdown };
}
