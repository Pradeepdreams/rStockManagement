import { createContext, useContext, useState } from "react";

const PurchaseOrderEntriesDialogContext = createContext();

export const usePurchaseOrderEntriesDialogContext = () => {
  return useContext(PurchaseOrderEntriesDialogContext);
};

export const PurchaseOrderEntriesProvider = ({ children }) => {
  const [
    openDialogForPurchaseOrderEntries,
    setOpenDialogForPurchaseOrderEntries,
  ] = useState(false);
  const [
    purchaseOrderEntriesPaginationData,
    setPurchaseOrderEntriesPaginationData,
  ] = useState([]);
  const [saveBtnForPurchaseOrderEntries, setSaveBtnForPurchaseOrderEntries] =
    useState("save");
  const [editIdForPurchaseOrderEntries, setEditIdForPurchaseOrderEntries] =
    useState("");
  const [purchaseOrderEntriesInputs, setPurchaseOrderEntriesInputs] = useState({
    purchase_order_id: "",
    purchase_entry_number: "",
    vendor_id: "",
    against_po: 1,
    vendor_invoice_no: "",
    vendor_invoice_date: "",
    sub_total_amount: "",
    gst_amount: "",
    total_amount: "",
    purchase_person_id: "",
    mode_of_delivery: "",
    logistic_id: "",
    remarks: "",
    vendor_invoice_image: "",

    items: [
      {
        po_item_id: "",
        vendor_item_name: "",
        item_id: "",
        gst_percent: "",
        hsn_code: "",
        po_quantity: "",
        quantity: "",
        po_price: "",
        vendor_price: "",
        selling_price: "",
        sub_total_amount: "",
        total_amount: "",
        // discount: "",
      },
    ],
    gst_details: [
      {
        gst_percent: "",
        igst_percent: "",
        cgst_percent: "",
        sgst_percent: "",
        igst_amount: "",
        cgst_amount: "",
        sgst_amount: "",
      },
    ],
  });
  const [poEntryLatestNumber, setPoEntryLatestNumber] = useState("");

  const toggleDialog = () => {
    setOpenDialogForPurchaseOrderEntries((prevState) => !prevState);
  };

  return (
    <PurchaseOrderEntriesDialogContext.Provider
      value={{
        openDialogForPurchaseOrderEntries,
        toggleDialog,
        setOpenDialogForPurchaseOrderEntries,
        purchaseOrderEntriesPaginationData,
        setPurchaseOrderEntriesPaginationData,
        saveBtnForPurchaseOrderEntries,
        setSaveBtnForPurchaseOrderEntries,
        editIdForPurchaseOrderEntries,
        setEditIdForPurchaseOrderEntries,
        purchaseOrderEntriesInputs,
        setPurchaseOrderEntriesInputs,
        setPoEntryLatestNumber,
        poEntryLatestNumber,
      }}
    >
      {children}
    </PurchaseOrderEntriesDialogContext.Provider>
  );
};
