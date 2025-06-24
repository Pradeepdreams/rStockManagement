import React, { createContext, useContext, useState } from "react";

const RoledialogContext = createContext();

export const useDialogForRole = () => {
    return useContext(RoledialogContext);
};

export const RoleDialogProvider = ({ children }) => {
    const [openDialogForRole, setOpenDialogForRole] =
        useState(false);
    const [rolePaginationData, setRolePaginationData] = useState(
        []
    );
    const [saveBtnForRole, setSaveBtnForRole] = useState("save");
    const [editIdForRole, setEditIdForRole] = useState("");
     const [rolesInput, setRolesInput] = useState({
        name: "",
        permissions: [],
      });



    const toggleDialog = () => {
        setOpenDialogForRole((prevState) => !prevState);
    };

    return (
        <RoledialogContext.Provider
            value={{
                openDialogForRole,
                toggleDialog,
                setOpenDialogForRole,
                rolePaginationData,
                setRolePaginationData,
                saveBtnForRole,
                setSaveBtnForRole,
                editIdForRole,
                setEditIdForRole,
                rolesInput,
                setRolesInput,
            }}
        >
            {children}
        </RoledialogContext.Provider>
    );
};
