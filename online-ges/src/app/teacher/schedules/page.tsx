"use client";

import { useState } from "react";
import { Calendar, Clock, Edit, Trash, Plus, Search, ClipboardList, ChevronLeft, ChevronRight } from "lucide-react";
import NavBar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";

type Course = {
  id: string;
  name: string;
  code: string;
  teacherId: string;
};

type Schedule = {
  id: string;
  courseId: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
};

type ScheduleWithCourse = Schedule & { course: Course | undefined };

// Helper function to format week range (e.g., "May 5 - May 11, 2025")
const formatWeekRange = (startDate: Date): string => {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  const startMonth = startDate.toLocaleString("default", { month: "short" });
  const endMonth = endDate.toLocaleString("default", { month: "short" });
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();
  const year = startDate.getFullYear();
  return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
};

// Helper function to get the most recent Monday
const getMostRecentMonday = (date: Date): Date => {
  const result = new Date(date);
  const day = result.getDay(); // 0 (Sunday) to 6 (Saturday)
  const diff = day === 0 ? -6 : 1 - day; // Adjust to previous Monday
  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0); // Reset time
  return result;
};

const TeacherSchedulesPage = () => {
  const currentUser = { id: "teacher1", role: "teacher" }; // Mock user
  const [weekStart, setWeekStart] = useState(getMostRecentMonday(new Date("2025-05-10")));
  const [schedules, setSchedules] = useState<Schedule[]>([
    { id: "1", courseId: "1", day: "Monday", startTime: "10:00 AM", endTime: "11:30 AM", room: "Room 101" },
    { id: "2", courseId: "1", day: "Wednesday", startTime: "10:00 AM", endTime: "11:30 AM", room: "Room 101" },
    { id: "3", courseId: "2", day: "Tuesday", startTime: "2:00 PM", endTime: "3:30 PM", room: "Room 202" },
  ]);
  const [courses] = useState<Course[]>([
    { id: "1", name: "Composition", code: "ENG105", teacherId: "teacher1" },
    { id: "2", name: "Intro to Biology", code: "BIO110", teacherId: "teacher1" },
    { id: "3", name: "Data Structures", code: "CS201", teacherId: "teacher2" },
  ]);
  const [activeSchedule, setActiveSchedule] = useState<ScheduleWithCourse | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAddingSchedule, setIsAddingSchedule] = useState<boolean>(false);
  const [isEditingSchedule, setIsEditingSchedule] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    courseId: string;
    day: string;
    startTime: string;
    endTime: string;
    room: string;
  }>({
    courseId: "",
    day: "Monday",
    startTime: "",
    endTime: "",
    room: "",
  });
  const [activeTab, setActiveTab] = useState<string>("details");

  const getCoursesForTeacher = (teacherId: string) => {
    return courses.filter((course) => course.teacherId === teacherId);
  };

  const getCourseById = (courseId: string) => {
    return courses.find((course) => course.id === courseId);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddSchedule = () => {
    setIsAddingSchedule(true);
    setActiveSchedule(null);
    setIsEditingSchedule(false);
    setFormData({ courseId: "", day: "Monday", startTime: "", endTime: "", room: "" });
    setActiveTab("details");
  };

  const handleEditSchedule = (e: React.MouseEvent<HTMLButtonElement>, schedule: Schedule) => {
    e.stopPropagation();
    setIsEditingSchedule(true);
    setActiveSchedule({ ...schedule, course: getCourseById(schedule.courseId) });
    setFormData({
      courseId: schedule.courseId,
      day: schedule.day,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      room: schedule.room,
    });
    setActiveTab("details");
  };

  const handleFormSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!formData.courseId || !formData.startTime || !formData.endTime || !formData.room) {
      alert("Please fill in all required fields");
      return;
    }
    if (isEditingSchedule && activeSchedule) {
      setSchedules(
        schedules.map((schedule) =>
          schedule.id === activeSchedule.id ? { ...schedule, ...formData } : schedule
        )
      );
    } else {
      setSchedules([...schedules, { id: `${schedules.length + 1}`, ...formData }]);
    }
    setIsAddingSchedule(false);
    setIsEditingSchedule(false);
    setActiveSchedule(null);
    setFormData({ courseId: "", day: "Monday", startTime: "", endTime: "", room: "" });
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this schedule?")) {
      setSchedules(schedules.filter((schedule) => schedule.id !== id));
      if (activeSchedule?.id === id) {
        setActiveSchedule(null);
      }
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePreviousWeek = () => {
    const newWeekStart = new Date(weekStart);
    newWeekStart.setDate(weekStart.getDate() - 7);
    setWeekStart(newWeekStart);
  };

  const handleNextWeek = () => {
    const newWeekStart = new Date(weekStart);
    newWeekStart.setDate(weekStart.getDate() + 7);
    setWeekStart(newWeekStart);
  };

  const filteredSchedules = searchTerm
    ? schedules.filter((schedule) => {
        const course = getCourseById(schedule.courseId);
        return (
          course?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course?.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          schedule.room.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    : schedules;

  const teacherSchedules: ScheduleWithCourse[] = filteredSchedules
    .filter((schedule) => getCourseById(schedule.courseId)?.teacherId === currentUser.id)
    .map((schedule) => ({
      ...schedule,
      course: getCourseById(schedule.courseId),
    }));

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  if (!currentUser || currentUser.role !== "teacher") {
    return <div>Access Denied</div>;
  }

  return (
    <div className="min-h-screen flex font-sans bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <NavBar />
        <div className="space-y-4 p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F214D]">MANAGE CLASS SCHEDULES</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-white rounded-md p-1 shadow-md">
                <button
                  className="p-2 rounded-md hover:bg-gray-100 text-[#0F214D]"
                  onClick={handlePreviousWeek}
                  title="Previous Week"
                >
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <div className="flex items-center px-2">
                  <Calendar className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-[#0F214D]" />
                  <span className="text-sm sm:text-base font-medium text-[#0F214D]">
                    {formatWeekRange(weekStart)}
                  </span>
                </div>
                <button
                  className="p-2 rounded-md hover:bg-gray-100 text-[#0F214D]"
                  onClick={handleNextWeek}
                  title="Next Week"
                >
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
              <button
                onClick={handleAddSchedule}
                className="bg-[#0F214D] text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md flex items-center hover:bg-[#0D1A3D] transition-colors text-sm sm:text-base"
              >
                <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Add New Schedule
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="space-y-4 sm:space-y-6">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search schedules..."
                  className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F214D] bg-white text-sm sm:text-base"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>

              <div className="rounded-lg border bg-white text-card-foreground shadow-sm space-y-4 p-3 sm:p-4">
                <div className="flex flex-col space-y-1.5 p-0">
                  <h3 className="text-base sm:text-lg font-semibold leading-none tracking-tight text-[#0F214D]">
                    Your Schedules ({teacherSchedules.length})
                  </h3>
                </div>
                <div className="p-0">
                  {teacherSchedules.length > 0 ? (
                    <div className="space-y-2">
                      {teacherSchedules.map((schedule) => (
                        <div
                          key={schedule.id}
                          className={`border cursor-pointer p-3 sm:p-4 rounded-md transition-colors ${
                            activeSchedule === schedule
                              ? "border-[#2BA3EC] bg-[#E6F0FA]"
                              : "hover:border-[#2BA3EC]"
                          }`}
                          onClick={() => {
                            setActiveSchedule({ ...schedule, course: getCourseById(schedule.courseId) });
                            setIsAddingSchedule(false);
                            setIsEditingSchedule(false);
                            setActiveTab("details");
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-sm font-medium text-[#020817]">
                                {schedule.course?.name}
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-600">
                                {schedule.course?.code} | {schedule.day}
                              </p>
                              <span className="inline-block bg-[#2BA3EC] text-white text-xs px-2 py-1 rounded mt-2">
                                {schedule.startTime} - {schedule.endTime}
                              </span>
                            </div>
                            <div className="flex gap-1 sm:gap-2">
                              <button
                                className="text-[#020817] hover:text-gray-500"
                                title="Edit"
                                onClick={(e) => handleEditSchedule(e, schedule)}
                              >
                                <Edit className="w-2 h-2 sm:w-4 sm:h-4" />
                              </button>
                              <button
                                className="text-red-500 hover:text-red-700 w-8 h-8"
                                title="Delete schedule"
                                onClick={(e) => handleDelete(e, schedule.id)}
                              >
                                <Trash className="w-2 h-2 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-4 text-gray-500 text-sm sm:text-base">
                      No schedules found
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              {(activeSchedule || isAddingSchedule || isEditingSchedule) ? (
                <div className="bg-white rounded-lg shadow-md">
                  <div className="p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-[#0F214D]">
                      {isAddingSchedule
                        ? "Add New Schedule"
                        : isEditingSchedule
                        ? "Edit Schedule"
                        : "Schedule Details"}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {isAddingSchedule
                        ? "Create a new schedule for your teaching"
                        : isEditingSchedule
                        ? "Update the schedule information"
                        : "View and manage this schedule's details"}
                    </p>
                  </div>

                  {(isAddingSchedule || isEditingSchedule) ? (
                    <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-[#0F214D]">
                            Course
                          </label>
                          <select
                            name="courseId"
                            aria-label="Course"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F214D] bg-white text-sm sm:text-base"
                            value={formData.courseId}
                            onChange={handleFormChange}
                          >
                            <option value="">Select a course</option>
                            {getCoursesForTeacher(currentUser.id).map((course) => (
                              <option key={course.id} value={course.id}>
                                {course.name} ({course.code})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="day-select" className="text-sm font-medium text-[#0F214D]">
                            Day
                          </label>
                          <select
                            id="day-select"
                            name="day"
                            aria-label="Day"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F214D] bg-white text-sm sm:text-base"
                            value={formData.day}
                            onChange={handleFormChange}
                          >
                            {daysOfWeek.map((day) => (
                              <option key={day} value={day}>
                                {day}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-[#0F214D]">
                              Start Time
                            </label>
                            <input
                              name="startTime"
                              type="time"
                              placeholder="Select start time"
                              title="Select start time"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F214D] bg-white text-sm sm:text-base"
                              value={formData.startTime}
                              onChange={handleFormChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-[#0F214D]">
                              End Time
                            </label>
                            <input
                              name="endTime"
                              type="time"
                              placeholder="Select end time"
                              title="Select end time"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F214D] bg-white text-sm sm:text-base"
                              value={formData.endTime}
                              onChange={handleFormChange}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-[#0F214D]">
                            Room
                          </label>
                          <input
                            name="room"
                            type="text"
                            placeholder="e.g., Room 101"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F214D] bg-white text-sm sm:text-base"
                            value={formData.room}
                            onChange={handleFormChange}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <button
                          type="button"
                          className="border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          onClick={() => {
                            setIsAddingSchedule(false);
                            setIsEditingSchedule(false);
                            setActiveSchedule(null);
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="bg-[#0F214D] text-white px-4 py-2 rounded-md hover:bg-[#0D1A3D] transition-colors text-sm"
                          onClick={handleFormSubmit}
                        >
                          {isAddingSchedule ? "Add Schedule" : "Save Changes"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="px-4 sm:px-6">
                        <div className="border-b border-gray-200 mb-4">
                          <div className="grid w-full grid-cols-2">
                            <button
                              className={`inline-flex items-center justify-center whitespace-nowrap rounded-t-md px-3 py-2 text-sm font-medium transition-all border-b-2 ${
                                activeTab === "details"
                                  ? "border-[#0F214D] text-[#0F214D]"
                                  : "border-transparent text-gray-500 hover:text-gray-700"
                              }`}
                              onClick={() => setActiveTab("details")}
                            >
                              <Clock className="mr-2 h-4 w-4" />
                              Details
                            </button>
                            <button
                              className={`inline-flex items-center justify-center whitespace-nowrap rounded-t-md px-3 py-2 text-sm font-medium transition-all border-b-2 ${
                                activeTab === "notes"
                                  ? "border-[#0F214D] text-[#0F214D]"
                                  : "border-transparent text-gray-500 hover:text-gray-700"
                              }`}
                              onClick={() => setActiveTab("notes")}
                            >
                              <ClipboardList className="mr-2 h-4 w-4" />
                              Notes
                            </button>
                          </div>
                        </div>

                        {activeTab === "details" && (
                          <div className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h3 className="text-sm font-medium text-gray-600">
                                  Course
                                </h3>
                                <p className="mt-1 text-[#020817]">
                                  {activeSchedule?.course?.name} (
                                  {activeSchedule?.course?.code})
                                </p>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-gray-600">Day</h3>
                                <p className="mt-1 text-[#020817]">
                                  {activeSchedule?.day}
                                </p>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-gray-600">
                                  Time
                                </h3>
                                <p className="mt-1 text-[#020817]">
                                  {activeSchedule?.startTime} -{" "}
                                  {activeSchedule?.endTime}
                                </p>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-gray-600">
                                  Room
                                </h3>
                                <p className="mt-1 text-[#020817]">
                                  {activeSchedule?.room}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {activeTab === "notes" && (
                          <div className="space-y-4 pt-4">
                            <div className="text-center p-4 text-gray-500">
                              No notes available for this schedule
                            </div>
                            <button className="w-full bg-[#0F214D] border border-gray-300 rounded-md h-10 px-4 py-2 flex items-center justify-center text-sm font-medium text-white hover:bg-[#0D1A3D]">
                              <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />{" "}
                              Add Note
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between p-4 sm:p-6">
                        <button
                          className="border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          onClick={() => setActiveSchedule(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-6 sm:p-8 bg-white rounded-lg shadow-md">
                  <div className="text-center">
                    <ClipboardList className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                    <h3 className="mt-4 text-base sm:text-lg font-medium text-gray-600">
                      No Schedule Selected
                    </h3>
                    <p className="mt-2 text-sm sm:text-base text-gray-500">
                      Select a schedule from the list or add a new one
                    </p>
                    <button
                      onClick={handleAddSchedule}
                      className="mt-4 bg-[#0F214D] text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md flex items-center justify-center hover:bg-[#0D1A3D] transition-colors text-sm sm:text-base mx-auto"
                    >
                      <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Add New
                      Schedule
                    </button>
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

export default TeacherSchedulesPage;