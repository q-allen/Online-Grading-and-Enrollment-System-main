'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, User, LogOut } from 'lucide-react';
import axios from 'axios';

export default function NavBar() {
  const [user, setUser] = useState<{
    role: string;
    username: string;
    avatar?: string;
    first_name?: string;
    last_name?: string;
  } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false); // Track avatar load failure
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') || 'http://127.0.0.1:8000';

  // Fetch user data from backend on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('user');

      if (!token || !storedUser) {
        handleLogout(); // Redirect to login if no token or user
        return;
      }

      try {
        // Fetch user profile from backend
        const response = await axios.get(`${apiUrl}/api/users/me/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        });

        const data = response.data;
        const avatarUrl = data.avatar
          ? `${data.avatar.startsWith('http') ? '' : apiUrl}${data.avatar}?t=${new Date().getTime()}`
          : null; // Null if no avatar

        setUser({
          role: data.role || 'student',
          username: data.username || '',
          avatar: avatarUrl ?? undefined,
          first_name: data.first_name || '',
          last_name: data.last_name || '',
        });

        // Update localStorage with latest data
        localStorage.setItem(
          'user',
          JSON.stringify({
            role: data.role,
            username: data.username,
            avatar: avatarUrl,
            first_name: data.first_name,
            last_name: data.last_name,
          })
        );
      } catch (error: any) {
        console.error('Error fetching user profile:', error);
        handleLogout(); // Logout on error (e.g., invalid token)
      }
    };

    fetchUserProfile();
  }, [router]);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = () => {
    setDropdownOpen(false);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  // Capitalize role for display
  const displayRole = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : 'Guest';

  // Get initials for fallback
  const getInitials = () => {
    const firstInitial = user?.first_name ? user.first_name[0] : '';
    const lastInitial = user?.last_name ? user.last_name[0] : '';
    return `${firstInitial}${lastInitial}`.toUpperCase() || 'NA';
  };

  // If no user, render minimal navbar or redirect
  if (!user) {
    return null; // Or a loading state
  }

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-md border-b border-gray-200">
      <div className="flex items-center space-x-3">
        {/* Add logo or home link if needed */}
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4">
        <Link href="/notifications" className="relative">
          <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-[#0F214D] cursor-pointer hover:text-[#2BA3EC] transition-colors" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
            3
          </span>
        </Link>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <span className="text-sm font-medium text-[#0F214D] bg-[#2BA3EC]/10 px-2 py-1 rounded-md">
            {displayRole}
          </span>

          <div className="relative">
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden cursor-pointer bg-gray-300 border border-[#2BA3EC]/30 hover:border-[#2BA3EC] transition-all flex items-center justify-center"
              onClick={toggleDropdown}
            >
              {user.avatar && !avatarError ? (
                <Image
                  src={user.avatar}
                  alt={`${displayRole} Avatar`}
                  width={48}
                  height={48}
                  unoptimized // Avoid _next/image issues
                  className="w-full h-full object-cover"
                  onError={() => {
                    console.error('Failed to load avatar:', user.avatar);
                    setAvatarError(true); // Fallback to initials on error
                  }}
                />
              ) : (
                <span className="text-white text-lg font-semibold bg-blue-500 w-full h-full flex items-center justify-center">
                  {getInitials()}
                </span>
              )}
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md z-50">
                <ul className="flex flex-col">
                  <li className="px-4 py-2 hover:bg-[#E6F0FA] cursor-pointer transition-colors">
                    <Link
                      href="/profile"
                      className="flex items-center space-x-2 text-[#0F214D]"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-[#E6F0FA] cursor-pointer transition-colors"
                    onClick={handleLogout}
                  >
                    <div className="flex items-center space-x-2 text-red-600">
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </div>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}