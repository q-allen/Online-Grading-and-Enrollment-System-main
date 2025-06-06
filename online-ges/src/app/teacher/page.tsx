"use client";

import { useState } from "react";
import { CalendarDays, ClipboardList, Book, Users, Search, ChevronRight } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Sidebar from "../components/Sidebar";

export default function DashboardPage() {
  const [viewPeriod, setViewPeriod] = useState<"weekly" | "monthly">("weekly");

  // Mock data
  const courses = 3;
  const classesThisWeek = 5;
  const gradesEntered = 120;
  const totalStudents = 75;

  const recentClasses = [
    { id: "1", course: "Composition", code: "ENG105", time: "10:00 AM", room: "Room 101", day: "Monday" },
    { id: "2", course: "Intro to Biology", code: "BIO110", time: "2:00 PM", room: "Room 202", day: "Tuesday" },
    { id: "3", course: "Data Structures", code: "CS201", time: "1:00 PM", room: "Room 303", day: "Wednesday" },
  ];

  const topStudents = [
    { name: "Alice Johnson", grade: 95, course: "CS101" },
    { name: "Bob Smith", grade: 92, course: "ENG105" },
    { name: "Carol Martinez", grade: 90, course: "CS201" },
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
                placeholder="Search..."
                className="w-full sm:w-64 pl-8 px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F214D] bg-white text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase">Courses</p>
                <p className="text-2xl font-bold text-[#0F214D]">{courses}</p>
                <p className="text-xs text-green-600">+10.5%</p>
              </div>
              <Book className="w-8 h-8 text-[#2BA3EC]" />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase">Classes This Week</p>
                <p className="text-2xl font-bold text-[#0F214D]">{classesThisWeek}</p>
                <p className="text-xs text-red-600">-5.2%</p>
              </div>
              <CalendarDays className="w-8 h-8 text-[#2BA3EC]" />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase">Grades Entered</p>
                <p className="text-2xl font-bold text-[#0F214D]">{gradesEntered}</p>
                <p className="text-xs text-green-600">+15.3%</p>
              </div>
              <ClipboardList className="w-8 h-8 text-[#2BA3EC]" />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase">Total Students</p>
                <p className="text-2xl font-bold text-[#0F214D]">{totalStudents}</p>
                <p className="text-xs text-red-600">-2.1%</p>
              </div>
              <Users className="w-8 h-8 text-[#2BA3EC]" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[#0F214D] uppercase">Recent Classes</h2>
                <a href="#" className="text-[#2BA3EC] text-sm flex items-center hover:underline">
                  View All <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </div>
              <div className="space-y-3">
                {recentClasses.map((classItem) => (
                  <div
                    key={classItem.id}
                    className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium text-[#0F214D]">{classItem.course}</p>
                      <p className="text-sm text-gray-600">{classItem.code} | {classItem.day}, {classItem.time}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#0F214D]">{classItem.room}</span>
                      <button className="text-[#2BA3EC] hover:underline">Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[#0F214D] uppercase">Classes Per Day</h2>
                <div className="flex gap-2">
                  <button
                    className={`text-sm px-3 py-1 rounded-md ${
                      viewPeriod === "weekly"
                        ? "bg-[#0F214D] text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => setViewPeriod("weekly")}
                  >
                    Weekly
                  </button>
                  <button
                    className={`text-sm px-3 py-1 rounded-md ${
                      viewPeriod === "monthly"
                        ? "bg-[#0F214D] text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => setViewPeriod("monthly")}
                  >
                    Monthly
                  </button>
                </div>
              </div>
              <div style={{ height: "200px" }}>
                {/* Replace with a Bar chart component */}
                {/* Example using react-chartjs-2 */}
                {/* 
                <Bar
                  data={{
                    labels: days,
                    datasets: [{
                      label: "Classes",
                      data: classesPerDayData,
                      backgroundColor: "#2BA3EC",
                      borderColor: "#2BA3EC",
                      borderWidth: 1,
                      barThickness: 20,
                      borderRadius: 4,
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 60,
                        ticks: {
                          stepSize: 10,
                          font: { size: 12 },
                          color: "#6B7280"
                        },
                        grid: {
                          color: "#E5E7EB"
                        }
                      },
                      x: {
                        ticks: {
                          font: { size: 12 },
                          color: "#6B7280"
                        },
                        grid: {
                          display: false
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        display: false
                      }
                    }
                  }}
                />
                */}
                <div className="flex items-center justify-center h-full text-gray-400">
                  [Bar Chart Placeholder]
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[#0F214D] uppercase">Average Grade Trend</h2>
                <div className="flex gap-2">
                  <button
                    className={`text-sm px-3 py-1 rounded-md ${
                      viewPeriod === "weekly"
                        ? "bg-[#0F214D] text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => setViewPeriod("weekly")}
                  >
                    Weekly
                  </button>
                  <button
                    className={`text-sm px-3 py-1 rounded-md ${
                      viewPeriod === "monthly"
                        ? "bg-[#0F214D] text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => setViewPeriod("monthly")}
                  >
                    Monthly
                  </button>
                </div>
              </div>
              <div style={{ height: "200px" }}>
                {/* Replace with a Line chart component */}
                <div className="flex items-center justify-center h-full text-gray-400">
                  [Line Chart Placeholder]
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-lg font-bold text-[#0F214D]">$70.68</p>
                <p className="text-sm text-gray-600">22 February</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[#0F214D] uppercase">Top Performing Students</h2>
                <div className="flex gap-2">
                  <button
                    className={`text-sm px-3 py-1 rounded-md ${
                      viewPeriod === "weekly"
                        ? "bg-[#0F214D] text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => setViewPeriod("weekly")}
                  >
                    Weekly
                  </button>
                  <button
                    className={`text-sm px-3 py-1 rounded-md ${
                      viewPeriod === "monthly"
                        ? "bg-[#0F214D] text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => setViewPeriod("monthly")}
                  >
                    Monthly
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2 font-medium text-[#0F214D] text-sm uppercase">
                  <p>Student Name</p>
                  <p>Grade</p>
                  <p>Course</p>
                </div>
                {topStudents.map((student, idx) => (
                  <div key={idx} className="grid grid-cols-3 gap-2 items-center p-3 border rounded-md">
                    <p className="text-sm text-[#0F214D]">{student.name}</p>
                    <p className="text-sm text-[#0F214D]">{student.grade}</p>
                    <p className="text-sm text-[#0F214D]">{student.course}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}