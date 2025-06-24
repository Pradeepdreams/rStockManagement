import React, { createContext, useContext, useState } from "react";

const GroupDialogContext = createContext();

export const useDialogForGroup = () => {
    return useContext(GroupDialogContext);
};

export const GroupDialogProvider = ({ children }) => {
    const [openDialogForGroup, setOpenDialogForGroup] =
        useState(false);
    const [groupPaginationData, setGroupPaginationData] = useState(
        []
    );
    const [saveBtnForGroup, setSaveBtnForGroup] = useState("save");
    const [editIdForGroup, setEditIdForGroup] = useState("");
    const [groupInputs, setGroupInputs] = useState({
        name: "",
        is_active: "yes",
        discussion:""
    });

    const toggleDialog = () => {
        setOpenDialogForGroup((prevState) => !prevState);
    };

    return (
        <GroupDialogContext.Provider
            value={{
                openDialogForGroup,
                toggleDialog,
                setOpenDialogForGroup,
                groupPaginationData,
                setGroupPaginationData,
                saveBtnForGroup,
                setSaveBtnForGroup,
                editIdForGroup,
                setEditIdForGroup,
                groupInputs,
                setGroupInputs,
            }}
        >
            {children}
        </GroupDialogContext.Provider>
    );
};
