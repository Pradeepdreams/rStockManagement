import React from "react";
import Select from "react-select";

function TopFilters({
  fields,
  filterData,
  handleChange,
  handleFilter,
  handleReset,
}) {
  return (
    <div className="mt-4">
      <div
        className={`grid grid-cols-1 sm:grid-${fields?.length} md:grid-cols-${fields?.length} lg:grid-cols-10 gap-4`}
      >
        {fields?.map((field) => (
          <div
            key={field.name}
            className="col-span-2 sm:col-span-2 lg:col-span-2"
          >
            {field.componentType === "input" ? (
              <input
                name={field?.name}
                type={field.type}
                placeholder={field.placeholder}
                value={filterData[field.name] || ""}
                onChange={handleChange}
                className="block w-full border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm rounded-md"
              />
            ) : field.componentType === "select" ? (
              <Select
                placeholder={field.placeholder}
                name={field?.name}
                options={field.options}
                value={
                  field.options?.find(
                    (option) => option.value === filterData[field.name]
                  ) || null
                }
                onChange={(selectedOption) =>
                  handleChange({
                    target: {
                      name: field.name,
                      value: selectedOption ? selectedOption.value : null, // Handle clearing
                    },
                  })
                }
                className="w-full mt-2"
                classNamePrefix="select"
              />
            ) : null}
          </div>
        ))}
        <div className="flex flex-col sm:flex-row lg:col-span-2 gap-2 col-span-2">
          <button
            type="button"
            onClick={handleFilter}
            className="inline-flex items-center justify-center text-sm px-3 py-1 border border-transparent rounded-md shadow-sm text-white bg-[#134b90] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Filter
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center text-sm px-3 py-2 border border-transparent rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default TopFilters;
