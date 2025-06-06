'use client';

import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";

function StudentRecordPage() {
  // Mock auth context
  const currentUser = { id: 'student1', role: 'student' };

  // Mock data
  const academicRecord = {
    gpa: 3.75,
    totalCredits: 30,
    courses: [
      { courseId: '1', semester: '1st Semester', letterGrade: 'A' },
      { courseId: '2', semester: '1st Semester', letterGrade: 'B+' },
      { courseId: '3', semester: '2nd Semester', letterGrade: 'A-' },
    ],
  };

  const courses: Record<string, { id: string; code: string; name: string; credits: number }> = {
    '1': { id: '1', code: 'CS101', name: 'Introduction to Programming', credits: 3 },
    '2': { id: '2', code: 'MATH201', name: 'Calculus I', credits: 4 },
    '3': { id: '3', code: 'ENG101', name: 'English Composition', credits: 3 },
  };

  const getCourseById = (courseId: string) => courses[courseId] || null;

  if (!currentUser || currentUser.role !== 'student') {
    return <div>Access Denied</div>;
  }

  if (!academicRecord) {
    return (
      <div className="space-y-6 p-6">
        <h1 className="text-3xl font-bold text-[#0F214D]">Academic Record</h1>
        <div className="border rounded-lg shadow-lg bg-white">
          <div className="p-12 text-center">
            <span className="mx-auto text-5xl text-gray-400 opacity-30">🎓</span>
            <h3 className="mt-4 text-lg font-medium">No Academic Record</h3>
            <p className="mt-2 text-sm text-gray-500">
              Your academic record is not available yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getLetterGradeColor = (letterGrade: string) => {
    switch (letterGrade[0]) {
      case 'A': return "text-green-600";
      case 'B': return "text-emerald-600";
      case 'C': return "text-yellow-600";
      case 'D': return "text-orange-600";
      case 'F': return "text-red-600";
      default: return "";
    }
  };

  const coursesBySemester: Record<string, typeof academicRecord.courses> = academicRecord.courses.reduce((acc: Record<string, typeof academicRecord.courses>, course) => {
    if (!acc[course.semester]) {
      acc[course.semester] = [];
    }
    acc[course.semester].push(course);
    return acc;
  }, {});

  return (
    <div className="min-h-screen flex font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gray-100">
        <Navbar />
        <div className="space-y-6 p-6">
          <h1 className="text-3xl font-bold text-[#0F214D]">ACADEMIC RECORD</h1>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border rounded-lg shadow-lg bg-white md:col-span-1">
              <div className="p-4">
                <h2 className="text-xl font-semibold text-[#0F214D]">Summary</h2>
                <p className="text-gray-600">Your academic progress</p>
              </div>
              <div className="p-4 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[#0F214D]">GPA</span>
                    <span className="text-2xl font-bold text-[#0F214D]">{academicRecord.gpa.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-[#1C3C6E] h-2.5 rounded-full"
                      style={{ width: `${academicRecord.gpa * 25}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 text-right">out of 4.0</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-[#0F214D]">Total Credits</span>
                    <div className="border rounded px-2 py-1 font-bold text-[#0F214D]">
                      {academicRecord.totalCredits}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-[#0F214D]">Courses Completed</span>
                    <div className="border rounded px-2 py-1 font-bold text-[#0F214D]">
                      {academicRecord.courses.length}
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t space-y-2">
                  <h3 className="text-sm font-medium text-[#0F214D]">Grade Distribution</h3>
                  <div className="flex justify-between gap-2 text-xs text-[#0F214D]">
                    {['A', 'B', 'C', 'D', 'F'].map((grade) => {
                      const count = academicRecord.courses.filter(c => c.letterGrade.startsWith(grade)).length;
                      return (
                        <div
                          key={grade}
                          className={`flex-1 p-2 rounded-md text-center ${count > 0 ? 'bg-[#E6F0FA] text-[#0F214D]' : 'bg-gray-100'}`}
                        >
                          <div className="font-bold">{grade}</div>
                          <div>{count}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="border rounded-lg shadow-lg bg-white md:col-span-2">
              <div className="p-4">
                <h2 className="text-xl font-semibold text-[#0F214D]">Course History</h2>
                <p className="text-gray-600">Your completed and in-progress courses</p>
              </div>
              <div className="p-4">
                <div className="border rounded-md">
                  <div className="grid grid-cols-[2fr_1fr_1fr] bg-gray-50 border-b">
                    <div className="p-3 font-semibold text-[#0F214D]">Course</div>
                    <div className="p-3 font-semibold text-[#0F214D]">Credits</div>
                    <div className="p-3 font-semibold text-right text-[#0F214D]">Grade</div>
                  </div>
                  {Object.entries(coursesBySemester).map(([semester, semesterCourses]) => (
                    <div key={semester}>
                      <div className="grid grid-cols-[1fr] bg-[#E6F0FA]">
                        <div className="p-3 font-semibold text-[#0F214D]">{semester}</div>
                      </div>
                      {semesterCourses.map(course => {
                        const courseDetails = getCourseById(course.courseId);
                        return (
                          <div key={course.courseId} className="grid grid-cols-[2fr_1fr_1fr] border-t">
                            <div className="p-3">
                              <div className="font-medium text-[#0F214D]">{courseDetails?.name}</div>
                              <div className="text-xs text-gray-500">{courseDetails?.code}</div>
                            </div>
                            <div className="p-3">{courseDetails?.credits}</div>
                            <div className="p-3 text-right">
                              <span className={`font-bold ${getLetterGradeColor(course.letterGrade)}`}>
                                {course.letterGrade}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentRecordPage;