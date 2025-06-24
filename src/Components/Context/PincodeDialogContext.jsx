import React, { createContext, useContext, useState } from "react";

const PincodeDialogContext = createContext();

export const useDialogForPincode = () => {
    return useContext(PincodeDialogContext);
};

export const PincodeDialogProvider = ({ children }) => {
    const [openDialogForPincode, setOpenDialogForPincode] =
        useState(false);
    const [pincodePaginationData, setPincodePaginationData] = useState(
        []
    );
    const [saveBtnForPincode, setSaveBtnForPincode] = useState("save");
    const [editIdForPincode, setEditIdForPincode] = useState("");
     const [pincodeInputs, setPincodeInputs] = useState(
        {
          country: "",
          state: "",
          city: "",
          pincode: "",  
        },
      );

    const toggleDialog = () => {
        setOpenDialogForPincode((prevState) => !prevState);
    };

    return (
        <PincodeDialogContext.Provider
            value={{
                openDialogForPincode,
                toggleDialog,
                setOpenDialogForPincode,
                pincodePaginationData,
                setPincodePaginationData,
                saveBtnForPincode,
                setSaveBtnForPincode,
                editIdForPincode,
                setEditIdForPincode,
                pincodeInputs,
                setPincodeInputs,
            }}
        >
            {children}
        </PincodeDialogContext.Provider>
    );
};
