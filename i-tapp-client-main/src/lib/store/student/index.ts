import type { Student } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StudentState {
  student: Student | null;
  savedApplications: any[];
  selectedJob: any;
  students: Student[];
  setStudent: (s: Student | null) => void;
  setSavedApplications: (apps: any[]) => void;
  setSelectedJob: (job: any) => void;
  setStudents: (list: Student[]) => void;
  updateStudentProfile: (updates: Partial<Student>) => void;
}

export const useStudentStore = create<StudentState>()(
  persist(
    (set) => ({
      student: null,
      savedApplications: [],
      selectedJob: null,
      students: [],

      setStudent: (s) => set({ student: s }),
      setSavedApplications: (apps) => set({ savedApplications: apps }),
      setSelectedJob: (job) => set({ selectedJob: job }),
      setStudents: (list) => set({ students: list }),

      updateStudentProfile: (updates) =>
        set((state) => ({
          student: state.student ? { ...state.student, ...updates } : null,
        })),
    }),
    { name: "student-store" }
  )
);
