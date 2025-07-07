import React, { createContext, useContext, useState } from "react";

const SalesDialogContext = createContext();

export const useDialogForSales = () => {
    return useContext(SalesDialogContext);
};

export const SalesDialogProvider = ({ children }) => {
    const [openDialogForSales, setOpenDialogForSales] =
        useState(false);
    const [salesPaginationData, setSalesPaginationData] = useState(
        []
    );
    const [saveBtnForSales, setSaveBtnForSales] = useState("save");
    const [editIdForSales, setEditIdForSales] = useState("");
    const [salesInputs, setSalesInputs] = useState({
        sales_order_number:"",
        order_date:"",
        customer_id:"",
        igst_amount:"",
        cgst_amount:"",
        sgst_amount:"",
        gst_amount:"",
        order_amount:"",
        total_amount:"",
        discount:"",
        discount_percent:"",
        discount_amount:"",
        discounted_total:"",
        payment_terms_id:"",
        mode_of_delivery:"",
        expected_delivery_date:"",
        logistic_id:"",
        sales_status:"",
        remarks:"",
    });


    const toggleDialog = () => {
        setOpenDialogForSales((prevState) => !prevState);
    };

    return (
        <SalesDialogContext.Provider
            value={{
                openDialogForSales,
                toggleDialog,
                setOpenDialogForSales,
                salesPaginationData,
                setSalesPaginationData,
                saveBtnForSales,
                setSaveBtnForSales,
                editIdForSales,
                setEditIdForSales,
                salesInputs,
                setSalesInputs,
            }}
        >
            {children}
        </SalesDialogContext.Provider>
    );
};
