"use client";

import { useState, useEffect } from "react";
import { Trash, Plus, Search, ClipboardList, Edit, Book, CalendarDays, Clock } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import axios from "axios";

type TabType = "subjects" | "details" | "subject-details";

const ManageCoursesPage = () => {
  type Program = {
    id: number;
    name: string;
    code: string;
    department?: string;
    description?: string;
  };

  type Subject = {
    id: number;
    title: string;
    course_code: string;
    description?: string;
    credits?: number;
    program: Program;
  };

  type Schedule = {
    id: number;
    subject_id: number;
    day: string;
    start_time: string; // HH:MM AM/PM for display
    end_time: string; // HH:MM AM/PM for display
    room: string;
  };

  const [programs, setPrograms] = useState<Program[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeProgram, setActiveProgram] = useState<Program | null>(null);
  const [activeSubject, setActiveSubject] = useState<Subject | null>(null);
  const [isAddingProgram, setIsAddingProgram] = useState(false);
  const [isEditingProgram, setIsEditingProgram] = useState(false);
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [isEditingSubject, setIsEditingSubject] = useState(false);
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [activeSchedule, setActiveSchedule] = useState<Schedule | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("subjects");
  const [activeSubjectTab, setActiveSubjectTab] = useState<"details" | "schedule">("details");
  const [error, setError] = useState<string | null>(null);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') || 'http://127.0.0.1:8000';

  const [scheduleFormData, setScheduleFormData] = useState<{
    day: string;
    start_time: string;
    end_time: string;
    room: string;
  }>({
    day: "Monday",
    start_time: "",
    end_time: "",
    room: "",
  });

  const formatTime = (time: string): string => {
    try {
      const [hours, minutes] = time.split(":");
      const hourNum = parseInt(hours, 10);
      const period = hourNum >= 12 ? "PM" : "AM";
      const displayHour = hourNum % 12 || 12;
      return `${displayHour}:${minutes} ${period}`;
    } catch (e) {
      console.error("Error formatting time:", time, e);
      return time;
    }
  };

  const parseTime = (time: string): string => {
    try {
      const [timePart, period] = time.split(" ");
      let [hours, minutes] = timePart.split(":").map(Number);
      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;
    } catch (e) {
      console.error("Error parsing time:", time, e);
      return time;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Please log in to access this page.");
        console.error("No access token found");
        return;
      }

      try {
        console.log("Fetching programs and subjects...");
        const [programsRes, subjectsRes] = await Promise.all([
          axios.get(`${apiUrl}/api/programs/programs/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${apiUrl}/api/programs/subjects/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        console.log("Programs:", programsRes.data);
        console.log("Subjects:", subjectsRes.data);
        setPrograms(programsRes.data);
        setSubjects(subjectsRes.data);
        setError(null);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setError(error.response?.data?.detail || "Failed to load data. Please try again.");
      }
    };
    fetchData();
  }, [apiUrl]);

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!activeSubject) {
        setSchedules([]);
        console.log("No active subject, clearing schedules");
        return;
      }
      setIsLoadingSchedules(true);
      try {
        console.log(`Fetching schedules for subject ID: ${activeSubject.id}`);
        const token = localStorage.getItem("access_token");
        const response = await axios.get(`${apiUrl}/api/programs/schedules/?subject_id=${activeSubject.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Schedules response:", response.data);
        const formattedSchedules: Schedule[] = response.data.map((schedule: any) => ({
          id: schedule.id,
          subject_id: schedule.subject_id,
          day: schedule.day,
          start_time: formatTime(schedule.start_time),
          end_time: formatTime(schedule.end_time),
          room: schedule.room,
        }));
        setSchedules(formattedSchedules);
        setError(null);
      } catch (error: any) {
        console.error("Error fetching schedules:", error);
        setError(error.response?.data?.detail || "Failed to load schedules.");
      } finally {
        setIsLoadingSchedules(false);
      }
    };
    fetchSchedules();
  }, [activeSubject, apiUrl]);

  const handleAddProgram = () => {
    console.log("Adding new program");
    setIsAddingProgram(true);
    setActiveProgram(null);
    setIsEditingProgram(false);
    setIsAddingSubject(false);
    setIsEditingSubject(false);
    setIsAddingSchedule(false);
    setIsEditingSchedule(false);
    setActiveSubject(null);
    setActiveSchedule(null);
    setActiveTab("subjects");
    setActiveSubjectTab("details");
  };

  const handleEditProgram = (e: React.MouseEvent<HTMLButtonElement>, program: Program) => {
    e.stopPropagation();
    console.log("Editing program:", program);
    setIsEditingProgram(true);
    setActiveProgram(program);
    setIsAddingProgram(false);
    setIsAddingSubject(false);
    setIsEditingSubject(false);
    setIsAddingSchedule(false);
    setIsEditingSchedule(false);
    setActiveSubject(null);
    setActiveSchedule(null);
    setActiveTab("subjects");
    setActiveSubjectTab("details");
  };

  const handleAddSubject = () => {
    if (!activeProgram) {
      setError("Please select a program first.");
      console.error("No active program selected");
      return;
    }
    console.log("Adding new subject for program:", activeProgram);
    setIsAddingSubject(true);
    setActiveSubject(null);
    setIsEditingSubject(false);
    setIsAddingProgram(false);
    setIsEditingProgram(false);
    setIsAddingSchedule(false);
    setIsEditingSchedule(false);
    setActiveSchedule(null);
    setActiveTab("subjects");
    setActiveSubjectTab("details");
  };

  const handleEditSubject = (e: React.MouseEvent<HTMLButtonElement>, subject: Subject) => {
    e.stopPropagation();
    console.log("Editing subject:", subject);
    setIsEditingSubject(true);
    setActiveSubject(subject);
    setIsAddingSubject(false);
    setIsAddingProgram(false);
    setIsEditingProgram(false);
    setIsAddingSchedule(false);
    setIsEditingSchedule(false);
    setActiveSchedule(null);
    setActiveTab("subjects");
    setActiveSubjectTab("details");
  };

  const handleAddSchedule = () => {
    if (!activeSubject) {
      setError("Please select a subject first.");
      console.error("No active subject selected for schedule");
      return;
    }
    console.log("Adding new schedule for subject:", activeSubject);
    setIsAddingSchedule(true);
    setIsEditingSchedule(false);
    setActiveSchedule(null);
    setScheduleFormData({
      day: "Monday",
      start_time: "",
      end_time: "",
      room: "",
    });
    setIsAddingProgram(false);
    setIsEditingProgram(false);
    setIsAddingSubject(false);
    setIsEditingSubject(false);
  };

  const handleEditSchedule = (e: React.MouseEvent<HTMLButtonElement>, schedule: Schedule) => {
    e.stopPropagation();
    console.log("Editing schedule:", schedule);
    setIsEditingSchedule(true);
    setIsAddingSchedule(false);
    setActiveSchedule(schedule);
    setScheduleFormData({
      day: schedule.day,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      room: schedule.room,
    });
    setIsAddingProgram(false);
    setIsEditingProgram(false);
    setIsAddingSubject(false);
    setIsEditingSubject(false);
  };

  const handleScheduleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(`Updating schedule form: ${name} = ${value}`);
    setScheduleFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleScheduleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!activeSubject) {
      setError("No subject selected.");
      console.error("No active subject for schedule submit");
      return;
    }
    if (!scheduleFormData.day || !scheduleFormData.start_time || !scheduleFormData.end_time || !scheduleFormData.room) {
      setError("Please fill in all required fields.");
      console.error("Incomplete schedule form data:", scheduleFormData);
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Please log in to access this page.");
      console.error("No access token for schedule submit");
      return;
    }

    const payload = {
      subject_id: activeSubject.id,
      day: scheduleFormData.day,
      start_time: parseTime(scheduleFormData.start_time),
      end_time: parseTime(scheduleFormData.end_time),
      room: scheduleFormData.room,
    };
    console.log("Submitting schedule payload:", payload);

    try {
      let response: any;
      if (isEditingSchedule && activeSchedule) {
        response = await axios.put(
          `${apiUrl}/api/programs/schedules/${activeSchedule.id}/`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSchedules(
          schedules.map((s) =>
            s.id === activeSchedule.id
              ? {
                  id: response.data.id,
                  subject_id: response.data.subject_id,
                  day: response.data.day,
                  start_time: formatTime(response.data.start_time),
                  end_time: formatTime(response.data.end_time),
                  room: response.data.room,
                }
              : s
          )
        );
      } else {
        response = await axios.post(`${apiUrl}/api/programs/schedules/`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSchedules([
          ...schedules,
          {
            id: response.data.id,
            subject_id: response.data.subject_id,
            day: response.data.day,
            start_time: formatTime(response.data.start_time),
            end_time: formatTime(response.data.end_time),
            room: response.data.room,
          },
        ]);
      }
      console.log("Schedule saved:", response.data);
      setIsAddingSchedule(false);
      setIsEditingSchedule(false);
      setActiveSchedule(null);
      setScheduleFormData({ day: "Monday", start_time: "", end_time: "", room: "" });
      setError(null);
    } catch (error: any) {
      console.error("Error saving schedule:", error);
      setError(error.response?.data?.detail || "Failed to save schedule.");
    }
  };

  const handleDeleteSchedule = async (e: React.MouseEvent<HTMLButtonElement>, scheduleId: number) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this schedule?")) return;

    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Please log in to access this page.");
      console.error("No access token for schedule delete");
      return;
    }

    try {
      console.log(`Deleting schedule ID: ${scheduleId}`);
      await axios.delete(`${apiUrl}/api/programs/schedules/${scheduleId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchedules(schedules.filter((s) => s.id !== scheduleId));
      if (activeSchedule?.id === scheduleId) {
        setActiveSchedule(null);
      }
      setError(null);
    } catch (error: any) {
      console.error("Error deleting schedule:", error);
      setError(error.response?.data?.detail || "Failed to delete schedule.");
    }
  };

  const filteredPrograms = searchTerm
    ? programs.filter(
        (program) =>
          program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          program.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : programs;

  const getSubjectsForActiveProgram = () => {
    if (!activeProgram) return [];
    const filtered = subjects.filter((subject) => subject.program.id === activeProgram.id);
    console.log("Subjects for active program:", filtered);
    return filtered;
  };

  useEffect(() => {
    console.log("Active Program:", activeProgram);
    console.log("Active Subject:", activeSubject);
    console.log("Active Tab:", activeTab);
    console.log("Active Subject Tab:", activeSubjectTab);
    console.log("Schedules:", schedules);
    console.log("Is Adding Schedule:", isAddingSchedule);
    console.log("Is Editing Schedule:", isEditingSchedule);
  }, [activeProgram, activeSubject, activeTab, activeSubjectTab, schedules, isAddingSchedule, isEditingSchedule]);

  return (
    <div className="min-h-screen flex font-sans bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="space-y-4 p-4 sm:p-6 md:p-8">
          {error && <div className="text-red-500 p-4 bg-red-100 rounded-md">{error}</div>}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F214D]">MANAGE COURSES</h1>
            <button
              onClick={handleAddProgram}
              className="bg-[#0F214D] text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md flex items-center hover:bg-[#0D1A3D] transition-colors text-sm sm:text-base"
            >
              <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Add New Program
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="space-y-4 sm:space-y-6">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search programs..."
                  className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F214D] bg-white text-sm sm:text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="rounded-lg border bg-white text-card-foreground shadow-sm space-y-4 p-3 sm:p-4">
                <div className="flex flex-col space-y-1.5 p-0">
                  <h3 className="text-base sm:text-lg font-semibold leading-none tracking-tight text-[#0F214D]">
                    Your Programs ({filteredPrograms.length})
                  </h3>
                </div>
                <div className="p-0">
                  {filteredPrograms.length > 0 ? (
                    <div className="space-y-2">
                      {filteredPrograms.map((program) => (
                        <div
                          key={program.id}
                          className={`border cursor-pointer p-3 sm:p-4 rounded-md transition-colors ${
                            activeProgram?.id === program.id
                              ? "border-[#2BA3EC] bg-[#E6F0FA]"
                              : "hover:border-[#2BA3EC]"
                          }`}
                          onClick={() => {
                            console.log("Selecting program:", program);
                            setActiveProgram(program);
                            setIsAddingProgram(false);
                            setIsEditingProgram(false);
                            setIsAddingSubject(false);
                            setIsEditingSubject(false);
                            setIsAddingSchedule(false);
                            setIsEditingSchedule(false);
                            setActiveSubject(null);
                            setActiveSchedule(null);
                            setActiveTab("subjects");
                            setActiveSubjectTab("details");
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-sm font-medium text-[#020817]">{program.name}</h3>
                              <p className="text-xs sm:text-sm text-gray-600">{program.code}</p>
                              <span className="inline-block bg-[#2BA3EC] text-white text-xs px-2 py-1 rounded mt-2">
                                {subjects.filter((s) => s.program.id === program.id).length} subjects
                              </span>
                            </div>
                            <div className="flex gap-1 sm:gap-2">
                              <button
                                className="text-[#020817] hover:text-gray-500"
                                title="Edit"
                                onClick={(e) => handleEditProgram(e, program)}
                              >
                                <Edit className="w-2 h-2 sm:w-4 sm:h-4" />
                              </button>
                              <button
                                className="text-red-500 hover:text-red-700 w-8 h-8"
                                title="Delete program"
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  if (!confirm(`Delete ${program.name}?`)) return;
                                  try {
                                    const token = localStorage.getItem("access_token");
                                    await axios.delete(`${apiUrl}/api/programs/programs/${program.id}/`, {
                                      headers: { Authorization: `Bearer ${token}` },
                                    });
                                    setPrograms(programs.filter((p) => p.id !== program.id));
                                    if (activeProgram?.id === program.id) {
                                      setActiveProgram(null);
                                      setActiveSubject(null);
                                      setActiveSchedule(null);
                                    }
                                    setError(null);
                                  } catch (error: any) {
                                    console.error("Error deleting program:", error);
                                    setError(error.response?.data?.detail || "Failed to delete program.");
                                  }
                                }}
                              >
                                <Trash className="w-2 h-2 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-4 text-gray-500 text-sm sm:text-base">No programs found</div>
                  )}
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              {(activeProgram || isAddingProgram) ? (
                <div className="bg-white rounded-lg shadow-md">
                  <div className="p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-[#0F214D]">
                      {isAddingProgram ? "Add New Program" : isEditingProgram ? "Edit Program" : "Program Details"}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {isAddingProgram
                        ? "Create a new program"
                        : isEditingProgram
                        ? "Update the program information"
                        : "View and manage subjects for this program"}
                    </p>
                  </div>

                  {(isAddingProgram || isEditingProgram) ? (
                    <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                      <form
                        className="space-y-4"
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const formData = new FormData(e.target as HTMLFormElement);
                          const programData = {
                            code: formData.get("code"),
                            name: formData.get("name"),
                            department: formData.get("department") || "",
                            description: formData.get("description") || "",
                          };
                          try {
                            const token = localStorage.getItem("access_token");
                            let response: any;
                            if (isEditingProgram && activeProgram?.id) {
                              response = await axios.put(
                                `${apiUrl}/api/programs/programs/${activeProgram.id}/`,
                                programData,
                                { headers: { Authorization: `Bearer ${token}` } }
                              );
                              setPrograms(programs.map((p) => (p.id === activeProgram.id ? response.data : p)));
                            } else {
                              response = await axios.post(`${apiUrl}/api/programs/programs/`, programData, {
                                headers: { Authorization: `Bearer ${token}` },
                              });
                              setPrograms([...programs, response.data]);
                            }
                            setIsAddingProgram(false);
                            setIsEditingProgram(false);
                            setActiveProgram(response.data);
                            setError(null);
                          } catch (error: any) {
                            console.error("Error saving program:", error);
                            setError(error.response?.data?.detail || "Failed to save program.");
                          }
                        }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-[#0F214D]">Program Code</label>
                            <input
                              type="text"
                              name="code"
                              placeholder="e.g., IT"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F214D] bg-white text-sm sm:text-base"
                              defaultValue={activeProgram?.code}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-[#0F214D]">Program Name</label>
                            <input
                              type="text"
                              name="name"
                              placeholder="e.g., Information Technology"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F214D] bg-white text-sm sm:text-base"
                              defaultValue={activeProgram?.name}
                              required
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-[#0F214D]">Department</label>
                            <input
                              type="text"
                              name="department"
                              placeholder="e.g., College of Computing"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F214D] bg-white text-sm sm:text-base"
                              defaultValue={activeProgram?.department}
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-[#0F214D]">Description</label>
                            <input
                              type="text"
                              name="description"
                              placeholder="Program description"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F214D] bg-white text-sm sm:text-base"
                              defaultValue={activeProgram?.description}
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            className="border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            onClick={() => {
                              setIsAddingProgram(false);
                              setIsEditingProgram(false);
                              setActiveProgram(null);
                              setActiveSubject(null);
                              setActiveSchedule(null);
                              setActiveSubjectTab("details");
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-[#0F214D] text-white px-4 py-2 rounded-md hover:bg-[#0D1A3D] transition-colors text-sm"
                          >
                            {isAddingProgram ? "Add Program" : "Save Changes"}
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : isAddingSubject || isEditingSubject ? (
                    <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                      <form
                        className="space-y-4"
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const formData = new FormData(e.target as HTMLFormElement);
                          const subjectData = {
                            course_code: formData.get("course_code"),
                            title: formData.get("title"),
                            description: formData.get("description") || "",
                            credits: parseInt(formData.get("credits") as string),
                            program_id: activeProgram?.id,
                          };
                          try {
                            const token = localStorage.getItem("access_token");
                            let response: any;
                            if (isEditingSubject && activeSubject?.id) {
                              response = await axios.put(
                                `${apiUrl}/api/programs/subjects/${activeSubject.id}/`,
                                subjectData,
                                { headers: { Authorization: `Bearer ${token}` } }
                              );
                              setSubjects(subjects.map((s) => (s.id === activeSubject.id ? response.data : s)));
                            } else {
                              response = await axios.post(`${apiUrl}/api/programs/subjects/`, subjectData, {
                                headers: { Authorization: `Bearer ${token}` },
                              });
                              setSubjects([...subjects, response.data]);
                            }
                            setIsAddingSubject(false);
                            setIsEditingSubject(false);
                            setActiveSubject(response.data);
                            setActiveTab("subject-details");
                            setActiveSubjectTab("details");
                            setError(null);
                          } catch (error: any) {
                            console.error("Error saving subject:", error);
                            setError(error.response?.data?.detail || "Failed to save subject.");
                          }
                        }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-[#0F214D]">Subject Code</label>
                            <input
                              type="text"
                              name="course_code"
                              placeholder="e.g., CS101"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F214D] bg-white text-sm sm:text-base"
                              defaultValue={activeSubject?.course_code}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-[#0F214D]">Subject Title</label>
                            <input
                              type="text"
                              name="title"
                              placeholder="e.g., Introduction to Programming"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F214D] bg-white text-sm sm:text-base"
                              defaultValue={activeSubject?.title}
                              required
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-[#0F214D]">Description</label>
                            <input
                              type="text"
                              name="description"
                              placeholder="Subject description"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F214D] bg-white text-sm sm:text-base"
                              defaultValue={activeSubject?.description}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-[#0F214D]">Credits</label>
                            <input
                              type="number"
                              name="credits"
                              placeholder="3"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F214D] bg-white text-sm sm:text-base"
                              defaultValue={activeSubject?.credits}
                              required
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            className="border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            onClick={() => {
                              setIsAddingSubject(false);
                              setIsEditingSubject(false);
                              setActiveSubject(null);
                              setActiveTab("subjects");
                              setActiveSubjectTab("details");
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-[#0F214D] text-white px-4 py-2 rounded-md hover:bg-[#0D1A3D] transition-colors text-sm"
                          >
                            {isAddingSubject ? "Add Subject" : "Save Changes"}
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <>
                      <div className="px-4 sm:px-6">
                        <div className="flex justify-between items-center mb-4">
                          <div className="border-b border-gray-200">
                            <div className="grid w-full grid-cols-2">
                              <button
                                className={`inline-flex items-center justify-center whitespace-nowrap rounded-t-md px-3 py-2 text-sm font-medium transition-all border-b-2 ${
                                  activeTab === "subjects"
                                    ? "border-[#0F214D] text-[#0F214D]"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                                onClick={() => {
                                  console.log("Switching to subjects tab");
                                  setActiveTab("subjects");
                                  setActiveSubject(null);
                                  setActiveSchedule(null);
                                  setActiveSubjectTab("details");
                                }}
                              >
                                <Book className="mr-2 h-4 w-4" />
                                Subjects
                              </button>
                              <button
                                className={`inline-flex items-center justify-center whitespace-nowrap rounded-t-md px-3 py-2 text-sm font-medium transition-all border-b-2 ${
                                  activeTab === "details"
                                    ? "border-[#0F214D] text-[#0F214D]"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                                onClick={() => {
                                  console.log("Switching to details tab");
                                  setActiveTab("details");
                                  setActiveSubject(null);
                                  setActiveSchedule(null);
                                  setActiveSubjectTab("details");
                                }}
                              >
                                <ClipboardList className="mr-2 h-4 w-4" />
                                Details
                              </button>
                            </div>
                          </div>
                          {activeTab === "subjects" && (
                            <button
                              onClick={handleAddSubject}
                              className="bg-[#0F214D] text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md flex items-center hover:bg-[#0D1A3D] transition-colors text-sm sm:text-base"
                            >
                              <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Add Subject
                            </button>
                          )}
                        </div>

                        {activeTab === "subjects" && (
                          <div className="space-y-4 pt-4">
                            {getSubjectsForActiveProgram().length > 0 ? (
                              <div className="space-y-3">
                                {getSubjectsForActiveProgram().map((subject) => (
                                  <div
                                    key={subject.id}
                                    className={`border cursor-pointer p-3 sm:p-4 rounded-md transition-colors ${
                                      activeSubject?.id === subject.id
                                        ? "border-[#2BA3EC] bg-[#E6F0FA]"
                                        : "hover:border-[#2BA3EC]"
                                    }`}
                                    onClick={() => {
                                      console.log("Selecting subject:", subject);
                                      setActiveSubject(subject);
                                      setActiveTab("subject-details");
                                      setActiveSchedule(null);
                                      setActiveSubjectTab("details");
                                    }}
                                  >
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h3 className="text-sm font-medium text-[#020817]">{subject.title}</h3>
                                        <p className="text-xs sm:text-sm text-gray-600">{subject.course_code}</p>
                                        <span className="inline-block bg-[#2BA3EC] text-white text-xs px-2 py-1 rounded mt-2">
                                          {subject.credits} credits
                                        </span>
                                      </div>
                                      <div className="flex gap-1 sm:gap-2">
                                        <button
                                          className="text-[#020817] hover:text-gray-500"
                                          title="Edit"
                                          onClick={(e) => handleEditSubject(e, subject)}
                                        >
                                          <Edit className="w-2 h-2 sm:w-4 sm:h-4" />
                                        </button>
                                        <button
                                          className="text-red-500 hover:text-red-700 w-8 h-8"
                                          title="Delete subject"
                                          onClick={async (e) => {
                                            e.stopPropagation();
                                            if (!confirm(`Delete ${subject.title}?`)) return;
                                            try {
                                              const token = localStorage.getItem("access_token");
                                              await axios.delete(
                                                `${apiUrl}/api/programs/subjects/${subject.id}/`,
                                                { headers: { Authorization: `Bearer ${token}` } }
                                              );
                                              setSubjects(subjects.filter((s) => s.id !== subject.id));
                                              if (activeSubject?.id === subject.id) {
                                                setActiveSubject(null);
                                                setActiveSchedule(null);
                                              }
                                              setError(null);
                                            } catch (error: any) {
                                              console.error("Error deleting subject:", error);
                                              setError(error.response?.data?.detail || "Failed to delete subject.");
                                            }
                                          }}
                                        >
                                          <Trash className="w-2 h-2 sm:w-4 sm:h-4" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center p-4 text-gray-500">No subjects found for this program</div>
                            )}
                          </div>
                        )}

                        {activeTab === "details" && (
                          <div className="space-y-4 pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h3 className="text-sm font-medium text-gray-600">Program Code</h3>
                                <p className="mt-1 text-[#020817]">{activeProgram?.code}</p>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-gray-600">Program Name</h3>
                                <p className="mt-1 text-[#020817]">{activeProgram?.name}</p>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-gray-600">Department</h3>
                                <p className="mt-1 text-[#020817]">{activeProgram?.department || "N/A"}</p>
                              </div>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-600">Description</h3>
                              <p className="mt-1 text-[#020817]">
                                {activeProgram?.description || "No description available"}
                              </p>
                            </div>
                          </div>
                        )}

                        {activeTab === "subject-details" && activeSubject && (
                          <div className="space-y-4 pt-4">
                            <div className="border-b border-gray-200 mb-4">
                              <div className="grid w-full grid-cols-2">
                                <button
                                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-t-md px-3 py-2 text-sm font-medium transition-all border-b-2 ${
                                    activeSubjectTab === "details"
                                      ? "border-[#0F214D] text-[#0F214D]"
                                      : "border-transparent text-gray-500 hover:text-gray-700"
                                  }`}
                                  onClick={() => {
                                    console.log("Switching to subject-details tab");
                                    setActiveSubjectTab("details");
                                  }}
                                >
                                  <Book className="mr-2 h-4 w-4" />
                                  Details
                                </button>
                                <button
                                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-t-md px-3 py-2 text-sm font-medium transition-all border-b-2 ${
                                    activeSubjectTab === "schedule"
                                      ? "border-[#0F214D] text-[#0F214D]"
                                      : "border-transparent text-gray-500 hover:text-gray-700"
                                  }`}
                                  onClick={() => {
                                    console.log("Switching to schedule tab");
                                    setActiveSubjectTab("schedule");
                                  }}
                                >
                                  <CalendarDays className="mr-2 h-4 w-4" />
                                  Schedule
                                </button>
                              </div>
                            </div>

                            {activeSubjectTab === "details" && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-600">Subject Code</h3>
                                    <p className="mt-1 text-[#020817]">{activeSubject?.course_code}</p>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-600">Credits</h3>
                                    <p className="mt-1 text-[#020817]">{activeSubject?.credits}</p>
                                  </div>
                                </div>
                                <div>
                                  <h3 className="text-sm font-medium text-gray-600">Description</h3>
                                  <p className="mt-1 text-[#020817]">
                                    {activeSubject?.description || "No description available"}
                                  </p>
                                </div>
                              </div>
                            )}

                            {activeSubjectTab === "schedule" && (
                              <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-[#0F214D]">Schedules</h3>
                                {isLoadingSchedules ? (
                                  <div className="text-center p-4 text-gray-500">Loading schedules...</div>
                                ) : isAddingSchedule || isEditingSchedule ? (
                                  <form className="space-y-4" onSubmit={handleScheduleSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-[#0F214D]">Day</label>
                                        <select
                                          name="day"
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F214D] bg-white text-sm sm:text-base"
                                          value={scheduleFormData.day}
                                          onChange={handleScheduleFormChange}
                                          required
                                          aria-label="Day"
                                        >
                                          <option value="Monday">Monday</option>
                                          <option value="Tuesday">Tuesday</option>
                                          <option value="Wednesday">Wednesday</option>
                                          <option value="Thursday">Thursday</option>
                                          <option value="Friday">Friday</option>
                                        </select>
                                      </div>
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-[#0F214D]">Start Time</label>
                                        <input
                                          type="time"
                                          name="start_time"
                                          placeholder="Select start time"
                                          title="Start Time"
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F214D] bg-white text-sm sm:text-base"
                                          value={scheduleFormData.start_time}
                                          onChange={(e) =>
                                            setScheduleFormData((prev) => ({
                                              ...prev,
                                              start_time: e.target.value,
                                            }))
                                          }
                                          required
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-[#0F214D]">End Time</label>
                                        <input
                                          type="time"
                                          name="end_time"
                                          placeholder="Select end time"
                                          title="End Time"
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F214D] bg-white text-sm sm:text-base"
                                          value={scheduleFormData.end_time}
                                          onChange={(e) =>
                                            setScheduleFormData((prev) => ({
                                              ...prev,
                                              end_time: e.target.value,
                                            }))
                                          }
                                          required
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-[#0F214D]">Room</label>
                                        <input
                                          type="text"
                                          name="room"
                                          placeholder="e.g., Room 101"
                                          title="Room"
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F214D] bg-white text-sm sm:text-base"
                                          value={scheduleFormData.room}
                                          onChange={handleScheduleFormChange}
                                          required
                                        />
                                      </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                      <button
                                        type="button"
                                        className="border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        onClick={() => {
                                          console.log("Canceling schedule form");
                                          setIsAddingSchedule(false);
                                          setIsEditingSchedule(false);
                                          setActiveSchedule(null);
                                          setScheduleFormData({ day: "Monday", start_time: "", end_time: "", room: "" });
                                        }}
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        type="submit"
                                        className="bg-[#0F214D] text-white px-4 py-2 rounded-md hover:bg-[#0D1A3D] transition-colors text-sm"
                                      >
                                        {isAddingSchedule ? "Add Schedule" : "Save Changes"}
                                      </button>
                                    </div>
                                  </form>
                                ) : schedules.length > 0 ? (
                                  <div className="space-y-3">
                                    {schedules.map((schedule) => (
                                      <div
                                        key={schedule.id}
                                        className="border rounded-md p-4 flex justify-between items-center"
                                      >
                                        <div className="flex items-center">
                                          <div className="bg-[#0F214D]/10 text-[#0F214D] p-2 rounded-md mr-4">
                                            <Clock className="h-5 w-5" />
                                          </div>
                                          <div>
                                            <p className="font-medium text-[#020817]">{schedule.day}</p>
                                            <p className="text-sm text-gray-600">
                                              {schedule.start_time} - {schedule.end_time}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="inline-block bg-[#0F214D] text-white text-xs px-2 py-1 rounded-full">
                                            {schedule.room}
                                          </span>
                                          <button
                                            className="text-[#020817] hover:text-gray-500"
                                            title="Edit"
                                            onClick={(e) => handleEditSchedule(e, schedule)}
                                          >
                                            <Edit className="w-4 h-4" />
                                          </button>
                                          <button
                                            className="text-red-500 hover:text-red-700"
                                            title="Delete schedule"
                                            onClick={(e) => handleDeleteSchedule(e, schedule.id)}
                                          >
                                            <Trash className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-center p-4 text-gray-500">
                                    No schedule found for this subject
                                  </div>
                                )}
                                {!isAddingSchedule && !isEditingSchedule && (
                                  <button
                                    onClick={handleAddSchedule}
                                    className="w-full bg-[#0F214D] border border-gray-300 rounded-md h-10 px-4 py-2 flex items-center justify-center text-sm font-medium text-white hover:bg-[#0D1A3D]"
                                  >
                                    <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Add Class Schedule
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between p-4 sm:p-6">
                        <button
                          className="border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          onClick={() => {
                            console.log("Canceling program selection");
                            setActiveProgram(null);
                            setActiveSubject(null);
                            setActiveSchedule(null);
                            setActiveTab("subjects");
                            setActiveSubjectTab("details");
                          }}
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
                    <h3 className="mt-4 text-base sm:text-lg font-medium text-gray-600">No Program Selected</h3>
                    <p className="mt-2 text-sm sm:text-base text-gray-500">
                      Select a program from the list or add a new one
                    </p>
                    <button
                      onClick={handleAddProgram}
                      className="mt-4 bg-[#0F214D] text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md flex items-center justify-center hover:bg-[#0D1A3D] transition-colors text-sm sm:text-base mx-auto"
                    >
                      <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Add New Program
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

export default ManageCoursesPage;