import React, { createContext, useContext, useState } from "react";

const AreaDialogContext = createContext();

export const useDialogForArea = () => {
    return useContext(AreaDialogContext);
};

export const AreaDialogProvider = ({ children }) => {
    const [openDialogForArea, setOpenDialogForArea] =
        useState(false);
    const [areaPaginationData, setAreaPaginationData] = useState(
        []
    );
    const [saveBtnForArea, setSaveBtnForArea] = useState("save");
    const [editIdForArea, setEditIdForArea] = useState("");
    const [areaInputs, setAreaInputs] = useState({
        name: "",
        area_code: "",
    });


    const toggleDialog = () => {
        setOpenDialogForArea((prevState) => !prevState);
    };

    return (
        <AreaDialogContext.Provider
            value={{
                openDialogForArea,
                toggleDialog,
                setOpenDialogForArea,
                areaPaginationData,
                setAreaPaginationData,
                saveBtnForArea,
                setSaveBtnForArea,
                editIdForArea,
                setEditIdForArea,
                areaInputs,
                setAreaInputs,
            }}
        >
            {children}
        </AreaDialogContext.Provider>
    );
};
