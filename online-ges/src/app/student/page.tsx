"use client";

import { useState } from "react";
import {BookOpen, CalendarDays, ListChecks, Receipt, Search, ChevronRight, Clock, } from "lucide-react";
import Sidebar from "@/app/components/Sidebar";
import Navbar from "@/app/components/Navbar";


const StudentDashboard = () => {
  const [viewPeriod, setViewPeriod] = useState<"semester" | "overall">("semester");

  // Mock data
  const totalCourses = 6;
  const enrolledClasses = 4;
  const totalGrades = 12;
  const billingBalance = 5000;

  const recentGrades = [
    { id: "1", course: "Math 101", code: "MATH101", grade: "A", date: "2025-05-27" },
    { id: "2", course: "Science 102", code: "SCI102", grade: "B+", date: "2025-05-26" },
    { id: "3", course: "History 201", code: "HIST201", grade: "A-", date: "2025-05-25" },
  ];

  const enrollmentStatus = {
    enrolledCourses: 4,
    totalCourses: 6,
    status: "Active",
  };

  const upcomingClasses = [
    { id: "1", course: "Math 101", code: "MATH101", time: "10:00 AM", room: "Room 101", day: "2025-05-29" },
    { id: "2", course: "Science 102", code: "SCI102", time: "2:00 PM", room: "Room 202", day: "2025-05-30" },
    { id: "3", course: "History 201", code: "HIST201", time: "1:00 PM", room: "Room 303", day: "2025-05-31" },
  ];

  return (
    <div className="min-h-screen flex font-sans bg-gray-100">
        <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-4 sm:p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F214D] uppercase">Welcome to Your Dashboard</h1>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses, grades..."
                className="w-full sm:w-64 pl-8 px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F214D] bg-white text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase">Total Courses</p>
                <p className="text-2xl font-bold text-[#0F214D]">{totalCourses}</p>
                <p className="text-xs text-green-600">+5.8%</p>
              </div>
              <BookOpen className="w-8 h-8 text-[#2BA3EC]" />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase">Enrolled Classes</p>
                <p className="text-2xl font-bold text-[#0F214D]">{enrolledClasses}</p>
                <p className="text-xs text-green-600">+3.2%</p>
              </div>
              <CalendarDays className="w-8 h-8 text-[#2BA3EC]" />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase">Total Grades</p>
                <p className="text-2xl font-bold text-[#0F214D]">{totalGrades}</p>
                <p className="text-xs text-red-600">-1.5%</p>
              </div>
              <ListChecks className="w-8 h-8 text-[#2BA3EC]" />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase">Billing Balance</p>
                <p className="text-2xl font-bold text-[#0F214D]">₱{billingBalance.toLocaleString()}.00</p>
                <p className="text-xs text-red-600">+2.1%</p>
              </div>
              <Receipt className="w-8 h-8 text-[#2BA3EC]" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[#0F214D] uppercase">Recent Grades</h2>
                <a href="/student/grades" className="text-[#2BA3EC] text-sm flex items-center hover:underline">
                  View All <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </div>
              <div className="space-y-3">
                {recentGrades.map((grade) => (
                  <div
                    key={grade.id}
                    className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium text-[#0F214D]">{grade.course}</p>
                      <p className="text-sm text-gray-600">{grade.code} | {grade.date}</p>
                    </div>
                    <span
                      className={`font-medium text-sm ${
                        grade.grade.startsWith("A")
                          ? "text-green-600"
                          : grade.grade.startsWith("B")
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {grade.grade}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[#0F214D] uppercase">Enrollment Status</h2>
              </div>
              <p className="text-sm text-gray-700">
                Currently enrolled in <strong>{enrollmentStatus.enrolledCourses}</strong> out of{" "}
                <strong>{enrollmentStatus.totalCourses}</strong> courses.
              </p>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-[#2BA3EC] h-2.5 rounded-full"
                    style={{
                      width: `${(enrollmentStatus.enrolledCourses / enrollmentStatus.totalCourses) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {Math.round((enrollmentStatus.enrolledCourses / enrollmentStatus.totalCourses) * 100)}% Complete
                </p>
              </div>
              <p className="mt-2 text-sm text-gray-700">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    enrollmentStatus.status === "Active" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {enrollmentStatus.status}
                </span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[#0F214D] uppercase">Grade Distribution</h2>
                <div className="flex gap-2">
                  <button
                    className={`text-sm px-3 py-1 rounded-md ${
                      viewPeriod === "semester"
                        ? "bg-[#0F214D] text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => setViewPeriod("semester")}
                  >
                    Semester
                  </button>
                  <button
                    className={`text-sm px-3 py-1 rounded-md ${
                      viewPeriod === "overall"
                        ? "bg-[#0F214D] text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => setViewPeriod("overall")}
                  >
                    Overall
                  </button>
                </div>
              </div>
              <div style={{ height: "200px" }} className="flex items-center justify-center text-gray-400">
                {/* Chart goes here. Replace this with a chart component like react-chartjs-2 */}
                <span>Grade distribution chart placeholder</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[#0F214D] uppercase">Upcoming Classes</h2>
                <a href="/student/schedule" className="text-[#2BA3EC] text-sm flex items-center hover:underline">
                  View All <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </div>
              <div className="space-y-3">
                {upcomingClasses.map((classItem) => (
                  <div
                    key={classItem.id}
                    className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <div className="text-[#2BA3EC] bg-[#2BA3EC]/10 p-2 rounded-md mr-4">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-[#0F214D]">{classItem.course}</p>
                        <p className="text-sm text-gray-600">{classItem.code} | {classItem.day}, {classItem.time}</p>
                      </div>
                    </div>
                    <span className="text-sm text-[#0F214D]">{classItem.room}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;