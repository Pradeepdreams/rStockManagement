import React from "react";

function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-80">
      <div className="flex flex-col items-center gap-4">
        <svg
          className="animate-spin h-10 w-10 text-[#134b90]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 00-8 8h4z"
          ></path>
        </svg>
        <p className="text-gray-600 text-sm font-medium">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
}

export default Loader;
