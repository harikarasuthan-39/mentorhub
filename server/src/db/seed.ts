import { prisma } from "../config/prisma";
import bcrypt from "bcryptjs";

export async function seedDatabase() {
  const existingUsers = await prisma.user.count();
  if (existingUsers > 0) {
    console.log(`[PostgreSQL] Database already initialized with ${existingUsers} users. Skipping seed.`);
    return;
  }

  console.log("[PostgreSQL] Initializing baseline institutional dataset without sample profile photos...");

  const passwordHash = bcrypt.hashSync("Password@123", 10);

  // Departments
  const cse = await prisma.department.upsert({
    where: { code: "CSE" },
    update: {},
    create: {
      id: "dept_cse",
      name: "Computer Science & Engineering",
      code: "CSE",
      createdAt: new Date("2024-01-01"),
    },
  });

  const aids = await prisma.department.upsert({
    where: { code: "AIDS" },
    update: {},
    create: {
      id: "dept_aids",
      name: "AI & Data Science",
      code: "AIDS",
      createdAt: new Date("2024-01-01"),
    },
  });

  // HOD User & Mentor record (NO sample / Unsplash profile photo)
  const hodUser = await prisma.user.create({
    data: {
      id: "usr_hod",
      email: "hod@university.edu",
      passwordHash,
      role: "HOD",
      profilePicture: null,
      isActive: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
  });

  const hodMentor = await prisma.mentor.create({
    data: {
      id: "mentor_hod",
      userId: hodUser.id,
      fullName: "Dr. Arvind Swamy",
      employeeId: "HOD-CSE-001",
      designation: "Professor & Head of Department",
      departmentId: cse.id,
      profilePicture: null,
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
    },
  });

  // Faculty Mentors
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

  const createdMentors: any[] = [];

  for (let i = 0; i < mentorNames.length; i++) {
    const uId = `usr_mentor_${i + 1}`;
    const mId = `mentor_${i + 1}`;

    const u = await prisma.user.create({
      data: {
        id: uId,
        email: `mentor${i + 1}@university.edu`,
        passwordHash,
        role: "MENTOR",
        profilePicture: null, // NO sample photos
        isActive: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
    });

    const m = await prisma.mentor.create({
      data: {
        id: mId,
        userId: u.id,
        fullName: mentorNames[i],
        employeeId: `EMP10${i + 1}`,
        designation: i === 0 ? "Associate Professor & Senior Advisor" : "Assistant Professor",
        departmentId: mentorDepts[i],
        profilePicture: null, // NO sample photos
        phone: `+91 98765 ${10000 + i}`,
        qualification: mentorQualifications[i],
        specialization: mentorSpecializations[i],
        experience: `${6 + i * 2} Years Teaching & Research`,
        dateOfJoining: new Date("2018-06-15"),
        employmentStatus: "Full-Time Permanent",
        address: `Faculty Block ${i % 2 === 0 ? "A" : "B"}, Cabin ${201 + i}`,
        city: "Coimbatore",
        state: "Tamil Nadu",
        bio: `Specializing in ${mentorSpecializations[i]}. Dedicated to undergraduate mentorship, project supervision, and career preparation.`,
        createdAt: new Date("2024-01-01"),
      },
    });

    createdMentors.push(m);
  }

  // Students
  const FIRST_NAMES = ["Arun", "Priya", "Karthik", "Divya", "Ram", "Sneha", "Vijay", "Anitha", "Suresh", "Meena"];
  const years = ["II", "III", "IV", "I", "II", "III", "IV", "II", "III", "IV"];
  const sections = ["A", "B", "A", "C", "B", "A", "C", "A", "B", "A"];
  const attendances = [68.5, 92.4, 71.0, 88.2, 94.0, 64.0, 79.5, 91.2, 73.5, 86.0];
  const cgpas = [6.8, 8.9, 7.1, 8.4, 9.2, 6.2, 7.8, 8.7, 7.0, 8.1];
  const arrearCounts = [2, 0, 1, 0, 0, 3, 0, 0, 2, 0];
  const placements = ["IN_PROGRESS", "ELIGIBLE", "NOT_ELIGIBLE", "ELIGIBLE", "PLACED", "NOT_ELIGIBLE", "IN_PROGRESS", "ELIGIBLE", "NOT_ELIGIBLE", "ELIGIBLE"] as const;
  const internships = ["IN_PROGRESS", "COMPLETED", "NOT_STARTED", "COMPLETED", "COMPLETED", "NOT_STARTED", "IN_PROGRESS", "COMPLETED", "NOT_STARTED", "IN_PROGRESS"] as const;

  for (let i = 0; i < 10; i++) {
    const sId = `student_${i + 1}`;
    const userId = `usr_student_${i + 1}`;
    const email = `student${i + 1}@university.edu`;
    const mentor = createdMentors[i % createdMentors.length];
    const dept = i % 2 === 0 ? cse : aids;
    const year = years[i];
    const section = sections[i];
    const attendance = attendances[i];
    const cgpa = cgpas[i];
    const arrears = arrearCounts[i];

    await prisma.user.create({
      data: {
        id: userId,
        email,
        passwordHash,
        role: "STUDENT",
        profilePicture: null, // NO sample photos
        isActive: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
    });

    const studentRecord = await prisma.student.create({
      data: {
        id: sId,
        userId,
        fullName: `${FIRST_NAMES[i]} Kumar`,
        registerNumber: `23${dept.code}${String(101 + i).padStart(3, "0")}`,
        admissionNumber: `ADM2023-${String(1001 + i)}`,
        admissionYear: 2023,
        academicYear: "2023 - 2027",
        profilePicture: null, // NO sample photos
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
        emergencyContactName: `Mr. ${FIRST_NAMES[i]} Senior`,
        emergencyContactPhone: `+91 9842${String(100000 + i)}`,
        bankName: i % 2 === 0 ? "State Bank of India" : "HDFC Bank",
        accountHolderName: `${FIRST_NAMES[i]} Kumar`,
        accountNumber: `39842010${String(1000 + i * 17).padStart(4, "0")}`,
        ifscCode: i % 2 === 0 ? "SBIN0001248" : "HDFC0000312",
        skills: ["Data Structures & Algorithms", "Python", "SQL & Database Design", "Web Development", "Git"],
        certifications: ["AWS Cloud Foundations", "Data Analytics Certification"],
        bio: `Undergraduate student in ${dept.name} with interests in software development, data science, and placement readiness.`,
        attendancePercentage: attendance,
        cgpa,
        arrearCount: arrears,
        placementStatus: placements[i],
        internshipStatus: internships[i],
        certificationCount: 2 + (i % 3),
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date(),
      },
    });

    // Seed 1 meeting per student for history
    const mDate = new Date(Date.now() - (15 + (i % 20)) * 86400000);
    const followUp = new Date(mDate.getTime() + 14 * 86400000);
    const isLowAtt = attendance < 75;

    const meeting = await prisma.meeting.create({
      data: {
        id: `meeting_${sId}_1`,
        studentId: sId,
        mentorId: mentor.id,
        meetingDate: mDate,
        meetingType: "INDIVIDUAL",
        discussionSummary: `Reviewed academic progress, semester attendance (${attendance}%), and coursework.`,
        studentConcerns: isLowAtt ? "Difficulty catching up with early morning coursework." : "Preparing for upcoming placements and exams.",
        mentorSuggestions: isLowAtt ? "Recommended attending remedial sessions and weekly tracking." : "Maintain good CGPA and start mock aptitude tests.",
        nextFollowUpDate: followUp,
        aiSummary: isLowAtt ? "Student requires attendance improvement and coursework reinforcement." : "Student is performing steadily across all parameters.",
        aiKeyConcerns: isLowAtt ? ["Attendance below 75%"] : ["Placement preparation"],
        aiImportantPoints: ["Attendance status reviewed", "Academic plan established"],
        aiRecommendedActions: isLowAtt ? ["Attend remedial math classes"] : ["Complete mock test series"],
        aiStatus: "COMPLETED",
        createdAt: mDate,
        updatedAt: mDate,
      },
    });

    if (isLowAtt) {
      await prisma.studentIssue.create({
        data: {
          id: `issue_${sId}_1`,
          studentId: sId,
          meetingId: meeting.id,
          mentorId: mentor.id,
          category: "ATTENDANCE",
          description: `Attendance dropped to ${attendance}% in current term.`,
          severity: "HIGH",
          status: "IN_PROGRESS",
          isRestricted: false,
          createdAt: mDate,
          updatedAt: mDate,
        },
      });
    }

    await prisma.actionItem.create({
      data: {
        id: `act_${sId}_1`,
        studentId: sId,
        meetingId: meeting.id,
        mentorId: mentor.id,
        actionType: "STUDENT_ACTION",
        description: isLowAtt ? "Submit weekly attendance log to mentor" : "Complete online certification course",
        assignedTo: studentRecord.fullName,
        targetCompletionDate: followUp,
        status: "PENDING",
        createdAt: mDate,
      },
    });
  }

  console.log("[PostgreSQL] Baseline institutional dataset seeded successfully into PostgreSQL.");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
