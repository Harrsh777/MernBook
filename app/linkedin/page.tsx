'use client';

import { useEffect } from 'react';

export default function LinkedInRedirect() {
  useEffect(() => {
    // Redirect to your LinkedIn profile
    if (typeof window !== 'undefined') {
      window.location.replace('https://www.linkedin.com/in/harrshh/');
    }

  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to LinkedIn...</p>
      </div>
    </div>
  );
}
