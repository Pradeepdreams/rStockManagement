import React, { createContext, useContext, useState } from "react";

const BranchDialogContext = createContext();

export const useDialogForBranch = () => {
    return useContext(BranchDialogContext);
};

export const BranchDialogProvider = ({ children }) => {
    const [openDialogForBranch, setOpenDialogForBranch] =
        useState(false);
    const [branchPaginationData, setBranchPaginationData] = useState(
        []
    );
    const [saveBtnForBranch, setSaveBtnForBranch] = useState("save");
    const [editIdForBranch, setEditIdForBranch] = useState("");
    const [branchInputs, setBranchInputs] = useState({
        name: "",
        location: "",
    });


    const toggleDialog = () => {
        setOpenDialogForBranch((prevState) => !prevState);
    };

    return (
        <BranchDialogContext.Provider
            value={{
                openDialogForBranch,
                toggleDialog,
                setOpenDialogForBranch,
                branchPaginationData,
                setBranchPaginationData,
                saveBtnForBranch,
                setSaveBtnForBranch,
                editIdForBranch,
                setEditIdForBranch,
                branchInputs,
                setBranchInputs,
            }}
        >
            {children}
        </BranchDialogContext.Provider>
    );
};
