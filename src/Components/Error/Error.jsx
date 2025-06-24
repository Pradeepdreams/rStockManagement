import React from 'react';
import { Link } from 'react-router-dom';

function Error() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-center">
      <h1 className="text-4xl font-extrabold text-red-600 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Page not found</h2>
      <p className="text-gray-600 mb-6 max-w-md">
        The page you're looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}

export default Error;
