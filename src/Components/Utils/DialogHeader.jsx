import React from "react";

function DialogHeader({
  heading,
  isEditing,
  setIsEditing,
  closeFunction,
  editIcon,
  closeIcon,
  headingIcon,
}) {
  return (
    <div>
      <div className="bg-white text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {headingIcon}
          <h2 className="text-xl font-semibold text-black sm:text-3xl">
            {heading}
          </h2>
        </div>

        <div className="flex gap-2">
          {isEditing && (
            <div
              onClick={() => setIsEditing(false)}
              className="bg-blue-100 text-blue-600 p-2 rounded-md cursor-pointer hover:bg-blue-200"
            >
              {editIcon}
            </div>
          )}
          <div
            onClick={closeFunction}
            className="text-black  p-2 rounded-full cursor-pointer hover:bg-red-200"
          >
            {closeIcon}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DialogHeader;
