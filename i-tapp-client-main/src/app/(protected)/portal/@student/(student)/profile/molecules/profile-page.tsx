"use client";
import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Target,
  Award,
  Code,
  Heart,
  Edit3,
  LogOut,
  X,
  MapPin,
  Calendar,
  GraduationCap,
  FileText,
} from "lucide-react";
import InfoCard from "@/components/info-card";
import SkillCard from "@/components/skill-card";
import ProfileHeaderBanner from "@/components/profile-header-banner";
import { useFetchProfile } from "@/hooks/query";
import { Spinner } from "@/components/spinner";
import ProfileForm from "./profile-form";
import { useLogout } from "@/hooks/use-logout";

// Mock student data
const mockStudent = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@university.edu",
  phone: "+234 803 555 1234",
  matricNumber: "2020/12345",
  department: "Computer Science",
  level: "400 Level",
  cgpa: "4.75",
  profileBio:
    "Passionate software developer with a keen interest in web technologies and artificial intelligence. Always eager to learn new technologies and contribute to innovative projects.",
  softSkills:
    "Communication, Teamwork, Problem Solving, Time Management, Leadership",
  technicalSkills: "JavaScript, React, Node.js, Python, SQL, Git, Docker",
  preferredIndustry: "Software Development, Fintech, AI/ML",
  goals:
    "Secure a software engineering role at a leading tech company and contribute to building scalable solutions that impact millions of users.",
  address: "University of Lagos, Akoka, Lagos",
  dob: "1999-05-15",
  profilePicture: null,
};

const StudentProfilePage = ({ student = mockStudent, onEdit = () => {} }) => {
  const [editing, setEditing] = useState(false);
  const { data: studentDetails, isLoading, error } = useFetchProfile();
  const logout = useLogout();

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      {/* ── Edit Profile Modal ── */}
      {editing && (
        <div
          className="fixed inset-0 z-[60] flex items-end md:items-center justify-center"
          style={{ animation: "backdropIn 200ms ease forwards" }}
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setEditing(false)}
          />
          <div
            className="relative w-full md:max-w-2xl md:mx-4 bg-white md:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{
              maxHeight: "92dvh",
              animation: "sheetIn 300ms cubic-bezier(0.32,0.72,0,1) forwards",
            }}
          >
            <div className="h-1 w-full bg-primary shrink-0" />
            <div className="flex justify-center pt-3 pb-1 md:hidden shrink-0">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
              <div>
                <h2 className="text-base font-bold text-gray-900 tracking-tight">
                  Edit Profile
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Update your details and skills
                </p>
              </div>
              <button
                title="edit"
                type="button"
                onClick={() => setEditing(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-5 py-5 md:px-8">
              <ProfileForm
                student={studentDetails}
                onClose={() => setEditing(false)}
              />
            </div>
            <div className="shrink-0 border-t border-gray-100 px-5 py-4 flex items-center justify-between bg-gray-50/80">
              <button
                type="button"
                onClick={logout}
                className="text-xs text-red-400 hover:text-red-600 font-medium flex items-center gap-1.5 transition-colors"
              >
                <LogOut size={13} />
                Sign out
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="profile-form"
                  className="px-5 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes backdropIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes sheetIn {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @media (min-width: 768px) {
          @keyframes sheetIn {
            from { transform: translateY(12px) scale(0.97); opacity: 0; }
            to   { transform: translateY(0)    scale(1);    opacity: 1; }
          }
        }
      `}</style>

      {/* ── Profile Page ── */}
      <div className="min-h-screen mt-6 md:mt-12 bg-gray-50 md:py-8 md:px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <ProfileHeaderBanner
              profile={{
                type: "student",
                profileImage: studentDetails.profileImage,
              }}
              icon={<User className="w-16 h-16 text-white" />}
            />

            <div className="pt-8 px-4 md:px-8 pb-6 border-b border-gray-200">
              <div className="flex items-center justify-end gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="flex gap-2 items-center px-3 py-1.5 bg-primary text-white hover:bg-primary/90 rounded-lg transition-colors font-medium text-sm"
                >
                  <Edit3 size={14} />
                  Edit Profile
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="flex gap-2 items-center px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium text-sm"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {studentDetails.firstName} {studentDetails.lastName}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <GraduationCap size={18} />
                      <span className="text-sm capitalize font-medium">
                        {studentDetails.courseOfStudy}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText size={16} />
                      <span className="text-sm font-medium">
                        {studentDetails.level} Level
                      </span>
                    </div>
                    {studentDetails.gpa && (
                      <div className="flex items-center gap-2">
                        <Award size={18} className="text-yellow-600" />
                        <span className="text-sm font-medium">
                          GPA: {studentDetails.gpa}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {studentDetails.matriculationNumber && (
                  <div className="bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg">
                    <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">
                      Matric Number
                    </p>
                    <p className="text-lg font-bold text-blue-900">
                      {studentDetails.matriculationNumber}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {studentDetails.bio && (
              <div className="px-4 md:px-8 py-6 bg-gray-50 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  About Me
                </h2>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                  {studentDetails.bio}
                </p>
              </div>
            )}

            <div className="p-3 md:p-8 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoCard
                  icon={<Mail size={18} />}
                  label="Email Address"
                  value={studentDetails?.user?.email}
                />
                <InfoCard
                  icon={<Phone size={18} />}
                  label="Phone Number"
                  value={studentDetails.phone}
                />
                {studentDetails.address && (
                  <InfoCard
                    icon={<MapPin size={18} />}
                    label="Address"
                    value={studentDetails.address}
                    fullWidth
                  />
                )}
                {studentDetails.preferredLocation && (
                  <InfoCard
                    icon={<MapPin size={18} />}
                    label="Preferred IT Location"
                    value={studentDetails.preferredLocation}
                  />
                )}
                {studentDetails?.dob && (
                  <InfoCard
                    icon={<Calendar size={18} />}
                    label="Date of Birth"
                    value={new Date(studentDetails.dob).toLocaleDateString(
                      "en-NG",
                      { month: "long", day: "numeric", year: "numeric" },
                    )}
                  />
                )}
              </div>
            </div>

            <div className="p-3 md:p-8 bg-gray-50">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6">
                Skills & Career Goals
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SkillCard
                  icon={<Code size={18} />}
                  label="Technical Skills"
                  value={studentDetails.techSkills}
                  color="blue"
                />
                <SkillCard
                  icon={<Heart size={18} />}
                  label="Soft Skills"
                  value={studentDetails.softSkills}
                  color="purple"
                />
                <SkillCard
                  icon={<Briefcase size={18} />}
                  label="Preferred Industry"
                  value={studentDetails.preferredIndustry}
                  color="green"
                />
                <SkillCard
                  icon={<Target size={18} />}
                  label="Career Goals"
                  value={studentDetails.goals}
                  color="orange"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentProfilePage;
