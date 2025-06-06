"use client";

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter(); // Initialize router

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false); // Hide splash screen after 3 seconds
      router.push('/login'); // Navigate to login page
    }, 3000);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [router]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="animate-pulse">
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={200}
          height={200}
          priority
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default SplashScreen;