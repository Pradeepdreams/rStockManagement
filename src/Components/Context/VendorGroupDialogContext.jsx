import React, { createContext, useContext, useState } from "react";

const VendorGroupDialogContext = createContext();

export const useDialogForVendorGroup = () => {
    return useContext(VendorGroupDialogContext);
};

export const VendorGroupDialogProvider = ({ children }) => {
    const [openDialogForVendorGroup, setOpenDialogForVendorGroup] =
        useState(false);
    const [vendorGroupPaginationData, setVendorGroupPaginationData] = useState(
        []
    );
    const [saveBtnForVendorGroup, setSaveBtnForVendorGroup] = useState("save");
    const [editIdForVendorGroup, setEditIdForVendorGroup] = useState("");
    const [vendorGroupInputs, setVendorGroupInputs] = useState({
        name: "",
        discussion:""
    });

    const toggleDialog = () => {
        setOpenDialogForVendorGroup((prevState) => !prevState);
    };

    return (
        <VendorGroupDialogContext.Provider
            value={{
                openDialogForVendorGroup,
                toggleDialog,
                setOpenDialogForVendorGroup,
                vendorGroupPaginationData,
                setVendorGroupPaginationData,
                saveBtnForVendorGroup,
                setSaveBtnForVendorGroup,
                editIdForVendorGroup,
                setEditIdForVendorGroup,
                vendorGroupInputs,
                setVendorGroupInputs,
            }}
        >
            {children}
        </VendorGroupDialogContext.Provider>
    );
};
