'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Pencil, Save, X, Camera, User, Mail, Phone, MapPin, UserCircle, Loader2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [profile, setProfile] = useState<{
    first_name: string;
    middle_name: string;
    last_name: string;
    studentId: string;
    email: string;
    contact: string;
    address: string;
    avatar: string | File;
    gender: string;
    username: string;
    role: string;
  }>({
    first_name: '',
    middle_name: '',
    last_name: '',
    studentId: '',
    email: '',
    contact: '',
    address: '',
    avatar: '/images/avatar.png', // Ensure this exists in public/images/
    gender: '',
    username: '',
    role: 'student',
  });
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') || 'http://127.0.0.1:8000';

  // Compute fullName for display
  const fullName = [profile.first_name, profile.middle_name, profile.last_name].filter(Boolean).join(' ').trim();

  // Get initials for avatar
  const getInitials = () => {
    const firstInitial = profile.first_name ? profile.first_name[0] : '';
    const lastInitial = profile.last_name ? profile.last_name[0] : '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  // Auto-dismiss messages
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/login');
        return;
      }
      try {
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
          : '/images/avatar.png';
        console.log('Fetched avatar URL:', avatarUrl); // Debug
        setProfile({
          first_name: data.first_name || '',
          middle_name: data.middle_name || '',
          last_name: data.last_name || '',
          studentId: data.student_id || '',
          email: data.email || '',
          contact: data.contact_number || '',
          address: data.address || '',
          avatar: avatarUrl,
          gender: data.gender || '',
          username: data.username || '',
          role: data.role || 'student',
        });
        setAvatarPreview(avatarUrl);
        setShowAddress(!!data.address);
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile. Please try again later.');
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          router.push('/login');
        }
      }
    };
    fetchProfile();
  }, [router, apiUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Avatar file size must be under 2MB.');
        return;
      }
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setError('Only JPEG, PNG, or GIF images are allowed.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        setProfile({ ...profile, avatar: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      if (!profile.first_name.trim() || !profile.last_name.trim()) {
        setError('First name and last name are required.');
        return;
      }
      if (profile.role === 'student' && !profile.studentId.trim()) {
        setError('Student ID is required for students.');
        return;
      }

      setIsSaving(true);
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Session expired. Please log in again.');
        router.push('/login');
        setIsSaving(false);
        return;
      }

      const formData = new FormData();
      formData.append('first_name', profile.first_name);
      formData.append('middle_name', profile.middle_name || '');
      formData.append('last_name', profile.last_name);
      formData.append('username', profile.username);
      formData.append('gender', profile.gender || '');
      formData.append('contact_number', profile.contact || '');
      formData.append('address', profile.address || '');
      if (profile.avatar instanceof File) {
        formData.append('avatar', profile.avatar);
      }
      if (profile.role === 'student' && profile.studentId) {
        formData.append('student_id', profile.studentId);
      }

      try {
        const response = await axios.put(`${apiUrl}/api/users/me/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          timeout: 10000,
        });
        console.log('Profile updated:', response.data);
        const newAvatarUrl = response.data.avatar
          ? `${response.data.avatar.startsWith('http') ? '' : apiUrl}${response.data.avatar}?t=${new Date().getTime()}`
          : '/images/avatar.png';
        console.log('New avatar URL:', newAvatarUrl); // Debug
        setProfile((prev) => ({
          ...prev,
          first_name: response.data.first_name || prev.first_name,
          middle_name: response.data.middle_name || prev.middle_name,
          last_name: response.data.last_name || prev.last_name,
          studentId: response.data.student_id || prev.studentId,
          email: response.data.email || prev.email,
          contact: response.data.contact_number || prev.contact,
          address: response.data.address || prev.address,
          avatar: newAvatarUrl,
          gender: response.data.gender || prev.gender,
          username: response.data.username || prev.username,
          role: response.data.role || prev.role,
        }));
        setAvatarPreview(newAvatarUrl);
        setSuccess('Profile saved successfully!');
        setIsEditing(false);
        setError('');
      } catch (error: any) {
        console.error('Error saving profile:', error);
        let errorMessage = 'Failed to save profile. Please try again.';
        if (error.response?.data) {
          if (error.response.data.error) {
            errorMessage = error.response.data.error;
          } else if (error.response.data.student_id) {
            errorMessage = error.response.data.student_id[0];
          } else if (error.response.data.username) {
            errorMessage = 'Username is already taken.';
          } else if (error.response.data.avatar) {
            errorMessage = error.response.data.avatar[0] || 'Failed to upload avatar.';
          } else if (error.response.data.non_field_errors) {
            errorMessage = error.response.data.non_field_errors[0];
          } else {
            errorMessage = 'Invalid data provided.';
          }
        } else if (error.code === 'ERR_NETWORK') {
          errorMessage = 'Network error: Unable to reach the server.';
        }
        setError(errorMessage);
      } finally {
        setIsSaving(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setAvatarPreview(typeof profile.avatar === 'string' ? profile.avatar : '/images/avatar.png');
    setSuccess('');
    setError('');
    const fetchProfile = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
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
            : '/images/avatar.png';
          console.log('Fetched avatar URL on cancel:', avatarUrl); // Debug
          setProfile({
            first_name: data.first_name || '',
            middle_name: data.middle_name || '',
            last_name: data.last_name || '',
            studentId: data.student_id || '',
            email: data.email || '',
            contact: data.contact_number || '',
            address: data.address || '',
            avatar: avatarUrl,
            gender: data.gender || '',
            username: data.username || '',
            role: data.role || 'student',
          });
          setAvatarPreview(avatarUrl);
          setShowAddress(!!data.address);
        } catch (error: any) {
          console.error('Error refetching profile:', error);
          setError('Failed to reload profile.');
        }
      }
    };
    fetchProfile();
  };

  return (
    <div className="min-h-screen flex font-sans bg-gradient-to-br from-gray-50 to-gray-200">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-2xl sm:text-3xl font-bold text-gray-800"
          >
            Profile
          </motion.h1>
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg flex items-center justify-between"
              >
                <span>{error}</span>
                <button
                  onClick={() => setError('')}
                  className="text-red-700 hover:text-red-900"
                  aria-label="Close error"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg flex items-center justify-between"
              >
                <span>{success}</span>
                <button
                  onClick={() => setSuccess('')}
                  className="text-green-700 hover:text-green-900"
                  aria-label="Close success"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
            </div>

            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Avatar */}
                <div className="flex flex-col items-center space-y-4 w-full sm:w-48">
                  <div className="relative w-32 h-32">
                    {typeof avatarPreview === 'string' && avatarPreview.includes('/images/avatar.png') ? (
                      <div className="w-full h-full rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-semibold">
                        {getInitials() || 'NA'}
                      </div>
                    ) : (
                      <Image
                        src={avatarPreview as string}
                        alt="Profile Avatar"
                        width={128}
                        height={128}
                        unoptimized // Disable Next.js optimization
                        className="rounded-full border-2 border-gray-300 object-cover"
                        priority
                        onError={(e) => {
                          console.error('Failed to load avatar:', avatarPreview, e);
                          setError('Failed to load avatar image.');
                          setAvatarPreview('/images/avatar.png');
                        }}
                      />
                    )}
                    {isEditing && (
                      <label
                        htmlFor="avatar-upload"
                        className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition"
                      >
                        <Camera className="w-4 h-4" />
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                          aria-label="Upload avatar"
                        />
                      </label>
                    )}
                  </div>
                  <p className="text-base font-medium text-gray-700">{fullName || 'N/A'}</p>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {profile.role === 'student' && (
                      <div className="relative">
                        <label htmlFor="studentId" className="block text-xs font-medium text-gray-700 mb-1">
                          Student ID
                        </label>
                        <div className="relative">
                          <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            id="studentId"
                            type="text"
                            name="studentId"
                            value={profile.studentId}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="Enter Student ID"
                            className={clsx(
                              'w-full pl-10 pr-3 py-2 border rounded-md text-sm text-gray-900',
                              isEditing && !profile.studentId ? 'border-red-300' : 'border-gray-300',
                              isEditing ? 'bg-white' : 'bg-gray-100'
                            )}
                          />
                        </div>
                      </div>
                    )}
                    <div className="relative">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {isEditing ? 'Name' : 'Full Name'}
                      </label>
                      <AnimatePresence mode="wait">
                        {isEditing ? (
                          <motion.div
                            key="edit-name"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-col sm:flex-row gap-4"
                          >
                            <div className="relative flex-1">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                id="first_name"
                                type="text"
                                name="first_name"
                                value={profile.first_name}
                                onChange={handleChange}
                                placeholder="First Name"
                                className={clsx(
                                  'w-full pl-10 pr-3 py-2 border rounded-md text-sm text-gray-900 bg-white',
                                  !profile.first_name ? 'border-red-300' : 'border-gray-300'
                                )}
                              />
                            </div>
                            <div className="relative flex-1">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                id="middle_name"
                                type="text"
                                name="middle_name"
                                value={profile.middle_name}
                                onChange={handleChange}
                                placeholder="Middle Name"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white"
                              />
                            </div>
                            <div className="relative flex-1">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                id="last_name"
                                type="text"
                                name="last_name"
                                value={profile.last_name}
                                onChange={handleChange}
                                placeholder="Last Name"
                                className={clsx(
                                  'w-full pl-10 pr-3 py-2 border rounded-md text-sm text-gray-900 bg-white',
                                  !profile.last_name ? 'border-red-300' : 'border-gray-300'
                                )}
                              />
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="display-name"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="relative"
                          >
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              id="full_name"
                              type="text"
                              value={fullName}
                              disabled
                              placeholder="Full Name"
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-900 text-sm"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="relative">
                      <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          id="email"
                          type="email"
                          name="email"
                          value={profile.email}
                          disabled
                          placeholder="Enter Email"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-900 text-sm"
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <label htmlFor="contact" className="block text-xs font-medium text-gray-700 mb-1">
                        Contact Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          id="contact"
                          type="text"
                          name="contact"
                          value={profile.contact}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder="Enter Contact Number"
                          className={clsx(
                            'w-full pl-10 pr-3 py-2 border rounded-md text-sm text-gray-900',
                            isEditing ? 'border-gray-300 bg-white' : 'border-gray-300 bg-gray-100'
                          )}
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <label htmlFor="username" className="block text-xs font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          id="username"
                          type="text"
                          name="username"
                          value={profile.username}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder="Enter Username"
                          className={clsx(
                            'w-full pl-10 pr-3 py-2 border rounded-md text-sm text-gray-900',
                            isEditing ? 'border-gray-300 bg-white' : 'border-gray-300 bg-gray-100'
                          )}
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <label htmlFor="gender" className="block text-xs font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                          id="gender"
                          name="gender"
                          value={profile.gender}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className={clsx(
                            'w-full pl-10 pr-3 py-2 border rounded-md text-sm text-gray-900 appearance-none',
                            isEditing ? 'border-gray-300 bg-white' : 'border-gray-300 bg-gray-100'
                          )}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        <svg
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Additional Details (collapsible) */}
                  <div className="mt-6">
                    <button
                      type="button"
                      className="text-blue-600 text-sm font-medium hover:underline"
                      onClick={() => {
                        setShowAddress(!showAddress);
                        if (!showAddress && !profile.address) {
                          setProfile({ ...profile, address: '123 Example St' });
                        }
                      }}
                    >
                      {showAddress ? 'Hide Additional Details' : 'Show Additional Details'}
                    </button>
                    <AnimatePresence>
                      {showAddress && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4"
                        >
                          <div className="relative">
                            <label htmlFor="address" className="block text-xs font-medium text-gray-700 mb-1">
                              Address
                            </label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                id="address"
                                type="text"
                                name="address"
                                value={profile.address}
                                onChange={handleChange}
                                disabled={!isEditing}
                                placeholder="Enter Address"
                                className={clsx(
                                  'w-full pl-10 pr-3 py-2 border rounded-md text-sm text-gray-900',
                                  isEditing ? 'border-gray-300 bg-white' : 'border-gray-300 bg-gray-100'
                                )}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 mt-6">
                    <AnimatePresence>
                      {isEditing && (
                        <motion.button
                          type="button"
                          onClick={handleCancel}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium transition"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </motion.button>
                      )}
                    </AnimatePresence>
                    <motion.button
                      type="button"
                      onClick={handleEditToggle}
                      disabled={isSaving}
                      whileHover={{ scale: isSaving ? 1 : 1.05 }}
                      whileTap={{ scale: isSaving ? 1 : 0.95 }}
                      className={clsx(
                        'flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md transition',
                        isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                      )}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : isEditing ? (
                        <>
                          <Save className="w-4 h-4" />
                          Save
                        </>
                      ) : (
                        <>
                          <Pencil className="w-4 h-4" />
                          Edit
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}