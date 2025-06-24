import React from "react";

function SaveButton({ saveFunction }) {
  return (
    <div>
      <button
        onClick={saveFunction}
        className="inline-flex items-center rounded-md bg-[var(--savebutton-bgcolor)] px-4 py-2 text-sm font-medium text-white hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
      >
        Save
      </button>
    </div>
  );
}

export default SaveButton;
