import React from "react";

const Pagination = ({ meta, onPageChange }) => {
  const {
    current_page = 1,
    total = 0,
    from = 0,
    to = 0,
    last_page = 1,
    links = [],
  } = meta || {};

  const start = from || 0;
  const end = to || 0;

  return (
    <div className="flex items-center justify-between mt-4 flex-wrap gap-4">
      {/* Info on the left */}
      <div className="text-sm text-gray-600">
        Showing <span className="font-medium text-[var(--hd-bg)]">{start}</span> to{" "}
        <span className="font-medium  text-[var(--hd-bg)">{end}</span> of{" "}
        <span className="font-medium  text-[var(--hd-bg)">{total}</span> results
      </div>

      {/* Pagination buttons */}
      <div className="flex items-center space-x-1">
        <button
          type="button"
          onClick={() => onPageChange(current_page - 1)}
          disabled={current_page === 1}
          className="px-3 py-1 text-sm bg-gray-100 font-semibold rounded-md text-[var(--hd-bg)]  hover:bg-gray-200 disabled:opacity-80 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {links
          .filter((link) => /^\d+$/.test(link.label))
          .map((link, index) => (
            <button
              type="button"
              key={index}
              onClick={() => onPageChange(Number(link.label))}
              className={`cursor-pointer px-3 py-1 rounded-md text-sm font-medium ${
                link.active
                  ? "bg-[var(--hd-bg)] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {link.label}
            </button>
          ))}

        <button
          type="button"
          onClick={() => onPageChange(current_page + 1)}
          disabled={current_page === last_page}
          className="px-3 py-1 text-sm bg-gray-100 font-semibold rounded-md text-[var(--hd-bg)] hover:bg-gray-200 disabled:opacity-80 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
