import React, { createContext, useContext, useState } from "react";

const CategoryDialogContext = createContext();

export const useDialogForCategory = () => {
    return useContext(CategoryDialogContext);
};

export const CategoryDialogProvider = ({ children }) => {
    const [openDialogForCategory, setOpenDialogForCategory] =useState(false);
    const [categoryPaginationData, setCategoryPaginationData] = useState([]);
    const [saveBtnForCategory, setSaveBtnForCategory] = useState("save");
    const [editIdForCategory, setEditIdForCategory] = useState("");
    const [categoryInputs, setCategoryInputs] = useState({
      name: "",
      attributes: [],
      gst_percent: "",
      gst_applicable_date: "",
      hsn_code: "",
      active_status: "",
      margin_percent_from: "",
      margin_percent_to: "",
      description: "",
      hsn_applicable_date: "",
    });
    const [hideplusiconforcategory, setHidePlusIconForCategory] = useState("hide");


    // const toggleDialog = () => {
    //     setOpenDialogForCategory((prevState) => !prevState);
    // };

    return (
        <CategoryDialogContext.Provider
            value={{
                openDialogForCategory,
                // toggleDialog,
                setOpenDialogForCategory,
                categoryPaginationData,
                setCategoryPaginationData,
                saveBtnForCategory,
                setSaveBtnForCategory,
                editIdForCategory,
                setEditIdForCategory,
                categoryInputs,
                setCategoryInputs,
                hideplusiconforcategory,
                setHidePlusIconForCategory
            }}
        >
            {children}
        </CategoryDialogContext.Provider>
    );
};
