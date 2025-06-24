import React, { createContext, useContext, useState } from "react";

const GstRegistrationDialogContext = createContext();

export const useDialogForGstRegistration = () => {
    return useContext(GstRegistrationDialogContext);
};

export const GstRegistrationDialogProvider = ({ children }) => {
    const [openDialogForGstRegistration, setOpenDialogForGstRegistration] = useState(false);
    const [gstRegistrationPaginationData, setGstRegistrationPaginationData] = useState([]);
    const [saveBtnForGstRegistration, setSaveBtnForGstRegistration] = useState("save");
    const [editIdForGstRegistration, setEditIdForGstRegistration] = useState("");
    const [gstRegistrationInputs, setGstRegistrationInputs] = useState({
        name: "",
        code: "",
        description: "",
    });


    const toggleDialog = () => {
        setOpenDialogForGstRegistration((prevState) => !prevState);
    };

    return (
        <GstRegistrationDialogContext.Provider
            value={{
                openDialogForGstRegistration,
                toggleDialog,
                setOpenDialogForGstRegistration,
                gstRegistrationPaginationData,
                setGstRegistrationPaginationData,
                saveBtnForGstRegistration,
                setSaveBtnForGstRegistration,
                editIdForGstRegistration,
                setEditIdForGstRegistration,
                gstRegistrationInputs,
                setGstRegistrationInputs,
            }}
        >
            {children}
        </GstRegistrationDialogContext.Provider>
    );
};
