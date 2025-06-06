// src/app/login/page.tsx
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { FaSchool, FaChalkboardTeacher } from 'react-icons/fa';
import { CiLogin } from 'react-icons/ci';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') || 'http://127.0.0.1:8000';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let endpoint = '';
      let payload = {};

      if (role === 'student') {
        if (!studentId || !password) {
          setError('Student ID and password are required');
          setLoading(false);
          return;
        }
        endpoint = `${apiUrl}/api/students/login/`;
        payload = { student_id: studentId, password };
      } else {
        if (!email || !password) {
          setError('Email and password are required');
          setLoading(false);
          return;
        }
        endpoint = `${apiUrl}/api/teachers/login/`;
        payload = { email, password };
      }

      console.log('Sending POST request to:', endpoint);
      console.log('Payload:', payload);

      const response = await axios.post(endpoint, payload);

      // Store JWT tokens
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirect based on role
      if (role === 'student') {
        router.push('/student');
      } else {
        router.push('/teacher');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Response:', error.response);
      console.error('Response data:', error.response?.data);
      let errorMessage = 'Login failed. Please try again.';
      if (error.response?.data && typeof error.response.data === 'object' && error.response.data.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.status === 401) {
        errorMessage = error.response?.data?.error || 'Invalid email or password.';
      } else if (error.request) {
        errorMessage = 'Network error: Unable to reach the server. Please check if the server is running.';
      } else {
        errorMessage = `Request error: ${error.message}`;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 font-sans px-4">
      <div className="flex flex-row items-center mb-8">
        <Image
          src="/images/logo.png"
          alt="SCSIT Logo"
          width={100}
          height={100}
          priority
          className="mr-4"
        />
        <h1 className="text-4xl font-bold text-[#0F214D]">SCSIT</h1>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-[#0F214D] mb-2">LOGIN</h2>
        <p className="text-center text-gray-600 mb-6">Sign in to access your college account</p>
        {error && <div className="text-red-600 text-center mb-4" role="alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {role === 'student' ? 'Student ID No.' : 'Email Address'}
            </label>
            <input
              type={role === 'student' ? 'text' : 'email'}
              value={role === 'student' ? studentId : email}
              onChange={(e) => (role === 'student' ? setStudentId(e.target.value) : setEmail(e.target.value))}
              placeholder={role === 'student' ? 'Enter your student ID' : 'Enter your email address'}
              className="w-full p-3 border rounded-md bg-[#F0F1FF] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F214D]"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-3 border rounded-md bg-[#F0F1FF] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F214D]"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">I am a:</label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex-1 flex items-center justify-center p-3 border rounded-md ${
                  role === 'student' ? 'border-[#0F214D] text-[#0F214D]' : 'border-gray-300 text-gray-600'
                }`}
              >
                <FaSchool className="mr-2" />
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={`flex-1 flex items-center justify-center p-3 border rounded-md ${
                  role === 'teacher' ? 'border-[#0F214D] text-[#0F214D]' : 'border-gray-300 text-gray-600'
                }`}
              >
                <FaChalkboardTeacher className="mr-2" />
                Teacher
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center bg-[#0B5FB0] text-white p-3 rounded-md hover:bg-[#2BA3EC]"
            disabled={loading}
          >
            <CiLogin className="mr-2" />
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        {role === 'student' && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/signup" className="text-[#0B5FB0] hover:underline font-medium">
                Sign up here
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;