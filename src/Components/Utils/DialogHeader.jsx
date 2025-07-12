import React from "react";
import { Tooltip } from "react-tooltip";

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
            <>
            <div
            id="edit"
              onClick={() => setIsEditing(false)}
              className="bg-blue-100 text-blue-600 p-2 rounded-md cursor-pointer hover:bg-blue-200"
            >
              {editIcon}
            </div>
            <Tooltip
              anchorSelect="#edit"
              place="top"
              content="Edit"
              className="!text-xs !bg-black !rounded !px-2 !py-1"
            />
            </>
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
