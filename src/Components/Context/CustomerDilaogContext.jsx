import React, { createContext, useContext, useState } from "react";

const CustomerDialogContext = createContext();

export const useDialogForCustomer = () => {
    return useContext(CustomerDialogContext);
};

export const CustomerDialogProvider = ({ children }) => {
    const [openDialogForCustomer, setOpenDialogForCustomer] =
        useState(false);
    const [customerPaginationData, setCustomerPaginationData] = useState(
        []
    );
    const [saveBtnForCustomer, setSaveBtnForCustomer] = useState("save");
    const [editIdForCustomer, setEditIdForCustomer] = useState("");
    const [customerInputs, setCustomerInputs] = useState({
        name:"",
        customer_type:"",
        email:"",
        phone:"",
        address_line1:"",
        address_line2:"",
        city:"",
        state:"",
        country:"",
        pincode:"",
        gst_number:"",
        gst_type:"",
        pan_number:"",
        credit_limit:"",
        customer_group:"",
    });


    const toggleDialog = () => {
        setOpenDialogForCustomer((prevState) => !prevState);
    };

    return (
        <CustomerDialogContext.Provider
            value={{
                openDialogForCustomer,
                toggleDialog,
                setOpenDialogForCustomer,
                customerPaginationData,
                setCustomerPaginationData,
                saveBtnForCustomer,
                setSaveBtnForCustomer,
                editIdForCustomer,
                setEditIdForCustomer,
                customerInputs,
                setCustomerInputs,
            }}
        >
            {children}
        </CustomerDialogContext.Provider>
    );
};
