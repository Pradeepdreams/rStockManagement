import React from "react";
import { Tooltip } from "react-tooltip";

function HalfSizeButton({
  buttonIcon,
  buttonText,
  buttonFunction,
  pdfDownload,
  pdfText,
  pdf
}) {
  return (

  <div className={`grid grid-cols-1 ${pdf && "sm:grid-cols-5" } items-center w-full`}>
  {/* Button(s) Section */}
  <div className={`${pdf ? "sm:col-span-3" : "sm:col-span-3"}  flex flex-wrap sm:flex-nowrap items-center justify-end gap-2 w-full`}>
    {/* Submit Button */}
    <button
      type="submit"
      onClick={buttonFunction}
      className="w-full sm:w-auto bg-[var(--hd-bg)] hover:bg-purple-800 text-white font-bold text-sm py-2 px-4 rounded-md focus:outline-none"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <span className="flex items-center justify-center gap-2">
        {buttonIcon && (
          <span className="text-sm sm:text-base md:text-lg lg:text-xl text-white">
            {buttonIcon}
          </span>
        )}
        <span className="text-xs">{buttonText}</span>
      </span>
    </button>
    </div>

    {/* PDF Button */}
    {pdf && (
        <div className={`${pdf ?  "sm:col-span-2 ": "sm:col-span-2"}`} >

        <button
          id="pdfDownloadBtn"
          type="button"
          className="w-full sm:w-auto bg-[var(--pdf-bg)] hover:bg-[var(--hover-pdf-bg)] text-white font-bold text-sm py-2 px-4 rounded-md focus:outline-none"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          <span className="flex items-center justify-center gap-2">
            <span className="w-5 h-5 flex items-center justify-center">
              {pdfDownload}
            </span>
          </span>
        </button>

        <Tooltip
          anchorSelect="#pdfDownloadBtn"
          place="top"
          content={pdfText}
        />
     </div>

    )}
</div>



  );
}

export default HalfSizeButton;
