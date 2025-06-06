"use client";

import { useState } from "react";
import { Bell, Check, Trash2, Filter } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

interface Notification {
  id: string;
  message: string;
  category: "Academic" | "Billing" | "System";
  timestamp: string;
  isRead: boolean;
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      message: "Your grade for Math 101 has been updated to A.",
      category: "Academic",
      timestamp: "2025-05-28 15:30 PST",
      isRead: false,
    },
    {
      id: "2",
      message: "Your tuition payment of ₱10,000 is due on 2025-06-01.",
      category: "Billing",
      timestamp: "2025-05-27 09:15 PST",
      isRead: false,
    },
    {
      id: "3",
      message: "System maintenance scheduled for 2025-05-29 at 02:00 AM.",
      category: "System",
      timestamp: "2025-05-26 14:00 PST",
      isRead: true,
    },
    {
      id: "4",
      message: "New course schedule for Science 102 is available.",
      category: "Academic",
      timestamp: "2025-05-25 11:45 PST",
      isRead: false,
    },
  ]);

  const [filter, setFilter] = useState<"All" | "Academic" | "Billing" | "System">("All");

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  const filteredNotifications =
    filter === "All"
      ? notifications
      : notifications.filter((notification) => notification.category === filter);

  return (
    <div className="min-h-screen flex font-sans bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="space-y-6 p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F214D] uppercase">
              Notifications
            </h1>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={markAllAsRead}
                className="inline-flex items-center gap-2 bg-[#0F214D] text-white px-4 py-2 rounded-md hover:bg-[#1d7ec9] transition-colors text-sm"
              >
                <Check className="w-4 h-4" /> Mark All as Read
              </button>
              <div className="relative">
                <Filter className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <select
                  aria-label="Filter notifications by category"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as typeof filter)}
                  className="pl-8 pr-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F214D] bg-white text-sm sm:text-base appearance-none cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="Academic">Academic</option>
                  <option value="Billing">Billing</option>
                  <option value="System">System</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Bell className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg">No notifications to display.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-center justify-between p-4 border rounded-md transition-colors ${
                      notification.isRead ? "bg-gray-50" : "bg-[#E6F0FA]"
                    } hover:bg-gray-100`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          notification.isRead ? "bg-gray-300" : "bg-[#2BA3EC]"
                        }`}
                      />
                      <div>
                        <p className="text-[#0F214D] font-medium">{notification.message}</p>
                        <p className="text-sm text-gray-600">
                          <span
                            className={`font-medium ${
                              notification.category === "Academic"
                                ? "text-green-600"
                                : notification.category === "Billing"
                                ? "text-red-600"
                                : "text-blue-600"
                            }`}
                          >
                            {notification.category}
                          </span>{" "}
                          | {notification.timestamp}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-[#2BA3EC] hover:underline text-sm flex items-center gap-1"
                        >
                          <Check className="w-4 h-4" /> Mark as Read
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-red-600 hover:underline text-sm flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}