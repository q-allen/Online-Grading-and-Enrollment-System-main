"use client";

import { useState } from "react";
import { Search, Book, Calendar, Plus, ClipboardList, Clock } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";

const StudentPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<{
    id: string;
    name: string;
    code: string;
    credits: number;
    semester: string;
    enrolledStudents: number;
    maxStudents: number;
    description: string;
  } | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [activeTab, setActiveTab] = useState("details"); // State for active tab

  const courses = [
    { id: "1", name: "Composition", code: "ENG105", credits: 3, semester: "Fall 2023", enrolledStudents: 15, maxStudents: 30, description: "Learn the fundamentals of writing and composition." },
    { id: "2", name: "Intro to Biology", code: "BIO110", credits: 4, semester: "Spring 2024", enrolledStudents: 20, maxStudents: 25, description: "Explore the basics of biological sciences." },
    { id: "3", name: "Data Structures", code: "CS201", credits: 3, semester: "Spring 2024", enrolledStudents: 10, maxStudents: 20, description: "Study advanced data structures and algorithms." },
  ];

  const filteredCourses = searchTerm
    ? courses.filter((course) =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : courses;

  // Mock function for schedule
  const getScheduleForCourse = (courseId: string) => {
    const schedules = [
      { id: "1", courseId: "1", day: "Monday", startTime: "10:00 AM", endTime: "11:30 AM", room: "Room 101" },
      { id: "2", courseId: "1", day: "Wednesday", startTime: "10:00 AM", endTime: "11:30 AM", room: "Room 101" },
      { id: "3", courseId: "2", day: "Tuesday", startTime: "2:00 PM", endTime: "3:30 PM", room: "Room 202" },
    ];
    return schedules.filter((schedule) => schedule.courseId === courseId);
  };

  const handleEnroll = (course: { id: string; name: string; code: string; credits: number; semester: string; enrolledStudents: number; maxStudents: number; description: string }) => {
    setEnrolling(true);
    setTimeout(() => {
      setEnrolling(false);
      setSelectedCourse(null);
      console.log(`Enrolled in ${course.code} - ${course.name}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gray-100">
        <Navbar />
        <div className="space-y-6 p-4 sm:p-6 md:p-8">
          <h1 className="text-3xl font-bold text-[#0F214D]">AVAILABLE COURSES</h1>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F214D] bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-4 bg-white p-4 rounded-lg shadow-md">
                <h2 className="font-medium text-lg text-[#0F214D]">
                  Available Courses ({filteredCourses.length})
                </h2>
                {filteredCourses.length > 0 ? (
                  <div className="space-y-2">
                    {filteredCourses.map((course) => (
                      <div
                        key={course.id}
                        className={`border cursor-pointer p-4 rounded-md transition-colors ${
                          selectedCourse?.id === course.id
                            ? "border-[#2BA3EC] bg-[#E6F0FA]"
                            : "hover:border-[#2BA3EC]"
                        }`}
                        onClick={() => setSelectedCourse(course)}
                      >
                        <div>
                          <h3 className="text-sm font-medium text-[#020817]">{course.name}</h3>
                          <p className="text-sm text-gray-600">{course.code}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="inline-block border border-gray-300 text-gray-700 text-xs px-2 py-1 rounded">
                              {course.credits} Credits
                            </span>
                            <span className="inline-block bg-[#E6F0FA] text-[#2BA3EC] text-xs px-2 py-1 rounded">
                              {course.semester}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-4 text-gray-500">No courses available for enrollment</div>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              {selectedCourse ? (
                <div className="bg-white rounded-lg shadow-md">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-[#0F214D]">
                      {selectedCourse.code} - {selectedCourse.name}
                    </h2>
                    <p className="text-gray-600 mt-1 text-sm">
                      {selectedCourse.credits} credits • {selectedCourse.semester} • {selectedCourse.enrolledStudents}/{selectedCourse.maxStudents} enrolled
                    </p>
                  </div>

                  <div className="border-t border-gray-200">
                    <div className="grid grid-cols-2">
                      <button
                        className={`text-sm p-4 font-medium flex items-center justify-center ${
                          activeTab === "details"
                            ? "text-[#0F214D] border-b-2 border-[#0F214D]"
                            : "text-gray-600"
                        }`}
                        onClick={() => setActiveTab("details")}
                      >
                        <Book className="mr-2 h-4 w-4" /> Details
                      </button>
                      <button
                        className={`text-sm p-4 font-medium flex items-center justify-center ${
                          activeTab === "schedule"
                            ? "text-[#0F214D] border-b-2 border-[#0F214D]"
                            : "text-gray-600"
                        }`}
                        onClick={() => setActiveTab("schedule")}
                      >
                        <Calendar className="mr-2 h-4 w-4" /> Schedule
                      </button>
                    </div>

                    {activeTab === "details" && (
                      <div className="p-6 space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-600">Description</h3>
                          <p className="mt-1 text-sm text-[#020817]">{selectedCourse.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-600">Credits</h3>
                            <p className="mt-1 text-sm text-[#020817]">{selectedCourse.credits}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-600">Semester</h3>
                            <p className="mt-1 text-sm text-[#020817]">{selectedCourse.semester}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-600">Available Seats</h3>
                            <p className="mt-1 text-sm text-[#020817]">{selectedCourse.maxStudents - selectedCourse.enrolledStudents}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-600">Enrollment Status</h3>
                            <p className="mt-1 text-sm">
                              {selectedCourse.enrolledStudents >= selectedCourse.maxStudents ? (
                                <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Full</span>
                              ) : (
                                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Open</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "schedule" && (
                        <div className="space-y-3 p-4">
                          {getScheduleForCourse(selectedCourse.id).length > 0 ? (
                            getScheduleForCourse(selectedCourse.id).map((schedule) => (
                              <div key={schedule.id} className="border rounded-md p-4">
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                      <div className="bg-persian-blue/10 text-[#020817] p-2 rounded-md mr-4">
                                        <Clock className="h-5 w-5" />
                                      </div>
                                      <div>
                                        <p className="font-medium text-[#020817]">{schedule.day}</p>
                                        <p className="text-sm text-gray-600">
                                          {schedule.startTime} - {schedule.endTime}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="inline-block bg-[#0F214D] text-white text-xs px-2 py-1 rounded-full">
                                      {schedule.room}
                                    </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center p-4 text-muted-foreground">
                              No schedule found for this course
                            </div>
                          )}
                      </div>
                    )}
                  </div>

                  <div className="p-6 border-t border-gray-200">
                    <button
                      className="w-full bg-[#0F214D] text-white px-4 py-2 rounded-md flex items-center justify-center hover:bg-[#0D1A3D] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      onClick={() => handleEnroll(selectedCourse)}
                      disabled={enrolling || selectedCourse.enrolledStudents >= selectedCourse.maxStudents}
                    >
                      {enrolling ? (
                        "Enrolling..."
                      ) : selectedCourse.enrolledStudents >= selectedCourse.maxStudents ? (
                        "Course is Full"
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" /> Enroll in this Course
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-8 bg-white rounded-lg shadow-md">
                  <div className="text-center">
                    <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-600">No Course Selected</h3>
                    <p className="mt-2 text-sm text-gray-500">Select a course from the list to view details and enroll</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;