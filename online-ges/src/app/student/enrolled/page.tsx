'use client';

import { useState } from 'react';
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";

function StudentEnrolledPage() {
  // Mock auth context
  const currentUser = { id: 'student1', role: 'student' };

  // Mock toast hook
  type ToastParams = { title: string; description: string };
  const toast = ({ title, description }: ToastParams) => {
    alert(`${title}: ${description}`);
  };

  // Mock data
  const enrolledCourses = [
    {
      id: '1',
      code: 'CS101',
      name: 'Introduction to Programming',
      credits: 3,
      semester: 'Fall 2024',
      description: 'Learn the basics of programming using Python.',
    },
    {
      id: '2',
      code: 'MATH201',
      name: 'Calculus I',
      credits: 4,
      semester: 'Fall 2024',
      description: 'Fundamentals of calculus and its applications.',
    },
  ];

  const getScheduleForCourse = (courseId: string) => {
    const schedules: Record<string, { id: string; day: string; startTime: string; endTime: string; room: string }[]> = {
      '1': [
        { id: 's1', day: 'Monday', startTime: '9:00 AM', endTime: '10:30 AM', room: 'B101' },
        { id: 's2', day: 'Wednesday', startTime: '9:00 AM', endTime: '10:30 AM', room: 'B101' },
      ],
      '2': [
        { id: 's3', day: 'Tuesday', startTime: '11:00 AM', endTime: '12:30 PM', room: 'A204' },
        { id: 's4', day: 'Thursday', startTime: '11:00 AM', endTime: '12:30 PM', room: 'A204' },
      ],
    };
    return schedules[courseId] || [];
  };

  const handleDropCourse = (courseId: string, courseName: string) => {
    toast({
      title: 'Course dropped',
      description: `You have dropped ${courseName}.`,
    });
  };

  if (!currentUser || currentUser.role !== 'student') {
    return <div>Access Denied</div>;
  }

  return (
    <div className="min-h-screen flex font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gray-100">
        <Navbar />
        <div className="space-y-6 p-6">
          <h1 className="text-3xl font-bold text-[#0F214D]">MY ENROLLED SUBJECTS</h1>

          {enrolledCourses.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  schedule={getScheduleForCourse(course.id)}
                  handleDropCourse={handleDropCourse}
                />
              ))}
            </div>
          ) : (
            <div className="border rounded-lg shadow-lg bg-white p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3-.512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h3 className="mt-4 text-lg font-medium">No Enrolled Courses</h3>
              <p className="mt-2 text-sm text-gray-500">You haven&apos;t enrolled in any courses yet.</p>
              <button
                className="mt-6 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => window.location.href = '/student/courses'}
              >
                Browse Available Courses
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type Course = {
  id: string;
  code: string;
  name: string;
  credits: number;
  semester: string;
  description: string;
};

type ScheduleSlot = {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
};

type CourseCardProps = {
  course: Course;
  schedule: ScheduleSlot[];
  handleDropCourse: (courseId: string, courseName: string) => void;
};

function CourseCard({ course, schedule, handleDropCourse }: CourseCardProps) {
  const [activeTab, setActiveTab] = useState('details');

  return (
    <div className="border rounded-lg shadow-lg bg-white">
      <div className="p-4">
        <h2 className="text-xl font-semibold text-[#0F214D]">{course.code}</h2>
        <p className="text-gray-600">{course.name}</p>
      </div>

      <div className="p-4">
        <div className="border-b">
          <div className="flex">
            <button
              className={`flex-1 py-2 px-4 text-sm font-medium ${
                activeTab === 'details'
                  ? 'text-[#0F214D] bg-gray-100 rounded-tl-md'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('details')}
            >
              <svg className="inline-block w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3-.512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Details
            </button>
            <button
              className={`flex-1 py-2 px-4 text-sm font-medium ${
                activeTab === 'schedule'
                  ? 'text-[#0F214D] bg-gray-100 rounded-tr-md'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('schedule')}
            >
              <svg className="inline-block w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Schedule
            </button>
          </div>
        </div>

        <div className="pt-4">
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs text-gray-500">Credits</h3>
                  <p className="font-medium text-[#0F214D]">{course.credits}</p>
                </div>
                <div>
                  <h3 className="text-xs text-gray-500">Semester</h3>
                  <p className="font-medium text-[#0F214D]">{course.semester}</p>
                </div>
              </div>
              <div>
                <h3 className="text-xs text-gray-500">Description</h3>
                <p className="text-sm text-[#0F214D]">{course.description}</p>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-2">
              {schedule.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between bg-gray-50 rounded-md p-2"
                >
                  <div>
                    <p className="font-medium text-[#0F214D]">{slot.day}</p>
                    <p className="text-xs text-gray-500">
                      {slot.startTime} - {slot.endTime}
                    </p>
                  </div>
                  <span className="bg-blue-100 text-[#0F214D] text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {slot.room}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        <button
          className="w-full py-2 px-4 border border-red-500 text-red-500 hover:bg-red-50 rounded-md flex items-center justify-center"
          onClick={() => handleDropCourse(course.id, course.name)}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Drop Course
        </button>
      </div>
    </div>
  );
}

export default StudentEnrolledPage;