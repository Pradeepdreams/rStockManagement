import React from "react";

const Table = ({ headers = [], data = [], renderRow, striped = true }) => {
  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full text-sm text-gray-700 shadow-md rounded-lg divide-y divide-gray-300">
        <thead className="bg-[var(--hd-bg)] text-center italic">
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} className="px-6 py-4 text-left font-[var(--font-button)] font-medium text-[var(--table-header-text)]">
                {header}
              </th>
            ))}
          </tr>
        </thead>
       
        <tbody className="divide-y divide-gray-200 text-center">
          {data?.length > 0 ? (
            data.map((item, index) => (
              <tr
                key={index}
                className={`${
                  striped && index % 2 === 1 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-50 transition`}
              >
                {renderRow(item, index)}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={headers.length}
                className="px-6 py-4 text-center text-gray-500"
              >
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
