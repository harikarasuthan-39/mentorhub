export interface RagDocument {
  id: string;
  category: "ACADEMIC_REGULATIONS" | "ATTENDANCE_POLICY" | "PLACEMENT_GUIDELINES" | "MENTORING_CODE" | "DISCIPLINE_EXAM";
  title: string;
  content: string;
  keywords: string[];
}

export const KNOWLEDGE_BASE: RagDocument[] = [
  {
    id: "kb_att_01",
    category: "ATTENDANCE_POLICY",
    title: "University Attendance Mandate & Condonation Regulations (Clause 7.2)",
    content: `1. Minimum Attendance Requirement: Every student must secure a minimum of 75% overall attendance in each semester to be eligible to appear for the End Semester University Examinations.
2. Condonation for Medical / Valid Grounds: Attendance between 65% and 74.9% may be condoned by the Head of the Institution / Dean on valid medical grounds, provided a valid medical certificate issued by a registered medical practitioner is submitted to the HOD within 3 working days of resumption of classes. Condonation fee as prescribed by the university must be paid.
3. Debarment (<65% Attendance): Students securing less than 65% overall attendance will NOT be eligible for condonation and will be debarred from writing end-semester examinations for that term. They must redo the semester in the subsequent academic cycle.
4. On-Duty (OD) Provision: Maximum 10% attendance credit for participation in approved inter-college technical symposiums, hackathons, sports tournaments, and authorized placement drives.`,
    keywords: ["attendance", "condonation", "medical", "leave", "debarred", "od", "on duty", "75%", "65%", "shortage"],
  },
  {
    id: "kb_acad_02",
    category: "ACADEMIC_REGULATIONS",
    title: "Choice Based Credit System (CBCS), Grading Scale & Arrear Policy (Clause 11.4)",
    content: `1. Grading Scale:
   - Outstanding (O): Grade Points 10 (Marks: 91-100)
   - Excellent (A+): Grade Points 9 (Marks: 81-90)
   - Very Good (A): Grade Points 8 (Marks: 71-80)
   - Good (B+): Grade Points 7 (Marks: 61-70)
   - Above Average (B): Grade Points 6 (Marks: 50-60)
   - Reappearance Required (RA): Grade Points 0 (Marks: <50)
2. Passing Minimum: A candidate must secure a minimum of 50% in the End Semester University Examination and 50% in the aggregate of continuous internal assessments (40% weightage) + semester examination (60% weightage).
3. Arrear Clearance Policy: Supplementary examinations for arrears are conducted alongside regular semester examinations. Fast-track summer semester remedial classes are scheduled for students with standing arrears in foundational mathematical and core algorithmic courses.
4. Degree Classification:
   - First Class with Distinction: Minimum CGPA of 8.5 with no standing arrears and completion within the standard 4-year duration.
   - First Class: Minimum CGPA of 6.5 within 5 academic years.`,
    keywords: ["cgpa", "grading", "marks", "arrear", "ra", "distinction", "cbcs", "internal", "credits", "passing minimum"],
  },
  {
    id: "kb_place_03",
    category: "PLACEMENT_GUIDELINES",
    title: "Campus Placement Eligibility & Internship Code (Placement Cell Handbook)",
    content: `1. Tier-1 Product Companies (CTC > 12 LPA): Minimum CGPA of 7.5+ with 0 active standing arrears, verified GitHub project portfolio, and minimum 200 DSA problems solved on LeetCode/HackerRank.
2. Core & IT Services Companies (CTC 4.5 - 10 LPA): Minimum CGPA of 6.5+ with maximum 1 standing arrear allowed (to be cleared prior to final joining).
3. Mandatory 8th Semester Industry Internship: Full-time semester internships permitted with fast-track online course credits for students maintaining CGPA >= 7.5 and no active arrears.
4. Placement Discipline & One-Offer Policy: A student securing an offer through campus recruitment is eligible for dream / super-dream company drives only if the new offer package is at least 1.5x of the initial offer.`,
    keywords: ["placement", "interview", "resume", "internship", "package", "ctc", "eligibility", "dream offer", "hiring"],
  },
  {
    id: "kb_mentor_04",
    category: "MENTORING_CODE",
    title: "Institutional Faculty Mentoring & Student Support Guidelines (NAAC Criterion 2.3.3)",
    content: `1. Mentoring Ratio: Each faculty mentor is assigned a cohort of 15-20 undergraduate mentees throughout their 4-year degree progression.
2. Advisory Meeting Cadence: Formal 1:1 advisory meetings must be conducted at least twice per semester (pre-assessment and post-assessment review), with emergency meetings scheduled immediately upon risk engine alerts (attendance drop < 75% or arrears > 0).
3. Confidentiality & Safeguarding: Personal, psychological, and financial details discussed during mentoring sessions are strictly confidential and shared with HOD or University Counselors only on a need-to-know safeguarding basis.
4. Action Item Tracking: Mentors must document meeting summaries, student concerns, and agreed remediation action items within 48 hours of meeting conclusion.`,
    keywords: ["mentor", "mentee", "advisory", "meeting", "counseling", "naac", "ratio", "confidentiality", "remediation"],
  },
  {
    id: "kb_exam_05",
    category: "DISCIPLINE_EXAM",
    title: "Continuous Internal Assessment (CIA) & Malpractice Rules",
    content: `1. Continuous Internal Assessments (CIA): Total 40 marks distributed across 3 Internal Assessment Tests (IAT 1, IAT 2, Model Exam), assignments, and seminar/quiz participation.
2. Re-test Eligibility: Re-tests for internal examinations are permitted exclusively on documented medical grounds or authorized university duty with prior HOD approval.
3. Examination Code of Conduct: Absolute zero tolerance for academic malpractice during examinations. Any unauthorized electronic device in examination halls results in immediate cancellation of current semester registrations.`,
    keywords: ["internal", "cia", "iat", "retest", "malpractice", "exam rules", "assessment"],
  },
];

export function queryRagKnowledge(query: string, maxResults = 2): RagDocument[] {
  if (!query) return [];
  const q = query.toLowerCase();
  const scored = KNOWLEDGE_BASE.map((doc) => {
    let score = 0;
    for (const kw of doc.keywords) {
      if (q.includes(kw)) score += 3;
    }
    if (doc.title.toLowerCase().split(" ").some((w) => w.length > 3 && q.includes(w))) {
      score += 4;
    }
    if (q.includes(doc.category.toLowerCase().replace("_", " "))) {
      score += 2;
    }
    return { doc, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map((s) => s.doc);
}
