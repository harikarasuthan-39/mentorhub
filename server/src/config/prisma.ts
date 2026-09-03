import bcrypt from "bcryptjs";

// Types matching the Prisma Schema enums
export type Role = "HOD" | "MENTOR" | "STUDENT";
export type MeetingType = "INDIVIDUAL" | "GROUP";
export type IssueCategory =
  | "ACADEMIC_PERFORMANCE"
  | "ATTENDANCE"
  | "ARREAR_SUBJECTS"
  | "PLACEMENT_READINESS"
  | "INTERNSHIP_STATUS"
  | "FINANCIAL_CONCERNS"
  | "PERSONAL_WELLBEING"
  | "DISCIPLINE"
  | "OTHER";
export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type IssueStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type ActionType = "STUDENT_ACTION" | "MENTOR_ACTION";
export type ActionStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type PlacementStatus = "NOT_ELIGIBLE" | "ELIGIBLE" | "IN_PROGRESS" | "PLACED";
export type InternshipStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
export type NotificationType =
  | "UPCOMING_MEETING"
  | "FOLLOW_UP"
  | "OVERDUE_ACTION"
  | "REPEATED_ISSUE"
  | "MONTHLY_REMINDER"
  | "RISK_CHANGE"
  | "GENERAL";

function genId(prefix = "cm") {
  return `${prefix}_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;
}

class InMemoryPrismaClient {
  departments: any[] = [];
  users: any[] = [];
  mentors: any[] = [];
  students: any[] = [];
  meetings: any[] = [];
  studentIssues: any[] = [];
  actionItems: any[] = [];
  riskAssessments: any[] = [];
  interventions: any[] = [];
  notifications: any[] = [];
  reports: any[] = [];
  auditLogs: any[] = [];
  messages: any[] = [];

  constructor() {
    this.seedInitialData();
  }

  async $disconnect() {}

  private seedInitialData() {
    const passwordHash = bcrypt.hashSync("Password@123", 10);

    // Departments
    const cse = { id: "dept_cse", name: "Computer Science & Engineering", code: "CSE", createdAt: new Date("2024-01-01") };
    const aids = { id: "dept_aids", name: "AI & Data Science", code: "AIDS", createdAt: new Date("2024-01-01") };
    this.departments.push(cse, aids);

    // HOD User & Mentor record for HOD
    const hodUser = {
      id: "usr_hod",
      email: "hod@university.edu",
      passwordHash,
      role: "HOD" as Role,
      isActive: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    };
    this.users.push(hodUser);

    this.mentors.push({
      id: "mentor_hod",
      userId: hodUser.id,
      fullName: "Dr. Arvind Swamy",
      employeeId: "HOD-CSE-001",
      designation: "Professor & Head of Department",
      departmentId: cse.id,
      phone: "+91 98420 11223",
      qualification: "Ph.D. in Distributed Systems & AI (IIT Madras)",
      specialization: "AI Systems, Cloud Distributed Architectures, Data Governance",
      experience: "18 Years Academic & Administrative Leadership",
      dateOfJoining: new Date("2010-04-12"),
      employmentStatus: "Full-Time Permanent",
      address: "Academic Block 3, Office of the HOD",
      city: "Coimbatore",
      state: "Tamil Nadu",
      bio: "Overseeing institutional curriculum quality, NAAC/NBA accreditations, AI lab infrastructure, and faculty mentorship governance.",
      createdAt: new Date("2024-01-01"),
    });

    // Mentors
    const mentorNames = ["Dr. Priya Raman", "Dr. Suresh Babu", "Dr. Kavitha Nair", "Dr. Anand Rao", "Dr. Meera Iyer"];
    const mentorDepts = [cse.id, aids.id, cse.id, aids.id, cse.id];
    const mentorQualifications = [
      "Ph.D. in Machine Learning (NIT Trichy)",
      "M.Tech, Ph.D. in Computer Science (Anna Univ)",
      "Ph.D. in Data Science & Intelligent Systems",
      "M.Tech in Software Engineering & AI",
      "Ph.D. in Cloud Computing & Cybersecurity",
    ];
    const mentorSpecializations = [
      "Deep Learning, Computer Vision, Placement Training",
      "Algorithms, System Design, Cloud Computing",
      "Data Structures, Full Stack Development, DBMS",
      "NLP, Big Data Engineering, Competitive Programming",
      "Cybersecurity, Operating Systems, DevOps",
    ];

    for (let i = 0; i < mentorNames.length; i++) {
      const uId = `usr_mentor_${i + 1}`;
      const mId = `mentor_${i + 1}`;
      this.users.push({
        id: uId,
        email: `mentor${i + 1}@university.edu`,
        passwordHash,
        role: "MENTOR" as Role,
        isActive: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      });

      this.mentors.push({
        id: mId,
        userId: uId,
        fullName: mentorNames[i],
        employeeId: `EMP10${i + 1}`,
        designation: i === 0 ? "Associate Professor & Senior Advisor" : "Assistant Professor",
        departmentId: mentorDepts[i],
        phone: `+91 98765 ${10000 + i}`,
        qualification: mentorQualifications[i],
        specialization: mentorSpecializations[i],
        experience: `${8 + (i * 2)} Years Faculty Experience`,
        dateOfJoining: new Date(2016 + i, 5, 15),
        employmentStatus: "Full-Time Regular Faculty",
        address: `Faculty Quarters Block ${String.fromCharCode(65 + i)}-${102 + i}, University Staff Enclave`,
        city: "Coimbatore",
        state: "Tamil Nadu",
        bio: `Dedicated faculty mentor guiding undergraduate students in core CS competencies, career placement roadmaps, and research projects.`,
        createdAt: new Date("2024-01-01"),
      });
    }

    // Students (50 students)
    const FIRST_NAMES = [
      "Arun", "Priya", "Karthik", "Divya", "Ram", "Sneha", "Vijay", "Anitha", "Suresh", "Meena",
      "Ravi", "Kavya", "Naveen", "Pooja", "Ganesh", "Lakshmi", "Sathish", "Deepa", "Manoj", "Swathi",
      "Praveen", "Nisha", "Dinesh", "Aishwarya", "Bala", "Revathi", "Senthil", "Gayathri", "Arjun", "Vidya",
      "Rahul", "Preethi", "Sanjay", "Harini", "Vikram", "Sindhu", "Mahesh", "Ramya", "Ashwin", "Keerthana",
      "Prakash", "Bhavani", "Yogesh", "Anjali", "Kiran", "Sowmya", "Rajesh", "Nithya", "Gopal", "Shalini",
    ];
    const years = ["I", "II", "III", "IV"];
    const sections = ["A", "B"];
    const placements: PlacementStatus[] = ["NOT_ELIGIBLE", "ELIGIBLE", "IN_PROGRESS", "PLACED"];
    const internships: InternshipStatus[] = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"];

    for (let i = 0; i < 50; i++) {
      const sId = `student_${i + 1}`;
      const dept = this.departments[i % 2];
      const mentor = this.mentors[i % this.mentors.length];
      const year = years[i % years.length];
      const section = sections[i % sections.length];
      const attendance = 60 + ((i * 17) % 39); // 60-98
      const cgpa = Number((5.5 + ((i * 7) % 43) / 10).toFixed(1));
      const arrears = attendance < 75 ? 1 + (i % 3) : (i % 5 === 0 ? 1 : 0);
      const email = `student${i + 1}@university.edu`;

      let userId: string | null = null;
      // First 5 students have accounts
      if (i < 5) {
        userId = `usr_student_${i + 1}`;
        this.users.push({
          id: userId,
          email,
          passwordHash,
          role: "STUDENT" as Role,
          isActive: true,
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-01"),
        });
      }

      const studentObj = {
        id: sId,
        userId,
        fullName: `${FIRST_NAMES[i]} Kumar`,
        registerNumber: `23${dept.code}${String(101 + i).padStart(3, "0")}`,
        admissionNumber: `ADM2023-${String(1001 + i)}`,
        admissionYear: 2023,
        academicYear: "2023 - 2027",
        degree: dept.code === "CSE" ? "B.E. Computer Science & Engineering" : "B.Tech AI & Data Science",
        batch: "2023 - 2027",
        section,
        semester: year === "I" ? 2 : year === "II" ? 4 : year === "III" ? 6 : 8,
        year,
        dateOfAdmission: new Date("2023-08-16"),
        admissionCategory: i % 3 === 0 ? "Merit - Single Window (Govt Quota)" : i % 3 === 1 ? "Management Merit" : "First Graduate Quota",
        departmentId: dept.id,
        mentorId: mentor.id,
        parentName: `Mr. ${FIRST_NAMES[i]} Senior`,
        parentContact: `+91 9876${String(100000 + i)}`,
        email,
        phone: `+91 9123${String(100000 + i)}`,
        dateOfBirth: new Date("2004-05-15"),
        gender: i % 2 === 0 ? "Male" : "Female",
        address: `${12 + i}/4, Crosscut Road, Gandhipuram`,
        city: "Coimbatore",
        state: "Tamil Nadu",
        emergencyContact: `+91 9842${String(100000 + i)}`,
        // Financial & Bank Details (Sensitively Protected)
        bankName: i % 2 === 0 ? "State Bank of India" : "HDFC Bank",
        accountHolderName: `${FIRST_NAMES[i]} Kumar`,
        accountNumber: `39842010${String(1000 + i * 17).padStart(4, "0")}`,
        ifscCode: i % 2 === 0 ? "SBIN0001248" : "HDFC0000312",
        branch: "University Campus Branch, Coimbatore",
        // Skills & Academic progress
        skills: ["Data Structures & Algorithms", "Python", "SQL & Database Design", "Web Development (React/Node)", "Git & Version Control"],
        certifications: [
          "AWS Certified Cloud Practitioner",
          "Google Data Analytics Professional Certificate",
          "NPTEL Elite Certificate in Data Structures"
        ],
        bio: `Undergraduate engineering student pursuing ${dept.name} with keen focus on software engineering, problem solving, and product placement preparation.`,
        attendancePercentage: attendance,
        cgpa,
        arrearCount: arrears,
        placementStatus: placements[i % placements.length],
        internshipStatus: internships[i % internships.length],
        certificationCount: 2 + (i % 3),
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date(),
      };
      this.students.push(studentObj);

      // Meetings per student
      const meetingDates = [
        new Date(Date.now() - (15 + (i % 20)) * 86400000),
        new Date(Date.now() - (50 + (i % 30)) * 86400000),
      ];

      for (let m = 0; m < meetingDates.length; m++) {
        const mDate = meetingDates[m];
        const followUp = new Date(mDate.getTime() + 14 * 86400000);
        const meetingId = `meeting_${sId}_${m + 1}`;

        const isLowAtt = attendance < 75;
        this.meetings.push({
          id: meetingId,
          studentId: sId,
          mentorId: mentor.id,
          meetingDate: mDate,
          meetingType: "INDIVIDUAL" as MeetingType,
          discussionSummary: `Reviewed academic progress, semester attendance (${attendance}%), and arrear records.`,
          studentConcerns: isLowAtt ? "Difficulty catching up with early morning coursework." : "Preparing for upcoming placements and exams.",
          mentorSuggestions: isLowAtt ? "Recommended attending remedial sessions and weekly tracking." : "Maintain good CGPA and start mock aptitude tests.",
          nextFollowUpDate: followUp,
          aiSummary: isLowAtt ? "Student requires attendance improvement and coursework reinforcement." : "Student is performing steadily across all parameters.",
          aiKeyConcerns: isLowAtt ? ["Attendance below 75%", "Arrear clearance"] : ["Placement readiness"],
          aiImportantPoints: ["Attendance status reviewed", "Academic plan established"],
          aiRecommendedActions: isLowAtt ? ["Attend remedial math classes", "Weekly attendance check-in"] : ["Complete mock test series"],
          aiStatus: "COMPLETED",
          createdAt: mDate,
          updatedAt: mDate,
        });

        // Issues
        if (isLowAtt && m === 0) {
          this.studentIssues.push({
            id: `issue_${sId}_1`,
            studentId: sId,
            meetingId,
            mentorId: mentor.id,
            category: "ATTENDANCE" as IssueCategory,
            description: `Attendance dropped to ${attendance}% in current term.`,
            severity: "HIGH" as Severity,
            status: "IN_PROGRESS" as IssueStatus,
            isRestricted: false,
            resolution: null,
            resolvedDate: null,
            createdAt: mDate,
            updatedAt: mDate,
          });

          if (arrears > 0) {
            this.studentIssues.push({
              id: `issue_${sId}_2`,
              studentId: sId,
              meetingId,
              mentorId: mentor.id,
              category: "ARREAR_SUBJECTS" as IssueCategory,
              description: `${arrears} pending arrear subject(s) requiring remediation.`,
              severity: "HIGH" as Severity,
              status: "OPEN" as IssueStatus,
              isRestricted: false,
              resolution: null,
              resolvedDate: null,
              createdAt: mDate,
              updatedAt: mDate,
            });
          }
        }

        // Action Item
        this.actionItems.push({
          id: `act_${sId}_${m + 1}`,
          studentId: sId,
          meetingId,
          issueId: null,
          mentorId: mentor.id,
          actionType: "STUDENT_ACTION" as ActionType,
          description: isLowAtt ? "Submit weekly attendance log to mentor" : "Complete online certification course",
          assignedTo: studentObj.fullName,
          targetCompletionDate: followUp,
          status: (followUp < new Date() ? (i % 2 === 0 ? "COMPLETED" : "OVERDUE") : "PENDING") as ActionStatus,
          completedDate: followUp < new Date() && i % 2 === 0 ? followUp : null,
          createdAt: mDate,
          updatedAt: new Date(),
        });
      }

      // Risk assessment
      const attPts = attendance < 65 ? 25 : attendance < 75 ? 20 : attendance < 85 ? 15 : 0;
      const arrPts = Math.min(arrears * 10, 25);
      const score = Math.min(100, attPts + arrPts + (i % 15));
      const level: RiskLevel = score >= 70 ? "CRITICAL" : score >= 50 ? "HIGH" : score >= 25 ? "MEDIUM" : "LOW";

      this.riskAssessments.push({
        id: `risk_${sId}`,
        studentId: sId,
        meetingId: null,
        riskScore: score,
        riskLevel: level,
        breakdown: [
          { label: "Attendance", detail: `${attendance}%`, points: attPts },
          { label: "Arrears", detail: `${arrears} arrear(s)`, points: arrPts },
        ],
        generatedBy: "AI",
        createdAt: new Date(),
      });
    }

    // Notifications
    for (const mentor of this.mentors) {
      this.notifications.push({
        id: genId("notif"),
        userId: mentor.userId,
        type: "MONTHLY_REMINDER" as NotificationType,
        title: "Monthly mentoring records due",
        message: "Please complete and submit the mentoring log entries for this month.",
        isRead: false,
        entityId: null,
        createdAt: new Date(),
      });
    }

    this.notifications.push({
      id: genId("notif"),
      userId: hodUser.id,
      type: "GENERAL" as NotificationType,
      title: "Welcome to Mentor Assistant AI",
      message: "Department analytics and student performance metrics are up to date.",
      isRead: false,
      entityId: null,
      createdAt: new Date(),
    });

    // Seed direct messages between Student, Mentor, and HOD
    const mentor1User = this.users.find((u) => u.email === "mentor1@university.edu");
    const student1User = this.users.find((u) => u.email === "student1@university.edu");

    if (mentor1User && student1User) {
      this.messages.push(
        {
          id: genId("msg"),
          senderId: mentor1User.id,
          senderName: "Dr. Priya Raman",
          senderRole: "MENTOR" as Role,
          recipientId: student1User.id,
          recipientName: "Arun Kumar",
          recipientRole: "STUDENT" as Role,
          content: "Hello Arun, please make sure you submit your DSA study plan and attendance log before Friday's advisory check-in.",
          isRead: true,
          createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 2), // 2 days ago
        },
        {
          id: genId("msg"),
          senderId: student1User.id,
          senderName: "Arun Kumar",
          senderRole: "STUDENT" as Role,
          recipientId: mentor1User.id,
          recipientName: "Dr. Priya Raman",
          recipientRole: "MENTOR" as Role,
          content: "Good morning Ma'am! I have uploaded the updated LeetCode milestone and completed the DSA module on Trees and Graphs.",
          isRead: true,
          createdAt: new Date(Date.now() - 3600 * 1000 * 20), // 20 hours ago
        },
        {
          id: genId("msg"),
          senderId: mentor1User.id,
          senderName: "Dr. Priya Raman",
          senderRole: "MENTOR" as Role,
          recipientId: student1User.id,
          recipientName: "Arun Kumar",
          recipientRole: "STUDENT" as Role,
          content: "Excellent progress Arun. Let's do a quick 10-minute review during office hours tomorrow at 3:00 PM.",
          isRead: false,
          createdAt: new Date(Date.now() - 3600 * 1000 * 2), // 2 hours ago
        }
      );
    }

    if (mentor1User && hodUser) {
      this.messages.push(
        {
          id: genId("msg"),
          senderId: hodUser.id,
          senderName: "Dr. Arvind Swamy",
          senderRole: "HOD" as Role,
          recipientId: mentor1User.id,
          recipientName: "Dr. Priya Raman",
          recipientRole: "MENTOR" as Role,
          content: "Dr. Priya, please verify that all mid-term mentoring action logs for Year 3 CSE students are finalized for the NAAC audit report.",
          isRead: true,
          createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 3),
        },
        {
          id: genId("msg"),
          senderId: mentor1User.id,
          senderName: "Dr. Priya Raman",
          senderRole: "MENTOR" as Role,
          recipientId: hodUser.id,
          recipientName: "Dr. Arvind Swamy",
          recipientRole: "HOD" as Role,
          content: "Yes Dr. Swamy, 18 out of 20 mentee logs are complete and submitted. The remaining 2 follow-ups will be finalized by tomorrow noon.",
          isRead: true,
          createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 1),
        }
      );
    }
  }

  // Model accessors
  department = this.createModelHandler("departments");
  user = this.createModelHandler("users");
  mentor = this.createModelHandler("mentors");
  student = this.createModelHandler("students");
  meeting = this.createModelHandler("meetings");
  studentIssue = this.createModelHandler("studentIssues");
  actionItem = this.createModelHandler("actionItems");
  riskAssessment = this.createModelHandler("riskAssessments");
  intervention = this.createModelHandler("interventions");
  notification = this.createModelHandler("notifications");
  report = this.createModelHandler("reports");
  auditLog = this.createModelHandler("auditLogs");
  message = this.createModelHandler("messages");

  private createModelHandler(collectionName: keyof InMemoryPrismaClient) {
    const getCollection = () => this[collectionName] as any[];

    return {
      findUnique: async (args: { where: Record<string, any>; include?: Record<string, any>; select?: Record<string, any> }): Promise<any> => {
        const item = getCollection().find((r) => matchWhere(r, args.where));
        if (!item) return null;
        return this.hydrateRelations(collectionName as string, item, args.include, args.select);
      },

      findFirst: async (args?: { where?: Record<string, any>; include?: Record<string, any>; select?: Record<string, any>; orderBy?: any }): Promise<any> => {
        let items = getCollection().filter((r) => (args?.where ? matchWhere(r, args.where) : true));
        if (args?.orderBy) items = sortItems(items, args.orderBy);
        if (items.length === 0) return null;
        return this.hydrateRelations(collectionName as string, items[0], args?.include, args?.select);
      },

      findMany: async (args?: { where?: Record<string, any>; include?: Record<string, any>; select?: Record<string, any>; orderBy?: any; skip?: number; take?: number }): Promise<any[]> => {
        let items = getCollection().filter((r) => (args?.where ? matchWhere(r, args.where) : true));
        if (args?.orderBy) items = sortItems(items, args.orderBy);
        if (args?.skip !== undefined) items = items.slice(args.skip);
        if (args?.take !== undefined) items = items.slice(0, args.take);
        return items.map((it) => this.hydrateRelations(collectionName as string, it, args?.include, args?.select));
      },

      count: async (args?: { where?: Record<string, any> }): Promise<number> => {
        return getCollection().filter((r) => (args?.where ? matchWhere(r, args.where) : true)).length;
      },

      create: async (args: { data: Record<string, any> }): Promise<any> => {
        const item = {
          id: args.data.id || genId(collectionName.slice(0, 3)),
          createdAt: new Date(),
          updatedAt: new Date(),
          ...args.data,
        };
        getCollection().push(item);
        return item;
      },

      update: async (args: { where: Record<string, any>; data: Record<string, any>; include?: Record<string, any>; select?: Record<string, any> }): Promise<any> => {
        const index = getCollection().findIndex((r) => matchWhere(r, args.where));
        if (index === -1) throw new Error("Record not found for update");
        const existing = getCollection()[index];
        const updated = { ...existing, ...args.data, updatedAt: new Date() };
        getCollection()[index] = updated;
        return this.hydrateRelations(collectionName as string, updated, args.include, args.select);
      },

      updateMany: async (args: { where: Record<string, any>; data: Record<string, any> }): Promise<{ count: number }> => {
        let count = 0;
        const col = getCollection();
        for (let i = 0; i < col.length; i++) {
          if (matchWhere(col[i], args.where)) {
            col[i] = { ...col[i], ...args.data, updatedAt: new Date() };
            count++;
          }
        }
        return { count };
      },

      delete: async (args: { where: Record<string, any> }) => {
        const index = getCollection().findIndex((r) => matchWhere(r, args.where));
        if (index === -1) throw new Error("Record not found for deletion");
        const deleted = getCollection().splice(index, 1)[0];
        return deleted;
      },

      deleteMany: async (args?: { where?: Record<string, any> }) => {
        if (!args?.where || Object.keys(args.where).length === 0) {
          const count = getCollection().length;
          (this as any)[collectionName] = [];
          return { count };
        }
        let count = 0;
        const remaining = getCollection().filter((r) => {
          if (matchWhere(r, args.where!)) {
            count++;
            return false;
          }
          return true;
        });
        (this as any)[collectionName] = remaining;
        return { count };
      },

      groupBy: async (args: { by: string[]; where?: Record<string, any>; _count?: Record<string, boolean>; having?: any }) => {
        const items = getCollection().filter((r) => (args.where ? matchWhere(r, args.where) : true));
        const groups = new Map<string, { keys: Record<string, any>; count: number }>();

        for (const item of items) {
          const keyObj: Record<string, any> = {};
          for (const b of args.by) keyObj[b] = item[b];
          const groupKey = JSON.stringify(keyObj);

          if (!groups.has(groupKey)) {
            groups.set(groupKey, { keys: keyObj, count: 1 });
          } else {
            groups.get(groupKey)!.count++;
          }
        }

        let result = Array.from(groups.values()).map((g) => {
          const res: any = { ...g.keys };
          if (args._count) {
            res._count = {};
            for (const c of Object.keys(args._count)) {
              res._count[c] = g.count;
            }
          }
          return res;
        });

        if (args.having) {
          // simple having filter
          for (const [key, val] of Object.entries(args.having as Record<string, any>)) {
            if (val._count?.gte) {
              result = result.filter((r) => (r._count?.[key] ?? 0) >= val._count.gte);
            }
          }
        }

        return result;
      },
    };
  }

  private hydrateRelations(modelName: string, item: any, include?: Record<string, any>, select?: Record<string, any>) {
    if (!item) return null;
    let res = { ...item };

    if (include) {
      if (include.department && res.departmentId) {
        res.department = this.departments.find((d) => d.id === res.departmentId) || null;
      }
      if (include.mentor && res.mentorId) {
        const m = this.mentors.find((men) => men.id === res.mentorId);
        if (m) {
          res.mentor = include.mentor.select ? pickFields(m, include.mentor.select) : m;
        } else {
          res.mentor = null;
        }
      }
      if (include.mentor && modelName === "users") {
        res.mentor = this.mentors.find((m) => m.userId === res.id) || null;
      }
      if (include.student && modelName === "users") {
        res.student = this.students.find((s) => s.userId === res.id) || null;
      }
      if (include.student && res.studentId) {
        const s = this.students.find((st) => st.id === res.studentId);
        if (s) {
          res.student = include.student.select ? pickFields(s, include.student.select) : s;
        } else {
          res.student = null;
        }
      }
      if (include.riskAssessments) {
        let risks = this.riskAssessments.filter((r) => r.studentId === res.id);
        if (include.riskAssessments.orderBy) risks = sortItems(risks, include.riskAssessments.orderBy);
        if (include.riskAssessments.take) risks = risks.slice(0, include.riskAssessments.take);
        res.riskAssessments = risks;
      }
      if (include.riskAssessment) {
        res.riskAssessment = this.riskAssessments.find((r) => r.meetingId === res.id || r.studentId === res.studentId) || null;
      }
      if (include.meetings) {
        let mList = this.meetings.filter((m) => m.studentId === res.id);
        if (include.meetings.orderBy) mList = sortItems(mList, include.meetings.orderBy);
        res.meetings = mList;
      }
      if (include.issues) {
        let iList = this.studentIssues.filter((i) => i.studentId === res.id);
        if (include.issues.orderBy) iList = sortItems(iList, include.issues.orderBy);
        res.issues = iList;
      }
      if (include.actionItems) {
        let aList = this.actionItems.filter((a) => a.studentId === res.id);
        if (include.actionItems.orderBy) aList = sortItems(aList, include.actionItems.orderBy);
        res.actionItems = aList;
      }
      if (include.interventions) {
        let intList = this.interventions.filter((i) => i.studentId === res.id);
        if (include.interventions.orderBy) intList = sortItems(intList, include.interventions.orderBy);
        res.interventions = intList;
      }
      if (include.students) {
        let sList = this.students.filter((s) => s.mentorId === res.id || s.departmentId === res.id);
        if (include.students.include?.riskAssessments) {
          sList = sList.map((st) => {
            let risks = this.riskAssessments.filter((r) => r.studentId === st.id);
            if (include.students.include.riskAssessments.orderBy) risks = sortItems(risks, include.students.include.riskAssessments.orderBy);
            if (include.students.include.riskAssessments.take) risks = risks.slice(0, include.students.include.riskAssessments.take);
            return { ...st, riskAssessments: risks };
          });
        }
        res.students = sList;
      }
      if (include.mentors) {
        let mList = this.mentors.filter((m) => m.departmentId === res.id);
        res.mentors = mList;
      }
    }

    if (select) {
      res = pickFields(res, select);
    }

    return res;
  }
}

function matchWhere(record: any, where: Record<string, any>): boolean {
  for (const [key, value] of Object.entries(where)) {
    if (key === "OR" && Array.isArray(value)) {
      const orMatched = value.some((clause) => matchWhere(record, clause));
      if (!orMatched) return false;
      continue;
    }

    if (value === undefined) continue;

    const recordVal = record[key];

    if (value !== null && typeof value === "object" && !(value instanceof Date)) {
      if ("in" in value && Array.isArray(value.in)) {
        if (!value.in.includes(recordVal)) return false;
      }
      if ("not" in value) {
        if (recordVal === value.not) return false;
      }
      if ("gte" in value) {
        const comp = value.gte instanceof Date ? value.gte.getTime() : value.gte;
        const rVal = recordVal instanceof Date ? recordVal.getTime() : recordVal;
        if (rVal < comp) return false;
      }
      if ("lte" in value) {
        const comp = value.lte instanceof Date ? value.lte.getTime() : value.lte;
        const rVal = recordVal instanceof Date ? recordVal.getTime() : recordVal;
        if (rVal > comp) return false;
      }
      if ("gt" in value) {
        const comp = value.gt instanceof Date ? value.gt.getTime() : value.gt;
        const rVal = recordVal instanceof Date ? recordVal.getTime() : recordVal;
        if (rVal <= comp) return false;
      }
      if ("lt" in value) {
        const comp = value.lt instanceof Date ? value.lt.getTime() : value.lt;
        const rVal = recordVal instanceof Date ? recordVal.getTime() : recordVal;
        if (rVal >= comp) return false;
      }
      if ("contains" in value) {
        const target = String(value.contains).toLowerCase();
        const actual = String(recordVal || "").toLowerCase();
        if (!actual.includes(target)) return false;
      }
    } else {
      if (recordVal !== value) return false;
    }
  }
  return true;
}

function sortItems(items: any[], orderBy: any): any[] {
  const copy = [...items];
  const entries = Array.isArray(orderBy) ? orderBy : [orderBy];

  copy.sort((a, b) => {
    for (const order of entries) {
      for (const [key, dir] of Object.entries(order)) {
        const valA = a[key] instanceof Date ? a[key].getTime() : a[key];
        const valB = b[key] instanceof Date ? b[key].getTime() : b[key];
        if (valA < valB) return dir === "desc" ? 1 : -1;
        if (valA > valB) return dir === "desc" ? -1 : 1;
      }
    }
    return 0;
  });
  return copy;
}

function pickFields(obj: any, select: Record<string, boolean>): any {
  const result: any = {};
  for (const [key, selected] of Object.entries(select)) {
    if (selected) result[key] = obj[key];
  }
  return result;
}

// Export singleton
export const prisma = new InMemoryPrismaClient();
