'use client';

import { useState } from 'react';
import { ChevronDown } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";

function StudentGradesPage() {
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Mock auth context
  const currentUser = { id: 'student1', role: 'student' };

  // Mock data
  const enrolledCourses = [
    {
      id: '1',
      code: 'CS101',
      name: 'Introduction to Programming',
      semester: '1st Semester',
    },
    {
      id: '2',
      code: 'MATH201',
      name: 'Calculus I',
      semester: '2nd Semester',
    },
  ];

  const grades: Record<string, {
    midterm: number | null;
    final: number | null;
    assignments: number | null;
    attendance: number | null;
    finalGrade: number | null;
    letterGrade: string | null;
  }> = {
    '1': {
      midterm: 85,
      final: 90,
      assignments: 88,
      attendance: 95,
      finalGrade: 89,
      letterGrade: 'B+',
    },
    '2': {
      midterm: null,
      final: null,
      assignments: null,
      attendance: null,
      finalGrade: null,
      letterGrade: null,
    },
  };

  const getStudentGradeForCourse = (studentId: string, courseId: string) => {
    return grades[courseId] || null;
  };

  if (!currentUser || currentUser.role !== 'student') {
    return <div>Access Denied</div>;
  }

  const semesters = Array.from(new Set(enrolledCourses.map(course => course.semester)));

  const filteredCourses = selectedSemester
    ? enrolledCourses.filter(course => course.semester === selectedSemester)
    : enrolledCourses;

  const getProgressColor = (value: number | null) => {
    if (value === null) return "bg-gray-200";
    if (value >= 90) return "bg-green-500";
    if (value >= 80) return "bg-emerald-500";
    if (value >= 70) return "bg-yellow-500";
    if (value >= 60) return "bg-orange-500";
    return "bg-red-500";
  };

  const renderGradeCard = (courseId: string) => {
    const course = enrolledCourses.find(c => c.id === courseId);
    if (!course) return null;

    const grade = getStudentGradeForCourse(currentUser.id, courseId);

    if (!grade || grade.finalGrade === null) {
      return (
        <div key={course.id} className="border rounded-lg shadow-lg bg-white">
          <div className="p-4">
            <h2 className="text-xl font-semibold text-[#0F214D]">{course.name}</h2>
            <p className="text-gray-600">{course.code}</p>
          </div>
          <div className="p-4 text-center text-gray-500">
            No grades available yet
          </div>
        </div>
      );
    }

    return (
      <div key={course.id} className="border rounded-lg shadow-lg bg-white">
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-[#0F214D]">{course.name}</h2>
              <p className="text-gray-600">{course.code}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-[#0F214D]">{grade.letterGrade}</span>
              <p className="text-sm text-[#0F214D]">{grade.finalGrade}%</p>
            </div>
          </div>
        </div>
        <div className="p-4 space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-sm text-[#0F214D]">
              <span>Midterm</span>
              <span>{grade.midterm !== null ? `${grade.midterm}%` : 'N/A'}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className={`${getProgressColor(grade.midterm)} h-2.5 rounded-full`} style={{ width: `${grade.midterm || 0}%` }}></div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm text-[#0F214D]">
              <span>Final</span>
              <span>{grade.final !== null ? `${grade.final}%` : 'N/A'}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className={`${getProgressColor(grade.final)} h-2.5 rounded-full`} style={{ width: `${grade.final || 0}%` }}></div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm text-[#0F214D]">
              <span>Assignments</span>
              <span>{grade.assignments !== null ? `${grade.assignments}%` : 'N/A'}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className={`${getProgressColor(grade.assignments)} h-2.5 rounded-full`} style={{ width: `${grade.assignments || 0}%` }}></div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm text-[#0F214D]">
              <span>Attendance</span>
              <span>{grade.attendance !== null ? `${grade.attendance}%` : 'N/A'}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className={`${getProgressColor(grade.attendance)} h-2.5 rounded-full`} style={{ width: `${grade.attendance || 0}%` }}></div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="space-y-1">
              <div className="flex justify-between text-[#0F214D]">
                <span className="font-medium">Final Grade</span>
                <span className="font-medium">{grade.finalGrade}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className={`${getProgressColor(grade.finalGrade)} h-2.5 rounded-full`} style={{ width: `${grade.finalGrade}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gray-100">
        <Navbar />
        <div className="space-y-6 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-3xl font-bold text-[#0F214D]">MY GRADES</h1>
            <div className="w-full md:w-64 relative">
            <button
              className="w-full h-10 px-4 py-2 text-left bg-white border border-gray-300 rounded-md text-gray-600 flex items-center justify-between"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>{selectedSemester || 'All Semesters'}</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
            {isDropdownOpen && (
              <div className="absolute w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 z-10 text-[#0F214D]">
                <div
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedSemester(null);
                    setIsDropdownOpen(false);
                  }}
                >
                  All Semesters
                </div>
                {semesters.map((semester) => (
                  <div
                    key={semester}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedSemester(semester);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {semester}
                  </div>
                ))}
              </div>
            )}
          </div>
          </div>
          {filteredCourses.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-6">
              {filteredCourses.map(course => renderGradeCard(course.id))}
            </div>
          ) : (
            <div className="border rounded-lg shadow-lg bg-white p-12 text-center">
              <h3 className="mt-4 text-lg font-medium">No Course Data</h3>
              <p className="mt-2 text-sm text-gray-500">
                You don&apos;t have any courses for the selected semester.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentGradesPage;