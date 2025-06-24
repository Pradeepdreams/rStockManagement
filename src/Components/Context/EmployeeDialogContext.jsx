import React, { createContext, useContext, useState } from "react";

const EmployeeDialogContext = createContext();

export const useDialogForEmployee = () => {
    return useContext(EmployeeDialogContext);
};

export const EmployeeDialogProvider = ({ children }) => {
    const [openDialogForEmployee, setOpenDialogForEmployee] =
        useState(false);
    const [employeePaginationData, setEmployeePaginationData] = useState(
        []
    );
    const [saveBtnForEmployee, setSaveBtnForEmployee] = useState("save");
    const [editIdForEmployee, setEditIdForEmployee] = useState("");
    const [employeeInputs, setEmployeeInputs] = useState({
        first_name: "",
        last_name: "",
        gender: "",
        email: "",
        phone: "",
        password: "",
        date_of_join: "",
        qualification_id: "",
        is_active: "",
        salary: "",
        branch_id: "",
        roles:[],
        address_line_1: "",
        address_line_2: "",
        country: "",
        state: "",
        city: "",
        pincode_id: "",
    });


    const toggleDialog = () => {
        setOpenDialogForEmployee((prevState) => !prevState);
    };

    return (
        <EmployeeDialogContext.Provider
            value={{
                openDialogForEmployee,
                toggleDialog,
                setOpenDialogForEmployee,
                employeePaginationData,
                setEmployeePaginationData,
                saveBtnForEmployee,
                setSaveBtnForEmployee,
                editIdForEmployee,
                setEditIdForEmployee,
                employeeInputs,
                setEmployeeInputs,
            }}
        >
            {children}
        </EmployeeDialogContext.Provider>
    );
};
