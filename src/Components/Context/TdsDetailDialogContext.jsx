import React, { createContext, useContext, useState } from "react";

const TdsDetailsDialogContext = createContext();

export const useDialogForTdsDetails = () => {
  return useContext(TdsDetailsDialogContext);
};

export const TdsDetailsDialogProvider = ({ children }) => {
  const [openDialogForTdsDetails, setOpenDialogForTdsDetails] = useState(false);
  const [tdsDetailsPaginationData, setTdsDetailsPaginationData] = useState([]);
  const [saveBtnForTdsDetails, setSaveBtnForTdsDetails] = useState("save");
  const [editIdForTdsDetails, setEditIdForTdsDetails] = useState("");
  const [tdsDetailsInputs, setTdsDetailsInputs] = useState({
    name: "",
    description: "",
    active_status: "",
    tds_section_id: "",
  });

  const toggleDialog = () => {
    setOpenDialogForTdsDetails((prevState) => !prevState);
  };

  return (
    <TdsDetailsDialogContext.Provider
      value={{
        openDialogForTdsDetails,
        toggleDialog,
        setOpenDialogForTdsDetails,
        tdsDetailsPaginationData,
        setTdsDetailsPaginationData,
        saveBtnForTdsDetails,
        setSaveBtnForTdsDetails,
        editIdForTdsDetails,
        setEditIdForTdsDetails,
        tdsDetailsInputs,
        setTdsDetailsInputs,
      }}
    >
      {children}
    </TdsDetailsDialogContext.Provider>
  );
};
