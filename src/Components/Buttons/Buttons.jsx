import React from 'react'
import '../Variable/Variable.css';

function Buttons({buttonText, buttonFunction}) {
  return (
     <button
        type="submit"
        onClick={buttonFunction}
        className="w-full  text-white bg-[var(--hd-bg)] font-bold text-xs py-3 rounded-md focus:outline-none"

        style={{
    // backgroundColor: "var(--button-bg)",
    color: "var(--button-text-color)",
    fontFamily: "var(--button-font-family)",
  }}
      >
        {buttonText}
      </button>
  )
}

export default Buttons