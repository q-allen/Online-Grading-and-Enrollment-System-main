'use client';

import { useState } from 'react';
import { Search, User, Save, ChevronDown } from 'lucide-react';
import Navbar from '@/app/components/Navbar';
import Sidebar from '@/app/components/Sidebar';

// Mock data (replacing the imported mockData)
const courses = [
  { id: '1', code: 'CS101', name: 'Introduction to Programming' },
  { id: '2', code: 'CS102', name: 'Data Structures' },
];

const getCoursesForTeacher = () => courses;

const getStudentsInCourse = () => [
  { id: 's1', name: 'John Doe', email: 'john@example.com' },
  { id: 's2', name: 'Jane Smith', email: 'jane@example.com' },
];

const getStudentGradeForCourse = () => ({
  midterm: null,
  final: null,
  assignments: null,
  attendance: null,
  finalGrade: null,
  letterGrade: null,
});

// Mock auth context
const useAuth = () => ({
  currentUser: { id: 't1', role: 'teacher' },
});

// Mock toast hook
const useToast = () => ({
  toast: ({ title, description }: { title: string; description: string }) => alert(`${title}: ${description}`),
});

export default function TeacherGradesPage() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState<{ id: string; code: string; name: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  type Grade = {
    midterm: number | null;
    final: number | null;
    assignments: number | null;
    attendance: number | null;
    finalGrade: number | null;
    letterGrade: string | null;
    [key: string]: number | string | null | undefined;
  };

  const [, setGrades] = useState<Record<string, Grade>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  if (!currentUser || currentUser.role !== 'teacher') {
    return <div className="text-center py-4">Access Denied</div>;
  }

  const teacherCourses = getCoursesForTeacher();

  const handleCourseChange = (courseId: string) => {
    const course = teacherCourses.find((c) => c.id === courseId) || null;
    setSelectedCourse(course);
    setGrades({});
    setHasChanges(false);
    setIsSelectOpen(false);
  };

  const getStudents = () => {
    if (!selectedCourse) return [];

    const students = getStudentsInCourse();

    if (searchTerm) {
      return students.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return students;
  };

  const handleGradeChange = (
    studentId: string,
    field: string,
    value: string | number
  ) => {
    const numValue = value === '' ? null : Number(value);

    setGrades((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: numValue,
      },
    }));

    setHasChanges(true);
  };

  const handleSaveGrades = () => {
    toast({
      title: 'Grades saved',
      description: 'Student grades have been successfully updated.',
    });
    setHasChanges(false);
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div
        className={`flex-1 flex flex-col bg-gray-100 transition-all duration-300`}
      >
        <Navbar />
      <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-[#0F214D]">MANAGE STUDENT GRADES</h1>
        {hasChanges && (
          <button
            onClick={handleSaveGrades}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </button>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="md:w-1/3">
              <label className="text-sm font-medium mb-1 block text-[#0F214D]">Select Course</label>
              <div className="relative w-full">
                <button
                    onClick={() => setIsSelectOpen(!isSelectOpen)}
                    className="w-full h-10 px-4 py-2 border border-gray-300 rounded-md text-left bg-white text-gray-600 flex items-center justify-between"
                >
                    <span>{selectedCourse ? `${selectedCourse.code} - ${selectedCourse.name}` : 'Select a course'}</span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>
                {isSelectOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {teacherCourses.map((course) => (
                        <div
                        key={course.id}
                        onClick={() => {
                            handleCourseChange(course.id);
                            setIsSelectOpen(false);
                        }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                        >
                        {course.code} - {course.name}
                        </div>
                    ))}
                    </div>
                )}
                </div>
            </div>

            {selectedCourse && (
              <div className="md:w-2/3">
                <label className="text-sm font-medium mb-1 block text-[#0F214D]">Search Students</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-600" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    className="w-full pl-8 pr-4 py-2 border rounded-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {selectedCourse ? (
            <>
              <div className="border rounded-md overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-4 text-left w-[200px]">Student</th>
                      <th className="p-4 text-center">Midterm</th>
                      <th className="p-4 text-center">Final</th>
                      <th className="p-4 text-center">Assignments</th>
                      <th className="p-4 text-center">Attendance</th>
                      <th className="p-4 text-center">Final Grade</th>
                      <th className="p-4 text-center">Letter Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getStudents().map((student) => {
                      const studentGrade = getStudentGradeForCourse();
                      return (
                        <tr key={student.id} className="border-t">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="bg-blue-600 text-white p-1 rounded-full">
                                <User className="h-4 w-4" />
                              </div>
                              <div>
                                <div>{student.name}</div>
                                <div className="text-xs text-gray-500">{student.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              className="w-16 mx-auto text-center border rounded-md p-1"
                              defaultValue={studentGrade?.midterm ?? ''}
                              onChange={(e) => handleGradeChange(student.id, 'midterm', e.target.value)}
                              placeholder="Midterm"
                              title="Midterm grade"
                            />
                          </td>
                          <td className="p-4 text-center">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              className="w-16 mx-auto text-center border rounded-md p-1"
                              defaultValue={studentGrade?.final ?? ''}
                              onChange={(e) => handleGradeChange(student.id, 'final', e.target.value)}
                              placeholder="Final"
                              title="Final grade"
                            />
                          </td>
                          <td className="p-4 text-center">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              className="w-16 mx-auto text-center border rounded-md p-1"
                              defaultValue={studentGrade?.assignments ?? ''}
                              onChange={(e) => handleGradeChange(student.id, 'assignments', e.target.value)}
                              placeholder="Assignments"
                              title="Assignments grade"
                            />
                          </td>
                          <td className="p-4 text-center">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              className="w-16 mx-auto text-center border rounded-md p-1"
                              defaultValue={studentGrade?.attendance ?? ''}
                              onChange={(e) => handleGradeChange(student.id, 'attendance', e.target.value)}
                              placeholder="Attendance"
                            />
                          </td>
                          <td className="p-4 text-center font-medium">
                            {studentGrade?.finalGrade !== null ? studentGrade?.finalGrade : '-'}
                          </td>
                          <td className="p-4 text-center font-medium">
                            {studentGrade?.letterGrade || '-'}
                          </td>
                        </tr>
                      );
                    })}
                    {getStudents().length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-gray-500">
                          No students found for this course
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {getStudents().length > 0 && hasChanges && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleSaveGrades}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <User className="mx-auto h-12 w-12 opacity-20 mb-2" />
              <h3 className="font-medium text-lg">No Course Selected</h3>
              <p className="text-sm mt-1">Please select a course to manage student grades</p>
            </div>
          )}
        </div>
      </div>
        </div>
      </div>
    </div>
  );
}