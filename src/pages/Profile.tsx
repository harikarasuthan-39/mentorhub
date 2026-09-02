import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  ArrowLeft,
  Mail,
  Phone,
  Building,
  GraduationCap,
  Calendar,
  MapPin,
  Github,
  Linkedin,
  Globe,
  FileText,
  Edit3,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Briefcase,
  Users,
  Award,
  BookOpen,
  LogOut,
  Save,
  X,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import { BackButton } from "../components/ui/BackButton";

export function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [mentorData, setMentorData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Edit form state
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    city: "",
    state: "",
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactPhone: "",
    careerGoal: "",
    targetRole: "",
    skills: "",
    certifications: "",
    githubUrl: "",
    linkedinUrl: "",
    portfolioUrl: "",
    resumeUrl: "",
    bio: "",
    specialization: "",
  });

  const fetchProfile = async () => {
    if (!user) return;
    try {
      setLoading(true);
      if (user.role === "STUDENT") {
        const res = await api.get("/students/me");
        if (res.data.success) {
          const s = res.data.data;
          setProfileData(s);
          setFormData({
            phone: s.phone || "+91 98765 43210",
            address: s.address || "14/A, Anna Salai, Gandhipuram",
            city: s.city || "Coimbatore",
            state: s.state || "Tamil Nadu",
            emergencyContactName: s.parentName || "S. Kumar (Father)",
            emergencyContactRelation: "Father",
            emergencyContactPhone: s.parentContact || "+91 98421 99887",
            careerGoal: s.careerGoal || "Full Stack AI Engineer at Tier-1 Product Company",
            targetRole: s.targetRole || "Software Development Engineer (SDE-1)",
            skills: Array.isArray(s.skills) ? s.skills.join(", ") : "React, TypeScript, Python, Node.js, PyTorch, SQL, DSA",
            certifications: Array.isArray(s.certifications) ? s.certifications.join(", ") : "AWS Cloud Practitioner, DeepLearning.AI GenAI Specialization",
            githubUrl: s.githubUrl || "https://github.com/arunkumar-dev",
            linkedinUrl: s.linkedinUrl || "https://linkedin.com/in/arunkumar-tech",
            portfolioUrl: s.portfolioUrl || "https://arunkumar.dev",
            resumeUrl: s.resumeUrl || "https://drive.google.com/file/d/arun-resume/view",
            bio: s.bio || "Passionate 3rd-year Computer Science undergraduate focusing on AI applications, full-stack microservices, and distributed systems.",
            specialization: "",
          });
        }
      } else {
        // MENTOR, HOD, or ADMIN
        const res = await api.get("/dashboard/metrics");
        const facultyInfo = {
          fullName: user.role === "HOD" ? "Dr. Arvind Swamy" : "Dr. Priya Raman",
          employeeId: user.role === "HOD" ? "FAC-HOD-001" : "FAC-CSE-014",
          designation: user.role === "HOD" ? "Professor & Head of Department" : "Associate Professor & Faculty Advisor",
          department: "Computer Science & Engineering",
          departmentCode: "CSE",
          email: user.email,
          phone: user.role === "HOD" ? "+91 98420 11223" : "+91 98765 11234",
          officeAddress: user.role === "HOD" ? "Block 3, Office of the HOD (Room 301)" : "Block 3, Faculty Cabins (Room 214)",
          qualification: user.role === "HOD" ? "Ph.D. in Distributed Systems & AI (IIT Madras)" : "Ph.D. in Machine Learning & Data Systems (NIT Trichy)",
          specialization: user.role === "HOD" ? "Cloud Systems, AI Governance, Institutional Accreditation" : "Machine Learning, Deep Learning, Graph Neural Networks",
          experience: user.role === "HOD" ? "18 Years (Academic & Administrative Leadership)" : "11 Years Teaching & Industry R&D",
          dateOfJoining: user.role === "HOD" ? "12 April 2010" : "15 June 2015",
          assignedStudentsCount: user.role === "HOD" ? 450 : 20,
          activeMeetingsCount: res.data?.data?.totalMeetings || 18,
          bio: user.role === "HOD"
            ? "Dedicated to advancing high-impact engineering pedagogy, NBA/NAAC tier-1 accreditation standards, and industry-partnered AI research labs."
            : "Mentoring undergraduate engineers with a focus on data structures, algorithmic problem solving, and career placement readiness.",
        };
        setMentorData(facultyInfo);
        setFormData({
          phone: facultyInfo.phone,
          address: facultyInfo.officeAddress,
          city: "Coimbatore",
          state: "Tamil Nadu",
          emergencyContactName: "",
          emergencyContactRelation: "",
          emergencyContactPhone: "",
          careerGoal: "",
          targetRole: "",
          skills: "",
          certifications: "",
          githubUrl: "",
          linkedinUrl: "",
          portfolioUrl: "",
          resumeUrl: "",
          bio: facultyInfo.bio,
          specialization: facultyInfo.specialization,
        });
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSaveError("");

    try {
      if (user?.role === "STUDENT" && profileData?.id) {
        await api.put(`/students/${profileData.id}`, {
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          emergencyContactName: formData.emergencyContactName,
          emergencyContactPhone: formData.emergencyContactPhone,
          careerGoal: formData.careerGoal,
          targetRole: formData.targetRole,
          skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
          certifications: formData.certifications.split(",").map((s) => s.trim()).filter(Boolean),
          githubUrl: formData.githubUrl,
          linkedinUrl: formData.linkedinUrl,
          portfolioUrl: formData.portfolioUrl,
          resumeUrl: formData.resumeUrl,
          bio: formData.bio,
        });
      }
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 4000);
      fetchProfile();
    } catch (err: any) {
      setSaveError(err.response?.data?.message || "Failed to update profile settings.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-9 h-9 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-600">Loading verified profile records...</p>
        </div>
      </div>
    );
  }

  const isStudent = user?.role === "STUDENT";
  const name = isStudent
    ? profileData?.fullName || "Arun Kumar"
    : mentorData?.fullName || (user?.role === "HOD" ? "Dr. Arvind Swamy" : "Dr. Priya Raman");

  const email = user?.email || "user@university.edu";

  return (
    <div id="profile_page" className="w-full space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BackButton label="Back" fallback="/dashboard" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
              {name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {isStudent ? (
                <>
                  Reg. No: <span className="font-mono font-semibold text-slate-700">{profileData?.registerNumber || "23CSE101"}</span> • {profileData?.degree || "B.E. Computer Science & Engineering"}
                </>
              ) : (
                <>
                  Employee ID: <span className="font-mono font-semibold text-slate-700">{mentorData?.employeeId || "FAC-CSE-014"}</span> • {mentorData?.department || "Computer Science & Engineering"}
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <button
            id="btn_edit_profile"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Edit3 size={14} />
            <span>Edit Profile</span>
          </button>
          <button
            id="btn_profile_logout"
            onClick={() => logout()}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>Profile records updated successfully.</span>
        </div>
      )}

      {/* Main Profile Hero Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Cover Banner */}
        <div className="h-28 sm:h-32 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-900 relative flex items-start justify-end p-4 sm:p-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-white/10 backdrop-blur-md text-white border border-white/20 shadow-xs">
            <ShieldCheck size={13} className="text-purple-300" />
            {user?.role} Account
          </span>
        </div>

        {/* Profile Info & Quick Actions Row */}
        <div className="px-5 sm:px-7 pb-6 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 -mt-12 sm:-mt-14 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
              {/* Round Profile Picture - Top Layer above banner */}
              <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-lg bg-slate-900 flex items-center justify-center shrink-0 overflow-hidden ring-1 ring-slate-200/80">
                <img
                  src={
                    isStudent
                      ? "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80"
                      : user?.role === "HOD"
                      ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                      : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80"
                  }
                  alt={name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback to stylized initial badge if image fails
                    e.currentTarget.style.display = "none";
                  }}
                />
                <span className="font-bold text-2xl sm:text-3xl text-white select-none">
                  {name.charAt(0)}
                </span>
              </div>
              <div className="sm:pt-4 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                    {name}
                  </h2>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200/70">
                    <ShieldCheck size={13} className="text-purple-600" /> Verified
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  {isStudent
                    ? `${profileData?.degree || "B.E. Computer Science & Engineering"} • Year ${profileData?.year || "III"}, Sec ${profileData?.section || "A"}`
                    : mentorData?.designation || "Faculty Advisor"}
                </p>
              </div>
            </div>

            <div className="flex items-center shrink-0 sm:pt-4">
              <button
                id="btn_quick_message"
                onClick={() => navigate("/messages")}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 hover:border-purple-300 text-xs font-semibold transition-colors cursor-pointer w-full sm:w-auto shadow-2xs"
              >
                <MessageSquare size={14} />
                <span>Open Messages</span>
              </button>
            </div>
          </div>

          {/* Quick Statistics Grid */}
          {isStudent ? (
            <div className="border-t border-slate-100 pt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                <div className="flex flex-col justify-center sm:px-2 pt-2 sm:pt-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Register Number
                  </p>
                  <p className="font-bold text-slate-800 text-sm sm:text-base mt-1 font-mono">
                    {profileData?.registerNumber || "23CSE101"}
                  </p>
                </div>
                <div className="flex flex-col justify-center sm:px-4 pt-2 sm:pt-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Cumulative CGPA
                  </p>
                  <p className="font-bold text-emerald-600 text-sm sm:text-base mt-1">
                    {profileData?.cgpa || 8.4} <span className="text-xs text-slate-400 font-normal">/ 10.0</span>
                  </p>
                </div>
                <div className="flex flex-col justify-center sm:px-4 pt-2 sm:pt-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Attendance Rate
                  </p>
                  <p className="font-bold text-purple-600 text-sm sm:text-base mt-1">
                    {profileData?.attendancePercentage || 88}%
                  </p>
                </div>
                <div className="flex flex-col justify-center sm:px-4 pt-2 sm:pt-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Standing Arrears
                  </p>
                  <p className="font-bold text-slate-800 text-sm sm:text-base mt-1">
                    {profileData?.arrearCount ?? 0} <span className="text-xs text-slate-500 font-normal">Active</span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-t border-slate-100 pt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                <div className="flex flex-col justify-center sm:px-2 pt-2 sm:pt-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Employee ID
                  </p>
                  <p className="font-bold text-slate-800 text-sm sm:text-base mt-1 font-mono">
                    {mentorData?.employeeId || "FAC-CSE-001"}
                  </p>
                </div>
                <div className="flex flex-col justify-center sm:px-4 pt-2 sm:pt-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Department
                  </p>
                  <p className="font-bold text-purple-700 text-sm sm:text-base mt-1">
                    {mentorData?.department || "Computer Science"}
                  </p>
                </div>
                <div className="flex flex-col justify-center sm:px-4 pt-2 sm:pt-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Assigned Mentees
                  </p>
                  <p className="font-bold text-slate-800 text-sm sm:text-base mt-1">
                    {mentorData?.assignedStudentsCount || 20} <span className="text-xs text-slate-500 font-normal">Students</span>
                  </p>
                </div>
                <div className="flex flex-col justify-center sm:px-4 pt-2 sm:pt-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Experience
                  </p>
                  <p className="font-bold text-slate-800 text-sm sm:text-base mt-1">
                    {mentorData?.experience || "11 Years"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Sections: 2-Column Responsive SaaS Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Contact & Relationships */}
        <div className="space-y-6 lg:col-span-1">
          {/* Contact Information */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Contact & Location
            </h3>
            <div className="space-y-3.5">
              {/* Institutional Email */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail size={15} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Institutional Email
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-slate-800 truncate mt-0.5">
                    {email}
                  </p>
                </div>
              </div>

              {/* Phone Line */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone size={15} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Phone Line
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-slate-800 truncate mt-0.5">
                    {formData.phone || "Not specified"}
                  </p>
                </div>
              </div>

              {/* Address & Location */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={15} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Address & Location
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-slate-800 leading-snug mt-0.5">
                    {formData.address}, {formData.city}, {formData.state}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mentoring Relationship Card (Student Only) */}
          {isStudent && profileData?.mentor && (
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Assigned Faculty Mentor
              </h3>
              <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-purple-50/70 border border-purple-100/80">
                <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
                  {profileData.mentor.fullName.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {profileData.mentor.fullName}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {profileData.mentor.designation || "Faculty Advisor"}
                  </p>
                </div>
              </div>
              <button
                id="btn_message_assigned_mentor"
                onClick={() => navigate("/messages")}
                className="w-full py-2 px-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold text-center transition-colors cursor-pointer shadow-xs inline-flex items-center justify-center gap-2"
              >
                <MessageSquare size={14} />
                <span>Message Mentor Directly</span>
              </button>
            </div>
          )}

          {/* Emergency Contact (Student Only) */}
          {isStudent && (
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Emergency Contact
              </h3>
              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 space-y-1">
                <p className="text-xs sm:text-sm font-bold text-slate-800">
                  {formData.emergencyContactName}
                </p>
                <p className="text-[11px] text-slate-500">
                  Relation: <span className="font-semibold text-slate-700">{formData.emergencyContactRelation}</span>
                </p>
                <p className="text-xs text-purple-700 font-semibold font-mono pt-0.5">
                  {formData.emergencyContactPhone}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Academic, Career & Technical Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Biography & Objective */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Profile Summary & Objective
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {formData.bio || "No summary provided."}
            </p>
          </div>

          {/* Student Career & Technical Portfolio */}
          {isStudent ? (
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Career Goals & Technical Portfolio
              </h3>
              
              {/* Target Role & Milestone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 border border-slate-100 flex flex-col justify-center">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Target Placement Role
                  </p>
                  <p className="font-bold text-slate-800 text-xs sm:text-sm mt-1 leading-snug">
                    {formData.targetRole || "Software Development Engineer"}
                  </p>
                </div>
                <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 border border-slate-100 flex flex-col justify-center">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Primary Career Milestone
                  </p>
                  <p className="font-bold text-purple-700 text-xs sm:text-sm mt-1 leading-snug">
                    {formData.careerGoal || "Product Engineering Track"}
                  </p>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-700">
                  Verified Skills & Technologies
                </p>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.split(",").map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200/80 text-xs font-medium"
                    >
                      {sk.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Certifications if available */}
              {formData.certifications && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-700">
                    Certifications & Honors
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.certifications.split(",").map((cert, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs font-medium"
                      >
                        {cert.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Developer Profiles & Artifacts */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-700">
                  Developer Profiles & Artifacts
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {formData.githubUrl && (
                    <a
                      href={formData.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/30 text-slate-700 transition-colors group min-w-0"
                    >
                      <Github size={15} className="text-slate-700 shrink-0 group-hover:text-purple-600" />
                      <span className="truncate font-medium flex-1">GitHub Profile</span>
                    </a>
                  )}
                  {formData.linkedinUrl && (
                    <a
                      href={formData.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/30 text-slate-700 transition-colors group min-w-0"
                    >
                      <Linkedin size={15} className="text-blue-600 shrink-0" />
                      <span className="truncate font-medium flex-1">LinkedIn Profile</span>
                    </a>
                  )}
                  {formData.portfolioUrl && (
                    <a
                      href={formData.portfolioUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/30 text-slate-700 transition-colors group min-w-0"
                    >
                      <Globe size={15} className="text-emerald-600 shrink-0" />
                      <span className="truncate font-medium flex-1">Personal Portfolio</span>
                    </a>
                  )}
                  {formData.resumeUrl && (
                    <a
                      href={formData.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/30 text-slate-700 transition-colors group min-w-0"
                    >
                      <FileText size={15} className="text-purple-600 shrink-0" />
                      <span className="truncate font-medium flex-1">Verified Resume PDF</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Academic Qualifications & Research Focus
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Highest Qualification
                  </p>
                  <p className="font-bold text-slate-800 text-xs sm:text-sm mt-0.5">
                    {mentorData?.qualification}
                  </p>
                </div>
                <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Research & Teaching Specialization
                  </p>
                  <p className="font-bold text-purple-700 text-xs sm:text-sm mt-0.5">
                    {mentorData?.specialization}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Masked Financial Information (Student Only) */}
          {isStudent && (
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Direct Benefit & Scholarship Account
                </h3>
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                  Verified Active
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-medium">Bank Name</p>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    {profileData?.bankName || "State Bank of India"}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-medium">Account Number</p>
                  <p className="font-semibold text-slate-800 mt-0.5 font-mono">
                    {profileData?.maskedAccountNumber || "XXXX XXXX 1017"}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-medium">IFSC Code</p>
                  <p className="font-semibold text-slate-800 mt-0.5 font-mono">
                    {profileData?.ifscCode || "SBIN0001248"}
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                🔒 Account numbers are masked for data privacy according to institutional security standards.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden my-auto flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Edit Profile Records
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update contact details, career roadmaps, and technical links.
                </p>
              </div>
              <button
                id="btn_close_edit_profile"
                onClick={() => setIsEditing(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={17} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
              {saveError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{saveError}</span>
                </div>
              )}

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Summary / Bio
                </label>
                <textarea
                  id="input_bio"
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Phone & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    id="input_phone"
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    City / State
                  </label>
                  <input
                    id="input_city"
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Address
                </label>
                <input
                  id="input_address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                />
              </div>

              {isStudent && (
                <>
                  {/* Emergency Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-slate-100">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Emergency Contact Person
                      </label>
                      <input
                        id="input_emergency_name"
                        type="text"
                        value={formData.emergencyContactName}
                        onChange={(e) =>
                          setFormData({ ...formData, emergencyContactName: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Emergency Contact Phone
                      </label>
                      <input
                        id="input_emergency_phone"
                        type="text"
                        value={formData.emergencyContactPhone}
                        onChange={(e) =>
                          setFormData({ ...formData, emergencyContactPhone: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Career & Skills */}
                  <div className="space-y-3.5 pt-2 border-t border-slate-100">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Target Role & Career Goal
                      </label>
                      <input
                        id="input_target_role"
                        type="text"
                        value={formData.targetRole}
                        onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                        placeholder="e.g. Full Stack AI Engineer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Skills (comma separated)
                      </label>
                      <input
                        id="input_skills"
                        type="text"
                        value={formData.skills}
                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Links */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-slate-100">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        GitHub Profile URL
                      </label>
                      <input
                        id="input_github_url"
                        type="url"
                        value={formData.githubUrl}
                        onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        LinkedIn Profile URL
                      </label>
                      <input
                        id="input_linkedin_url"
                        type="url"
                        value={formData.linkedinUrl}
                        onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Form Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  id="btn_cancel_edit"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn_save_profile_submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <Save size={14} />
                  <span>{submitting ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default Profile;

