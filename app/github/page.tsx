'use client';

import { useEffect } from 'react';

export default function GitHubRedirect() {
  useEffect(() => {
    // Redirect to your GitHub profile
    window.location.href = 'https://github.com/Harrsh777'; // Replace with your actual GitHub username
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to GitHub...</p>
      </div>
    </div>
  );
}
