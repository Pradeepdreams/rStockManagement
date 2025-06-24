import React, { createContext, useContext, useState } from "react";

const LogisticsDialogContext = createContext();

export const useDialogForLogistics = () => {
    return useContext(LogisticsDialogContext);
};

export const LogisticsDialogProvider = ({ children }) => {
    const [openDialogForLogistics, setOpenDialogForLogistics] =
        useState(false);
    const [logisticsPaginationData, setLogisticsPaginationData] = useState(
        []
    );
    const [saveBtnForLogistics, setSaveBtnForLogistics] = useState("save");
    const [editIdForLogistics, setEditIdForLogistics] = useState("");
    const [logisticsInputs, setLogisticsInputs] = useState({
        name: "",
    });


    const toggleDialog = () => {
        setOpenDialogForLogistics((prevState) => !prevState);
    };

    return (
        <LogisticsDialogContext.Provider
            value={{
                openDialogForLogistics,
                toggleDialog,
                setOpenDialogForLogistics,
                logisticsPaginationData,
                setLogisticsPaginationData,
                saveBtnForLogistics,
                setSaveBtnForLogistics,
                editIdForLogistics,
                setEditIdForLogistics,
                logisticsInputs,
                setLogisticsInputs,
            }}
        >
            {children}
        </LogisticsDialogContext.Provider>
    );
};
