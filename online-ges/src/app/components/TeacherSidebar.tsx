"use client";

import { useState } from "react";
import {BookOpen, Clock, ListChecks, ChevronLeft, ChevronRight, LayoutDashboard, Users, } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const teacherLinks = [
    { path: "/teacher", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: "/teacher/students", label: "Manage Students", icon: <Users className="h-5 w-5" /> },
    { path: "/teacher/courses", label: "Manage Courses", icon: <BookOpen className="h-5 w-5" /> },
    { path: "/teacher/schedules", label: "Class Schedules", icon: <Clock className="h-5 w-5" /> },
    { path: "/teacher/grades", label: "Manage Grades", icon: <ListChecks className="h-5 w-5" /> },
  ];

  const isActive = (path: string) =>
    pathname === path || (path !== "/teacher" && pathname.startsWith(path));

  return (
    <aside
      className={`bg-[#0F214D] text-white flex flex-col transition-all duration-300 z-10 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#2BA3EC]/50">
        <div className="flex items-center space-x-2 overflow-hidden">
          <Image src="/images/logo.png" alt="SCSIT Logo" width={40} height={40} />
          {isOpen && <span className="text-3xl font-semibold">SCSIT</span>}
        </div>
        <button
          onClick={toggleSidebar}
          className="text-white hover:bg-[#2BA3EC]/50 p-1 rounded"
          title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 pt-4">
        <div className="px-3 mb-4">
          {isOpen && (
            <p className="text-xs uppercase font-semibold opacity-70 px-3 mb-2">Teaching</p>
          )}

          <ul className="space-y-1">
            {teacherLinks.map((link, index) => (
              <li key={index}>
                <Link
                  href={link.path}
                  className={`flex items-center gap-3 py-2 px-3 rounded-md transition-colors ${
                    isActive(link.path)
                      ? "bg-[#2BA3EC]/70 text-white"
                      : "text-gray-200 hover:bg-[#2BA3EC]/50"
                  } ${!isOpen && "justify-center"}`}
                >
                  {link.icon}
                  {isOpen && <span>{link.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#2BA3EC]/50">
        <div className={`flex items-center ${!isOpen ? "justify-center" : "gap-3"}`}>
          <Image src="/images/logo.png" alt="Version Logo" width={24} height={24} />
          {isOpen && <span className="text-sm">v1.0.0</span>}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
