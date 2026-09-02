export interface InterventionSuggestion {
  issueArea: string;
  recommendation: string;
}

const PLAYBOOK: Record<string, string[]> = {
  Attendance: ["Attendance counseling session", "Parent/guardian communication", "Weekly attendance monitoring"],
  "Academic Performance": ["Remedial class enrollment", "Faculty support session", "Additional structured study plan"],
  Arrears: ["Arrear-clearing study plan", "Subject-specific tutoring", "Exam strategy counseling"],
  "Placement Readiness": ["Aptitude training", "Mock interview practice", "Resume preparation workshop"],
  "Internship Status": ["Internship guidance session", "Industry project recommendation", "Resume/portfolio review"],
  "Financial Concerns": ["Scholarship/financial-aid guidance", "Connect with student welfare office"],
  "Personal/Well-being": ["Refer to student counseling services", "Confidential check-in with mentor"],
  Discipline: ["Formal counseling conversation", "Clear expectation-setting with follow-up review"],
};

/**
 * Maps identified concern areas to a fixed, reviewed playbook of interventions.
 * Deliberately template-driven (not free-form LLM output) so mentors always see
 * vetted, appropriate suggestions - the AI never invents interventions from scratch.
 */
export function recommendInterventions(concernAreas: string[]): InterventionSuggestion[] {
  const suggestions: InterventionSuggestion[] = [];
  for (const area of concernAreas) {
    const key = Object.keys(PLAYBOOK).find((k) => area.toLowerCase().includes(k.toLowerCase().split(" ")[0].toLowerCase()));
    if (key) {
      for (const recommendation of PLAYBOOK[key]) {
        suggestions.push({ issueArea: key, recommendation });
      }
    }
  }
  return suggestions;
}

export function mapCategoryToIssueArea(category: string): string {
  const map: Record<string, string> = {
    ACADEMIC_PERFORMANCE: "Academic Performance",
    ATTENDANCE: "Attendance",
    ARREAR_SUBJECTS: "Arrears",
    PLACEMENT_READINESS: "Placement Readiness",
    INTERNSHIP_STATUS: "Internship Status",
    FINANCIAL_CONCERNS: "Financial Concerns",
    PERSONAL_WELLBEING: "Personal/Well-being",
    DISCIPLINE: "Discipline",
    OTHER: "Other",
  };
  return map[category] ?? "Other";
}
