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
    attributes: [],
    reorder_level: "",
    unit_of_measurement: "",
    item_code: "",
    gst_applicable_date: "",
    hsn_code: "",
    hsn_applicable_date: "",
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
