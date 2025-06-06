"use client";

import { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { MdAppRegistration } from 'react-icons/md';
import { useRouter } from 'next/navigation';

interface FormData {
  first_name: string;
  middle_name: string;
  last_name: string;
  student_id: string;
  username: string;
  address: string;
  gender: string;
  email: string;
  contact_number: string;
  password: string;
  confirm_password: string;
}

const SignupPage = () => {
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    middle_name: '',
    last_name: '',
    student_id: '',
    username: '',
    address: '',
    gender: '',
    email: '',
    contact_number: '',
    password: '',
    confirm_password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') || 'http://127.0.0.1:8000';

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      console.log('Sending POST request to:', `${apiUrl}/api/students/register/`);
      console.log('Payload:', {
        first_name: formData.first_name,
        middle_name: formData.middle_name,
        last_name: formData.last_name,
        student_id: formData.student_id,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        gender: formData.gender,
        address: formData.address,
        contact_number: formData.contact_number,
      });
      const response = await axios.post(`${apiUrl}/api/students/register/`, {
        first_name: formData.first_name,
        middle_name: formData.middle_name,
        last_name: formData.last_name,
        student_id: formData.student_id,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        gender: formData.gender,
        address: formData.address,
        contact_number: formData.contact_number,
      });
      alert(`Signup successful! Welcome, ${response.data.username || 'User'}!`);
      router.push('/login');
    } catch (error: any) {
      console.error('Signup error:', error);
      console.error('Response data:', error.response?.data);
      let errorMessage = 'Signup failed. Please try again.';
      if (error.response) {
        errorMessage = error.response.data?.detail || JSON.stringify(error.response.data) || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'Network error: Unable to reach the server at ' + `${apiUrl}/api/students/register/` + '. Please check if the server is running.';
      } else {
        errorMessage = `Request error: ${error.message}`;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="flex flex-row items-center mb-8">
        <div className="mr-4">
          <Image src="/images/logo.png" alt="Logo" width={80} height={80} priority />
        </div>
        <h1 className="text-4xl font-bold text-[#0F214D]">SCSIT</h1>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-[#0F214D] mb-4">
          Create Your Account
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Please fill in the details below to register as a student.
        </p>

        {error && <div className="text-red-600 text-center mb-4" role="alert">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 mb-4">
            {[
              { label: 'First Name', name: 'first_name', required: true },
              { label: 'Middle Name (Optional)', name: 'middle_name' },
              { label: 'Last Name', name: 'last_name', required: true },
              { label: 'Student ID', name: 'student_id' },
              { label: 'Username', name: 'username', required: true },
              { label: 'Address', name: 'address' },
              { label: 'Email', name: 'email', type: 'email', required: true },
              { label: 'Contact Number', name: 'contact_number' },
            ].map(({ label, name, type = 'text', required }) => (
              <div key={name}>
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                  {label}
                </label>
                <input
                  id={name}
                  name={name}
                  type={type}
                  placeholder={label}
                  value={formData[name as keyof FormData]}
                  onChange={handleChange}
                  required={required}
                  className="p-3 border rounded-md bg-[#F0F1FF] text-gray-700 w-full"
                />
              </div>
            ))}

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                aria-label="Gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="p-3 border rounded-md bg-[#F0F1FF] text-gray-700 w-full"
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="p-3 border rounded-md bg-[#F0F1FF] text-gray-700 w-full"
              />
            </div>
            <div>
              <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirm_password"
                name="confirm_password"
                type="password"
                placeholder="Confirm Password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
                className="p-3 border rounded-md bg-[#F0F1FF] text-gray-700 w-full"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center bg-[#0B5FB0] text-white p-3 rounded-md hover:bg-[#2BA3EC] transition-all duration-300"
            disabled={loading}
          >
            <MdAppRegistration className="mr-2" />
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[#0B5FB0] hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;