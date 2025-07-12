import { GrView  } from "react-icons/gr";
import { Tooltip } from "react-tooltip";

function ViewButton({onView,item}) {
  return (
    // <button
    //         className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
    //         onClick={(e) => function(e, item.id_crypt)}
    //       >
    //         View
    //       </button>
    <>
      <button
      id="view"
      className="bg-[var(--addbutton-bgcolor)]  cursor-pointer font-semibold px-2 py-1 rounded text-xs  hover:text-[var(--hover-text)] hover:bg-[var(--addbutton-bgcolor)]"
      onClick={(e) => onView(e, item.id_crypt)}
    >
          <GrView className="text-[var(--hd-bg)]   text-lg text-white  cursor-pointer "/>

    </button>
    
     <Tooltip
          anchorSelect="#view"
          place="top"
          content="View"
          // className="!text-xs !bg-black !rounded !px-2 !py-1"
        />
    </>

  )
}

export default ViewButton