import React, { createContext, useContext, useState } from "react";

const ItemsDialogContext = createContext();

export const useDialogForItems = () => {
  return useContext(ItemsDialogContext);
};

export const ItemDialogProvider = ({ children }) => {
  const [openDialogForItems, setOpenDialogForItems] = useState(false);
  const [itemsPaginationData, setItemsPaginationData] = useState([]);
  const [saveBtnForItems, setSaveBtnForItems] = useState("save");
  const [editIdForItems, setEditIdForItems] = useState("");
  const [itemInputs, setItemInputs] = useState({
    item_name: "",
    category_id: "",
    reorder_level: "",
    unit_of_measurement: "",
    item_code: "",
    item_type_code:"",
    gst_applicable_date: "",
    gst_percent:"",
    hsn_code: "",
    hsn_applicable_date: "",
    sac_code: "",
    sac_applicable_date: "",
    item_type: "",
    purchase_price: "",
    selling_price: "",
  });

  const toggleDialog = () => {
    setOpenDialogForItems((prevState) => !prevState);
  };

  return (
    <ItemsDialogContext.Provider
      value={{
        openDialogForItems,
        toggleDialog,
        setOpenDialogForItems,
        itemsPaginationData,
        setItemsPaginationData,
        saveBtnForItems,
        setSaveBtnForItems,
        editIdForItems,
        setEditIdForItems,
        itemInputs,
        setItemInputs,
      }}
    >
      {children}
    </ItemsDialogContext.Provider>
  );
};
